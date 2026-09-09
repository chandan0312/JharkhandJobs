import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../db/mockDb.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Simple rate limiter for auth routes
const rateLimitMap = new Map();
const authRateLimiter = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimitMap.get(key) || { count: 0, startTime: now };

    if (now - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = now;
    } else {
      record.count += 1;
    }

    rateLimitMap.set(key, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
      });
    }

    next();
  };
};

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjharkhandjobskey12345', {
    expiresIn: '30d',
  });
};

// Set secure HTTP-only auth cookie helper
const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authRateLimiter(10, 15 * 60 * 1000), async (req, res) => {
  const { name, email, mobile, phone, password, confirmPassword } = req.body;
  const userMobile = mobile || phone || '';

  // Basic field checks
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Full Name is required' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email Address is required' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  // Mobile number validation (if provided)
  if (userMobile) {
    const mobileClean = userMobile.replace(/[\s\-()+]/g, '');
    if (!/^\d{10,15}$/.test(mobileClean)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid mobile number (10-15 digits)' });
    }
  }

  // Confirm password match check
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  // Enforce strong password requirement
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&).' 
    });
  }

  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    if (global.useMockDb) {
      const userExists = mockDb.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'mock-user-' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        phone: userMobile,
        mobile: userMobile,
        role: 'user',
        emailVerified: false,
        verificationToken,
        savedJobs: [],
        createdAt: new Date()
      };

      mockDb.users.push(newUser);
      const token = generateToken(newUser._id);
      setAuthCookie(res, token);

      // Async email verification link (non-blocking)
      sendVerificationEmail(newUser.email, newUser.name, verificationToken).catch(console.error);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Verification email has been sent.',
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          mobile: newUser.mobile,
          role: newUser.role,
          emailVerified: false,
          savedJobs: newUser.savedJobs || [],
          profileData: newUser.profileData || {},
        },
      });
    }

    const userExists = await User.findOne({ $or: [{ email: email.trim() }, { mobile: userMobile }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email or mobile number already exists' });
    }

    const user = await User.create({ 
      name: name.trim(), 
      email: email.trim().toLowerCase(), 
      password, 
      phone: userMobile, 
      mobile: userMobile,
      role: 'user',
      emailVerified: false,
      verificationToken
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    // Async email verification link (non-blocking)
    sendVerificationEmail(user.email, user.name, verificationToken).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Verification email has been sent.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        role: user.role,
        emailVerified: user.emailVerified || false,
        savedJobs: user.savedJobs || [],
        profileData: user.profileData || {},
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authRateLimiter(10, 15 * 60 * 1000), async (req, res) => {
  const { email, password, emailOrMobile } = req.body;
  const loginIdentifier = (emailOrMobile || email || '').trim();

  if (!loginIdentifier || !password) {
    return res.status(400).json({ success: false, message: 'Email/Mobile and Password are required' });
  }

  try {
    if (global.useMockDb) {
      const user = mockDb.users.find(u => 
        u.email.toLowerCase() === loginIdentifier.toLowerCase() || 
        (u.phone && u.phone === loginIdentifier) ||
        (u.mobile && u.mobile === loginIdentifier)
      );
      if (user && (await bcrypt.compare(password, user.passwordHash || user.password))) {
        user.lastLogin = new Date();
        const token = generateToken(user._id);
        setAuthCookie(res, token);
        return res.json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            mobile: user.mobile || user.phone || '',
            role: user.role,
            emailVerified: user.emailVerified || false,
            profileImage: user.profileImage || '',
            savedJobs: user.savedJobs || [],
            profileData: user.profileData || {},
          },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email/mobile or password' });
    }

    const user = await User.findOne({ email: loginIdentifier, mobile: loginIdentifier }).select('+password');
    if (user && (await user.matchPassword(password))) {
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);
      setAuthCookie(res, token);

      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          mobile: user.mobile || user.phone || '',
          role: user.role,
          emailVerified: user.emailVerified || false,
          profileImage: user.profileImage || '',
          savedJobs: user.savedJobs || [],
          profileData: user.profileData || {},
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email/mobile or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    if (global.useMockDb) {
      const user = mockDb.users.find(u => u._id === req.user._id);
      if (user) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            mobile: user.mobile || user.phone || '',
            role: user.role,
            emailVerified: user.emailVerified || false,
            profileImage: user.profileImage || '',
            savedJobs: user.savedJobs || [],
            profileData: user.profileData || {},
          }
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          mobile: user.mobile || user.phone || '',
          role: user.role,
          emailVerified: user.emailVerified || false,
          profileImage: user.profileImage || '',
          savedJobs: user.savedJobs || [],
          profileData: user.profileData || {},
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, mobile, profileImage, profileData } = req.body;
    const userPhone = phone || mobile;

    if (global.useMockDb) {
      const userIdx = mockDb.users.findIndex(u => u._id === req.user._id);
      if (userIdx !== -1) {
        if (name) mockDb.users[userIdx].name = name;
        if (userPhone) {
          mockDb.users[userIdx].phone = userPhone;
          mockDb.users[userIdx].mobile = userPhone;
        }
        if (profileImage) mockDb.users[userIdx].profileImage = profileImage;
        if (profileData) {
          mockDb.users[userIdx].profileData = {
            ...(mockDb.users[userIdx].profileData || {}),
            ...profileData
          };
        }
        return res.json({ success: true, user: mockDb.users[userIdx] });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      if (name) user.name = name;
      if (userPhone) {
        user.phone = userPhone;
        user.mobile = userPhone;
      }
      if (profileImage) user.profileImage = profileImage;
      if (profileData) {
        user.profileData = {
          ...(user.profileData || {}),
          ...profileData
        };
      }
      
      await user.save();
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', authRateLimiter(5, 15 * 60 * 1000), async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  const genericSuccessMsg = 'If an account exists with that email, a password reset link has been sent.';

  try {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    if (global.useMockDb) {
      const user = mockDb.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (user) {
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        sendPasswordResetEmail(user.email, user.name, resetToken).catch(console.error);
      }
      return res.json({ success: true, message: genericSuccessMsg });
    }

    const user = await User.findOne({ email: email.trim() });
    if (user) {
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();
      sendPasswordResetEmail(user.email, user.name, resetToken).catch(console.error);
    }

    res.json({ success: true, message: genericSuccessMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', authRateLimiter(5, 15 * 60 * 1000), async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Reset token is required' });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&).' 
    });
  }

  try {
    if (global.useMockDb) {
      const user = mockDb.users.find(u => 
        u.resetPasswordToken === token && 
        u.resetPasswordExpires && 
        new Date(u.resetPasswordExpires) > new Date()
      );

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      return res.json({ success: true, message: 'Password reset successful! You can now sign in with your new password.' });
    }

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user || !user.resetPasswordExpires || new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful! You can now sign in with your new password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify user email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Verification token is required' });
  }

  try {
    if (global.useMockDb) {
      const user = mockDb.users.find(u => u.verificationToken === token);
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
      }
      user.emailVerified = true;
      user.verificationToken = null;
      return res.json({ success: true, message: 'Email address verified successfully!' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ success: true, message: 'Email address verified successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Change logged-in user password
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }

  if (confirmPassword !== undefined && newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'New passwords do not match' });
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(newPassword)) {
    return res.status(400).json({ 
      success: false, 
      message: 'New password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
    });
  }

  try {
    if (global.useMockDb) {
      const user = mockDb.users.find(u => u._id === req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (user.passwordHash && !(await bcrypt.compare(oldPassword, user.passwordHash))) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      return res.json({ success: true, message: 'Password changed successfully!' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.password && !(await user.matchPassword(oldPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Google Sign-In / Social Login
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  const { credential, email, name, googleId, picture } = req.body;

  try {
    let userEmail = email;
    let userName = name;
    let userGoogleId = googleId;
    let userPicture = picture || '';

    // Verify token securely using the official Google Identity Services library
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        userEmail = payload.email;
        userName = payload.name;
        userGoogleId = payload.sub;
        userPicture = payload.picture || '';
      } catch (err) {
        console.error('Google token verification failed:', err.message);
        return res.status(401).json({ 
          success: false, 
          message: `Google token verification failed: ${err.message}` 
        });
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ 
          success: false, 
          message: 'Google authentication requires a secure token credential' 
        });
      }
      if (!userEmail) {
        return res.status(400).json({ 
          success: false, 
          message: 'Google authentication failed: Email is missing' 
        });
      }
    }

    const lowerEmail = userEmail.toLowerCase();
    const isAdmin = lowerEmail === 'admin.google@jharkhandjobs.com' || lowerEmail === 'admin@jharkhandjobs.com' || lowerEmail === 'jharkhandjobs03@gmail.com';
    const assignedRole = isAdmin ? 'admin' : 'user';

    if (global.useMockDb) {
      let user = mockDb.users.find(u => u.email.toLowerCase() === lowerEmail || u.googleId === userGoogleId);
      if (user) {
        if (!user.googleId) user.googleId = userGoogleId;
        if (!user.profileImage && userPicture) user.profileImage = userPicture;
        user.emailVerified = true;
        if (isAdmin) user.role = 'admin';
        user.lastLogin = new Date();
      } else {
        user = {
          _id: 'mock-user-google-' + Date.now(),
          name: userName || userEmail.split('@')[0],
          email: userEmail,
          googleId: userGoogleId,
          profileImage: userPicture,
          role: assignedRole,
          emailVerified: true,
          savedJobs: [],
          lastLogin: new Date(),
          createdAt: new Date()
        };
        mockDb.users.push(user);
      }

      const token = generateToken(user._id);
      setAuthCookie(res, token);

      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          mobile: user.mobile || user.phone || '',
          role: user.role,
          emailVerified: true,
          profileImage: user.profileImage || '',
          savedJobs: user.savedJobs || [],
          profileData: user.profileData || {},
        },
      });
    }

    let user = await User.findOne({ $or: [{ googleId: userGoogleId }, { email: userEmail }] });
    if (user) {
      let updated = false;
      if (!user.googleId) {
        user.googleId = userGoogleId;
        updated = true;
      }
      if (!user.profileImage && userPicture) {
        user.profileImage = userPicture;
        updated = true;
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
        updated = true;
      }
      if (isAdmin && user.role !== 'admin') {
        user.role = 'admin';
        updated = true;
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        googleId: userGoogleId,
        profileImage: userPicture,
        role: assignedRole,
        emailVerified: true,
        lastLogin: new Date()
      });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        mobile: user.mobile || user.phone || '',
        role: user.role,
        emailVerified: user.emailVerified || false,
        profileImage: user.profileImage || '',
        savedJobs: user.savedJobs || [],
        profileData: user.profileData || {},
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const usersList = mockDb.users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || u.mobile || '',
        role: u.role,
        emailVerified: u.emailVerified || false,
        createdAt: u.createdAt
      }));
      return res.json({ success: true, count: usersList.length, users: usersList });
    }

    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a user account (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (global.useMockDb) {
      const userIndex = mockDb.users.findIndex(u => u._id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      mockDb.users.splice(userIndex, 1);
      return res.json({ success: true, message: 'User account deleted successfully' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a user's role (Admin only)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    if (global.useMockDb) {
      const user = mockDb.users.find(u => u._id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.role = role;
      return res.json({ success: true, message: `User role updated to ${role} successfully` });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.role = role;
    await user.save();

    res.json({ success: true, message: `User role updated to ${role} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Save a job
// @route   POST /api/auth/save-job/:jobId
// @access  Private
router.post('/save-job/:jobId', protect, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (global.useMockDb) {
      const user = mockDb.users.find(u => u._id === req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (!user.savedJobs) user.savedJobs = [];
      if (!user.savedJobs.includes(jobId)) {
        user.savedJobs.push(jobId);
      }
      return res.json({ success: true, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        mobile: user.mobile || user.phone || '',
        role: user.role,
        savedJobs: user.savedJobs,
        profileData: user.profileData || {}
      }});
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.savedJobs.includes(jobId)) {
      const arr = Array.isArray(user.savedJobs) ? [...user.savedJobs] : [];
      arr.push(jobId);
      user.savedJobs = arr;
      await user.save();
    }
    res.json({ success: true, user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      mobile: user.mobile || user.phone || '',
      role: user.role,
      savedJobs: user.savedJobs,
      profileData: user.profileData || {}
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Unsave a job
// @route   DELETE /api/auth/save-job/:jobId
// @access  Private
router.delete('/save-job/:jobId', protect, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (global.useMockDb) {
      const user = mockDb.users.find(u => u._id === req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (!user.savedJobs) user.savedJobs = [];
      user.savedJobs = user.savedJobs.filter(id => id !== jobId);
      return res.json({ success: true, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        mobile: user.mobile || user.phone || '',
        role: user.role,
        savedJobs: user.savedJobs,
        profileData: user.profileData || {}
      }});
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const arr = Array.isArray(user.savedJobs) ? [...user.savedJobs] : [];
    user.savedJobs = arr.filter(id => id !== jobId);
    await user.save();
    res.json({ success: true, user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      mobile: user.mobile || user.phone || '',
      role: user.role,
      savedJobs: user.savedJobs,
      profileData: user.profileData || {}
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
