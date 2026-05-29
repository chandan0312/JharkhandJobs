import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import { sendEmail } from '../services/emailService.js';
import mockDb from '../config/mockDb.js';

const router = express.Router();

// @desc    Submit a new job application (with resume upload)
// @route   POST /api/applications
// @access  Private
router.post('/', protect, uploadResume.single('resume'), async (req, res) => {
  const { jobId, fullName, email, phone, coverLetter } = req.body;

  try {
    // Check if resume file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload your resume document' });
    }

    let job;
    if (global.useMockDb) {
      job = mockDb.jobs.find(j => j._id === jobId);
    } else {
      job = await Job.findById(jobId);
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    let application;

    if (global.useMockDb) {
      application = {
        _id: 'mock-app-' + Date.now(),
        job: jobId,
        applicant: req.user._id,
        fullName,
        email,
        phone,
        coverLetter: coverLetter || '',
        resumePath: `/uploads/resumes/${req.file.filename}`,
        resumeOriginalName: req.file.originalname,
        status: 'pending',
        appliedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockDb.applications.push(application);
    } else {
      application = await Application.create({
        job: jobId,
        applicant: req.user._id,
        fullName,
        email,
        phone,
        coverLetter,
        resumePath: `/uploads/resumes/${req.file.filename}`,
        resumeOriginalName: req.file.originalname,
      });
    }

    // Send confirmation emails
    const emailSubject = `Application Received: ${job.title} at ${job.company}`;
    const emailText = `Hello ${fullName},\n\nThank you for applying for the position of ${job.title} at ${job.company}. We have successfully received your resume (${req.file.originalname}).\n\nOur team is currently reviewing your profile and we will get back to you shortly.\n\nBest regards,\nJharkhand Jobs Team`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1B8C0A;">Jharkhand Jobs — Application Confirmation</h2>
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Thank you for applying for the position of <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
        <p>We have successfully received your application along with your resume: <em>${req.file.originalname}</em>.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #374151;">Application Details:</h4>
          <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
            <li><strong>Job:</strong> ${job.title}</li>
            <li><strong>Company:</strong> ${job.company}</li>
            <li><strong>Location:</strong> ${job.location}</li>
            <li><strong>Applied Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
        </div>
        <p>Our recruiters will review your application shortly. If your profile matches our requirements, we will contact you for next steps.</p>
        <p style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 12px; color: #6b7280;">This is an automated notification. Please do not reply to this email.</p>
      </div>
    `;

    // Trigger email notification
    sendEmail(email, emailSubject, emailText, emailHtml);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, jobId } = req.query;

    if (global.useMockDb) {
      let apps = [...mockDb.applications];
      
      if (status && status !== 'all') {
        apps = apps.filter(a => a.status === status);
      }
      if (jobId) {
        apps = apps.filter(a => a.job === jobId);
      }

      // Populate manually
      const populated = apps.map(app => {
        const jobObj = mockDb.jobs.find(j => j._id === app.job) || { title: 'Unknown Job', company: 'Unknown Company', location: '' };
        const userObj = mockDb.users.find(u => u._id === app.applicant) || { name: 'Anonymous', email: '', phone: '' };
        return {
          ...app,
          job: { _id: app.job, title: jobObj.title, company: jobObj.company, location: jobObj.location },
          applicant: { _id: app.applicant, name: userObj.name, email: userObj.email, phone: userObj.phone }
        };
      });

      return res.json({ success: true, count: populated.length, applications: populated });
    }

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location')
      .populate('applicant', 'name email phone')
      .sort({ appliedDate: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update application status (Admin only)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;

  try {
    if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    let application;
    let jobTitle = '';
    let companyName = '';
    let applicantEmail = '';
    let applicantName = '';

    if (global.useMockDb) {
      const appIndex = mockDb.applications.findIndex(a => a._id === req.params.id);
      if (appIndex === -1) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      mockDb.applications[appIndex].status = status;
      mockDb.applications[appIndex].updatedAt = new Date();
      application = mockDb.applications[appIndex];
      
      const jobObj = mockDb.jobs.find(j => j._id === application.job) || { title: 'Unknown Job', company: 'Unknown Company' };
      jobTitle = jobObj.title;
      companyName = jobObj.company;
      applicantEmail = application.email;
      applicantName = application.fullName;
    } else {
      application = await Application.findById(req.params.id).populate('job', 'title company');
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      application.status = status;
      await application.save();
      
      jobTitle = application.job.title;
      companyName = application.job.company;
      applicantEmail = application.email;
      applicantName = application.fullName;
    }

    // Send status update email notification
    const emailSubject = `Application Status Update: ${jobTitle}`;
    const emailText = `Hello ${applicantName},\n\nYour application status for the position of ${jobTitle} at ${companyName} has been updated to: ${status.toUpperCase()}.\n\nBest regards,\nJharkhand Jobs Team`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1B8C0A;">Jharkhand Jobs — Application Update</h2>
        <p>Hello <strong>${applicantName}</strong>,</p>
        <p>The status of your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated:</p>
        <div style="background-color: #f0fdf4; border-left: 4px solid #1B8C0A; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <strong>New Status:</strong> <span style="text-transform: uppercase; color: #1B8C0A;">${status}</span>
        </div>
        <p>If you have any questions, our recruitment team will be in touch with you directly.</p>
        <p style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 12px; color: #6b7280;">Best regards,<br>Jharkhand Jobs Recruiting Team</p>
      </div>
    `;

    sendEmail(applicantEmail, emailSubject, emailText, emailHtml);

    res.json({ success: true, message: `Application status updated to ${status}`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user's own applications
// @route   GET /api/applications/my-applications
// @access  Private
router.get('/my-applications', protect, async (req, res) => {
  try {
    if (global.useMockDb) {
      const userApps = mockDb.applications.filter(a => a.applicant === req.user._id);
      
      const populated = userApps.map(app => {
        const jobObj = mockDb.jobs.find(j => j._id === app.job) || { title: 'Unknown Job', company: 'Unknown Company', location: '', type: '', salary: {} };
        return {
          ...app,
          job: {
            _id: app.job,
            title: jobObj.title,
            company: jobObj.company,
            location: jobObj.location,
            type: jobObj.type,
            salary: jobObj.salary
          }
        };
      });

      return res.json({ success: true, count: populated.length, applications: populated });
    }

    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salary')
      .sort({ appliedDate: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
