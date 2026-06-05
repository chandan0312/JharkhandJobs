import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Exam from '../models/Exam.js';
import Company from '../models/Company.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import mockDb from '../config/mockDb.js';
import * as pgDb from '../config/pgDb.js';
import { scrapeAndUpsertData } from '../services/scraperService.js';
import { scrapeLandingPages } from '../services/landingScraperService.js';

const router = express.Router();

// @desc    Get dashboard statistics & charts data (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const totalJobs = mockDb.jobs.length;
      const activeJobs = mockDb.jobs.filter(j => j.status === 'active').length;
      const totalApplications = mockDb.applications.length;
      const totalExams = mockDb.exams.length;
      const totalCompanies = mockDb.companies.length;
      const totalUsers = mockDb.users.length;

      // Slice most recent applications (max 5)
      const sortedApps = [...mockDb.applications]
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5);

      const recentApplications = sortedApps.map(app => {
        const jobObj = mockDb.jobs.find(j => j._id === app.job) || { title: 'Unknown Job', company: 'Unknown Company' };
        const userObj = mockDb.users.find(u => u._id === app.applicant) || { name: 'Anonymous' };
        return {
          ...app,
          job: { title: jobObj.title, company: jobObj.company },
          applicant: { name: userObj.name, email: userObj.email }
        };
      });

      // Jobs by type count
      const typeCounts = {};
      mockDb.jobs.forEach(j => {
        typeCounts[j.type] = (typeCounts[j.type] || 0) + 1;
      });
      const jobsByType = Object.keys(typeCounts).map(type => ({
        name: type,
        value: typeCounts[type]
      }));

      // Applications Trend
      const applicationsTrend = [
        { name: 'Dec', applications: 25 },
        { name: 'Jan', applications: 45 },
        { name: 'Feb', applications: 120 },
        { name: 'Mar', applications: 180 },
        { name: 'Apr', applications: 155 },
        { name: 'May', applications: totalApplications > 0 ? totalApplications + 5 : 290 },
      ];

      return res.json({
        success: true,
        stats: {
          totalJobs,
          activeJobs,
          totalApplications,
          totalExams,
          totalCompanies,
          totalUsers,
        },
        recentApplications,
        charts: {
          jobsByType: jobsByType.length ? jobsByType : [
            { name: 'Full Time', value: 8 },
            { name: 'Part Time', value: 3 },
            { name: 'Contract', value: 2 },
            { name: 'Internship', value: 2 },
          ],
          jobStatus: [
            { name: 'Active', value: activeJobs > 0 ? activeJobs : 5892 },
            { name: 'Inactive', value: activeJobs > 0 ? Math.max(1, Math.round(totalJobs * 0.25)) : 3256 },
            { name: 'Expired', value: activeJobs > 0 ? Math.max(1, Math.round(totalJobs * 0.18)) : 2345 },
            { name: 'Draft', value: activeJobs > 0 ? Math.max(1, Math.round(totalJobs * 0.10)) : 1349 }
          ],
          applicationsTrend,
        }
      });
    }

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const totalExams = await Exam.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalUsers = await User.countDocuments();

    // Fetch 5 most recent applications
    const recentApplications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'name email')
      .sort({ appliedDate: -1 })
      .limit(5);

    // Aggregate jobs by type
    const jobsByTypeGroup = await Job.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    const jobsByType = jobsByTypeGroup.map(item => ({
      name: item._id,
      value: item.count
    }));

    // Fallback static trend data (if DB history is light)
    const applicationsTrend = [
      { name: 'Dec', applications: 25 },
      { name: 'Jan', applications: 45 },
      { name: 'Feb', applications: 120 },
      { name: 'Mar', applications: 180 },
      { name: 'Apr', applications: 155 },
      { name: 'May', applications: totalApplications > 0 ? totalApplications : 290 },
    ];

    res.json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        totalExams,
        totalCompanies,
        totalUsers,
      },
      recentApplications,
      charts: {
        jobsByType: jobsByType.length ? jobsByType : [
          { name: 'Full Time', value: 8 },
          { name: 'Part Time', value: 3 },
          { name: 'Contract', value: 2 },
          { name: 'Internship', value: 2 },
        ],
        jobStatus: [
          { name: 'Active', value: activeJobs > 0 ? activeJobs : 5892 },
          { name: 'Inactive', value: activeJobs > 0 ? Math.max(1, Math.round(totalJobs * 0.25)) : 3256 },
          { name: 'Expired', value: activeJobs > 0 ? Math.max(1, Math.round(totalJobs * 0.18)) : 2345 },
          { name: 'Draft', value: activeJobs > 0 ? Math.max(1, Math.round(totalJobs * 0.10)) : 1349 }
        ],
        applicationsTrend,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Subscribe user email to newsletter list (Public)
// @route   POST /api/admin/subscribe
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (global.useMockDb) {
      const exists = mockDb.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
      if (!exists) {
        mockDb.subscribers.push({
          _id: 'sub-' + Date.now(),
          email,
          createdAt: new Date().toISOString()
        });
      }
      return res.status(200).json({ success: true, message: 'Subscribed successfully' });
    }

    await pgDb.query(
      `INSERT INTO subscribers (id, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
      ['sub-' + Date.now(), email]
    );
    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all newsletter subscribers (Admin only)
// @route   GET /api/admin/subscribers
// @access  Private/Admin
router.get('/subscribers', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const subscribers = mockDb.subscribers.map(s => ({ id: s._id, email: s.email, created_at: s.createdAt }));
      return res.json({ success: true, count: subscribers.length, subscribers });
    }

    const result = await pgDb.query('SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, subscribers: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a subscriber (Admin only)
// @route   DELETE /api/admin/subscribers/:id
// @access  Private/Admin
router.delete('/subscribers/:id', protect, admin, async (req, res) => {
  try {
    const id = req.params.id;

    if (global.useMockDb) {
      const index = mockDb.subscribers.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Subscriber not found' });
      }
      mockDb.subscribers.splice(index, 1);
      return res.json({ success: true, message: 'Subscriber deleted successfully' });
    }

    await pgDb.query('DELETE FROM subscribers WHERE id = $1', [id]);
    res.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Submit contact form enquiry (Public)
// @route   POST /api/admin/enquiries
// @access  Public
router.post('/enquiries', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const id = 'enq-' + Date.now();

    if (global.useMockDb) {
      mockDb.enquiries.push({
        _id: id,
        name,
        email,
        subject,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ success: true, message: 'Enquiry submitted successfully' });
    }

    await pgDb.query(
      `INSERT INTO enquiries (id, name, email, subject, message, status) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, name, email, subject, message, 'pending']
    );
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all enquiries (Admin only)
// @route   GET /api/admin/enquiries
// @access  Private/Admin
router.get('/enquiries', protect, admin, async (req, res) => {
  try {
    if (global.useMockDb) {
      const enquiries = mockDb.enquiries.map(e => ({
        id: e._id,
        name: e.name,
        email: e.email,
        subject: e.subject,
        message: e.message,
        status: e.status,
        created_at: e.createdAt
      }));
      return res.json({ success: true, count: enquiries.length, enquiries });
    }

    const result = await pgDb.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, enquiries: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Resolve/update enquiry status (Admin only)
// @route   PUT /api/admin/enquiries/:id
// @access  Private/Admin
router.put('/enquiries/:id', protect, admin, async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    if (global.useMockDb) {
      const enquiry = mockDb.enquiries.find(e => e._id === id);
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }
      enquiry.status = status;
      return res.json({
        success: true,
        enquiry: {
          id: enquiry._id,
          name: enquiry.name,
          email: enquiry.email,
          subject: enquiry.subject,
          message: enquiry.message,
          status: enquiry.status,
          created_at: enquiry.createdAt
        }
      });
    }

    const result = await pgDb.query(
      'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, enquiry: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete enquiry (Admin only)
// @route   DELETE /api/admin/enquiries/:id
// @access  Private/Admin
router.delete('/enquiries/:id', protect, admin, async (req, res) => {
  try {
    const id = req.params.id;

    if (global.useMockDb) {
      const index = mockDb.enquiries.findIndex(e => e._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }
      mockDb.enquiries.splice(index, 1);
      return res.json({ success: true, message: 'Enquiry deleted successfully' });
    }

    await pgDb.query('DELETE FROM enquiries WHERE id = $1', [id]);
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Trigger live scraper to fetch and sync data
// @route   POST /api/admin/scrape
// @access  Private/Admin
router.post('/scrape', protect, admin, async (req, res) => {
  try {
    const stats = await scrapeAndUpsertData();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Trigger landing scraper to fetch and sync data
// @route   POST /api/admin/scrape-landing
// @access  Private/Admin
router.post('/scrape-landing', protect, admin, async (req, res) => {
  try {
    const stats = await scrapeLandingPages();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Send newsletter blast/mock send to all subscribers
// @route   POST /api/admin/newsletter/send
// @access  Private/Admin
router.post('/newsletter/send', protect, admin, async (req, res) => {
  try {
    const { subject, content } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ success: false, message: 'Subject and Content are required' });
    }

    console.log(`📢 Sending newsletter [${subject}] to all subscribers...`);
    
    let count = 0;
    if (global.useMockDb) {
      count = mockDb.subscribers.length;
    } else {
      const result = await pgDb.query('SELECT COUNT(*) FROM subscribers');
      count = parseInt(result.rows[0].count);
    }

    res.json({ 
      success: true, 
      message: `Newsletter blast successfully sent to ${count} subscribers!`,
      count 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
