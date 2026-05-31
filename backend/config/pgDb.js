import pg from 'pg';
const { Pool } = pg;
import bcrypt from 'bcryptjs';

let pool = null;
let isConnected = false;

export const initPgDb = async () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jharkhand_jobs';
  
  console.log('🔌 Attempting connection to PostgreSQL...');
  
  pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 3000, // Timeout fast if PG is not running
  });

  try {
    // Test the connection
    const client = await pool.connect();
    console.log('🚀 PostgreSQL Connected successfully!');
    client.release();
    isConnected = true;
    global.useMockDb = false;

    // Run Schema DDL scripts
    await runDDL();
    
    // Seed default records if empty
    await seedTables();
    
    return true;
  } catch (error) {
    console.log('\n=============================================================');
    console.log('⚠️  COULD NOT CONNECT TO POSTGRESQL DATABASE INSTANCE');
    console.log(`❌ Error: ${error.message}`);
    console.log('💡 Jharkhand Jobs Server is falling back to In-Memory DB Mode.');
    console.log('✨ All functionalities (Auth, Search, Admin Dashboard) will work seamlessly!');
    console.log('=============================================================\n');
    
    isConnected = false;
    global.useMockDb = true;
    return false;
  }
};

export const getPool = () => {
  if (!isConnected) return null;
  return pool;
};

export const query = async (text, params) => {
  if (!isConnected) {
    throw new Error('PostgreSQL is not connected. Attempted query on disconnected pool.');
  }
  return pool.query(text, params);
};

