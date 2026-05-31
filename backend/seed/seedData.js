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
        title: 'JSSC CGL Recruitment 2024',
        company: 'Jharkhand Staff Selection Commission (JSSC)',
        companyInitial: 'JSSC',
        companyColor: '#1B8C0A',
        location: 'Ranchi, Jharkhand',
        type: 'Full Time',
        salary: { min: 35400, max: 112400, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: 'Graduation',
        badgeText: 'New',
        category: 'Govt Jobs',
        industry: 'Public Service',
        description: 'Online application invited for JSSC CGL Combined Graduate Level examination for administrative posts.',
        responsibilities: [
          'Perform administrative and supervisory duties in state departments.',
          'Implement government schemes and regulations at block levels.',
          'Maintain registers and records for official audits.'
        ],
        requirements: [
          'Bachelor\'s degree in any discipline from a recognized university.',
          'Age between 21 and 35 years.',
          'Knowledge of local customs and languages of Jharkhand.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-26'),
        lastDate: new Date('2026-06-04')
      },
      {
        title: 'JPSC Civil Services Exam 2024',
        company: 'Jharkhand Public Service Commission (JPSC)',
        companyInitial: 'JPSC',
        companyColor: '#005691',
        location: 'Ranchi, Jharkhand',
        type: 'Full Time',
        salary: { min: 56100, max: 177500, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: 'Graduation',
        badgeText: 'Featured',
        category: 'Govt Jobs',
        industry: 'Public Service',
        description: 'State civil services exams for administrative, police, and finance service cadres of Jharkhand.',
        responsibilities: [
          'Manage subdivision level governance and law enforcement assistance.',
          'Coordinate state revenue collection and treasury audits.',
          'Supervise administrative offices and public welfare delivery.'
        ],
        requirements: [
          'Graduation degree from an accredited institution.',
          'Strong knowledge of Indian administration and Jharkhand GK.',
          'Physical standards eligibility for DSP cadres.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-25'),
        lastDate: new Date('2026-06-24')
      },
      {
        title: 'RRB NTPC Graduate Vacancy 2024',
        company: 'Indian Railways',
        companyInitial: 'RRB',
        companyColor: '#DC2626',
        location: 'All India',
        type: 'Full Time',
        salary: { min: 35400, max: 112400, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: 'Graduation',
        badgeText: 'Popular',
        category: 'Govt Jobs',
        industry: 'Transportation',
        description: 'Non-Technical Popular Categories recruitment for Station Master, Goods Guard, and Commercial Clerks.',
        responsibilities: [
          'Supervise station operations and train movements.',
          'Coordinate cargo logistics and safety protocols.',
          'Manage reservation counters and public relations.'
        ],
        requirements: [
          'University degree from any stream.',
          'Excellent medical fitness and vision standards.',
          'Successful clearance of CBT 1 and CBT 2 exams.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-24'),
        lastDate: new Date('2026-06-12')
      },
      {
        title: 'IBPS Clerk Recruitment 2024',
        company: 'IBPS',
        companyInitial: 'IBPS',
        companyColor: '#2563EB',
        location: 'All India',
        type: 'Full Time',
        salary: { min: 19900, max: 63200, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: 'Graduation',
        badgeText: 'New',
        category: 'Govt Jobs',
        industry: 'Banking',
        description: 'Clerical cadre selection examination for public sector banks across India.',
        responsibilities: [
          'Handle cash receipts, ledger updates, and customer deposits.',
          'Assist branch managers in document processing and loan files.',
          'Promote retail banking services and address grievances.'
        ],
        requirements: [
          'Bachelor\'s degree in commerce, arts, science or engineering.',
          'Computer literacy certificate or operating skills.',
          'Proficiency in the local state language.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-23'),
        lastDate: new Date('2026-06-11')
      },
      {
        title: 'Jharkhand Police Constable 2024',
        company: 'Jharkhand Police',
        companyInitial: 'JHP',
        companyColor: '#059669',
        location: 'Jharkhand',
        type: 'Full Time',
        salary: { min: 21700, max: 69100, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: '12th Pass',
        badgeText: 'Featured',
        category: 'Govt Jobs',
        industry: 'Security / Defense',
        description: 'District level police constable recruitment for law enforcement and patrolling forces.',
        responsibilities: [
          'Maintain public order and local community safety.',
          'Assist senior officers in active crime investigation.',
          'Perform patrol beats and checkpost guard duties.'
        ],
        requirements: [
          '10+2 / Intermediate pass from a recognized board.',
          'Minimum height and chest measurement as per guidelines.',
          'Ability to complete the 10km run in specified limits.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-22'),
        lastDate: new Date('2026-06-09')
      },
      {
        title: 'SBI PO Recruitment 2024',
        company: 'State Bank of India',
        companyInitial: 'SBI',
        companyColor: '#005691',
        location: 'All India',
        type: 'Full Time',
        salary: { min: 48480, max: 85920, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: 'Graduation',
        badgeText: 'Popular',
        category: 'Govt Jobs',
        industry: 'Banking',
        description: 'Probationary Officers selection exam for managing financial credits, sales, and accounts.',
        responsibilities: [
          'Manage branch accounting, credits approval, and drafts processing.',
          'Direct retail loan distributions and customer deposits growth.',
          'Oversee customer support desks and cash audits.'
        ],
        requirements: [
          'Graduation degree in any stream.',
          'Final year students are also eligible to apply.',
          'Strong quantitative, reasoning, and financial understanding.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-21'),
        lastDate: new Date('2026-06-03')
      },
      {
        title: 'NTPC Junior Executive 2024',
        company: 'NTPC Limited',
        companyInitial: 'NTPC',
        companyColor: '#2563EB',
        location: 'All India',
        type: 'Full Time',
        salary: { min: 40000, max: 140000, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: 'B.E/B.Tech',
        badgeText: 'New',
        category: 'Govt Jobs',
        industry: 'Engineering',
        description: 'Junior Executive roles in various disciplines of civil, mechanical, and electrical engineering.',
        responsibilities: [
          'Supervise thermal power plant operation and system logs.',
          'Coordinate construction maintenance and safety procedures.',
          'Maintain engineering inventory and equipment calibration.'
        ],
        requirements: [
          'B.E/B.Tech in Civil, Mechanical, or Electrical engineering.',
          'Minimum 60% marks in aggregate.',
          'Valid GATE score is a preference.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-20'),
        lastDate: new Date('2026-06-19')
      },
      {
        title: 'LIC AAO Recruitment 2024',
        company: 'Life Insurance Corporation of India',
        companyInitial: 'LIC',
        companyColor: '#D97706',
        location: 'All India',
        type: 'Full Time',
        salary: { min: 32795, max: 62315, currency: '₹', period: 'monthly' },
        experience: '0 - 2 Years',
        qualification: 'Graduation',
        badgeText: 'Featured',
        category: 'Govt Jobs',
        industry: 'Insurance',
        description: 'Assistant Administrative Officer cadre selection for insurance policy management and customer audits.',
        responsibilities: [
          'Audit claim requests and insurance registrations.',
          'Promote corporate sales and agency recruitments.',
          'Perform administrative ledger reviews and payouts.'
        ],
        requirements: [
          'Bachelor\'s degree in any discipline.',
          'Aptitude in financial math and insurance law.',
          'Good communication and negotiation capacities.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-19'),
        lastDate: new Date('2026-06-07')
      },
      {
        title: 'Software Development Engineer',
        company: 'Tata Steel',
        companyInitial: 'TS',
        companyColor: '#005691',
        location: 'Jamshedpur',
        type: 'Full Time',
        salary: { min: 6, max: 12, currency: '₹', period: 'LPA' },
        experience: '1 - 3 Years',
        qualification: 'B.E/B.Tech',
        badgeText: 'Featured',
        category: 'Private Jobs',
        industry: 'IT / Software',
        description: 'Design and develop industrial ERP automation dashboards and system tools using React and Node.js.',
        responsibilities: [
          'Develop clean and modular UI components in React.',
          'Integrate REST APIs and design schema endpoints.',
          'Write testing suites and optimize performance.'
        ],
        requirements: [
          'B.Tech/MCA in Computer Science or related fields.',
          'Good understanding of database structures and algorithms.',
          'Familiarity with containerization (Docker) is a plus.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-28'),
        lastDate: new Date('2026-06-15')
      },
      {
        title: 'Graduate Engineer Trainee',
        company: 'Jindal Steel',
        companyInitial: 'JS',
        companyColor: '#0B72B9',
        location: 'Ranchi',
        type: 'Full Time',
        salary: { min: 5, max: 8, currency: '₹', period: 'LPA' },
        experience: '0 - 2 Years',
        qualification: 'B.E/B.Tech',
        badgeText: 'New',
        category: 'Private Jobs',
        industry: 'Manufacturing',
        description: 'Training programme for freshly graduated mechanical and metallurgical engineers in state-of-the-art steel plants.',
        responsibilities: [
          'Support senior shift managers in blast furnace logs.',
          'Learn metallurgical testing and QA validations.',
          'Assist in automation upgrades.'
        ],
        requirements: [
          'B.E / B.Tech in Metallurgy, Mechanical, or Production Engineering.',
          'Pass out year 2025 or 2026.',
          'Ready to work in rotation shifts.'
        ],
        status: 'active',
        postedDate: new Date('2026-05-29'),
        lastDate: new Date('2026-06-10')
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
