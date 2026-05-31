import * as pgDb from '../config/pgDb.js';

const mapExam = (e) => {
  if (!e) return null;
  return {
    _id: e.id,
    title: e.title,
    organization: e.organization,
    orgShort: e.org_short,
    category: e.category,
    lastDate: e.last_date || '',
    posts: e.posts || '',
    status: e.status || '',
    description: e.description || '',
    isNew: e.is_new || false,
    deleteOne: async function() {
      await pgDb.query('DELETE FROM exams WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const Exam = {
  countDocuments: async () => {
    const res = await pgDb.query('SELECT COUNT(*) FROM exams');
    return parseInt(res.rows[0].count);
  },

  find: async (queryObj) => {
    let sql = 'SELECT * FROM exams';
    const params = [];
    const whereClauses = [];

    if (queryObj) {
      if (queryObj.category) {
        params.push(queryObj.category);
        whereClauses.push(`category = $${params.length}`);
      }
      if (queryObj.orgShort) {
        params.push(queryObj.orgShort);
        whereClauses.push(`org_short = $${params.length}`);
      }
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' ORDER BY id DESC';

    const res = await pgDb.query(sql, params);
    return res.rows.map(mapExam);
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM exams WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapExam(res.rows[0]);
  },

  create: async (examData) => {
    const id = examData._id || 'exam-' + Date.now();
    const title = examData.title;
    const organization = examData.organization;
    const orgShort = examData.orgShort;
    const category = examData.category;
    const lastDate = examData.lastDate || '';
    const posts = examData.posts || '';
    const status = examData.status || '';
    const description = examData.description || '';
    const isNew = examData.isNew !== undefined ? examData.isNew : true;

    const res = await pgDb.query(
      `INSERT INTO exams (id, title, organization, org_short, category, last_date, posts, status, description, is_new)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [id, title, organization, orgShort, category, lastDate, posts, status, description, isNew]
    );

    return mapExam(res.rows[0]);
  },

  findByIdAndUpdate: async (id, updateData, options) => {
    const setFields = [];
    const params = [id];

    const fieldsToUpdate = {
      title: updateData.title,
      organization: updateData.organization,
      org_short: updateData.orgShort,
      category: updateData.category,
      last_date: updateData.lastDate,
      posts: updateData.posts,
      status: updateData.status,
      description: updateData.description,
      is_new: updateData.isNew
    };

    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] !== undefined) {
        params.push(fieldsToUpdate[key]);
        setFields.push(`${key} = $${params.length}`);
      }
    });

    if (setFields.length === 0) {
      const existing = await Exam.findById(id);
      return existing;
    }

    const res = await pgDb.query(
      `UPDATE exams SET ${setFields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

    if (res.rows.length === 0) return null;
    return mapExam(res.rows[0]);
  }
};

export default Exam;
