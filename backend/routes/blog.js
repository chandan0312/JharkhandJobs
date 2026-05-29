import express from 'express';
import BlogPost from '../models/BlogPost.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../config/mockDb.js';

const router = express.Router();

// @desc    Get all blog posts (with category, tag, & keyword search)
// @route   GET /api/blog
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, tag, search } = req.query;

    if (global.useMockDb) {
      let posts = [...mockDb.blogPosts];

      if (category && category !== 'All') {
        posts = posts.filter(p => p.category === category);
      }
      if (tag) {
        posts = posts.filter(p => p.tags.includes(tag));
      }
      if (search) {
        const s = search.toLowerCase();
        posts = posts.filter(p => 
          p.title.toLowerCase().includes(s) ||
          p.excerpt.toLowerCase().includes(s) ||
          p.content.toLowerCase().includes(s)
        );
      }

      posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
      return res.json({ success: true, count: posts.length, posts });
    }

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await BlogPost.find(query).sort({ publishedDate: -1 });
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;

    if (global.useMockDb) {
      const post = mockDb.blogPosts.find(p => p.slug === slug);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      
      // Increment views in-memory
      post.views += 1;
      return res.json({ success: true, post });
    }

    const post = await BlogPost.findOne({ slug });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    post.views += 1;
    await post.save();
    
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const post = {
        _id: 'mock-post-' + Date.now(),
        ...req.body,
        slug,
        views: 0,
        publishedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockDb.blogPosts.push(post);
      return res.status(201).json({ success: true, post });
    }

    const post = await BlogPost.create(req.body);
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const postId = req.params.id;

    if (global.useMockDb) {
      const postIndex = mockDb.blogPosts.findIndex(p => p._id === postId);
      if (postIndex === -1) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      
      mockDb.blogPosts.splice(postIndex, 1);
      return res.json({ success: true, message: 'Blog post deleted successfully' });
    }

    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const postId = req.params.id;

    if (global.useMockDb) {
      const postIndex = mockDb.blogPosts.findIndex(p => p._id === postId);
      if (postIndex === -1) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }

      const slug = req.body.title
        ? req.body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : mockDb.blogPosts[postIndex].slug;

      mockDb.blogPosts[postIndex] = {
        ...mockDb.blogPosts[postIndex],
        ...req.body,
        slug,
        updatedAt: new Date()
      };

      return res.json({ success: true, post: mockDb.blogPosts[postIndex] });
    }

    let post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    if (req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    post = await BlogPost.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
