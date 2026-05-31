import * as pgDb from '../config/pgDb.js';

const mapQuiz = (q) => {
  if (!q) return null;
  return {
    _id: q.id,
    key: q.key,
    title: q.title,
    icon: q.icon || 'HelpCircle',
    color: q.color || '#1B8C0A',
    bgColor: q.bg_color || '#E8F5E3',
    description: q.description || '',
    duration: q.duration || 600,
    questions: typeof q.questions === 'string' ? JSON.parse(q.questions) : (q.questions || []),
    deleteOne: async function() {
      await pgDb.query('DELETE FROM quizzes WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const Quiz = {
  find: async () => {
    const res = await pgDb.query('SELECT * FROM quizzes ORDER BY title ASC');
    return res.rows.map(mapQuiz);
  },

  findOne: async (queryObj) => {
    const res = await pgDb.query('SELECT * FROM quizzes WHERE key = $1', [queryObj.key]);
    if (res.rows.length === 0) return null;
    return mapQuiz(res.rows[0]);
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapQuiz(res.rows[0]);
  },

  create: async (quizData) => {
    const id = quizData._id || 'quiz-' + Date.now();
    const title = quizData.title;
    const description = quizData.description || '';
    const duration = Number(quizData.duration) || 600;
    const icon = quizData.icon || 'HelpCircle';
    const color = quizData.color || '#2563EB';
    const bgColor = quizData.bgColor || '#EFF6FF';
    
    // key
    const key = quizData.key || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // serialize questions JSON array
    const questions = JSON.stringify(quizData.questions || []);

    const res = await pgDb.query(
      `INSERT INTO quizzes (id, key, title, icon, color, bg_color, description, duration, questions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [id, key, title, icon, color, bgColor, description, duration, questions]
    );

    return mapQuiz(res.rows[0]);
  },

  findByIdAndUpdate: async (id, updateData, options) => {
    const setFields = [];
    const params = [id];

    const fieldsToUpdate = {
      title: updateData.title,
      description: updateData.description,
      duration: updateData.duration ? Number(updateData.duration) : undefined,
      icon: updateData.icon,
      color: updateData.color,
      bg_color: updateData.bgColor
    };

    if (updateData.title && !updateData.key) {
      fieldsToUpdate.key = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    } else if (updateData.key) {
      fieldsToUpdate.key = updateData.key;
    }

    if (updateData.questions) {
      fieldsToUpdate.questions = JSON.stringify(updateData.questions);
    }

    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] !== undefined) {
        params.push(fieldsToUpdate[key]);
        setFields.push(`${key} = $${params.length}`);
      }
    });

    if (setFields.length === 0) {
      const existing = await Quiz.findById(id);
      return existing;
    }

    const res = await pgDb.query(
      `UPDATE quizzes SET ${setFields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

    if (res.rows.length === 0) return null;
    return mapQuiz(res.rows[0]);
  }
};

export default Quiz;
