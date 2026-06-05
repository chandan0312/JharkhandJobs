import * as pgDb from '../config/pgDb.js';

const mapApplication = async (a) => {
  if (!a) return null;
  
  let job = null;
  if (a.job_id) {
    const jobRes = await pgDb.query('SELECT * FROM jobs WHERE id = $1', [a.job_id]);
    if (jobRes.rows.length > 0) {
      const j = jobRes.rows[0];
      job = {
        _id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.type,
        salary: {
          min: Number(j.salary_min),
          max: Number(j.salary_max),
          currency: j.salary_currency || '₹',
          period: j.salary_period || 'LPA'
        }
      };
    }
  }

  // Fetch applicant
  let applicant = null;
  if (a.user_id) {
    const userRes = await pgDb.query('SELECT * FROM users WHERE id = $1', [a.user_id]);
    if (userRes.rows.length > 0) {
      const u = userRes.rows[0];
      applicant = {
        _id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone
      };
    }
  }

  return {
    _id: a.id,
    job: job,
    applicant: applicant || a.user_id,
    fullName: a.full_name,
    email: a.email,
    phone: a.phone,
    resumePath: a.resume_path,
    status: a.status || 'pending',
    appliedDate: a.applied_date,
    save: async function() {
      await pgDb.query(
        'UPDATE applications SET status = $1, full_name = $2, email = $3, phone = $4, resume_path = $5 WHERE id = $6',
        [this.status, this.fullName, this.email, this.phone, this.resumePath, this._id]
      );
      return this;
    },
    deleteOne: async function() {
      await pgDb.query('DELETE FROM applications WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const Application = {
  countDocuments: async () => {
    const res = await pgDb.query('SELECT COUNT(*) FROM applications');
    return parseInt(res.rows[0].count);
  },

  find: (queryObj) => {
    let limitCount = 100;
    
    const queryChain = {
      populate: (pathStr, fields) => {
        // chain helper
        return queryChain;
      },
      sort: (sortObj) => {
        // chain helper
        return queryChain;
      },
      limit: async (limitNum) => {
        limitCount = limitNum;
        return queryChain.exec();
      },
      exec: async () => {
        let sql = 'SELECT * FROM applications';
        const params = [];
        const whereClauses = [];

        if (queryObj) {
          if (queryObj.applicant) {
            params.push(queryObj.applicant);
            whereClauses.push(`user_id = $${params.length}`);
          }
          if (queryObj.job) {
            params.push(queryObj.job);
            whereClauses.push(`job_id = $${params.length}`);
          }
        }

        if (whereClauses.length > 0) {
          sql += ' WHERE ' + whereClauses.join(' AND ');
        }

        sql += ' ORDER BY applied_date DESC';
        
        if (limitCount) {
          sql += ` LIMIT ${limitCount}`;
        }

        const res = await pgDb.query(sql, params);
        return Promise.all(res.rows.map(mapApplication));
      },
      then: async (resolve) => {
        const res = await queryChain.exec();
        return resolve(res);
      }
    };
    return queryChain;
  },

  findById: (id) => {
    const queryChain = {
      populate: (pathStr, fields) => {
        return queryChain;
      },
      then: async (resolve) => {
        const res = await pgDb.query('SELECT * FROM applications WHERE id = $1', [id]);
        if (res.rows.length === 0) return resolve(null);
        const mapped = await mapApplication(res.rows[0]);
        return resolve(mapped);
      }
    };
    return queryChain;
  },

  create: async (appData) => {
    const id = appData._id || 'app-' + Date.now();
    const jobId = appData.job;
    const userId = appData.applicant;
    const fullName = appData.fullName;
    const email = appData.email;
    const phone = appData.phone;
    const resumePath = appData.resumePath;
    const status = appData.status || 'pending';

    const res = await pgDb.query(
      `INSERT INTO applications (id, job_id, user_id, full_name, email, phone, resume_path, status, applied_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [id, jobId, userId, fullName, email, phone, resumePath, status]
    );

    return mapApplication(res.rows[0]);
  },

  findByIdAndUpdate: async (id, updateData, options) => {
    const setFields = [];
    const params = [id];

    const fieldsToUpdate = {
      status: updateData.status,
      full_name: updateData.fullName,
      email: updateData.email,
      phone: updateData.phone,
      resume_path: updateData.resumePath
    };

    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] !== undefined) {
        params.push(fieldsToUpdate[key]);
        setFields.push(`${key} = $${params.length}`);
      }
    });

    if (setFields.length === 0) {
      const existing = await Application.findById(id);
      return existing;
    }

    const res = await pgDb.query(
      `UPDATE applications SET ${setFields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

    if (res.rows.length === 0) return null;
    return mapApplication(res.rows[0]);
  }
};

export default Application;
