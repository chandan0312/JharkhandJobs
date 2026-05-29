import express from 'express';
import Job from '../models/Job.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../config/mockDb.js';

const router = express.Router();

// @desc    Get all jobs (with advanced search & filters)
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, location, experience, minSalary, maxSalary, search, sort } = req.query;

    if (global.useMockDb) {
      let filteredJobs = [...mockDb.jobs];

      // Category filter
      if (category && category !== 'All Categories') {
        filteredJobs = filteredJobs.filter(j => j.category === category);
      }
      // Type filter
      if (type && type !== 'All Types' && type !== 'All') {
        filteredJobs = filteredJobs.filter(j => j.type === type);
      }
      // Location filter
      if (location && location !== 'All Locations' && location !== 'Jharkhand') {
        filteredJobs = filteredJobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
      }
      // Search keyword filter
      if (search) {
        const s = search.toLowerCase();
        filteredJobs = filteredJobs.filter(j => 
          j.title.toLowerCase().includes(s) ||
          j.company.toLowerCase().includes(s) ||
          j.description.toLowerCase().includes(s) ||
          j.industry.toLowerCase().includes(s)
        );
      }
      // Salary range filters
      if (minSalary) {
        filteredJobs = filteredJobs.filter(j => j.salary.min >= Number(minSalary));
      }
      if (maxSalary) {
        filteredJobs = filteredJobs.filter(j => j.salary.max <= Number(maxSalary));
      }
      // Experience filter
      if (experience && experience !== 'Any Experience') {
        filteredJobs = filteredJobs.filter(j => j.experience.toLowerCase().includes(experience.toLowerCase()));
      }

      // Sorting
      if (sort === 'oldest') {
        filteredJobs.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
      } else if (sort === 'salary-high') {
        filteredJobs.sort((a, b) => b.salary.max - a.salary.max);
      } else {
        // default newest
        filteredJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      }

      return res.json({ success: true, count: filteredJobs.length, jobs: filteredJobs });
    }

    let query = {};
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    if (type && type !== 'All Types') {
      query.type = type;
    }
    if (location && location !== 'All Locations' && location !== 'Jharkhand') {
      query.location = { $regex: location, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }
    if (minSalary) {
      query['salary.min'] = { $gte: Number(minSalary) };
    }
    if (maxSalary) {
      query['salary.max'] = { $lte: Number(maxSalary) };
    }
    if (experience && experience !== 'Any Experience') {
      query.experience = { $regex: experience, $options: 'i' };
    }

    let sortOption = { postedDate: -1 };
    if (sort === 'oldest') {
      sortOption = { postedDate: 1 };
    } else if (sort === 'salary-high') {
      sortOption = { 'salary.max': -1 };
    }

    const jobs = await Job.find(query).sort(sortOption);
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    if (global.useMockDb) {
      const job = mockDb.jobs.find(j => j._id === jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      return res.json({ success: true, job });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const companyInitial = req.body.company.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      const job = {
        _id: 'mock-job-' + Date.now(),
        ...req.body,
        companyInitial,
        postedBy: req.user._id,
        status: 'active',
        postedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockDb.jobs.push(job);
      
      // Update company counts dynamically
      const company = mockDb.companies.find(c => c.name.toLowerCase() === req.body.company.toLowerCase());
      if (company) {
        company.jobCount += 1;
      }

      return res.status(201).json({ success: true, job });
    }

    const jobData = { ...req.body, postedBy: req.user._id };
    const job = await Job.create(jobData);
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const jobId = req.params.id;

    if (global.useMockDb) {
      const jobIndex = mockDb.jobs.findIndex(j => j._id === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      mockDb.jobs[jobIndex] = {
        ...mockDb.jobs[jobIndex],
        ...req.body,
        updatedAt: new Date()
      };

      return res.json({ success: true, job: mockDb.jobs[jobIndex] });
    }

    let job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const jobId = req.params.id;

    if (global.useMockDb) {
      const jobIndex = mockDb.jobs.findIndex(j => j._id === jobId);
      if (jobIndex === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      
      const job = mockDb.jobs[jobIndex];
      mockDb.jobs.splice(jobIndex, 1);
      
      // Update company counts dynamically
      const company = mockDb.companies.find(c => c.name.toLowerCase() === job.company.toLowerCase());
      if (company && company.jobCount > 0) {
        company.jobCount -= 1;
      }

      return res.json({ success: true, message: 'Job deleted successfully' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
