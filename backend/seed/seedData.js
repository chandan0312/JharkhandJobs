import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Exam from '../models/Exam.js';
import BlogPost from '../models/BlogPost.js';
import Application from '../models/Application.js';
import Quiz from '../models/Quiz.js';
import mockDb from '../config/mockDb.js';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jharkhand_jobs';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding: ${mongoUri}`);

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Company.deleteMany();
    await Exam.deleteMany();
    await BlogPost.deleteMany();
    await Application.deleteMany();
    await Quiz.deleteMany();
    console.log('Cleared existing database entries.');

    // 1. Seed Users (Admin & User)
    const adminUser = await User.create({
      name: 'Jharkhand Jobs Admin',
      email: 'admin@jharkhandjobs.com',
      password: 'Admin@123', // Will be hashed automatically by pre-save
      phone: '9876543210',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'Rohan Kumar',
      email: 'rohan@gmail.com',
      password: 'User@123',
      phone: '9123456789',
      role: 'user',
    });

    console.log('Seeded User accounts (Admin & Demo User).');

    // 2. Seed Companies
    const companies = await Company.create([
      { name: 'Tata Steel', industry: 'Manufacturing', jobCount: 45, featured: true, companyColor: '#005691' },
      { name: 'HCLTech', industry: 'IT / Software', jobCount: 38, featured: true, companyColor: '#2563EB' },
      { name: 'Tech Mahindra', industry: 'IT / Software', jobCount: 32, featured: true, companyColor: '#E11D48' },
      { name: 'Vedanta', industry: 'Manufacturing', jobCount: 25, featured: true, companyColor: '#059669' },
      { name: 'Cipla', industry: 'Healthcare', jobCount: 18, featured: true, companyColor: '#DC2626' },
      { name: 'Reliance Industries', industry: 'Telecommunications', jobCount: 50, featured: true, companyColor: '#1E3A8A' },
      { name: 'Deloitte', industry: 'Consulting', jobCount: 30, featured: true, companyColor: '#86EFAC' },
      { name: 'ITC Limited', industry: 'FMCG', jobCount: 20, featured: true, companyColor: '#D97706' },
      { name: 'Birlasoft', industry: 'IT / Software', jobCount: 22, featured: true, companyColor: '#7C3AED' },
      { name: 'L&T', industry: 'Infrastructure', jobCount: 40, featured: true, companyColor: '#EF4444' },
      { name: 'Jindal Steel', industry: 'Manufacturing', jobCount: 15, recentlyAdded: true, companyColor: '#0B72B9' },
      { name: 'SAIL', industry: 'Manufacturing', jobCount: 12, recentlyAdded: true, companyColor: '#1E40AF' },
      { name: 'ECI', industry: 'Infrastructure', jobCount: 10, recentlyAdded: true, companyColor: '#4B5563' },
      { name: 'Piramal', industry: 'Healthcare', jobCount: 8, recentlyAdded: true, companyColor: '#B45309' },
      { name: 'Godrej', industry: 'FMCG', jobCount: 14, recentlyAdded: true, companyColor: '#10B981' }
    ]);

    console.log('Seeded Company information.');

    // 3. Seed Jobs
    const jobs = await Job.create([
      {
        title: 'Junior Software Developer',
        company: 'Tech Solutions Pvt. Ltd.',
        companyInitial: 'TS',
        companyColor: '#10B981',
        location: 'Ranchi',
        type: 'Full Time',
        salary: { min: 3, max: 6, currency: '₹', period: 'LPA' },
        experience: '0 - 2 Years',
        category: 'Private Jobs',
        industry: 'IT / Software',
        description: 'We are looking for a passionate Junior Software Developer to join our dynamic team. You will be responsible for developing, testing and maintaining software applications using HTML, CSS, JavaScript, and React.',
        responsibilities: [
          'Write clean, efficient, and maintainable code.',
          'Collaborate with cross-functional teams to define and design new features.',
          'Troubleshoot and debug software issues.',
          'Participate in code reviews and learn from senior developers.',
          'Maintain technical documentation.'
        ],
        requirements: [
          "Bachelor's degree in Computer Science, IT, or related fields.",
          'Good understanding of HTML, CSS, JavaScript.',
          'Basic knowledge of React.js or any other modern frontend library is a plus.',
          'Strong problem-solving and communication skills.',
          'A proactive attitude to learning and development.'
        ]
      },
      {
        title: 'Marketing Executive',
        company: 'Green Future Pvt. Ltd.',
        companyInitial: 'GF',
        companyColor: '#3B82F6',
        location: 'Jamshedpur',
        type: 'Full Time',
        salary: { min: 4, max: 6, currency: '₹', period: 'LPA' },
        experience: '1 - 3 Years',
        category: 'Private Jobs',
        industry: 'Marketing',
        description: 'Green Future Pvt. Ltd. is hiring a creative and results-driven Marketing Executive to implement offline and online marketing campaigns. You will coordinate promotional activities and run digital campaigns to build brand awareness.',
        responsibilities: [
          'Develop marketing plans and execute campaigns.',
          'Manage company social media handles and online listings.',
          'Coordinate offline events, college events, and public displays.',
          'Create weekly reports on lead generation.'
        ],
        requirements: [
          'MBA or BBA in Marketing or related field.',
          '1-3 years of marketing experience.',
          'Familiarity with digital marketing, SEO, and social ads.',
          'Outstanding verbal communication skills (Hindi & English).'
        ]
      },
      {
        title: 'HR Assistant',
        company: 'ABC Industries',
        companyInitial: 'AB',
        companyColor: '#8B5CF6',
        location: 'Dhanbad',
        type: 'Full Time',
        salary: { min: 2, max: 3.5, currency: '₹', period: 'LPA' },
        experience: '0 - 1 Years',
        category: 'Private Jobs',
        industry: 'Human Resources',
        description: 'ABC Industries is seeking a detail-oriented HR Assistant to manage day-to-day HR duties. Your tasks will include scheduling interviews, coordinating candidate onboarding, and managing employee records.',
        responsibilities: [
          'Assist in hiring campaigns and screen resumes.',
          'Coordinate job postings and recruitments.',
          'Prepare onboarding documentation for new hires.',
          'Respond to employee queries and file documents.'
        ],
        requirements: [
          'B.Com, BBA, or MBA in HR.',
          '0-1 year of corporate experience (freshers are welcome).',
          'Good command over MS Excel and Word.',
          'Strong organizational and scheduling skills.'
        ]
      },
      {
        title: 'Accountant',
        company: 'Shield Enterprises',
        companyInitial: 'SE',
        companyColor: '#F59E0B',
        location: 'Ranchi',
        type: 'Part Time',
        salary: { min: 2, max: 3.5, currency: '₹', period: 'LPA' },
        experience: '2 - 5 Years',
        category: 'Private Jobs',
        industry: 'Finance',
        description: 'Shield Enterprises is seeking an experienced Accountant for a part-time position. You will manage GST filings, accounts receivable, and general bookkeeping duties.',
        responsibilities: [
          'Maintain ledger entries and verify invoice matches.',
          'Prepare quarterly GST returns and tax filings.',
          'Handle monthly payroll distributions.',
          'Generate balance sheets and budget statements.'
        ],
        requirements: [
          'B.Com in Accounting/Finance or higher.',
          '2+ years of bookkeeping or accounting experience.',
          'Expert-level familiarity with Tally Prime and MS Excel.',
          'Basic understanding of Indian tax codes and GST.'
        ]
      }
    ]);

    console.log('Seeded Job listings.');

    // 4. Seed Exams (Govt Job Notifications & Calendar Links)
    await Exam.create([
      {
        title: 'JSSC CGL Recruitment 2024',
        organization: 'Jharkhand Staff Selection Commission',
        orgShort: 'JSSC',
        category: 'Upcoming Exams',
        lastDate: '18 May 2026',
        posts: '2,018 Posts',
        status: 'Apply Now',
        description: 'Online application invited for JSSC CGL Combined Graduate Level examination for administrative posts.',
        isNew: true
      },
      {
        title: 'Jharkhand Police Constable Recruitment 2024',
        organization: 'Jharkhand Staff Selection Commission',
        orgShort: 'JSSC',
        category: 'Upcoming Exams',
        lastDate: '20 May 2026',
        posts: '4,919 Posts',
        status: 'Apply Now',
        description: 'Recruitment notice for constables in various districts of Jharkhand. Physical test followed by written test.',
        isNew: true
      },
      {
        title: 'JPSC Civil Services Examination 2024',
        organization: 'Jharkhand Public Service Commission',
        orgShort: 'JPSC',
        category: 'Upcoming Exams',
        lastDate: '15 Jun 2026',
        posts: '342 Posts',
        status: 'Apply Now',
        description: 'JPSC Combined Civil Services Prelims exam notifications for administrative, finance, and executive roles.',
        isNew: false
      },
      {
        title: 'JSSC JE (Civil) Recruitment 2024',
        organization: 'Jharkhand Staff Selection Commission',
        orgShort: 'JSSC',
        category: 'Upcoming Exams',
        lastDate: '25 May 2026',
        posts: '1,562 Posts',
        status: 'Apply Now',
        description: 'Junior Engineer (Civil, Mechanical, Electrical) recruitment exam notifications for state departments.',
        isNew: false
      },
      {
        title: 'JSSC CGL Admit Card 2024',
        organization: 'Jharkhand Staff Selection Commission',
        orgShort: 'JSSC',
        category: 'Admit Card',
        status: 'Released',
        description: 'Admit card released. Download now from JSSC portal.'
      },
      {
        title: 'JPSC Civil Services Prelims Result 2024',
        organization: 'Jharkhand Public Service Commission',
        orgShort: 'JPSC',
        category: 'Results',
        status: 'Declared',
        description: 'Result declared. Check your roll number and scores.'
      },
      {
        title: 'JSSC JE Civil Answer Key 2024',
        organization: 'Jharkhand Staff Selection Commission',
        orgShort: 'JSSC',
        category: 'Answer Key',
        status: 'Released',
        description: 'Provisional answer key uploaded. Submit objections by 5 PM.'
      }
    ]);

    console.log('Seeded Exam & Government notifications.');

    // 5. Seed Blog posts
    await BlogPost.create([
      {
        title: 'How to Crack JSSC CGL: Ultimate Prep Guide',
        slug: 'how-to-crack-jssc-cgl-ultimate-prep-guide',
        excerpt: 'Crack the Jharkhand Staff Selection Commission CGL exam with our comprehensive guide covering syllabus, patterns, and tips.',
        content: `
          <h3>Introduction</h3>
          <p>The Jharkhand Staff Selection Commission Combined Graduate Level (JSSC CGL) exam is one of the most competitive administrative exams in Jharkhand. Scoring high requires a structured preparation methodology. This guide walks you through essential steps to ace the JSSC CGL.</p>
          
          <h3>1. Understand the Exam Pattern</h3>
          <p>The exam is conducted in objective multiple-choice format spanning three papers:</p>
          <ul>
            <li><strong>Paper 1:</strong> Language Ability (Hindi and English) – Qualifying only.</li>
            <li><strong>Paper 2:</strong> Regional/Tribal Language (Santhali, Khortha, Kurukh, Mundari, Urdu, etc.) – Score added to merit.</li>
            <li><strong>Paper 3:</strong> General Knowledge (Science, Math, Reasoning, Computer, and Jharkhand GK).</li>
          </ul>
          
          <h3>2. Focus Heavily on Jharkhand GK</h3>
          <p>Over 40 questions in Paper 3 are specifically dedicated to Jharkhand GK. Devote significant study hours to studying the history, geography, economy, culture, and current affairs of Jharkhand. Refer to standard reference books like 'Jharkhand Ek Avlokan' or similar competitive publications.</p>
          
          <h3>3. Regular Mock Testing</h3>
          <p>Time management is the difference between success and failure in Paper 3. Practice at least 2 online/offline mock papers every week under exam environments. Review mistakes thoroughly and revise weaker concepts.</p>
          
          <h3>Conclusion</h3>
          <p>Consistency is key. Set aside 6-8 dedicated hours daily for the next three months, and success will be yours! Good luck!</p>
        `,
        category: 'Career Guide',
        author: 'Exam Expert Team',
        coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop',
        tags: ['JSSC', 'Govt Jobs', 'Preparation']
      },
      {
        title: 'Top 10 High-Paying IT Jobs in Ranchi',
        slug: 'top-10-high-paying-it-jobs-in-ranchi',
        excerpt: 'Explore the fast-growing technology sector in Ranchi and discover the top roles offering the best salaries for tech professionals.',
        content: `
          <h3>Ranchi's Growing Tech Scene</h3>
          <p>Ranchi, the capital of Jharkhand, is emerging as a promising tech hub in eastern India. With new software centers, technology parks, and startups setting up offices in the state, high-paying tech jobs are highly sought after. Here are the top 5 high-paying fields in Ranchi:</p>
          
          <ol>
            <li><strong>Full-Stack Developer:</strong> React, Node.js, and MongoDB developers are in massive demand. Experienced developers command salaries ranging from 8 to 15 LPA.</li>
            <li><strong>Cloud Engineers:</strong> AWS and Azure professionals managing backend infrastructures.</li>
            <li><strong>Data Analysts & Scientists:</strong> Turning raw business data into strategic insights.</li>
            <li><strong>Digital Marketers:</strong> SEO and PPC campaigns for overseas clients.</li>
            <li><strong>UI/UX Designers:</strong> Building clean customer experiences.</li>
          </ol>
          
          <p>Upgrading your skillsets, building Github projects, and networking are essential to cracking these roles locally in Ranchi.</p>
        `,
        category: 'Industry Trends',
        author: 'Job Market Analyst',
        coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
        tags: ['IT Jobs', 'Ranchi', 'Tech Careers']
      },
      {
        title: 'Writing the Perfect Resume: A Step-by-Step Walkthrough',
        slug: 'writing-the-perfect-resume-step-by-step-walkthrough',
        excerpt: 'Land more interviews with a modern, professional resume. Learn the exact formatting, layout, and keywords recruiters look for.',
        content: `
          <h3>Your Resume is Your First Impression</h3>
          <p>Recruiters spend an average of 6 seconds reviewing a single resume before making a decision. To make that time count, your resume must be crisp, impactful, and tailored to the job description.</p>
          
          <h3>Essential Formatting Rules:</h3>
          <ul>
            <li><strong>Keep it to 1 Page:</strong> Unless you have 10+ years of corporate experience, a 1-page document is best.</li>
            <li><strong>Use Clean Fonts:</strong> Helvetica, Inter, or Arial in size 10-12 are standard.</li>
            <li><strong>The Star Method:</strong> Describe your responsibilities using metrics (e.g., 'Designed a frontend dashboard that improved loading speed by 25%' instead of 'Worked on frontend code').</li>
          </ul>
        `,
        category: 'Tips & Tricks',
        author: 'HR Recruiter Specialist',
        coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
        tags: ['Resume Tips', 'Interview', 'Career advice']
      }
    ]);

    console.log('Seeded Blog articles.');

    // 6. Seed Practice Quizzes
    const quizzesToSeed = mockDb.quizzes.map(quiz => {
      const { _id, ...quizData } = quiz;
      return quizData;
    });
    await Quiz.create(quizzesToSeed);
    console.log('Seeded Practice Quizzes.');

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
