import * as pgDb from '../config/pgDb.js';

const mapForum = (f) => {
  if (!f) return null;
  return {
    _id: f.id,
    title: f.title,
    slug: f.slug,
    category: f.category,
    author: f.author,
    authorId: f.author_id,
    views: f.views || 0,
    replies: f.replies || 0,
    createdAt: f.created_at,
    save: async function() {
      await pgDb.query(
        'UPDATE forums SET views = $1, replies = $2 WHERE id = $3',
        [this.views, this.replies, this._id]
      );
      return this;
    },
    deleteOne: async function() {
      await pgDb.query('DELETE FROM forums WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const mapAnswer = (a) => {
  if (!a) return null;
  return {
    _id: a.id,
    forumId: a.forum_id,
    author: a.author,
    authorId: a.author_id,
    content: a.content,
    createdAt: a.created_at
  };
};

const Forum = {
  find: async (queryObj = {}) => {
    let sql = 'SELECT * FROM forums';
    const params = [];
    const whereClauses = [];

    if (queryObj.category && queryObj.category !== 'All') {
      params.push(queryObj.category);
      whereClauses.push(`category = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const res = await pgDb.query(sql, params);
    return res.rows.map(mapForum);
  },

  findOne: async (queryObj) => {
    let res;
    if (queryObj.slug) {
      res = await pgDb.query('SELECT * FROM forums WHERE slug = $1', [queryObj.slug]);
    } else if (queryObj.id) {
      res = await pgDb.query('SELECT * FROM forums WHERE id = $1', [queryObj.id]);
    }
    if (!res || res.rows.length === 0) return null;
    return mapForum(res.rows[0]);
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM forums WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapForum(res.rows[0]);
  },

  create: async (forumData) => {
    const id = forumData._id || 'forum-' + Date.now();
    const title = forumData.title;
    const category = forumData.category || 'General';
    const author = forumData.author;
    const authorId = forumData.authorId;
    const views = forumData.views || 0;
    const replies = forumData.replies || 0;
    
    const slug = forumData.slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const res = await pgDb.query(
      `INSERT INTO forums (id, title, slug, category, author, author_id, views, replies, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [id, title, slug, category, author, authorId, views, replies]
    );

    return mapForum(res.rows[0]);
  },

  // Answers (Replies) Methods
  getAnswers: async (forumId) => {
    const res = await pgDb.query(
      'SELECT * FROM forum_answers WHERE forum_id = $1 ORDER BY created_at ASC',
      [forumId]
    );
    return res.rows.map(mapAnswer);
  },

  addAnswer: async (answerData) => {
    const id = 'ans-' + Date.now();
    const { forumId, author, authorId, content } = answerData;

    const res = await pgDb.query(
      `INSERT INTO forum_answers (id, forum_id, author, author_id, content, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [id, forumId, author, authorId, content]
    );

    // Increment replies counter in forum
    await pgDb.query(
      'UPDATE forums SET replies = replies + 1 WHERE id = $1',
      [forumId]
    );

    return mapAnswer(res.rows[0]);
  },

  deleteAnswer: async (id) => {
    // Get answer details first to decrement count
    const ansRes = await pgDb.query('SELECT forum_id FROM forum_answers WHERE id = $1', [id]);
    if (ansRes.rows.length > 0) {
      const forumId = ansRes.rows[0].forum_id;
      await pgDb.query('DELETE FROM forum_answers WHERE id = $1', [id]);
      await pgDb.query('UPDATE forums SET replies = GREATEST(0, replies - 1) WHERE id = $1', [forumId]);
      return true;
    }
    return false;
  }
};

export default Forum;
