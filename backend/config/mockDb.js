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
    },
    {
      _id: 'job-5',
      title: 'Teacher Eligibility Test (JTET)',
      company: 'Jharkhand Academic Council (JAC)',
      companyInitial: 'JAC',
      companyColor: '#7C3AED',
      location: 'Jharkhand, India',
      type: 'Full Time',
      salary: { min: 0, max: 0, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'D.El.Ed / B.Ed',
      badgeText: 'Eligibility Exam',
      category: 'Govt Jobs',
      industry: 'Education / Teaching',
      description: 'Jharkhand Academic Council conducts the Teacher Eligibility Test (JTET) to certify primary and middle school teachers in the state. Selection Process: Written Exam.',
      responsibilities: [
        'Qualifying exam to assess eligibility of primary (Class I-V) and middle (Class VI-VIII) school teachers.',
        'Demonstrate proper teaching quality standards as per NCTE rules.'
      ],
      requirements: [
        'D.El.Ed or B.Ed qualification from a recognized NCTE college.',
        'Passed secondary or senior secondary with minimum aggregate marks.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-24'),
      lastDate: null,
      vacancies: 0
    },
    {
      _id: 'job-6',
      title: 'Assistant Professor (Engineering)',
      company: 'Jharkhand Public Service Commission (JPSC)',
      companyInitial: 'JPSC',
      companyColor: '#005691',
      location: 'Jharkhand, India',
      type: 'Full Time',
      salary: { min: 57700, max: 182400, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'M.Tech / PhD',
      badgeText: 'JPSC Faculty',
      category: 'Govt Jobs',
      industry: 'Education / Teaching',
      description: 'Jharkhand Public Service Commission invites applications for Assistant Professor vacancies in Government Engineering Colleges. Selection Process: Interview/Written.',
      responsibilities: [
        'Engage in academic lectures, curriculum development, and laboratory guidance.',
        'Mentor undergraduate students and publish technical papers in indexed journals.',
        'Participate in college department committees and accreditation tasks.'
      ],
      requirements: [
        'M.Tech or PhD in relevant engineering stream from a recognized university.',
        'Cleared national-level eligibility certifications (NET/SLET) where applicable.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-23'),
      lastDate: null,
      vacancies: 45
    },
    {
      _id: 'job-7',
      title: 'Lecturer (Govt Polytechnic)',
      company: 'Jharkhand Public Service Commission (JPSC)',
      companyInitial: 'JPSC',
      companyColor: '#005691',
      location: 'Jharkhand, India',
      type: 'Full Time',
      salary: { min: 56100, max: 177500, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'Engineering Degree',
      badgeText: 'Ongoing',
      category: 'Govt Jobs',
      industry: 'Education / Teaching',
      description: 'Recruitment for engineering and non-engineering lecturers in state government polytechnics under JPSC. Selection Process: Written + Interview.',
      responsibilities: [
        'Deliver technical curriculum lectures and supervise practical lab experiments.',
        'Assist in college administrative tasks, semester examinations, and quality assurance.'
      ],
      requirements: [
        'Bachelor\'s Degree in Engineering/Technology in relevant branch with First Class.',
        'Age limits and relaxations as per government directives.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-22'),
      lastDate: null,
      vacancies: 50
    },
    {
      _id: 'job-8',
      title: 'Group B & C Posts',
      company: 'Staff Selection Commission (SSC)',
      companyInitial: 'SSC',
      companyColor: '#1A73E8',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 35400, max: 112400, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'Graduate',
      badgeText: 'Apply Online',
      category: 'Govt Jobs',
      industry: 'Public Service',
      description: 'Staff Selection Commission (SSC) conducts recruitment for various Group B & C posts across ministries and departments of the Government of India. Selection Process: Tier 1 + Tier 2 Computer Based Exams.',
      responsibilities: [
        'Assist in administrative duties in ministries.',
        'Maintain files and reports.',
        'Implement government policies under senior supervision.'
      ],
      requirements: [
        'Must hold a Bachelor\'s degree in any discipline from a recognized university.',
        'Age must be between 18-30 years as per post requirements.',
        'Indian citizenship is mandatory.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-21'),
      lastDate: new Date('2026-06-22'),
      vacancies: 12256
    },
    {
      _id: 'job-9',
      title: 'Assistant Loco Pilot',
      company: 'Railway Recruitment Board (RRB)',
      companyInitial: 'Railway',
      companyColor: '#D97706',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 19900, max: 35000, currency: '₹', period: 'monthly' },
      experience: 'Fresher',
      qualification: 'ITI / Diploma',
      badgeText: 'Apply Online',
      category: 'Govt Jobs',
      industry: 'Railways',
      description: 'Railway Recruitment Board (RRB) invites applications for the recruitment of Assistant Loco Pilots (ALP) in Indian Railways. Selection Process: Computer Based Tests (CBT 1 & 2), CBAT, and Document Verification.',
      responsibilities: [
        'Assist in operating trains under the supervision of Loco Pilots.',
        'Check the mechanical/electrical condition of locomotives.',
        'Follow safety directives and rail signals carefully.'
      ],
      requirements: [
        '10th Pass + ITI or Diploma in Engineering streams.',
        'Must meet strict medical standard (A1 visual standards).'
      ],
      status: 'active',
      postedDate: new Date('2026-05-20'),
      lastDate: new Date('2026-06-14'),
      vacancies: 11127
    },
    {
      _id: 'job-10',
      title: 'Combined Defence Services',
      company: 'Union Public Service Commission (UPSC)',
      companyInitial: 'UPSC',
      companyColor: '#9333EA',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 56100, max: 177500, currency: '₹', period: 'monthly' },
      experience: 'Fresher',
      qualification: 'Graduate',
      badgeText: 'Apply Online',
      category: 'Govt Jobs',
      industry: 'Defense / Security',
      description: 'Union Public Service Commission (UPSC) conducts Combined Defence Services (CDS) Exam for admission into IMA, INA, AFA, and OTA. Selection Process: Written Exam + SSB Interview.',
      responsibilities: [
        'Undergo military officer training program.',
        'Serve as a commissioned officer in the Indian Armed Forces.'
      ],
      requirements: [
        'Graduation degree in relevant streams (Engineering for Navy/Air Force, any discipline for Army).',
        'Unmarried males/females matching UPSC age specifications.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-19'),
      lastDate: new Date('2026-06-09'),
      vacancies: 451
    },
    {
      _id: 'job-11',
      title: 'National Defence Academy',
      company: 'Union Public Service Commission (UPSC)',
      companyInitial: 'UPSC',
      companyColor: '#9333EA',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 56100, max: 177500, currency: '₹', period: 'monthly' },
      experience: 'Fresher',
      qualification: '12th Pass',
      badgeText: 'Apply Online',
      category: 'Govt Jobs',
      industry: 'Defense / Security',
      description: 'Union Public Service Commission (UPSC) conducts NDA & NA Exam for entry into Army, Navy and Air Force wings of National Defence Academy. Selection Process: Written Exam + SSB Interview.',
      responsibilities: [
        'Undergo basic defense and academic education training.',
        'Serve in Indian Army, Navy, or Air Force.'
      ],
      requirements: [
        '12th Class Pass (with Physics and Mathematics for Air Force and Navy).',
        'Unmarried male/female candidates.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-18'),
      lastDate: new Date('2026-06-09'),
      vacancies: 394
    },
    {
      _id: 'job-12',
      title: 'Flying & Ground Duty',
      company: 'Indian Air Force (IAF)',
      companyInitial: 'IAF',
      companyColor: '#2563EB',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 56100, max: 110000, currency: '₹', period: 'monthly' },
      experience: 'Fresher',
      qualification: 'Graduate / BE',
      badgeText: 'Apply Online',
      category: 'Govt Jobs',
      industry: 'Defense / Security',
      description: 'Indian Air Force (IAF) invites applications for Flying Branch and Ground Duty (Technical and Non-Technical) branches through AFCAT entry. Selection Process: Written Exam + AFSB Testing.',
      responsibilities: [
        'Fulfill flying operations or supervise aeronautical technical/non-technical operations.',
        'Manage command systems and ground logistics.'
      ],
      requirements: [
        'Bachelor Degree in any stream with Physics & Math at 10+2, or B.E./B.Tech.',
        'Age limits: 20-24 years for Flying, 20-26 years for Ground Duty.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-17'),
      lastDate: new Date('2026-06-19'),
      vacancies: 379
    },
    {
      _id: 'job-13',
      title: 'Graduate/Diploma/Trade Apprentice',
      company: 'Northern Coalfields Limited (NCL)',
      companyInitial: 'NCL',
      companyColor: '#059669',
      location: 'Singrauli, MP/UP',
      type: 'Full Time',
      salary: { min: 8000, max: 10000, currency: '₹', period: 'monthly' },
      experience: 'Fresher',
      qualification: 'ITI / Diploma / Degree',
      badgeText: 'Ongoing',
      category: 'Govt Jobs',
      industry: 'Mining / Public Enterprise',
      description: 'Northern Coalfields Limited (NCL) invites online applications for Graduate, Diploma, and Trade Apprentice training positions. Selection Process: Merit List based on Marks.',
      responsibilities: [
        'Undergo technical training in designated engineering trades.',
        'Assist in site mining operational units.'
      ],
      requirements: [
        'ITI in relevant trade, Diploma, or Degree in Engineering.',
        'Must register on NATS/NAPS portal.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-16'),
      lastDate: null,
      vacancies: 1607
    },
    {
      _id: 'job-14',
      title: 'Group B & C Posts',
      company: 'Delhi Subordinate Services Selection Board (DSSSB)',
      companyInitial: 'DSSSB',
      companyColor: '#DC2626',
      location: 'Delhi, India',
      type: 'Full Time',
      salary: { min: 21700, max: 81100, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: '10th / 12th / Graduate',
      badgeText: 'Starting June 16',
      category: 'Govt Jobs',
      industry: 'Public Service',
      description: 'DSSSB releases advertisement No. 03/2026 for various Group B & C vacancies in departments of GNCTD. Applications start from June 16. Selection Process: Written Examination.',
      responsibilities: [
        'Perform general administration, checking, and files clerical work.',
        'Execute department field operations.'
      ],
      requirements: [
        '10th/12th pass or Graduate from a recognized Board/University (Post-wise criteria).'
      ],
      status: 'active',
      postedDate: new Date('2026-05-15'),
      lastDate: new Date('2026-07-16'),
      vacancies: 1979
    },
    {
      _id: 'job-15',
      title: 'Management Trainee',
      company: 'Coal India Limited (CIL)',
      companyInitial: 'CIL',
      companyColor: '#059669',
      location: 'Kolkata, India',
      type: 'Full Time',
      salary: { min: 50000, max: 160000, currency: '₹', period: 'monthly' },
      experience: 'Fresher',
      qualification: 'Engineering / MBA',
      badgeText: 'Apply Online',
      category: 'Govt Jobs',
      industry: 'Public Sector Undertaking (PSU)',
      description: 'Coal India Limited (CIL) recruits Management Trainees in disciplines of Mining, Civil, Mechanical, System, HR, Marketing, etc. Selection Process: GATE Score / CBT + Interview.',
      responsibilities: [
        'Executive supervisory duties in designated disciplines.',
        'Ensure project compliance, safety norms, and field efficiency.'
      ],
      requirements: [
        'B.E./B.Tech/B.Sc Engineering, or MBA/PG Diploma with minimum 60% marks.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-14'),
      lastDate: new Date('2026-06-11'),
      vacancies: 660
    },
    {
      _id: 'job-16',
      title: 'Agniveer GD/Technical/Clerk',
      company: 'Indian Army',
      companyInitial: 'Army',
      companyColor: '#1B8C0A',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 30000, max: 40000, currency: '₹', period: 'monthly' },
      experience: 'Fresher',
      qualification: '10th / 12th / ITI',
      badgeText: 'Exam Ongoing',
      category: 'Govt Jobs',
      industry: 'Defense / Security',
      description: 'Indian Army conducts online common entrance exam (CEE) for recruiting Agniveers in General Duty, Technical, Clerk/Store Keeper, and Tradesmen categories. Selection Process: Online CEE + Physical Fitness Test.',
      responsibilities: [
        'Serve in primary field/combat/trades duties under the Agniveer scheme.',
        'Maintain high physical training and security discipline.'
      ],
      requirements: [
        '10th Pass (GD), 12th Pass (Technical/Clerk), 8th/10th Pass (Tradesmen).',
        'Age: 17.5 to 21 years.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-13'),
      lastDate: null,
      vacancies: 25000
    },
    {
      _id: 'job-17',
      title: 'General Duty Doctor',
      company: 'Civil Surgeon Office East Singhbhum',
      companyInitial: 'CSOES',
      companyColor: '#059669',
      location: 'East Singhbhum, Jharkhand',
      type: 'Full Time',
      salary: { min: 45000, max: 65000, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'MBBS',
      badgeText: 'Walk-in Interview',
      category: 'Jharkhand',
      industry: 'Healthcare / Medical',
      description: 'Walk-in interview for the recruitment of General Duty Doctors under District Health Society, East Singhbhum, Jamshedpur.',
      responsibilities: [
        'Provide clinical care and medical services in district hospitals.',
        'Supervise outdoor and indoor patient departments.',
        'Assist in implementation of state healthcare programs.'
      ],
      requirements: [
        'Must hold an MBBS degree from a recognized MCI college.',
        'Valid registration certificate from state medical council.'
      ],
      status: 'active',
      postedDate: new Date('2026-06-03'),
      lastDate: new Date('2026-06-10'),
      vacancies: 5,
      applyLink: 'https://www.freejobalert.com/articles/civil-surgeon-office-east-singhbhum-general-duty-doctor-recruitment-2026-walkin-3052542'
    },
    {
      _id: 'job-18',
      title: 'Non Faculty Posts (Group B & C)',
      company: 'AIIMS Deoghar',
      companyInitial: 'AIIMSD',
      companyColor: '#7C3AED',
      location: 'Deoghar, Jharkhand',
      type: 'Full Time',
      salary: { min: 35400, max: 112400, currency: '₹', period: 'monthly' },
      experience: 'Experienced',
      qualification: 'Graduate / Diploma / 12th',
      badgeText: 'Apply Offline',
      category: 'Jharkhand',
      industry: 'Healthcare / Administration',
      description: 'Offline applications are invited for recruitment to various Non-Faculty Group B and C posts on deputation basis at AIIMS Deoghar.',
      responsibilities: [
        'Execute daily administrative and clinical support workflows.',
        'Maintain registers and records under supervision of senior officers.',
        'Coordinate departmental tasks across hospital wings.'
      ],
      requirements: [
        'Graduate, Diploma, or 12th pass matching specific post criteria.',
        'Experience in government health departments or public undertakings is preferred.'
      ],
      status: 'active',
      postedDate: new Date('2026-06-03'),
      lastDate: new Date('2026-07-03'),
      vacancies: 11,
      applyLink: 'https://www.freejobalert.com/articles/aiims-deoghar-non-faculty-recruitment-2026-apply-offline-for-11-posts-3050225'
    },
    {
      _id: 'job-19',
      title: 'Technician (Group II)',
      company: 'CSIR - Central Institute of Mining and Fuel Research',
      companyInitial: 'CIMFR',
      companyColor: '#2563EB',
      location: 'Dhanbad, Jharkhand',
      type: 'Full Time',
      salary: { min: 19900, max: 63200, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: '10th Pass + ITI',
      badgeText: 'Apply Online',
      category: 'Jharkhand',
      industry: 'Mining / Technical',
      description: 'CSIR-CIMFR, Dhanbad invites online applications from enthusiastic Indian nationals for recruitment of Technicians (Group II) in various trades.',
      responsibilities: [
        'Operate laboratory mining apparatus and trade equipment.',
        'Follow standard chemical and safety protocols under team leads.',
        'Log experiment observations and daily testing statistics.'
      ],
      requirements: [
        '10th class pass with science subjects from a recognized board.',
        'Valid ITI certificate in relevant trade (Electrical, Fitter, etc.).'
      ],
      status: 'active',
      postedDate: new Date('2026-05-20'),
      lastDate: new Date('2026-06-19'),
      vacancies: 30,
      applyLink: 'https://www.freejobalert.com/articles/csir-cimfr-technician-recruitment-2026-apply-online-for-30-posts-3049841'
    },
    {
      _id: 'job-20',
      title: 'IT Executive',
      company: 'District Health Society Jharkhand',
      companyInitial: 'DHSJH',
      companyColor: '#0891B2',
      location: 'Jharkhand, India',
      type: 'Full Time',
      salary: { min: 22000, max: 30000, currency: '₹', period: 'monthly' },
      experience: 'Fresher / Experienced',
      qualification: 'B.Tech / B.E / M.Sc',
      badgeText: 'Apply Online',
      category: 'Jharkhand',
      industry: 'IT / Healthcare Support',
      description: 'Recruitment of IT Executives on contractual basis for Medical Colleges and District Hospitals under Jharkhand Health Department.',
      responsibilities: [
        'Manage IT hardware, local area networks, and hospital information systems.',
        'Provide technical support for state tele-medicine and digital health portals.',
        'Maintain system backups and troubleshoot hardware faults.'
      ],
      requirements: [
        'B.Tech/B.E in Computer Science/IT or M.Sc in IT/Electronics.',
        'Hands-on experience with hardware troubleshooting and basic SQL queries.'
      ],
      status: 'active',
      postedDate: new Date('2026-05-13'),
      lastDate: new Date('2026-06-25'),
      vacancies: 29,
      applyLink: 'https://www.freejobalert.com/articles/medical-college-and-district-hospital-jharkhand-it-executive-recruitment-2026-apply-online-for-29-posts-3048894'
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
    },
    {
      _id: 'e3',
      title: 'Polytechnic Lecturer',
      organization: 'Jharkhand Public Service Commission',
      orgShort: 'JPSC',
      category: 'Upcoming Exams',
      lastDate: 'As per Notification',
      posts: '349+ Posts',
      status: 'Apply Now',
      description: 'Selection Process: Written + Interview. B.E./B.Tech / M.Tech. Source: The Times of India (https://timesofindia.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e5',
      title: 'Teacher Eligibility Test (JTET)',
      organization: 'Jharkhand Academic Council',
      orgShort: 'JAC',
      category: 'Upcoming Exams',
      lastDate: 'Registration Closing',
      posts: 'Eligibility Exam',
      status: 'Apply Now',
      description: 'Selection Process: Written Exam. D.El.Ed/B.Ed. Source: The Times of India (https://timesofindia.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e6',
      title: 'Assistant Professor (Engineering)',
      organization: 'Jharkhand Public Service Commission',
      orgShort: 'JPSC',
      category: 'Admit Card',
      lastDate: 'Ongoing',
      posts: 'Multiple Posts',
      status: 'Apply Now',
      description: 'Selection Process: Interview/Written. M.Tech/PhD. Source: JPSC (https://www.jpsc.gov.in)',
      isNew: false,
      createdAt: new Date()
    },
    {
      _id: 'e7',
      title: 'Lecturer (Govt Polytechnic)',
      organization: 'Jharkhand Public Service Commission',
      orgShort: 'JPSC',
      category: 'Admit Card',
      lastDate: 'Ongoing',
      posts: 'Multiple Posts',
      status: 'Apply Now',
      description: 'Selection Process: Written + Interview. Engineering Degree. Source: JPSC (https://www.jpsc.gov.in)',
      isNew: false,
      createdAt: new Date()
    },
    {
      _id: 'e8',
      title: 'Group B & C Posts',
      organization: 'Staff Selection Commission',
      orgShort: 'SSC',
      category: 'Upcoming Exams',
      lastDate: '22 Jun 2026',
      posts: '12,256 Posts',
      status: 'Apply Now',
      description: 'Selection Process: Tier 1 + Tier 2 Computer Based Exams. Open to graduates. Source: Navbharat Times (https://navbharattimes.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e9',
      title: 'Assistant Loco Pilot',
      organization: 'Railway Recruitment Board',
      orgShort: 'Railway',
      category: 'Admit Card',
      lastDate: '14 Jun 2026',
      posts: '11,127 Posts',
      status: 'Apply Now',
      description: 'Selection Process: CBT 1 & 2 + CBAT + Document Verification. ITI/Diploma. Source: Navbharat Times (https://navbharattimes.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e10',
      title: 'Combined Defence Services',
      organization: 'Union Public Service Commission',
      orgShort: 'UPSC',
      category: 'Results',
      lastDate: '9 Jun 2026',
      posts: '451 Posts',
      status: 'Apply Now',
      description: 'Selection Process: Written Exam + SSB Interview. Open to graduates. Source: Navbharat Times (https://navbharattimes.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e11',
      title: 'National Defence Academy',
      organization: 'Union Public Service Commission',
      orgShort: 'UPSC',
      category: 'Admit Card',
      lastDate: '9 Jun 2026',
      posts: '394 Posts',
      status: 'Apply Now',
      description: 'Selection Process: Written Exam + SSB Interview. Open to 12th pass. Source: Navbharat Times (https://navbharattimes.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e12',
      title: 'Flying & Ground Duty',
      organization: 'Indian Air Force',
      orgShort: 'IAF',
      category: 'Results',
      lastDate: '19 Jun 2026',
      posts: '379 Posts',
      status: 'Apply Now',
      description: 'Selection Process: Written Exam + AFSB Testing. Open to graduates/BE. Source: Navbharat Times (https://navbharattimes.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e13',
      title: 'Graduate/Diploma/Trade Apprentice',
      organization: 'Northern Coalfields Limited',
      orgShort: 'NCL',
      category: 'Results',
      lastDate: 'Ongoing',
      posts: '1,607 Posts',
      status: 'Apply Now',
      description: 'Selection Process: Merit List based on Marks. ITI/Diploma/Degree. Source: The Times of India (https://timesofindia.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e14',
      title: 'Group B & C Posts',
      organization: 'Delhi Subordinate Services Selection Board',
      orgShort: 'DSSSB',
      category: 'Results',
      lastDate: 'Applications Start 16 Jun',
      posts: '1,979 Posts',
      status: 'Notification Out',
      description: 'Selection Process: Written Examination. Open to 10th/12th/Graduates. Source: The Times of India (https://timesofindia.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e15',
      title: 'Management Trainee',
      organization: 'Coal India Limited',
      orgShort: 'CIL',
      category: 'Results',
      lastDate: '11 Jun 2026',
      posts: '660 Posts',
      status: 'Apply Now',
      description: 'Selection Process: GATE Score / CBT + Interview. Engineering/MBA. Source: Career Power (https://www.careerpower.in)',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e16',
      title: 'Agniveer GD/Technical/Clerk',
      organization: 'Indian Army',
      orgShort: 'Army',
      category: 'Admit Card',
      lastDate: 'Exam Ongoing',
      posts: 'Thousands',
      status: 'Admit Card Out',
      description: 'Selection Process: Online CEE + Physical Fitness Test. Open to 10th/12th/ITI. Source: The Times of India (https://timesofindia.indiatimes.com)',
      isNew: true,
      createdAt: new Date()
    }
  ],
  blogPosts: [
    {
      _id: 'b1',
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
        <p>Over 40 questions in Paper 3 are specifically dedicated to Jharkhand GK. Devote significant study hours to studying the history, geography, economy, culture, and current affairs of Jharkhand.</p>
      `,
      category: 'Career Guide',
      author: 'Exam Expert Team',
      coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop',
      tags: ['JSSC', 'Govt Jobs', 'Preparation'],
      views: 124,
      publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'b2',
      title: 'Top 10 High-Paying IT Jobs in Ranchi',
      slug: 'top-10-high-paying-it-jobs-in-ranchi',
      excerpt: 'Explore the fast-growing technology sector in Ranchi and discover the top roles offering the best salaries for tech professionals.',
      content: `
        <h3>Ranchi's Growing Tech Scene</h3>
        <p>Ranchi, the capital of Jharkhand, is emerging as a promising tech hub in eastern India. With new software centers, technology parks, and startups setting up offices in the state, high-paying tech jobs are highly sought after.</p>
      `,
      category: 'Industry Trends',
      author: 'Job Market Analyst',
      coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
      tags: ['IT Jobs', 'Ranchi', 'Tech Careers'],
      views: 89,
      publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'b3',
      title: 'Writing the Perfect Resume: A Step-by-Step Walkthrough',
      slug: 'writing-the-perfect-resume-step-by-step-walkthrough',
      excerpt: 'Land more interviews with a modern, professional resume. Learn the exact formatting, layout, and keywords recruiters look for.',
      content: `
        <h3>Your Resume is Your First Impression</h3>
        <p>Recruiters spend an average of 6 seconds reviewing a single resume before making a decision. To make that time count, your resume must be crisp, impactful, and tailored to the job description.</p>
      `,
      category: 'Tips & Tricks',
      author: 'HR Recruiter Specialist',
      coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
      tags: ['Resume Tips', 'Interview', 'Career advice'],
      views: 245,
      publishedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ],
  applications: [],
  quizzes: [
    {
      _id: 'q1',
      key: 'jharkhand-gk',
      title: 'Jharkhand GK',
      icon: 'BookOpen',
      color: '#1B8C0A',
      bgColor: '#E8F5E3',
      description: 'History, geography, culture, and landmarks of Jharkhand state.',
      duration: 600,
      questions: [
        {
          question: 'When was the state of Jharkhand officially carved out of Bihar?',
          options: ['15 November 2000', '1 November 2000', '26 January 2001', '15 August 2000'],
          answer: 0,
          explanation: 'Jharkhand was officially formed on 15 November 2000, which also marks the birth anniversary of tribal leader Birsa Munda.'
        },
        {
          question: 'Which city is known as the "Steel City" and "Industrial Capital" of Jharkhand?',
          options: ['Ranchi', 'Dhanbad', 'Jamshedpur', 'Bokaro'],
          answer: 2,
          explanation: 'Jamshedpur, founded by Jamsetji Tata, is known as the Steel City and is home to Tata Steel, the first private iron and steel company in India.'
        },
        {
          question: 'Who was the first Chief Minister of Jharkhand?',
          options: ['Shibu Soren', 'Babulal Marandi', 'Arjun Munda', 'Madhu Koda'],
          answer: 1,
          explanation: 'Babulal Marandi served as the first Chief Minister of Jharkhand from 15 November 2000 to 18 March 2003.'
        },
        {
          question: 'What is the official state animal of Jharkhand?',
          options: ['Bengal Tiger', 'Indian Elephant', 'One-horned Rhino', 'Gaur'],
          answer: 1,
          explanation: 'The Indian Elephant (Elephas maximus indicus) is the official state animal of Jharkhand.'
        },
        {
          question: 'Which famous waterfall in Jharkhand is located on the Subarnarekha River?',
          options: ['Hundru Falls', 'Jonha Falls', 'Dassam Falls', 'Hirni Falls'],
          answer: 0,
          explanation: 'The Hundru Falls is located on the Subarnarekha River in Ranchi district and is one of the most famous waterfalls in the state.'
        }
      ]
    },
    {
      _id: 'q2',
      key: 'general-knowledge',
      title: 'General Knowledge',
      icon: 'HelpCircle',
      color: '#2563EB',
      bgColor: '#EFF6FF',
      description: 'Polity, constitution, history, and geography of India.',
      duration: 600,
      questions: [
        {
          question: 'Who is regarded as the Chief Architect and Father of the Indian Constitution?',
          options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad'],
          answer: 1,
          explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee and is widely recognized as the Father of the Indian Constitution.'
        },
        {
          question: 'Which is the longest river flowing entirely within India?',
          options: ['The Ganges', 'The Godavari', 'The Narmada', 'The Brahmaputra'],
          answer: 0,
          explanation: 'The Ganges is the longest river in India, flowing over 2,525 km through northern and eastern plains.'
        },
        {
          question: 'The Fundamental Rights in the Indian Constitution are inspired by which country?',
          options: ['United Kingdom', 'Soviet Union', 'United States', 'Canada'],
          answer: 2,
          explanation: 'The Fundamental Rights in Part III of the Constitution are heavily inspired by the Bill of Rights in the US Constitution.'
        },
        {
          question: 'Which planet in our solar system is known as the "Red Planet"?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          answer: 1,
          explanation: 'Mars is known as the Red Planet due to the iron oxide (rust) prevalent on its surface, giving it a reddish appearance.'
        },
        {
          question: 'What is the chemical formula of common table salt?',
          options: ['H2O', 'CO2', 'NaCl', 'HCl'],
          answer: 2,
          explanation: 'Sodium Chloride (NaCl) is the chemical representation of common table salt.'
        }
      ]
    },
    {
      _id: 'q3',
      key: 'computer',
      title: 'Computer',
      icon: 'Clock',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      description: 'Basic computer applications, operations, protocols, and hardware.',
      duration: 300,
      questions: [
        {
          question: 'What is the standard Windows keyboard shortcut to copy selected content?',
          options: ['Ctrl + X', 'Ctrl + V', 'Ctrl + C', 'Ctrl + Z'],
          answer: 2,
          explanation: 'Ctrl + C is used to copy, Ctrl + X to cut, Ctrl + V to paste, and Ctrl + Z to undo.'
        },
        {
          question: 'Which of the following is an open-source Operating System?',
          options: ['Windows 11', 'macOS', 'Linux', 'iOS'],
          answer: 2,
          explanation: 'Linux is a family of open-source Unix-like operating systems based on the Linux kernel.'
        },
        {
          question: 'What is the full form of RAM?',
          options: ['Read Access Memory', 'Random Access Memory', 'Rapid Active Module', 'Registry Allocator Memory'],
          answer: 1,
          explanation: 'RAM stands for Random Access Memory, which is the high-speed volatile storage used by computers.'
        },
        {
          question: 'What does URL stand for?',
          options: ['Uniform Resource Locator', 'Unique Registry Location', 'Universal Route Link', 'Unified Resource List'],
          answer: 0,
          explanation: 'URL stands for Uniform Resource Locator, commonly known as a web address.'
        },
        {
          question: 'Which cryptographic protocol securely encrypts communication over the World Wide Web?',
          options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
          answer: 2,
          explanation: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts HTTP requests using SSL/TLS to prevent eavesdropping.'
        }
      ]
    },
    {
      _id: 'q4',
      key: 'current-affairs',
      title: 'Current Affairs',
      icon: 'Award',
      color: '#EA580C',
      bgColor: '#FEF3C7',
      description: 'Latest state schemes, cabinet announcements, awards, and sports updates.',
      duration: 300,
      questions: [
        {
          question: 'Which landmark social scheme was recently launched in Jharkhand to provide financial aid to local women?',
          options: ['Lado Kanya Yojana', 'Maiya Samman Yojana', 'Nari Shakti Protsahan', 'Guruji Student Credit Scheme'],
          answer: 1,
          explanation: 'The Jharkhand Mukhyamantri Maiya Samman Yojana (JMMSY) provides direct financial assistance to eligible women in the state.'
        },
        {
          question: 'Who serves as the current Governor of Jharkhand state?',
          options: ['C.P. Radhakrishnan', 'Ramesh Bais', 'Santosh Kumar Gangwar', 'Draupadi Murmu'],
          answer: 2,
          explanation: 'Santosh Kumar Gangwar was appointed as the Governor of Jharkhand in July 2024.'
        },
        {
          question: 'The Guruji Student Credit Card scheme in Jharkhand provides educational loans up to what limit?',
          options: ['₹5 Lakhs', '₹10 Lakhs', '₹15 Lakhs', '₹20 Lakhs'],
          answer: 2,
          explanation: 'Under the Guruji Student Credit Card Scheme, students can secure educational loans up to ₹15 Lakhs at nominal interest rates for higher education.'
        },
        {
          question: 'Which sportsperson from Jharkhand has won multiple international archery championships?',
          options: ['Mahendra Singh Dhoni', 'Deepika Kumari', 'Jaipal Singh Munda', 'Asunta Lakra'],
          answer: 1,
          explanation: 'Deepika Kumari is a world-class archer from Ranchi, Jharkhand, and former World No. 1 in women\'s recurve archery.'
        },
        {
          question: 'Ranchi, Jamshedpur, and Dhanbad belong to which official timezone standard?',
          options: ['GMT+5:00', 'IST (GMT+5:30)', 'GMT+6:00', 'IST (GMT+6:30)'],
          answer: 1,
          explanation: 'Like all of India, Jharkhand observes Indian Standard Time (IST), which is GMT+5:30.'
        }
      ]
    }
  ]
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
    const scrapedPath = path.join(__dirname, 'scraped_data.json');
    if (fs.existsSync(scrapedPath)) {
      const data = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
      if (data.jobs && Array.isArray(data.jobs)) {
        data.jobs.forEach(job => {
          if (!mockDb.jobs.some(j => j._id === job._id)) {
            // Convert date strings back to Date objects
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
