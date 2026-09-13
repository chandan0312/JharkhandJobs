import * as pgDb from '../db/pgDb.js';

const mapJob = (j) => {
  if (!j) return null;
  return {
    _id: j.id,
    title: j.title,
    company: j.company,
    companyInitial: j.company_initial,
    companyColor: j.company_color,
    location: j.location,
    type: j.type,
    salary: {
      min: Number(j.salary_min),
      max: Number(j.salary_max),
      currency: j.salary_currency || '₹',
      period: j.salary_period || 'monthly'
    },
    experience: j.experience,
    qualification: j.qualification || 'Graduation',
    badgeText: j.badge_text || '',
    category: j.category,
    industry: j.industry,
    description: j.description,
    responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : (typeof j.responsibilities === 'string' ? JSON.parse(j.responsibilities || '[]') : []),
    requirements: Array.isArray(j.requirements) ? j.requirements : (typeof j.requirements === 'string' ? JSON.parse(j.requirements || '[]') : []),
    status: j.status || 'active',
    postedDate: j.posted_date,
    lastDate: j.last_date,
    updatedAt: j.updated_at || j.posted_date,
    vacancies: j.vacancies !== undefined ? Number(j.vacancies) : 45,
    postedBy: j.posted_by,
    applyLink: j.apply_link || '',
    pdfUrl: j.pdf_url || '',
    deleteOne: async function() {
      await pgDb.query('DELETE FROM jobs WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const Job = {
  countDocuments: async (query) => {
    let sql = 'SELECT COUNT(*) FROM jobs';
    const params = [];
    if (query && query.status) {
      params.push(query.status);
      sql += ' WHERE status = $1';
    }
    const res = await pgDb.query(sql, params);
    return parseInt(res.rows[0].count);
  },

  aggregate: async (pipeline) => {
    // Matches { $group: { _id: '$type', count: { $sum: 1 } } }
    const res = await pgDb.query('SELECT type AS "_id", COUNT(*)::integer AS "count" FROM jobs GROUP BY type');
    return res.rows;
  },

  find: (queryObj) => {
    const queryChain = {
      sort: async (sortOption) => {
        let sql = 'SELECT * FROM jobs';
        const params = [];
        const whereClauses = [];

        if (queryObj) {
          // category
          if (queryObj.category) {
            params.push(queryObj.category);
            whereClauses.push(`category = $${params.length}`);
          }
          // type
          if (queryObj.type) {
            params.push(queryObj.type);
            whereClauses.push(`type = $${params.length}`);
          }
          // location regex
          if (queryObj.location) {
            let loc = queryObj.location;
            if (typeof loc === 'object' && loc.$regex) loc = loc.$regex;
            params.push(`%${loc}%`);
            whereClauses.push(`location ILIKE $${params.length}`);
          }
          // experience regex
          if (queryObj.experience) {
            let exp = queryObj.experience;
            if (typeof exp === 'object' && exp.$regex) exp = exp.$regex;
            params.push(`%${exp}%`);
            whereClauses.push(`experience ILIKE $${params.length}`);
          }
          // min salary
          if (queryObj['salary.min'] && queryObj['salary.min'].$gte) {
            params.push(queryObj['salary.min'].$gte);
            whereClauses.push(`salary_min >= $${params.length}`);
          }
          // max salary
          if (queryObj['salary.max'] && queryObj['salary.max'].$lte) {
            params.push(queryObj['salary.max'].$lte);
            whereClauses.push(`salary_max <= $${params.length}`);
          }
          // search keyword ($or array)
          if (queryObj.$or && Array.isArray(queryObj.$or)) {
            const orClauses = [];
            const searchObj = queryObj.$or.find(o => o.title || o.company || o.description);
            if (searchObj) {
              let val = '';
              if (searchObj.title) val = searchObj.title.$regex || searchObj.title;
              else if (searchObj.company) val = searchObj.company.$regex || searchObj.company;
              else if (searchObj.description) val = searchObj.description.$regex || searchObj.description;
              else if (searchObj.industry) val = searchObj.industry.$regex || searchObj.industry;
              
              params.push(`%${val}%`);
              const pIndex = params.length;
              orClauses.push(`title ILIKE $${pIndex}`);
              orClauses.push(`company ILIKE $${pIndex}`);
              orClauses.push(`description ILIKE $${pIndex}`);
              orClauses.push(`industry ILIKE $${pIndex}`);
              
              whereClauses.push(`(${orClauses.join(' OR ')})`);
            }
          }
        }

        if (whereClauses.length > 0) {
          sql += ' WHERE ' + whereClauses.join(' AND ');
        }

        // sorting
        if (sortOption) {
          if (sortOption.postedDate === 1) {
            sql += ' ORDER BY posted_date ASC';
          } else if (sortOption.postedDate === -1) {
            sql += ' ORDER BY updated_at DESC, posted_date DESC';
          } else if (sortOption['salary.max'] === -1) {
            sql += ' ORDER BY salary_max DESC';
          } else {
            sql += ' ORDER BY updated_at DESC, posted_date DESC';
          }
        } else {
          sql += ' ORDER BY updated_at DESC, posted_date DESC';
        }

        const res = await pgDb.query(sql, params);
        return res.rows.map(mapJob);
      },
      then: async (resolve) => {
        // chain fallback
        const res = await queryChain.sort({ postedDate: -1 });
        return resolve(res);
      }
    };
    return queryChain;
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapJob(res.rows[0]);
  },

  create: async (jobData) => {
    const id = jobData._id || 'job-' + Date.now();
    const title = jobData.title;
    const company = jobData.company;
    const companyColor = jobData.companyColor || '#1B8C0A';
    const location = jobData.location;
    const type = jobData.type;
    const experience = jobData.experience;
    const qualification = jobData.qualification || 'Graduation';
    const badgeText = jobData.badgeText || '';
    const category = jobData.category;
    const industry = jobData.industry;
    const description = jobData.description;
    const responsibilities = jobData.responsibilities || [];
    const requirements = jobData.requirements || [];
    const status = jobData.status || 'active';
    const postedBy = jobData.postedBy || null;
    const vacancies = jobData.vacancies !== undefined ? Number(jobData.vacancies) : 45;
    const applyLink = jobData.applyLink || '';
    const pdfUrl = jobData.pdfUrl || '';
    
    // Auto initials
    const companyInitial = jobData.companyInitial || company.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    
    // Salary fields
    const salaryMin = jobData.salary?.min || 0;
    const salaryMax = jobData.salary?.max || 0;
    const salaryCurrency = jobData.salary?.currency || '₹';
    const salaryPeriod = jobData.salary?.period || 'LPA';
    
    const lastDate = jobData.lastDate ? new Date(jobData.lastDate) : null;

    const res = await pgDb.query(
      `INSERT INTO jobs (id, title, company, company_initial, company_color, location, type, salary_min, salary_max, salary_currency, salary_period, experience, qualification, badge_text, category, industry, description, responsibilities, requirements, status, posted_date, last_date, vacancies, posted_by, apply_link, pdf_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), $21, $22, $23, $24, $25) RETURNING *`,
      [id, title, company, companyInitial, companyColor, location, type, salaryMin, salaryMax, salaryCurrency, salaryPeriod, experience, qualification, badgeText, category, industry, description, responsibilities, requirements, status, lastDate, vacancies, postedBy, applyLink, pdfUrl]
    );

    return mapJob(res.rows[0]);
  },

  findByIdAndUpdate: async (id, updateData, options) => {
    // Construct dynamic update fields query
    const setFields = [];
    const params = [id];
    
    // Map object details if present
    const fieldsToUpdate = {
      title: updateData.title,
      company: updateData.company,
      company_color: updateData.companyColor,
      location: updateData.location,
      type: updateData.type,
      experience: updateData.experience,
      qualification: updateData.qualification,
      badge_text: updateData.badgeText,
      category: updateData.category,
      industry: updateData.industry,
      description: updateData.description,
      responsibilities: updateData.responsibilities,
      requirements: updateData.requirements,
      status: updateData.status,
      vacancies: updateData.vacancies !== undefined ? Number(updateData.vacancies) : undefined,
      apply_link: updateData.applyLink,
      pdf_url: updateData.pdfUrl
    };

    if (updateData.company && !updateData.companyInitial) {
      fieldsToUpdate.company_initial = updateData.company.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    } else if (updateData.companyInitial) {
      fieldsToUpdate.company_initial = updateData.companyInitial;
    }

    if (updateData.salary) {
      fieldsToUpdate.salary_min = updateData.salary.min;
      fieldsToUpdate.salary_max = updateData.salary.max;
      fieldsToUpdate.salary_currency = updateData.salary.currency;
      fieldsToUpdate.salary_period = updateData.salary.period;
    }

    if (updateData.lastDate) {
      fieldsToUpdate.last_date = new Date(updateData.lastDate);
    }

    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] !== undefined) {
        params.push(fieldsToUpdate[key]);
        setFields.push(`${key} = $${params.length}`);
      }
    });

    if (setFields.length === 0) {
      const existing = await Job.findById(id);
      return existing;
    }

    const res = await pgDb.query(
      `UPDATE jobs SET ${setFields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      params
    );

    if (res.rows.length === 0) return null;
    return mapJob(res.rows[0]);
  }
};

export default Job;
