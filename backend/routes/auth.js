import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../config/mockDb.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjharkhandjobskey12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Enforce strong password requirement (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&).' 
    });
  }

  try {
    if (global.useMockDb) {
      const userExists = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'mock-user-' + Date.now(),
        name,
        email,
        passwordHash,
        phone: phone || '',
        role: 'user',
        savedJobs: [],
        createdAt: new Date()
      };

      mockDb.users.push(newUser);

      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          savedJobs: newUser.savedJobs || [],
          profileData: newUser.profileData || {},
        },
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone, role: 'user' });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
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
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (global.useMockDb) {
      const user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        return res.json({
          success: true,
          token: generateToken(user._id),
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            savedJobs: user.savedJobs || [],
            profileData: user.profileData || {},
          },
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          savedJobs: user.savedJobs || [],
          profileData: user.profileData || {},
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
            role: user.role,
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
          role: user.role,
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
    const { name, phone, profileData } = req.body;

    if (global.useMockDb) {
      const userIdx = mockDb.users.findIndex(u => u._id === req.user._id);
      if (userIdx !== -1) {
        if (name) mockDb.users[userIdx].name = name;
        if (phone) mockDb.users[userIdx].phone = phone;
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
      if (phone) user.phone = phone;
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

// @desc    Google Sign-In / Social Login
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  const { credential, email, name, googleId } = req.body;

  try {
    let userEmail = email;
    let userName = name;
    let userGoogleId = googleId;

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
      } catch (err) {
        console.error('Google token verification failed:', err.message);
        return res.status(401).json({ 
          success: false, 
          message: `Google token verification failed: ${err.message}` 
        });
      }
    } else {
      // In production, require secure token verification
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ 
          success: false, 
          message: 'Google authentication requires a secure token credential' 
        });
      }
      
      // Local development mock fallback
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
        if (!user.googleId) {
          user.googleId = userGoogleId;
        }
        // Sync role if it is a designated admin email
        if (isAdmin) {
          user.role = 'admin';
        }
      } else {
        user = {
          _id: 'mock-user-google-' + Date.now(),
          name: userName || userEmail.split('@')[0],
          email: userEmail,
          googleId: userGoogleId,
          role: assignedRole,
          savedJobs: [],
          createdAt: new Date()
        };
        mockDb.users.push(user);
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
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
      if (isAdmin && user.role !== 'admin') {
        user.role = 'admin';
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      user = await User.create({
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        googleId: userGoogleId,
        role: assignedRole,
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
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
      // Return all mock users without password hash
      const usersList = mockDb.users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
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
      role: user.role,
      savedJobs: user.savedJobs,
      profileData: user.profileData || {}
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
