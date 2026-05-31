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
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
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
    return {
      select: async (fields) => {
        let email = queryObj.email;
        if (typeof email === 'object' && email.$regex) {
          // simple regex conversion
          email = email.$regex;
        }
        
        const res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        if (res.rows.length === 0) return null;
        return mapUser(res.rows[0]);
      },
      then: async (resolve) => {
        const res = await pgDb.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [queryObj.email]);
        if (res.rows.length === 0) return resolve(null);
        return resolve(mapUser(res.rows[0]));
      }
    };
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM users WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapUser(res.rows[0]);
  },

  create: async (userData) => {
    const id = userData._id || 'user-' + Date.now();
    const name = userData.name;
    const email = userData.email;
    const phone = userData.phone || '';
    const role = userData.role || 'user';
    const googleId = userData.googleId || null;
    const savedJobs = userData.savedJobs || [];
    
    // Hash password if present
    let password = userData.password || '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const res = await pgDb.query(
      `INSERT INTO users (id, name, email, password, phone, role, google_id, saved_jobs, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
      [id, name, email, password, phone, role, googleId, savedJobs]
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
