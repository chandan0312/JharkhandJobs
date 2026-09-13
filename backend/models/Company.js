import * as pgDb from '../db/pgDb.js';

const mapCompany = (c) => {
  if (!c) return null;
  return {
    _id: c.id,
    name: c.name,
    industry: c.industry,
    jobCount: c.job_count || 0,
    featured: c.featured || false,
    recentlyAdded: c.recently_added || false,
    companyColor: c.company_color || '#1B8C0A',
    deleteOne: async function() {
      await pgDb.query('DELETE FROM companies WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const Company = {
  countDocuments: async () => {
    const res = await pgDb.query('SELECT COUNT(*) FROM companies');
    return parseInt(res.rows[0].count);
  },

  find: async () => {
    const res = await pgDb.query('SELECT * FROM companies ORDER BY name ASC');
    return res.rows.map(mapCompany);
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM companies WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapCompany(res.rows[0]);
  },

  create: async (companyData) => {
    const id = companyData._id || 'comp-' + Date.now();
    const name = companyData.name;
    const industry = companyData.industry;
    const jobCount = companyData.jobCount || 0;
    const featured = companyData.featured !== undefined ? companyData.featured : false;
    const recentlyAdded = companyData.recentlyAdded !== undefined ? companyData.recentlyAdded : false;
    const companyColor = companyData.companyColor || '#1B8C0A';

    const res = await pgDb.query(
      `INSERT INTO companies (id, name, industry, job_count, featured, recently_added, company_color)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, name, industry, jobCount, featured, recentlyAdded, companyColor]
    );

    return mapCompany(res.rows[0]);
  },

  findByIdAndUpdate: async (id, updateData, options) => {
    const setFields = [];
    const params = [id];

    const fieldsToUpdate = {
      name: updateData.name,
      industry: updateData.industry,
      job_count: updateData.jobCount,
      featured: updateData.featured,
      recently_added: updateData.recentlyAdded,
      company_color: updateData.companyColor
    };

    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] !== undefined) {
        params.push(fieldsToUpdate[key]);
        setFields.push(`${key} = $${params.length}`);
      }
    });

    if (setFields.length === 0) {
      const existing = await Company.findById(id);
      return existing;
    }

    const res = await pgDb.query(
      `UPDATE companies SET ${setFields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

    if (res.rows.length === 0) return null;
    return mapCompany(res.rows[0]);
  }
};

export default Company;