const runDDL = async () => {
  console.log('⚙️  Running PostgreSQL Schema Builders...');
  
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      role VARCHAR(50) DEFAULT 'user',
      google_id VARCHAR(255) UNIQUE,
      saved_jobs TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    
    // Companies table
    `CREATE TABLE IF NOT EXISTS companies (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      industry VARCHAR(255),
      job_count INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT FALSE,
      recently_added BOOLEAN DEFAULT FALSE,
      company_color VARCHAR(50)
    );`,
    
    // Jobs table
    `CREATE TABLE IF NOT EXISTS jobs (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      company_initial VARCHAR(50),
      company_color VARCHAR(50),
      location VARCHAR(255),
      type VARCHAR(100),
      salary_min NUMERIC,
      salary_max NUMERIC,
      salary_currency VARCHAR(10) DEFAULT '₹',
      salary_period VARCHAR(50) DEFAULT 'monthly',
      experience VARCHAR(100),
      qualification VARCHAR(255),
      badge_text VARCHAR(100),
      category VARCHAR(100),
      industry VARCHAR(255),
      description TEXT,
      responsibilities TEXT[] DEFAULT '{}',
      requirements TEXT[] DEFAULT '{}',
      status VARCHAR(50) DEFAULT 'active',
      posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_date TIMESTAMP,
      posted_by VARCHAR(255)
    );`,
    
    // Exams table
    `CREATE TABLE IF NOT EXISTS exams (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      organization VARCHAR(255),
      org_short VARCHAR(50),
      category VARCHAR(100),
      last_date VARCHAR(100),
      posts VARCHAR(100),
      status VARCHAR(100),
      description TEXT,
      is_new BOOLEAN DEFAULT TRUE
    );`,
    
    // Blog posts table
    `CREATE TABLE IF NOT EXISTS blog_posts (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      category VARCHAR(100),
      author VARCHAR(255),
      cover_image VARCHAR(555),
      tags TEXT[] DEFAULT '{}',
      views INTEGER DEFAULT 0,
      published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    
    // Applications table
    `CREATE TABLE IF NOT EXISTS applications (
      id VARCHAR(255) PRIMARY KEY,
      job_id VARCHAR(255),
      user_id VARCHAR(255),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      resume_path VARCHAR(555),
      status VARCHAR(50) DEFAULT 'pending',
      applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    
    // Quizzes table
    `CREATE TABLE IF NOT EXISTS quizzes (
      id VARCHAR(255) PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      icon VARCHAR(100),
      color VARCHAR(50),
      bg_color VARCHAR(50),
      description TEXT,
      duration INTEGER DEFAULT 600,
      questions JSONB DEFAULT '[]'
    );`,

    // Discussion Forums table
    `CREATE TABLE IF NOT EXISTS forums (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      category VARCHAR(100),
      author VARCHAR(255) NOT NULL,
      author_id VARCHAR(255) NOT NULL,
      views INTEGER DEFAULT 0,
      replies INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Forum Answers table
    `CREATE TABLE IF NOT EXISTS forum_answers (
      id VARCHAR(255) PRIMARY KEY,
      forum_id VARCHAR(255) NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
      author VARCHAR(255) NOT NULL,
      author_id VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const queryStr of tables) {
    await pool.query(queryStr);
  }
  console.log('✅ PostgreSQL Schema Built successfully.');
};

const seedTables = async () => {
  // Check if users table is empty, if so, seed
  const userCheck = await pool.query('SELECT COUNT(*) FROM users');
  if (parseInt(userCheck.rows[0].count) === 0) {
    console.log('🌱 Seeding PostgreSQL default records...');
    
    // Create seed passwords
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('Admin@123', salt);
    const userPass = await bcrypt.hash('User@123', salt);
    
    // Seed users
    await pool.query(
      `INSERT INTO users (id, name, email, password, phone, role, created_at) VALUES 
       ($1, $2, $3, $4, $5, $6, NOW()),
       ($7, $8, $9, $10, $11, $12, NOW())`,
      [
        'mock-user-admin-id', 'Jharkhand Jobs Admin', 'admin@jharkhandjobs.com', adminPass, '9876543210', 'admin',
        'mock-user-demo-id', 'Rohan Kumar', 'rohan@gmail.com', userPass, '9123456789', 'user'
      ]
    );

    // Seed companies
    const companies = [
      ['c1', 'Tata Steel', 'Manufacturing', 45, true, false, '#005691'],
      ['c2', 'HCLTech', 'IT / Software', 38, true, false, '#2563EB'],
      ['c3', 'Tech Mahindra', 'IT / Software', 32, true, false, '#E11D48'],
      ['c4', 'Vedanta', 'Manufacturing', 25, true, false, '#059669'],
      ['c5', 'Cipla', 'Healthcare', 18, true, false, '#DC2626'],
      ['c6', 'Reliance Industries', 'Telecommunications', 50, true, false, '#1E3A8A'],
      ['c7', 'Deloitte', 'Consulting', 30, true, false, '#86EFAC'],
      ['c8', 'ITC Limited', 'FMCG', 20, true, false, '#D97706'],
      ['c9', 'Birlasoft', 'IT / Software', 22, true, false, '#7C3AED'],
      ['c10', 'L&T', 'Infrastructure', 40, true, false, '#EF4444'],
      ['c11', 'Jindal Steel', 'Manufacturing', 15, false, true, '#0B72B9'],
      ['c12', 'SAIL', 'Manufacturing', 12, false, true, '#1E40AF'],
      ['c13', 'ECI', 'Infrastructure', 10, false, true, '#4B5563'],
      ['c14', 'Piramal', 'Healthcare', 8, false, true, '#B45309'],
      ['c15', 'Godrej', 'FMCG', 14, false, true, '#10B981']
    ];

    for (const c of companies) {
      await pool.query(
        `INSERT INTO companies (id, name, industry, job_count, featured, recently_added, company_color) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        c
      );
    }

    // Seed Jobs
    const jobs = [
      [
        'mock-job-1-id', 'JSSC CGL Recruitment 2024', 'Jharkhand Staff Selection Commission (JSSC)', 'JSSC', '#1B8C0A', 
        'Ranchi, Jharkhand', 'Full Time', 35400, 112400, '₹', 'monthly', '0 - 2 Years', 'Graduation', 'New', 'Govt Jobs', 'Public Service',
        'Online application invited for JSSC CGL Combined Graduate Level examination for administrative posts.',
        ['Perform administrative and supervisory duties in state departments.', 'Implement government schemes and regulations at block levels.', 'Maintain registers and records for official audits.'],
        ['Bachelor\'s degree in any discipline from a recognized university.', 'Age between 21 and 35 years.', 'Knowledge of local customs and languages of Jharkhand.'],
        'active', '2026-05-26', '2026-06-24', 'mock-user-admin-id'
      ],
      [
        'mock-job-2-id', 'JPSC Civil Services Exam 2024', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Ranchi, Jharkhand', 'Full Time', 56100, 177500, '₹', 'monthly', '0 - 2 Years', 'Graduation', 'Featured', 'Govt Jobs', 'Public Service',
        'State civil services exams for administrative, police, and finance service cadres of Jharkhand.',
        ['Manage subdivision level governance and law enforcement assistance.', 'Coordinate state revenue collection and treasury audits.', 'Supervise administrative offices and public welfare delivery.'],
        ['Graduation degree from an accredited institution.', 'Strong knowledge of Indian administration and Jharkhand GK.', 'Physical standards eligibility for DSP cadres.'],
        'active', '2026-05-25', '2026-06-24', 'mock-user-admin-id'
      ],
      [
        'mock-job-3-id', 'RRB NTPC Graduate Vacancy 2024', 'Indian Railways', 'RRB', '#DC2626', 
        'All India', 'Full Time', 35400, 112400, '₹', 'monthly', '0 - 2 Years', 'Graduation', 'Popular', 'Govt Jobs', 'Transportation',
        'Non-Technical Popular Categories recruitment for Station Master, Goods Guard, and Commercial Clerks.',
        ['Supervise station operations and train movements.', 'Coordinate cargo logistics and safety protocols.', 'Manage reservation counters and public relations.'],
        ['University degree from any stream.', 'Excellent medical fitness and vision standards.', 'Successful clearance of CBT 1 and CBT 2 exams.'],
        'active', '2026-05-24', '2026-06-12', 'mock-user-admin-id'
      ],
      [
        'mock-job-4-id', 'IBPS Clerk Recruitment 2024', 'IBPS', 'IBPS', '#2563EB', 
        'All India', 'Full Time', 19900, 63200, '₹', 'monthly', '0 - 2 Years', 'Graduation', 'New', 'Govt Jobs', 'Banking',
        'Clerical cadre selection examination for public sector banks across India.',
        ['Handle cash receipts, ledger updates, and customer deposits.', 'Assist branch managers in document processing and loan files.', 'Promote retail banking services and address grievances.'],
        ['Bachelor\'s degree in commerce, arts, science or engineering.', 'Computer literacy certificate or operating skills.', 'Proficiency in the local state language.'],
        'active', '2026-05-23', '2026-06-11', 'mock-user-admin-id'
      ],
      [
        'mock-job-5-id', 'Jharkhand Police Constable 2024', 'Jharkhand Police', 'JHP', '#059669', 
        'Jharkhand', 'Full Time', 21700, 69100, '₹', 'monthly', '0 - 2 Years', '12th Pass', 'Featured', 'Govt Jobs', 'Security / Defense',
        'District level police constable recruitment for law enforcement and patrolling forces.',
        ['Maintain public order and local community safety.', 'Assist senior officers in active crime investigation.', 'Perform patrol beats and checkpost guard duties.'],
        ['10+2 / Intermediate pass from a recognized board.', 'Minimum height and chest measurement as per guidelines.', 'Ability to complete the 10km run in specified limits.'],
        'active', '2026-05-22', '2026-06-09', 'mock-user-admin-id'
      ]
    ];

    for (const j of jobs) {
      await pool.query(
        `INSERT INTO jobs (id, title, company, company_initial, company_color, location, type, salary_min, salary_max, salary_currency, salary_period, experience, qualification, badge_text, category, industry, description, responsibilities, requirements, status, posted_date, last_date, posted_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
        j
      );
    }

    // Seed Exams
    const exams = [
      ['e1', 'JSSC CGL Recruitment 2024', 'Jharkhand Staff Selection Commission', 'JSSC', 'Upcoming Exams', '18 May 2026', '2,018 Posts', 'Apply Now', 'Online application invited for JSSC CGL Combined Graduate Level examination for administrative posts.', true],
      ['e2', 'Jharkhand Police Constable Recruitment 2024', 'Jharkhand Staff Selection Commission', 'JSSC', 'Upcoming Exams', '20 May 2026', '4,919 Posts', 'Apply Now', 'Recruitment notice for constables in various districts of Jharkhand. Physical test followed by written test.', true],
      ['e3', 'JPSC Combined Civil Services Prelims 2024', 'Jharkhand Public Service Commission', 'JPSC', 'Upcoming Exams', '15 Jun 2026', '342 Posts', 'Apply Now', 'JPSC Combined Civil Services Prelims exam notifications for administrative, finance, and executive roles.', false],
      ['e4', 'JSSC CGL Admit Card 2024', 'Jharkhand Staff Selection Commission', 'JSSC', 'Admit Card', 'Released Now', '', 'Released', 'Admit card released. Download now from JSSC portal.', true],
      ['e5', 'JPSC Civil Services Prelims Result 2024', 'Jharkhand Public Service Commission', 'JPSC', 'Results', 'Declared Now', '', 'Declared', 'Result declared. Check your roll number and scores.', true]
    ];

    for (const e of exams) {
      await pool.query(
        `INSERT INTO exams (id, title, organization, org_short, category, last_date, posts, status, description, is_new) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        e
      );
    }

    // Seed blog posts
    const blogs = [
      [
        'b1', 'How to Crack JSSC CGL: Ultimate Prep Guide', 'how-to-crack-jssc-cgl-ultimate-prep-guide',
        'Crack the Jharkhand Staff Selection Commission CGL exam with our comprehensive guide covering syllabus, patterns, and tips.',
        '<h3>Introduction</h3><p>The JSSC CGL exam is highly competitive...</p>',
        'Career Guide', 'Exam Expert Team', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop',
        ['JSSC', 'Govt Jobs', 'Preparation'], 124
      ],
      [
        'b2', 'Top 10 High-Paying IT Jobs in Ranchi', 'top-10-high-paying-it-jobs-in-ranchi',
        'Explore the fast-growing technology sector in Ranchi and discover the top roles offering the best salaries.',
        '<h3>Ranchi\'s Growing Tech Scene</h3><p>Ranchi is emerging as a promising tech hub...</p>',
        'Industry Trends', 'Job Market Analyst', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
        ['IT Jobs', 'Ranchi', 'Tech Careers'], 89
      ],
      [
        'b3', 'Writing the Perfect Resume: A Step-by-Step Walkthrough', 'writing-the-perfect-resume-step-by-step-walkthrough',
        'Land more interviews with a modern, professional resume. Learn the exact formatting recruiters look for.',
        '<h3>Your Resume is Your First Impression</h3><p>Recruiters spend an average of 6 seconds...</p>',
        'Tips & Tricks', 'HR Recruiter Specialist', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
        ['Resume Tips', 'Interview', 'Career advice'], 245
      ]
    ];

    for (const b of blogs) {
      await pool.query(
        `INSERT INTO blog_posts (id, title, slug, excerpt, content, category, author, cover_image, tags, views) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        b
      );
    }

    // Seed Quizzes
    const quizzes = [
      [
        'q1', 'jharkhand-gk', 'Jharkhand GK', 'BookOpen', '#1B8C0A', '#E8F5E3',
        'History, geography, culture, and landmarks of Jharkhand state.', 600,
        JSON.stringify([
          {
            question: 'When was the state of Jharkhand officially carved out of Bihar?',
            options: ['15 November 2000', '1 November 2000', '26 January 2001', '15 August 2000'],
            answer: 0,
            explanation: 'Jharkhand was officially formed on 15 November 2000, Birsa Munda\'s birth anniversary.'
          },
          {
            question: 'Which city is known as the "Steel City" of Jharkhand?',
            options: ['Ranchi', 'Dhanbad', 'Jamshedpur', 'Bokaro'],
            answer: 2,
            explanation: 'Jamshedpur founded by Jamsetji Tata is known as the Steel City.'
          }
        ])
      ],
      [
        'q2', 'general-knowledge', 'General Knowledge', 'HelpCircle', '#2563EB', '#EFF6FF',
        'Polity, constitution, history, and geography of India.', 600,
        JSON.stringify([
          {
            question: 'Who is regarded as the Father of the Indian Constitution?',
            options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad'],
            answer: 1,
            explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee.'
          }
        ])
      ]
    ];

    for (const q of quizzes) {
      await pool.query(
        `INSERT INTO quizzes (id, key, title, icon, color, bg_color, description, duration, questions) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        q
      );
    }

    // Seed Forums
    const forums = [
      ['f1', 'How to prepare for JPSC Civil Services Exam 2024?', 'how-to-prepare-for-jpsc-2024', 'Govt Jobs', 'Aaspirant_JH01', 'mock-user-demo-id', 75, 2],
      ['f2', 'Which courses are best after 12th for government jobs?', 'which-courses-best-after-12th', 'Career Guidance', 'Riya Kumari', 'mock-user-demo-id', 124, 1],
      ['f3', 'How to crack JSSC CGL in first attempt?', 'how-to-crack-jssc-cgl-first-attempt', 'Exam Preparation', 'Abhishek-Kr', 'mock-user-demo-id', 90, 1]
    ];

    for (const f of forums) {
      await pool.query(
        `INSERT INTO forums (id, title, slug, category, author, author_id, views, replies) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        f
      );
    }

    // Seed Forum Answers
    const answers = [
      ['a1', 'f1', 'Jharkhand Jobs Admin', 'mock-user-admin-id', 'The best way is to focus on Jharkhand GK (40 questions in Paper 3) and practice tribal languages.'],
      ['a2', 'f1', 'Rohan Kumar', 'mock-user-demo-id', 'Highly recommend reading local publications and past papers of JPSC exams.'],
      ['a3', 'f2', 'Jharkhand Jobs Admin', 'mock-user-admin-id', 'Bachelor in Arts (Polity/History) or Graduation in Computer Applications is highly beneficial.'],
      ['a4', 'f3', 'Rohan Kumar', 'mock-user-demo-id', 'Regular mock testing and speed optimization on Paper 3 are the core elements.']
    ];

    for (const a of answers) {
      await pool.query(
        `INSERT INTO forum_answers (id, forum_id, author, author_id, content) 
         VALUES ($1, $2, $3, $4, $5)`,
        a
      );
    }

    console.log('🌲 PostgreSQL Seeding Finished successfully.');
  } else {
    console.log('👍 PostgreSQL tables already populated. Skipping seed data insertion.');
  }
};
