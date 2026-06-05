import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mockDb from '../config/mockDb.js';

export const protect = async (req, res, next) => {
  let token;

  // Check headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjharkhandjobskey12345');
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }

  try {
    if (global.useMockDb) {
      const user = mockDb.users.find(u => u._id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      // Populate req.user
      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
    } else {
      // Get user from database (excluding password)
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      req.user = user;
    }
    
    next();
  } catch (error) {
    console.error('Database query error in protect middleware:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied, admin authorization required' });
  }
};
