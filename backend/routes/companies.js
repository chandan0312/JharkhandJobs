import express from 'express';
import Company from '../models/Company.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../config/mockDb.js';

const router = express.Router();

// @desc    Get all companies (with industry filters)
// @route   GET /api/companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { industry, featured, recentlyAdded } = req.query;

    if (global.useMockDb) {
      let comps = [...mockDb.companies];

      if (industry && industry !== 'All' && industry !== 'All Industries') {
        comps = comps.filter(c => c.industry.toLowerCase() === industry.toLowerCase() || c.industry.toLowerCase().includes(industry.toLowerCase()));
      }
      if (featured) {
        comps = comps.filter(c => c.featured === (featured === 'true'));
      }
      if (recentlyAdded) {
        comps = comps.filter(c => c.recentlyAdded === (recentlyAdded === 'true'));
      }

      return res.json({ success: true, count: comps.length, companies: comps });
    }

    let query = {};
    if (industry && industry !== 'All' && industry !== 'All Industries') {
      query.industry = industry;
    }
    if (featured) {
      query.featured = featured === 'true';
    }
    if (recentlyAdded) {
      query.recentlyAdded = recentlyAdded === 'true';
    }

    const companies = await Company.find(query).sort({ name: 1 });
    res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new company
// @route   POST /api/companies
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const company = {
        _id: 'mock-company-' + Date.now(),
        ...req.body,
        jobCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockDb.companies.push(company);
      return res.status(201).json({ success: true, company });
    }

    const company = await Company.create(req.body);
    res.status(201).json({ success: true, company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const companyId = req.params.id;

    if (global.useMockDb) {
      const companyIndex = mockDb.companies.findIndex(c => c._id === companyId);
      if (companyIndex === -1) {
        return res.status(404).json({ success: false, message: 'Company not found' });
      }

      mockDb.companies[companyIndex] = {
        ...mockDb.companies[companyIndex],
        ...req.body,
        updatedAt: new Date()
      };

      return res.json({ success: true, company: mockDb.companies[companyIndex] });
    }

    let company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    company = await Company.findByIdAndUpdate(companyId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const companyId = req.params.id;

    if (global.useMockDb) {
      const companyIndex = mockDb.companies.findIndex(c => c._id === companyId);
      if (companyIndex === -1) {
        return res.status(404).json({ success: false, message: 'Company not found' });
      }

      mockDb.companies.splice(companyIndex, 1);
      return res.json({ success: true, message: 'Company deleted successfully' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    await company.deleteOne();
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
