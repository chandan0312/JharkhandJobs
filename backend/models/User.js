import bcrypt from 'bcryptjs';
import * as pgDb from '../db/pgDb.js';

const mapUser = (u) => {
  if (!u) return null;
  return {
    _id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    phone: u.phone || '',
    mobile: u.mobile || u.phone || '',
    role: u.role || 'user',
    googleId: u.google_id || null,
    profileImage: u.profile_image || '',
    emailVerified: u.email_verified || false,
    verificationToken: u.verification_token || null,
    resetPasswordToken: u.reset_password_token || null,
    resetPasswordExpires: u.reset_password_expires || null,
    lastLogin: u.last_login || null,
    savedJobs: Array.isArray(u.saved_jobs) ? u.saved_jobs : (typeof u.saved_jobs === 'string' ? JSON.parse(u.saved_jobs || '[]') : []),
    profileData: u.profile_data ? (typeof u.profile_data === 'string' ? JSON.parse(u.profile_data) : u.profile_data) : {},
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    matchPassword: async function(enteredPassword) {
      if (!this.password) return false;
      return await bcrypt.compare(enteredPassword, this.password);
    },
    save: async function() {
      const profileDataStr = typeof this.profileData === 'object' ? JSON.stringify(this.profileData) : '{}';
      await pgDb.query(
        `UPDATE users SET 
          google_id = $1, role = $2, name = $3, phone = $4, mobile = $5, profile_image = $6, 
          email_verified = $7, verification_token = $8, reset_password_token = $9, 
          reset_password_expires = $10, last_login = $11, saved_jobs = $12, profile_data = $13, 
          updated_at = NOW() 
         WHERE id = $14`,
        [
          this.googleId || null, this.role, this.name, this.phone, this.mobile, this.profileImage,
          this.emailVerified, this.verificationToken, this.resetPasswordToken,
          this.resetPasswordExpires, this.lastLogin, this.savedJobs, profileDataStr, this._id
        ]
      );
      return this;
    },
    deleteOne: async function() {
      await pgDb.query('DELETE FROM users WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const User = {
  countDocuments: async () => {
    const res = await pgDb.query('SELECT COUNT(*) FROM users');
    return parseInt(res.rows[0].count);
  },

  findOne: (queryObj) => {
    const selectChain = {
      select: async (fields) => {
        let email = queryObj.email;
        let mobile = queryObj.mobile;
        let googleId = queryObj.googleId;
        let resetPasswordToken = queryObj.resetPasswordToken;
        let verificationToken = queryObj.verificationToken;
        
        if (queryObj.$or) {
          const emailObj = queryObj.$or.find(o => o.email !== undefined);
          const mobileObj = queryObj.$or.find(o => o.mobile !== undefined || o.phone !== undefined);
          const googleIdObj = queryObj.$or.find(o => o.googleId !== undefined);
          email = emailObj ? emailObj.email : undefined;
          mobile = mobileObj ? (mobileObj.mobile || mobileObj.phone) : undefined;
          googleId = googleIdObj ? googleIdObj.googleId : undefined;
        }

        if (typeof email === 'object' && email.$regex) {
          email = email.$regex;
        }

        let res;
        if (resetPasswordToken) {
          res = await pgDb.query('SELECT * FROM users WHERE reset_password_token = $1', [resetPasswordToken]);
        } else if (verificationToken) {
          res = await pgDb.query('SELECT * FROM users WHERE verification_token = $1', [verificationToken]);
        } else if (email && googleId) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR google_id = $2', [email, googleId]);
        } else if (email && mobile) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR mobile = $2 OR phone = $2', [email, mobile]);
        } else if (email) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        } else if (mobile) {
          res = await pgDb.query('SELECT * FROM users WHERE mobile = $1 OR phone = $1', [mobile]);
        } else if (googleId) {
          res = await pgDb.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        } else {
          return null;
        }
        
        if (res.rows.length === 0) return null;
        return mapUser(res.rows[0]);
      },
      then: async (resolve) => {
        let email = queryObj.email;
        let mobile = queryObj.mobile;
        let googleId = queryObj.googleId;
        let resetPasswordToken = queryObj.resetPasswordToken;
        let verificationToken = queryObj.verificationToken;
        
        if (queryObj.$or) {
          const emailObj = queryObj.$or.find(o => o.email !== undefined);
          const mobileObj = queryObj.$or.find(o => o.mobile !== undefined || o.phone !== undefined);
          const googleIdObj = queryObj.$or.find(o => o.googleId !== undefined);
          email = emailObj ? emailObj.email : undefined;
          mobile = mobileObj ? (mobileObj.mobile || mobileObj.phone) : undefined;
          googleId = googleIdObj ? googleIdObj.googleId : undefined;
        }
        
        let res;
        if (resetPasswordToken) {
          res = await pgDb.query('SELECT * FROM users WHERE reset_password_token = $1', [resetPasswordToken]);
        } else if (verificationToken) {
          res = await pgDb.query('SELECT * FROM users WHERE verification_token = $1', [verificationToken]);
        } else if (email && googleId) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR google_id = $2', [email, googleId]);
        } else if (email && mobile) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR mobile = $2 OR phone = $2', [email, mobile]);
        } else if (email) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        } else if (mobile) {
          res = await pgDb.query('SELECT * FROM users WHERE mobile = $1 OR phone = $1', [mobile]);
        } else if (googleId) {
          res = await pgDb.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        } else {
          return resolve(null);
        }
        
        if (res.rows.length === 0) return resolve(null);
        return resolve(mapUser(res.rows[0]));
      }
    };
    return selectChain;
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM users WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    const mapped = mapUser(res.rows[0]);
    if (mapped) {
      mapped.select = function(fields) {
        return this;
      };
    }
    return mapped;
  },

  create: async (userData) => {
    const id = userData._id || 'user-' + Date.now();
    const name = userData.name;
    const email = userData.email;
    const phone = userData.phone || userData.mobile || '';
    const mobile = userData.mobile || userData.phone || '';
    const role = userData.role || 'user';
    const googleId = userData.googleId || null;
    const profileImage = userData.profileImage || '';
    const emailVerified = userData.emailVerified || false;
    const verificationToken = userData.verificationToken || null;
    const resetPasswordToken = userData.resetPasswordToken || null;
    const resetPasswordExpires = userData.resetPasswordExpires || null;
    const lastLogin = userData.lastLogin || new Date();
    const savedJobs = userData.savedJobs || [];
    const profileDataStr = userData.profileData ? JSON.stringify(userData.profileData) : '{}';
    
    // Hash password if present
    let password = userData.password || '';
    if (password && !password.startsWith('$2a$') && !password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const res = await pgDb.query(
      `INSERT INTO users (
        id, name, email, password, phone, mobile, role, google_id, profile_image, 
        email_verified, verification_token, reset_password_token, reset_password_expires, 
        last_login, saved_jobs, profile_data, created_at, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()) 
       RETURNING *`,
      [
        id, name, email, password, phone, mobile, role, googleId, profileImage, 
        emailVerified, verificationToken, resetPasswordToken, resetPasswordExpires, 
        lastLogin, savedJobs, profileDataStr
      ]
    );

    return mapUser(res.rows[0]);
  },

  find: async () => {
    const res = await pgDb.query('SELECT * FROM users ORDER BY created_at DESC');
    const mapped = res.rows.map(mapUser);
    mapped.select = () => mapped;
    return mapped;
  }
};

export default User;
