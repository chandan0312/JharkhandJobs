import express from 'express';
import Quiz from '../models/Quiz.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../config/mockDb.js';

const router = express.Router();

// @desc    Get all practice quizzes
// @route   GET /api/quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (global.useMockDb) {
      return res.json({ success: true, count: mockDb.quizzes.length, quizzes: mockDb.quizzes });
    }

    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new practice quiz
// @route   POST /api/quizzes
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, duration, description, questions } = req.body;
    
    // Generate key from title
    const key = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Map styled parameters or defaults
    const icons = ['BookOpen', 'HelpCircle', 'Clock', 'Award'];
    const colors = ['#1B8C0A', '#2563EB', '#7C3AED', '#EA580C'];
    const bgColors = ['#E8F5E3', '#EFF6FF', '#F5F3FF', '#FEF3C7'];
    
    const randomIdx = Math.floor(Math.random() * icons.length);
    const icon = req.body.icon || icons[randomIdx];
    const color = req.body.color || colors[randomIdx];
    const bgColor = req.body.bgColor || bgColors[randomIdx];

    if (global.useMockDb) {
      const quiz = {
        _id: 'mock-quiz-' + Date.now(),
        title,
        key,
        icon,
        color,
        bgColor,
        description: description || '',
        duration: Number(duration) || 600,
        questions: questions || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockDb.quizzes.push(quiz);
      return res.status(201).json({ success: true, quiz });
    }

    const quiz = await Quiz.create({
      title,
      key,
      icon,
      color,
      bgColor,
      description,
      duration: Number(duration) || 600,
      questions
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete practice quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const quizId = req.params.id;

    if (global.useMockDb) {
      const quizIdx = mockDb.quizzes.findIndex(q => q._id === quizId);
      if (quizIdx === -1) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }

      mockDb.quizzes.splice(quizIdx, 1);
      return res.json({ success: true, message: 'Quiz deleted successfully' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    await quiz.deleteOne();
    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update practice quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const quizId = req.params.id;

    if (global.useMockDb) {
      const quizIdx = mockDb.quizzes.findIndex(q => q._id === quizId);
      if (quizIdx === -1) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }

      const key = req.body.title
        ? req.body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : mockDb.quizzes[quizIdx].key;

      mockDb.quizzes[quizIdx] = {
        ...mockDb.quizzes[quizIdx],
        ...req.body,
        key,
        updatedAt: new Date()
      };

      return res.json({ success: true, quiz: mockDb.quizzes[quizIdx] });
    }

    let quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (req.body.title) {
      req.body.key = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    quiz = await Quiz.findByIdAndUpdate(quizId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
