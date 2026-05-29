import express from 'express';
import Exam from '../models/Exam.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../config/mockDb.js';

const router = express.Router();

// @desc    Get all exams (with category, organization, & search filters)
// @route   GET /api/exams
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, org, search } = req.query;

    if (global.useMockDb) {
      let filteredExams = [...mockDb.exams];

      if (category && category !== 'All') {
        filteredExams = filteredExams.filter(e => e.category === category);
      }
      if (org && org !== 'All') {
        filteredExams = filteredExams.filter(e => e.orgShort === org);
      }
      if (search) {
        const s = search.toLowerCase();
        filteredExams = filteredExams.filter(e => 
          e.title.toLowerCase().includes(s) ||
          e.organization.toLowerCase().includes(s) ||
          (e.description && e.description.toLowerCase().includes(s))
        );
      }

      // Sort newest first
      filteredExams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({ success: true, count: filteredExams.length, exams: filteredExams });
    }

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (org && org !== 'All') {
      query.orgShort = org;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const exams = await Exam.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new exam notification
// @route   POST /api/exams
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const exam = {
        _id: 'mock-exam-' + Date.now(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockDb.exams.push(exam);
      return res.status(201).json({ success: true, exam });
    }

    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Get single exam notification details
// @route   GET /api/exams/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const examId = req.params.id;

    if (global.useMockDb) {
      const exam = mockDb.exams.find(e => e._id === examId);
      if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam notification not found' });
      }
      return res.json({ success: true, exam });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam notification not found' });
    }
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete exam notification
// @route   DELETE /api/exams/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const examId = req.params.id;

    if (global.useMockDb) {
      const examIndex = mockDb.exams.findIndex(e => e._id === examId);
      if (examIndex === -1) {
        return res.status(404).json({ success: false, message: 'Exam notification not found' });
      }
      
      mockDb.exams.splice(examIndex, 1);
      return res.json({ success: true, message: 'Exam notification deleted successfully' });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam notification not found' });
    }
    await exam.deleteOne();
    res.json({ success: true, message: 'Exam notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update exam notification
// @route   PUT /api/exams/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const examId = req.params.id;

    if (global.useMockDb) {
      const examIndex = mockDb.exams.findIndex(e => e._id === examId);
      if (examIndex === -1) {
        return res.status(404).json({ success: false, message: 'Exam notification not found' });
      }

      mockDb.exams[examIndex] = {
        ...mockDb.exams[examIndex],
        ...req.body,
        updatedAt: new Date()
      };

      return res.json({ success: true, exam: mockDb.exams[examIndex] });
    }

    let exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam notification not found' });
    }

    exam = await Exam.findByIdAndUpdate(examId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
