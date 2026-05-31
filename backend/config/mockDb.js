import bcrypt from 'bcryptjs';

// In-Memory Mock Database Store
const mockDb = {
  users: [
    {
      _id: 'mock-user-admin-id',
      name: 'Jharkhand Jobs Admin',
      email: 'admin@jharkhandjobs.com',
      passwordHash: '', // Will set on init
      phone: '9876543210',
      role: 'admin',
      savedJobs: [],
      createdAt: new Date(),
    },
    {
      _id: 'mock-user-demo-id',
      name: 'Rohan Kumar',
      email: 'rohan@gmail.com',
      passwordHash: '', // Will set on init
      phone: '9123456789',
      role: 'user',
      savedJobs: [],
      createdAt: new Date(),
    }
  ],
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
      _id: 'mock-job-1-id',
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
      _id: 'mock-job-2-id',
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
      _id: 'mock-job-3-id',
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
      _id: 'mock-job-4-id',
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
      _id: 'mock-job-5-id',
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
      _id: 'mock-job-6-id',
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
      _id: 'mock-job-7-id',
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
      _id: 'mock-job-8-id',
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
      _id: 'mock-job-9-id',
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
      _id: 'mock-job-10-id',
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
  ],
  exams: [
    {
      _id: 'e1',
      title: 'JSSC CGL Recruitment 2024',
      organization: 'Jharkhand Staff Selection Commission',
      orgShort: 'JSSC',
      category: 'Upcoming Exams',
      lastDate: '18 May 2026',
      posts: '2,018 Posts',
      status: 'Apply Now',
      description: 'Online application invited for JSSC CGL Combined Graduate Level examination for administrative posts.',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e2',
      title: 'Jharkhand Police Constable Recruitment 2024',
      organization: 'Jharkhand Staff Selection Commission',
      orgShort: 'JSSC',
      category: 'Upcoming Exams',
      lastDate: '20 May 2026',
      posts: '4,919 Posts',
      status: 'Apply Now',
      description: 'Recruitment notice for constables in various districts of Jharkhand. Physical test followed by written test.',
      isNew: true,
      createdAt: new Date()
    },
    {
      _id: 'e3',
      title: 'JPSC Civil Services Examination 2024',
      organization: 'Jharkhand Public Service Commission',
      orgShort: 'JPSC',
      category: 'Upcoming Exams',
      lastDate: '15 Jun 2026',
      posts: '342 Posts',
      status: 'Apply Now',
      description: 'JPSC Combined Civil Services Prelims exam notifications for administrative, finance, and executive roles.',
      isNew: false,
      createdAt: new Date()
    },
    {
      _id: 'e4',
      title: 'JSSC JE (Civil) Recruitment 2024',
      organization: 'Jharkhand Staff Selection Commission',
      orgShort: 'JSSC',
      category: 'Upcoming Exams',
      lastDate: '25 May 2026',
      posts: '1,562 Posts',
      status: 'Apply Now',
      description: 'Junior Engineer (Civil, Mechanical, Electrical) recruitment exam notifications for state departments.',
      isNew: false,
      createdAt: new Date()
    },
    {
      _id: 'e5',
      title: 'JSSC CGL Admit Card 2024',
      organization: 'Jharkhand Staff Selection Commission',
      orgShort: 'JSSC',
      category: 'Admit Card',
      status: 'Released',
      description: 'Admit card released. Download now from JSSC portal.',
      createdAt: new Date()
    },
    {
      _id: 'e6',
      title: 'JPSC Civil Services Prelims Result 2024',
      organization: 'Jharkhand Public Service Commission',
      orgShort: 'JPSC',
      category: 'Results',
      status: 'Declared',
      description: 'Result declared. Check your roll number and scores.',
      createdAt: new Date()
    },
    {
      _id: 'e7',
      title: 'JSSC JE Civil Answer Key 2024',
      organization: 'Jharkhand Staff Selection Commission',
      orgShort: 'JSSC',
      category: 'Answer Key',
      status: 'Released',
      description: 'Provisional answer key uploaded. Submit objections by 5 PM.',
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

// Auto-hash passwords for seed accounts
export const initMockDb = async () => {
  const salt = await bcrypt.genSalt(10);
  mockDb.users[0].passwordHash = await bcrypt.hash('Admin@123', salt);
  mockDb.users[1].passwordHash = await bcrypt.hash('User@123', salt);
  console.log('🤖 Mock In-Memory Database Initialized with Seed Data.');
};

export default mockDb;
