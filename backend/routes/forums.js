import express from 'express';
import Forum from '../models/Forum.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../db/mockDb.js';

const router = express.Router();

// @desc    Get all discussions
// @route   GET /api/forums
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    if (global.useMockDb) {
      let posts = [...mockDb.forums];
      if (category && category !== 'All') {
        posts = posts.filter(p => p.category === category);
      }
      // sort newest first
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: posts.length, forums: posts });
    }

    const posts = await Forum.find({ category });
    res.json({ success: true, count: posts.length, forums: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single discussion and its replies
// @route   GET /api/forums/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;

    if (global.useMockDb) {
      const forum = mockDb.forums.find(f => f.slug === slug);
      if (!forum) {
        return res.status(404).json({ success: false, message: 'Discussion thread not found' });
      }
      
      // Increment views
      forum.views += 1;
      
      // Get answers
      const answers = mockDb.forumAnswers.filter(a => a.forumId === forum._id);
      answers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      return res.json({ success: true, forum, answers });
    }

    const forum = await Forum.findOne({ slug });
    if (!forum) {
      return res.status(404).json({ success: false, message: 'Discussion thread not found' });
    }

    // Increment views
    forum.views += 1;
    await forum.save();

    const answers = await Forum.getAnswers(forum._id);
    res.json({ success: true, forum, answers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new discussion post
// @route   POST /api/forums
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, category } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title and category' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const forumData = {
      title,
      category,
      author: req.user.name,
      authorId: req.user._id,
      slug,
      views: 0,
      replies: 0
    };

    if (global.useMockDb) {
      const forum = {
        _id: 'mock-forum-' + Date.now(),
        ...forumData,
        createdAt: new Date().toISOString()
      };
      mockDb.forums.push(forum);
      return res.status(201).json({ success: true, forum });
    }

    const forum = await Forum.create(forumData);
    res.status(201).json({ success: true, forum });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete discussion post
// @route   DELETE /api/forums/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const id = req.params.id;

    if (global.useMockDb) {
      const index = mockDb.forums.findIndex(f => f._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Discussion post not found' });
      }

      const forum = mockDb.forums[index];
      // Only allow admin or the author to delete
      if (req.user.role !== 'admin' && req.user._id !== forum.authorId) {
        return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
      }

      mockDb.forums.splice(index, 1);
      // Clean answers as well
      mockDb.forumAnswers = mockDb.forumAnswers.filter(a => a.forumId !== id);

      return res.json({ success: true, message: 'Discussion post deleted successfully' });
    }

    const forum = await Forum.findById(id);
    if (!forum) {
      return res.status(404).json({ success: false, message: 'Discussion post not found' });
    }

    if (req.user.role !== 'admin' && req.user._id !== forum.authorId) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await forum.deleteOne();
    res.json({ success: true, message: 'Discussion post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add reply answer to discussion
// @route   POST /api/forums/:id/answers
// @access  Private
router.post('/:id/answers', protect, async (req, res) => {
  try {
    const forumId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    if (global.useMockDb) {
      const forum = mockDb.forums.find(f => f._id === forumId);
      if (!forum) {
        return res.status(404).json({ success: false, message: 'Discussion not found' });
      }

      const answer = {
        _id: 'mock-ans-' + Date.now(),
        forumId,
        author: req.user.name,
        authorId: req.user._id,
        content,
        createdAt: new Date().toISOString()
      };

      mockDb.forumAnswers.push(answer);
      forum.replies += 1;

      return res.status(201).json({ success: true, answer });
    }

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    const answer = await Forum.addAnswer({
      forumId,
      author: req.user.name,
      authorId: req.user._id,
      content
    });

    res.status(201).json({ success: true, answer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete reply answer
// @route   DELETE /api/forums/answers/:id
// @access  Private
router.delete('/answers/:id', protect, async (req, res) => {
  try {
    const id = req.params.id;

    if (global.useMockDb) {
      const answerIndex = mockDb.forumAnswers.findIndex(a => a._id === id);
      if (answerIndex === -1) {
        return res.status(404).json({ success: false, message: 'Reply not found' });
      }

      const answer = mockDb.forumAnswers[answerIndex];
      const forum = mockDb.forums.find(f => f._id === answer.forumId);

      if (req.user.role !== 'admin' && req.user._id !== answer.authorId) {
        return res.status(401).json({ success: false, message: 'Not authorized to delete this reply' });
      }

      mockDb.forumAnswers.splice(answerIndex, 1);
      if (forum) {
        forum.replies = Math.max(0, forum.replies - 1);
      }

      return res.json({ success: true, message: 'Reply deleted successfully' });
    }

    // PostgreSQL mode
    const ansRes = await Forum.deleteAnswer(id);
    if (!ansRes) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    res.json({ success: true, message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
