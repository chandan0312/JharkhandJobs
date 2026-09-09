import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Mock Database Store
const mockDb = {
  users: [],
  forums: [],
  forumAnswers: [],
  enquiries: [],
  subscribers: [],
  companies: [
    { _id: 'c1', name: 'Tata Steel', industry: 'Manufacturing', jobCount: 45, featured: true, companyColor: '#005691' },
    { _id: 'c2', name: 'HCLTech', industry: 'IT / Software', jobCount: 38, featured: true, companyColor: '#2563EB' },
    { _id: 'c3', name: 'Tech Mahindra', industry: 'IT / Software', jobCount: 32, featured: true, companyColor: '#E11D48' },
    { _id: 'c4', name: 'Vedanta', industry: 'Manufacturing', jobCount: 25, featured: true, companyColor: '#059669' },
    { _id: 'c5', name: 'Cipla', industry: 'Healthcare', jobCount: 18, featured: true, companyColor: '#DC2626' },
    { _id: 'c6', name: 'Reliance Industries', industry: 'Telecommunications', jobCount: 50, featured: true, companyColor: '#1E3A8A' },
    { _id: 'c7', name: 'Deloitte', industry: 'Consulting', jobCount: 30, featured: true, companyColor: '#86EFAC' },
    { _id: 'c8', name: 'ITC Limited', industry: 'FMCG', jobCount: 20, featured: true, companyColor: '#D97706' },
    { _id: 'c9', name: 'Birlasoft', industry: 'IT / Software', jobCount: 22, featured: true, companyColor: '#7C3AED' },
    { _id: 'c10', name: 'L&T', industry: 'Infrastructure', jobCount: 40, featured: true, companyColor: '#EF4444' },
    { _id: 'c11', name: 'Jindal Steel', industry: 'Manufacturing', jobCount: 15, recentlyAdded: true, companyColor: '#0B72B9' },
    { _id: 'c12', name: 'SAIL', industry: 'Manufacturing', jobCount: 12, recentlyAdded: true, companyColor: '#1E40AF' },
    { _id: 'c13', name: 'ECI', industry: 'Infrastructure', jobCount: 10, recentlyAdded: true, companyColor: '#4B5563' },
    { _id: 'c14', name: 'Piramal', industry: 'Healthcare', jobCount: 8, recentlyAdded: true, companyColor: '#B45309' },
    { _id: 'c15', name: 'Godrej', industry: 'FMCG', jobCount: 14, recentlyAdded: true, companyColor: '#10B981' }
  ],
  jobs: [
    {
      _id: 'job-1',
      title: 'Combined Civil Services (Deputy Collector, DSP, etc.)',
      company: 'Jharkhand Public Service Commission (JPSC)',
      companyInitial: 'JPSC',
      companyColor: '#005691',
      location: 'Jharkhand, India',
      type: 'Full Time',
      salary: { min: 56100, max: 177500, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'Graduate',
      badgeText: 'Recruitment Ongoing',
      category: 'Govt Jobs',
      industry: 'Public Service',
      description: 'Jharkhand Public Service Commission (JPSC) invites applications for the Combined Civil Services Examination to recruit Deputy Collectors, DSPs, and other executive officers. Selection Process: Prelims + Mains + Interview.',
      responsibilities: [
        'Prelims Exam: Objective type questions on General Studies (Paper I & II).',
        'Mains Exam: Written descriptive papers on core subjects and local languages.',
        'Interview: Personality test and viva-voce conducted by JPSC board members.'
      ],
      requirements: [
        'Must hold a Bachelor\'s degree in any discipline from a recognized university.',
        'Age must meet JPSC Civil Services eligibility guidelines.',
        'Must satisfy physical standards eligibility for DSP and other uniformed services.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-28'),
      lastDate: new Date('2026-12-31'),
      vacancies: 103
    },
    {
      _id: 'job-2',
      title: 'JTGLCCE (Assistant, Inspector & Others)',
      company: 'Jharkhand Staff Selection Commission (JSSC)',
      companyInitial: 'JSSC',
      companyColor: '#1B8C0A',
      location: 'Jharkhand, India',
      type: 'Full Time',
      salary: { min: 35400, max: 112400, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'B.Sc / M.Sc / B.Pharm / Graduate (Post-wise)',
      badgeText: 'Apply Online',
      category: 'Govt Jobs',
      industry: 'Public Service',
      description: 'Jharkhand Staff Selection Commission (JSSC) invites online applications for JTGLCCE to recruit Assistants, Inspectors, and other technical graduate posts. Selection Process: Written Exam.',
      responsibilities: [
        'Perform administrative and technical supervisory duties in designated state departments.',
        'Implement government schemes, checks, and regulations at block levels.',
        'Review and maintain records/files for technical and general audits.'
      ],
      requirements: [
        'Graduation or Post-Graduation in B.Sc, M.Sc, B.Pharm, or specific streams matching the post details.',
        'Age must fit the JSSC JTGLCCE regulations.',
        'Knowledge of local customs and languages of Jharkhand is required.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-27'),
      lastDate: new Date('2026-06-30'),
      vacancies: 611
    },
    {
      _id: 'job-3',
      title: 'Polytechnic Lecturer',
      company: 'Jharkhand Public Service Commission (JPSC)',
      companyInitial: 'JPSC',
      companyColor: '#005691',
      location: 'Jharkhand, India',
      type: 'Full Time',
      salary: { min: 56100, max: 79800, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'B.E. / B.Tech / M.Tech',
      badgeText: 'New',
      category: 'Govt Jobs',
      industry: 'Education / Teaching',
      description: 'Recruitment of Lecturers in government polytechnic institutes across Jharkhand state. Selection Process: Written + Interview.',
      responsibilities: [
        'Deliver technical curriculum and instructions in engineering/science disciplines.',
        'Manage laboratory equipment and supervise practical experiment sessions.',
        'Assess student performance, assignments, and participate in academic mentoring.'
      ],
      requirements: [
        'B.E. / B.Tech / M.Tech in relevant engineering discipline with first class or equivalent.',
        'Strong subject matter expertise and academic teaching capabilities.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-26'),
      lastDate: null,
      vacancies: 349
    }
  ],
  exams: [
    {
      _id: 'e1',
      title: 'Combined Civil Services (Deputy Collector, DSP, etc.)',
      organization: 'Jharkhand Public Service Commission',
      orgShort: 'JPSC',
      category: 'Upcoming Exams',
      lastDate: 'Recruitment Ongoing',
      posts: '103 Posts',
      status: 'Apply Now',
      description: 'Selection Process: Prelims + Mains + Interview. Open to graduates. Source: JPSC (https://www.jpsc.gov.in)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e2',
      title: 'JTGLCCE (Assistant, Inspector & Others)',
      organization: 'Jharkhand Staff Selection Commission',
      orgShort: 'JSSC',
      category: 'Upcoming Exams',
      lastDate: '30 Jun 2026',
      posts: '611 Posts',
      status: 'Apply Now',
      description: 'Selection Process: Written Exam. B.Sc / M.Sc / B.Pharm / Graduate (Post-wise). Source: FreeJobAlert (https://www.freejobalert.com)',
      isNew: true,
      createdAt: new Date()
    }
  ],
  blogPosts: [],
  applications: [],
  quizzes: []
};

// Dynamically map categories for seeded mock jobs
mockDb.jobs.forEach(job => {
  job.pdfUrl = job.pdfUrl || '';
  if (job.category === 'Govt Jobs' || job.category === 'Govt') {
    const company = String(job.companyInitial || job.company).toUpperCase();
    if (['JPSC', 'JSSC', 'JAC', 'JHGD'].some(c => company.includes(c))) {
      job.category = 'Jharkhand';
    } else if (company.includes('SSC')) {
      job.category = 'SSC';
    } else if (company.includes('UPSC')) {
      job.category = 'UPSC';
    } else if (company.includes('RAILWAY') || company.includes('RRB')) {
      job.category = 'Railway';
    } else if (['IAF', 'DSSSB', 'CIL', 'NCL', 'ARMY', 'DEFENCE'].some(c => company.includes(c))) {
      job.category = 'Other State';
    } else if (String(job.location).toLowerCase().includes('jharkhand')) {
      job.category = 'Jharkhand';
    } else {
      job.category = 'Other State';
    }
  } else if (job.category === 'Private Jobs' || job.category === 'Private') {
    job.category = 'Private';
  }
});

// Initialize mock database
export const initMockDb = async () => {
  try {
    const scrapedPath = path.join(__dirname, '../config/scraped_data.json');
    if (fs.existsSync(scrapedPath)) {
      const data = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
      if (data.jobs && Array.isArray(data.jobs)) {
        data.jobs.forEach(job => {
          if (!mockDb.jobs.some(j => j._id === job._id)) {
            if (job.postedDate) job.postedDate = new Date(job.postedDate);
            if (job.lastDate) job.lastDate = new Date(job.lastDate);
            mockDb.jobs.push(job);
          }
        });
        console.log(`🌱 Loaded ${data.jobs.length} scraped jobs into Mock DB.`);
      }
      if (data.exams && Array.isArray(data.exams)) {
        data.exams.forEach(exam => {
          if (!mockDb.exams.some(e => e._id === exam._id)) {
            mockDb.exams.push(exam);
          }
        });
        console.log(`🌱 Loaded ${data.exams.length} scraped exam notices into Mock DB.`);
      }
    }
  } catch (err) {
    console.error('⚠️ Error loading scraped data into Mock DB:', err.message);
  }
  console.log('🤖 Mock In-Memory Database Initialized.');
};

export default mockDb;
