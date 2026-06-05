import bcrypt from 'bcryptjs';
import * as pgDb from '../config/pgDb.js';

const mapUser = (u) => {
  if (!u) return null;
  return {
    _id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    phone: u.phone,
    role: u.role,
    googleId: u.google_id,
    savedJobs: u.saved_jobs || [],
    profileData: u.profile_data ? JSON.parse(u.profile_data) : {},
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    },
    save: async function() {
      const profileDataStr = typeof this.profileData === 'object' ? JSON.stringify(this.profileData) : '{}';
      await pgDb.query(
        `UPDATE users SET google_id = $1, role = $2, name = $3, phone = $4, saved_jobs = $5, profile_data = $6, updated_at = NOW() WHERE id = $7`,
        [this.googleId || null, this.role, this.name, this.phone, this.savedJobs, profileDataStr, this._id]
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
        let googleId = queryObj.googleId;
        
        if (queryObj.$or) {
          const emailObj = queryObj.$or.find(o => o.email !== undefined);
          const googleIdObj = queryObj.$or.find(o => o.googleId !== undefined);
          email = emailObj ? emailObj.email : undefined;
          googleId = googleIdObj ? googleIdObj.googleId : undefined;
        }
        
        if (typeof email === 'object' && email.$regex) {
          email = email.$regex;
        }

        let res;
        if (email && googleId) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR google_id = $2', [email, googleId]);
        } else if (email) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
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
        let googleId = queryObj.googleId;
        
        if (queryObj.$or) {
          const emailObj = queryObj.$or.find(o => o.email !== undefined);
          const googleIdObj = queryObj.$or.find(o => o.googleId !== undefined);
          email = emailObj ? emailObj.email : undefined;
          googleId = googleIdObj ? googleIdObj.googleId : undefined;
        }
        
        let res;
        if (email && googleId) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR google_id = $2', [email, googleId]);
        } else if (email) {
          res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
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
    const phone = userData.phone || '';
    const role = userData.role || 'user';
    const googleId = userData.googleId || null;
    const savedJobs = userData.savedJobs || [];
    const profileDataStr = userData.profileData ? JSON.stringify(userData.profileData) : '{}';
    
    // Hash password if present
    let password = userData.password || '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const res = await pgDb.query(
      `INSERT INTO users (id, name, email, password, phone, role, google_id, saved_jobs, profile_data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *`,
      [id, name, email, password, phone, role, googleId, savedJobs, profileDataStr]
    );

    return mapUser(res.rows[0]);
  },

  find: async () => {
    const res = await pgDb.query('SELECT * FROM users ORDER BY created_at DESC');
    const mapped = res.rows.map(mapUser);
    
    // Add custom select helper to match Mongoose .select('-password')
    mapped.select = () => mapped;
    return mapped;
  }
};

export default User;
