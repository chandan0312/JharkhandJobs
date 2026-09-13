import * as pgDb from '../db/pgDb.js';

const mapBlogPost = (b) => {
  if (!b) return null;
  return {
    _id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content,
    category: b.category,
    author: b.author,
    coverImage: b.cover_image,
    tags: Array.isArray(b.tags) ? b.tags : (typeof b.tags === 'string' ? JSON.parse(b.tags || '[]') : []),
    views: b.views || 0,
    publishedDate: b.published_date,
    save: async function() {
      await pgDb.query(
        'UPDATE blog_posts SET views = $1 WHERE id = $2',
        [this.views, this._id]
      );
      return this;
    },
    deleteOne: async function() {
      await pgDb.query('DELETE FROM blog_posts WHERE id = $1', [this._id]);
      return { success: true };
    }
  };
};

const BlogPost = {
  find: (queryObj) => {
    const queryChain = {
      sort: async (sortOption) => {
        let sql = 'SELECT * FROM blog_posts';
        const params = [];
        const whereClauses = [];

        if (queryObj) {
          if (queryObj.category && queryObj.category !== 'All') {
            params.push(queryObj.category);
            whereClauses.push(`category = $${params.length}`);
          }
          if (queryObj.tag) {
            params.push(queryObj.tag);
            whereClauses.push(`$${params.length} = ANY(tags)`);
          }
        }

        if (whereClauses.length > 0) {
          sql += ' WHERE ' + whereClauses.join(' AND ');
        }

        // sorting
        if (sortOption && sortOption.views === -1) {
          sql += ' ORDER BY views DESC';
        } else {
          sql += ' ORDER BY published_date DESC';
        }

        const res = await pgDb.query(sql, params);
        return res.rows.map(mapBlogPost);
      },
      then: async (resolve) => {
        const res = await queryChain.sort({ publishedDate: -1 });
        return resolve(res);
      }
    };
    return queryChain;
  },

  findOne: async (queryObj) => {
    const res = await pgDb.query('SELECT * FROM blog_posts WHERE slug = $1', [queryObj.slug]);
    if (res.rows.length === 0) return null;
    return mapBlogPost(res.rows[0]);
  },

  findById: async (id) => {
    const res = await pgDb.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapBlogPost(res.rows[0]);
  },

  create: async (blogData) => {
    const id = blogData._id || 'blog-' + Date.now();
    const title = blogData.title;
    const excerpt = blogData.excerpt;
    const content = blogData.content;
    const category = blogData.category || 'Career Guide';
    const author = blogData.author || 'Jharkhand Jobs Team';
    const coverImage = blogData.coverImage || '';
    const tags = blogData.tags || [];
    const views = blogData.views || 0;
    
    const slug = blogData.slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const res = await pgDb.query(
      `INSERT INTO blog_posts (id, title, slug, excerpt, content, category, author, cover_image, tags, views, published_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING *`,
      [id, title, slug, excerpt, content, category, author, coverImage, tags, views]
    );

    return mapBlogPost(res.rows[0]);
  },

  findByIdAndUpdate: async (id, updateData, options) => {
    const setFields = [];
    const params = [id];

    const fieldsToUpdate = {
      title: updateData.title,
      excerpt: updateData.excerpt,
      content: updateData.content,
      category: updateData.category,
      author: updateData.author,
      cover_image: updateData.coverImage,
      tags: updateData.tags,
      views: updateData.views
    };

    if (updateData.title && !updateData.slug) {
      fieldsToUpdate.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    } else if (updateData.slug) {
      fieldsToUpdate.slug = updateData.slug;
    }

    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] !== undefined) {
        params.push(fieldsToUpdate[key]);
        setFields.push(`${key} = $${params.length}`);
      }
    });

    if (setFields.length === 0) {
      const existing = await BlogPost.findById(id);
      return existing;
    }

    const res = await pgDb.query(
      `UPDATE blog_posts SET ${setFields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

    if (res.rows.length === 0) return null;
    return mapBlogPost(res.rows[0]);
  }
};

export default BlogPost;
