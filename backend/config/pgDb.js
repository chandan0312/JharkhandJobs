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

    // Migrate existing job categories to specific classifications
    await runCategoryMigrations();
    
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
      profile_data TEXT DEFAULT '{}',
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
      vacancies INTEGER DEFAULT 45,
      posted_by VARCHAR(255),
      apply_link VARCHAR(555) DEFAULT '',
      pdf_url VARCHAR(555) DEFAULT ''
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
      is_new BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      apply_link VARCHAR(555) DEFAULT '',
      pdf_url VARCHAR(555) DEFAULT '',
      exam_date VARCHAR(100) DEFAULT ''
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
    );`,

    // Enquiries table
    `CREATE TABLE IF NOT EXISTS enquiries (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Subscribers table
    `CREATE TABLE IF NOT EXISTS subscribers (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const queryStr of tables) {
    await pool.query(queryStr);
  }
  // Ensure profile_data column exists dynamically
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_data TEXT DEFAULT '{}';`);
  // Ensure vacancies column exists dynamically on jobs
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vacancies INTEGER DEFAULT 45;`);
  // Ensure updated_at column exists dynamically on jobs
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  // Ensure created_at and updated_at columns exist dynamically on exams
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  // Ensure apply_link column exists dynamically on jobs
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_link VARCHAR(555) DEFAULT '';`);
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(555) DEFAULT '';`);
  // Ensure apply_link and pdf_url columns exist dynamically on exams
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS apply_link VARCHAR(555) DEFAULT '';`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(555) DEFAULT '';`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_date VARCHAR(100) DEFAULT '';`);
  console.log('✅ PostgreSQL Schema Built successfully.');
};

const seedTables = async () => {
  // Check if companies table is empty, if so, seed
  const companyCheck = await pool.query('SELECT COUNT(*) FROM companies');
  if (parseInt(companyCheck.rows[0].count) === 0) {
    console.log('🌱 Seeding PostgreSQL default records...');

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
        'job-1', 'Combined Civil Services (Deputy Collector, DSP, etc.)', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher / Experienced', 'Graduate', 'Recruitment Ongoing', 'Govt Jobs', 'Public Service',
        'Jharkhand Public Service Commission (JPSC) invites applications for the Combined Civil Services Examination to recruit Deputy Collectors, DSPs, and other executive officers.',
        ['Prelims Exam: Objective type questions on General Studies (Paper I & II).', 'Mains Exam: Written descriptive papers on core subjects and local languages.', 'Interview: Personality test and viva-voce.'],
        ['Must hold a Bachelor\'s degree in any discipline from a recognized university.', 'Age must meet JPSC Civil Services eligibility guidelines.', 'Must satisfy physical standards eligibility for DSP and other uniformed services.'],
        'active', '2026-05-28', '2026-12-31', 103, 'mock-user-admin-id'
      ],
      [
        'job-2', 'JTGLCCE (Assistant, Inspector & Others)', 'Jharkhand Staff Selection Commission (JSSC)', 'JSSC', '#1B8C0A', 
        'Jharkhand, India', 'Full Time', 35400, 112400, '₹', 'monthly', 'Fresher / Experienced', 'B.Sc / M.Sc / B.Pharm / Graduate (Post-wise)', 'Apply Online', 'Govt Jobs', 'Public Service',
        'Jharkhand Staff Selection Commission (JSSC) invites online applications for JTGLCCE to recruit Assistants, Inspectors, and other technical graduate posts.',
        ['Perform administrative and technical supervisory duties in designated state departments.', 'Implement government schemes, checks, and regulations at block levels.', 'Review and maintain records/files for technical and general audits.'],
        ['Graduation or Post-Graduation in B.Sc, M.Sc, B.Pharm, or specific streams matching the post details.', 'Age must fit the JSSC JTGLCCE regulations.', 'Knowledge of local customs and languages of Jharkhand is required.'],
        'active', '2026-05-27', '2026-06-30', 611, 'mock-user-admin-id'
      ],
      [
        'job-3', 'Polytechnic Lecturer', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 56100, 79800, '₹', 'monthly', 'Fresher / Experienced', 'B.E. / B.Tech / M.Tech', 'New', 'Govt Jobs', 'Education / Teaching',
        'Recruitment of Lecturers in government polytechnic institutes across Jharkhand state.',
        ['Deliver technical curriculum and instructions in engineering/science disciplines.', 'Manage laboratory equipment and supervise practical experiment sessions.', 'Assess student performance, assignments, and participate in academic mentoring.'],
        ['B.E. / B.Tech / M.Tech in relevant engineering discipline with first class or equivalent.', 'Strong subject matter expertise and academic teaching capabilities.'],
        'active', '2026-05-26', null, 349, 'mock-user-admin-id'
      ],
      [
        'job-5', 'Teacher Eligibility Test (JTET)', 'Jharkhand Academic Council (JAC)', 'JAC', '#7C3AED', 
        'Jharkhand, India', 'Full Time', 0, 0, '₹', 'monthly', 'Fresher / Experienced', 'D.El.Ed / B.Ed', 'Eligibility Exam', 'Govt Jobs', 'Education / Teaching',
        'Jharkhand Academic Council conducts the Teacher Eligibility Test (JTET) to certify primary and middle school teachers in the state.',
        ['Qualifying exam to assess eligibility of primary (Class I-V) and middle (Class VI-VIII) school teachers.', 'Demonstrate proper teaching quality standards as per NCTE rules.'],
        ['D.El.Ed or B.Ed qualification from a recognized NCTE college.', 'Passed secondary or senior secondary with minimum aggregate marks.'],
        'active', '2026-05-24', null, 0, 'mock-user-admin-id'
      ],
      [
        'job-6', 'Assistant Professor (Engineering)', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 57700, 182400, '₹', 'monthly', 'Fresher / Experienced', 'M.Tech / PhD', 'JPSC Faculty', 'Govt Jobs', 'Education / Teaching',
        'Jharkhand Public Service Commission invites applications for Assistant Professor vacancies in Government Engineering Colleges.',
        ['Engage in academic lectures, curriculum development, and laboratory guidance.', 'Mentor undergraduate students and publish technical papers in indexed journals.', 'Participate in college department committees and accreditation tasks.'],
        ['M.Tech or PhD in relevant engineering stream from a recognized university.', 'Cleared national-level eligibility certifications (NET/SLET) where applicable.'],
        'active', '2026-05-23', null, 45, 'mock-user-admin-id'
      ],
      [
        'job-7', 'Lecturer (Govt Polytechnic)', 'Jharkhand Public Service Commission (JPSC)', 'JPSC', '#005691', 
        'Jharkhand, India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher / Experienced', 'Engineering Degree', 'Ongoing', 'Govt Jobs', 'Education / Teaching',
        'Recruitment for engineering and non-engineering lecturers in state government polytechnics under JPSC.',
        ['Deliver technical curriculum lectures and supervise practical lab experiments.', 'Assist in college administrative tasks, semester examinations, and quality assurance.'],
        ['Bachelor\'s Degree in Engineering/Technology in relevant branch with First Class.', 'Age limits and relaxations as per government directives.'],
        'active', '2026-05-22', null, 50, 'mock-user-admin-id'
      ],
      [
        'job-8', 'Group B & C Posts', 'Staff Selection Commission (SSC)', 'SSC', '#1A73E8', 
        'All India', 'Full Time', 35400, 112400, '₹', 'monthly', 'Fresher / Experienced', 'Graduate', 'Apply Online', 'Govt Jobs', 'Public Service',
        'Staff Selection Commission (SSC) conducts recruitment for various Group B & C posts across ministries and departments of the Government of India.',
        ['Assist in administrative duties in ministries.', 'Maintain files and reports.', 'Implement government policies under senior supervision.'],
        ['Must hold a Bachelor\'s degree in any discipline from a recognized university.', 'Age must be between 18-30 years as per post requirements.', 'Indian citizenship is mandatory.'],
        'active', '2026-05-21', '2026-06-22', 12256, 'mock-user-admin-id'
      ],
      [
        'job-9', 'Assistant Loco Pilot', 'Railway Recruitment Board (RRB)', 'Railway', '#D97706', 
        'All India', 'Full Time', 19900, 35000, '₹', 'monthly', 'Fresher', 'ITI / Diploma', 'Apply Online', 'Govt Jobs', 'Railways',
        'Railway Recruitment Board (RRB) invites applications for the recruitment of Assistant Loco Pilots (ALP) in Indian Railways.',
        ['Assist in operating trains under the supervision of Loco Pilots.', 'Check the mechanical/electrical condition of locomotives.', 'Follow safety directives and rail signals carefully.'],
        ['10th Pass + ITI or Diploma in Engineering streams.', 'Must meet strict medical standard (A1 visual standards).'],
        'active', '2026-05-20', '2026-06-14', 11127, 'mock-user-admin-id'
      ],
      [
        'job-10', 'Combined Defence Services', 'Union Public Service Commission (UPSC)', 'UPSC', '#9333EA', 
        'All India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher', 'Graduate', 'Apply Online', 'Govt Jobs', 'Defense / Security',
        'Union Public Service Commission (UPSC) conducts Combined Defence Services (CDS) Exam for admission into IMA, INA, AFA, and OTA.',
        ['Undergo military officer training program.', 'Serve as a commissioned officer in the Indian Armed Forces.'],
        ['Graduation degree in relevant streams (Engineering for Navy/Air Force, any discipline for Army).', 'Unmarried males/females matching UPSC age specifications.'],
        'active', '2026-05-19', '2026-06-09', 451, 'mock-user-admin-id'
      ],
      [
        'job-11', 'National Defence Academy', 'Union Public Service Commission (UPSC)', 'UPSC', '#9333EA', 
        'All India', 'Full Time', 56100, 177500, '₹', 'monthly', 'Fresher', '12th Pass', 'Apply Online', 'Govt Jobs', 'Defense / Security',
        'Union Public Service Commission (UPSC) conducts NDA & NA Exam for entry into Army, Navy and Air Force wings of National Defence Academy.',
        ['Undergo basic defense and academic education training.', 'Serve in Indian Army, Navy, or Air Force.'],
        ['12th Class Pass (with Physics and Mathematics for Air Force and Navy).', 'Unmarried male/female candidates.'],
        'active', '2026-05-18', '2026-06-09', 394, 'mock-user-admin-id'
      ],
      [
        'job-12', 'Flying & Ground Duty', 'Indian Air Force (IAF)', 'IAF', '#2563EB', 
        'All India', 'Full Time', 56100, 110000, '₹', 'monthly', 'Fresher', 'Graduate / BE', 'Apply Online', 'Govt Jobs', 'Defense / Security',
        'Indian Air Force (IAF) invites applications for Flying Branch and Ground Duty (Technical and Non-Technical) branches through AFCAT entry.',
        ['Fulfill flying operations or supervise aeronautical technical/non-technical operations.', 'Manage command systems and ground logistics.'],
        ['Bachelor Degree in any stream with Physics & Math at 10+2, or B.E./B.Tech.', 'Age limits: 20-24 years for Flying, 20-26 years for Ground Duty.'],
        'active', '2026-05-17', '2026-06-19', 379, 'mock-user-admin-id'
      ],
      [
        'job-13', 'Graduate/Diploma/Trade Apprentice', 'Northern Coalfields Limited (NCL)', 'NCL', '#059669', 
        'Singrauli, MP/UP', 'Full Time', 8000, 10000, '₹', 'monthly', 'Fresher', 'ITI / Diploma / Degree', 'Ongoing', 'Govt Jobs', 'Mining / Public Enterprise',
        'Northern Coalfields Limited (NCL) invites online applications for Graduate, Diploma, and Trade Apprentice training positions.',
        ['Undergo technical training in designated engineering trades.', 'Assist in site mining operational units.'],
        ['ITI in relevant trade, Diploma, or Degree in Engineering.', 'Must register on NATS/NAPS portal.'],
        'active', '2026-05-16', null, 1607, 'mock-user-admin-id'
      ],
      [
        'job-14', 'Group B & C Posts', 'Delhi Subordinate Services Selection Board (DSSSB)', 'DSSSB', '#DC2626', 
        'Delhi, India', 'Full Time', 21700, 81100, '₹', 'monthly', 'Fresher / Experienced', '10th / 12th / Graduate', 'Starting June 16', 'Govt Jobs', 'Public Service',
        'DSSSB releases advertisement No. 03/2026 for various Group B & C vacancies in departments of GNCTD. Applications start from June 16.',
        ['Perform general administration, checking, and files clerical work.', 'Execute department field operations.'],
        ['10th/12th pass or Graduate from a recognized Board/University (Post-wise criteria).'],
        'active', '2026-05-15', '2026-07-16', 1979, 'mock-user-admin-id'
      ],
      [
        'job-15', 'Management Trainee', 'Coal India Limited (CIL)', 'CIL', '#059669', 
        'Kolkata, India', 'Full Time', 50000, 160000, '₹', 'monthly', 'Fresher', 'Engineering / MBA', 'Apply Online', 'Govt Jobs', 'Public Sector Undertaking (PSU)',
        'Coal India Limited (CIL) recruits Management Trainees in disciplines of Mining, Civil, Mechanical, System, HR, Marketing, etc.',
        ['Executive supervisory duties in designated disciplines.', 'Ensure project compliance, safety norms, and field efficiency.'],
        ['B.E./B.Tech/B.Sc Engineering, or MBA/PG Diploma with minimum 60% marks.'],
        'active', '2026-05-14', '2026-06-11', 660, 'mock-user-admin-id'
      ],
      [
        'job-16', 'Agniveer GD/Technical/Clerk', 'Indian Army', 'Army', '#1B8C0A', 
        'All India', 'Full Time', 30000, 40000, '₹', 'monthly', 'Fresher', '10th / 12th / ITI', 'Exam Ongoing', 'Govt Jobs', 'Defense / Security',
        'Indian Army conducts online common entrance exam (CEE) for recruiting Agniveers in General Duty, Technical, Clerk/Store Keeper, and Tradesmen categories.',
        ['Serve in primary field/combat/trades duties under the Agniveer scheme.', 'Maintain high physical training and security discipline.'],
        ['10th Pass (GD), 12th Pass (Technical/Clerk), 8th/10th Pass (Tradesmen).', 'Age: 17.5 to 21 years.'],
        'active', '2026-05-13', null, 25000, 'mock-user-admin-id'
      ],
      [
        'job-17', 'General Duty Doctor', 'Civil Surgeon Office East Singhbhum', 'CSOES', '#059669',
        'East Singhbhum, Jharkhand', 'Full Time', 45000, 65000, '₹', 'monthly', 'Fresher / Experienced', 'MBBS', 'Walk-in Interview', 'Jharkhand', 'Healthcare / Medical',
        'Walk-in interview for the recruitment of General Duty Doctors under District Health Society, East Singhbhum, Jamshedpur.',
        ['Provide clinical care and medical services in district hospitals.', 'Supervise outdoor and indoor patient departments.', 'Assist in implementation of state healthcare programs.'],
        ['Must hold an MBBS degree from a recognized MCI college.', 'Valid registration certificate from state medical council.'],
        'active', '2026-06-03', '2026-06-10', 5, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/civil-surgeon-office-east-singhbhum-general-duty-doctor-recruitment-2026-walkin-3052542'
      ],
      [
        'job-18', 'Non Faculty Posts (Group B & C)', 'AIIMS Deoghar', 'AIIMSD', '#7C3AED',
        'Deoghar, Jharkhand', 'Full Time', 35400, 112400, '₹', 'monthly', 'Experienced', 'Graduate / Diploma / 12th', 'Apply Offline', 'Jharkhand', 'Healthcare / Administration',
        'Offline applications are invited for recruitment to various Non-Faculty Group B and C posts on deputation basis at AIIMS Deoghar.',
        ['Execute daily administrative and clinical support workflows.', 'Maintain registers and records under supervision of senior officers.', 'Coordinate departmental tasks across hospital wings.'],
        ['Graduate, Diploma, or 12th pass matching specific post criteria.', 'Experience in government health departments or public undertakings is preferred.'],
        'active', '2026-06-03', '2026-07-03', 11, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/aiims-deoghar-non-faculty-recruitment-2026-apply-offline-for-11-posts-3050225'
      ],
      [
        'job-19', 'Technician (Group II)', 'CSIR - Central Institute of Mining and Fuel Research', 'CIMFR', '#2563EB',
        'Dhanbad, Jharkhand', 'Full Time', 19900, 63200, '₹', 'monthly', 'Fresher / Experienced', '10th Pass + ITI', 'Apply Online', 'Jharkhand', 'Mining / Technical',
        'CSIR-CIMFR, Dhanbad invites online applications from enthusiastic Indian nationals for recruitment of Technicians (Group II) in various trades.',
        ['Operate laboratory mining apparatus and trade equipment.', 'Follow standard chemical and safety protocols under team leads.', 'Log experiment observations and daily testing statistics.'],
        ['10th class pass with science subjects from a recognized board.', 'Valid ITI certificate in relevant trade (Electrical, Fitter, etc.).'],
        'active', '2026-05-20', '2026-06-19', 30, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/csir-cimfr-technician-recruitment-2026-apply-online-for-30-posts-3049841'
      ],
      [
        'job-20', 'IT Executive', 'District Health Society Jharkhand', 'DHSJH', '#0891B2',
        'Jharkhand, India', 'Full Time', 22000, 30000, '₹', 'monthly', 'Fresher / Experienced', 'B.Tech / B.E / M.Sc', 'Apply Online', 'Jharkhand', 'IT / Healthcare Support',
        'Recruitment of IT Executives on contractual basis for Medical Colleges and District Hospitals under Jharkhand Health Department.',
        ['Manage IT hardware, local area networks, and hospital information systems.', 'Provide technical support for state tele-medicine and digital health portals.', 'Maintain system backups and troubleshoot hardware faults.'],
        ['B.Tech/B.E in Computer Science/IT or M.Sc in IT/Electronics.', 'Hands-on experience with hardware troubleshooting and basic SQL queries.'],
        'active', '2026-05-13', '2026-06-25', 29, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/medical-college-and-district-hospital-jharkhand-it-executive-recruitment-2026-apply-online-for-29-posts-3048894'
      ]
    ];

    for (const j of jobs) {
      const applyLink = j[24] || '';
      const params = j.slice(0, 24).concat([applyLink]);
      await pool.query(
        `INSERT INTO jobs (id, title, company, company_initial, company_color, location, type, salary_min, salary_max, salary_currency, salary_period, experience, qualification, badge_text, category, industry, description, responsibilities, requirements, status, posted_date, last_date, vacancies, posted_by, apply_link) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`,
        params
      );
    }

    // Seed Exams
    const exams = [
      ['e1', 'Combined Civil Services (Deputy Collector, DSP, etc.)', 'Jharkhand Public Service Commission', 'JPSC', 'Upcoming Exams', 'Recruitment Ongoing', '103 Posts', 'Apply Now', 'Selection Process: Prelims + Mains + Interview. Open to graduates. Source: JPSC (https://www.jpsc.gov.in)', true],
      ['e2', 'JTGLCCE (Assistant, Inspector & Others)', 'Jharkhand Staff Selection Commission', 'JSSC', 'Upcoming Exams', '30 Jun 2026', '611 Posts', 'Apply Now', 'Selection Process: Written Exam. B.Sc / M.Sc / B.Pharm / Graduate (Post-wise). Source: FreeJobAlert (https://www.freejobalert.com)', true],
      ['e3', 'Polytechnic Lecturer', 'Jharkhand Public Service Commission', 'JPSC', 'Upcoming Exams', 'As per Notification', '349+ Posts', 'Apply Now', 'Selection Process: Written + Interview. B.E./B.Tech / M.Tech. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e5', 'Teacher Eligibility Test (JTET)', 'Jharkhand Academic Council', 'JAC', 'Upcoming Exams', 'Registration Closing', 'Eligibility Exam', 'Apply Now', 'Selection Process: Written Exam. D.El.Ed/B.Ed. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e6', 'Assistant Professor (Engineering)', 'Jharkhand Public Service Commission', 'JPSC', 'Admit Card', 'Ongoing', 'Multiple Posts', 'Apply Now', 'Selection Process: Interview/Written. M.Tech/PhD. Source: JPSC (https://www.jpsc.gov.in)', false],
      ['e7', 'Lecturer (Govt Polytechnic)', 'Jharkhand Public Service Commission', 'JPSC', 'Admit Card', 'Ongoing', 'Multiple Posts', 'Apply Now', 'Selection Process: Written + Interview. Engineering Degree. Source: JPSC (https://www.jpsc.gov.in)', false],
      ['e8', 'Group B & C Posts', 'Staff Selection Commission', 'SSC', 'Upcoming Exams', '22 Jun 2026', '12,256 Posts', 'Apply Now', 'Selection Process: Tier 1 + Tier 2 Computer Based Exams. Open to graduates. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e9', 'Assistant Loco Pilot', 'Railway Recruitment Board', 'Railway', 'Admit Card', '14 Jun 2026', '11,127 Posts', 'Apply Now', 'Selection Process: CBT 1 & 2 + CBAT + Document Verification. ITI/Diploma. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e10', 'Combined Defence Services', 'Union Public Service Commission', 'UPSC', 'Results', '9 Jun 2026', '451 Posts', 'Apply Now', 'Selection Process: Written Exam + SSB Interview. Open to graduates. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e11', 'National Defence Academy', 'Union Public Service Commission', 'UPSC', 'Admit Card', '9 Jun 2026', '394 Posts', 'Apply Now', 'Selection Process: Written Exam + SSB Interview. Open to 12th pass. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e12', 'Flying & Ground Duty', 'Indian Air Force', 'IAF', 'Results', '19 Jun 2026', '379 Posts', 'Apply Now', 'Selection Process: Written Exam + AFSB Testing. Open to graduates/BE. Source: Navbharat Times (https://navbharattimes.indiatimes.com)', true],
      ['e13', 'Graduate/Diploma/Trade Apprentice', 'Northern Coalfields Limited', 'NCL', 'Results', 'Ongoing', '1,607 Posts', 'Apply Now', 'Selection Process: Merit List based on Marks. ITI/Diploma/Degree. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e14', 'Group B & C Posts', 'Delhi Subordinate Services Selection Board', 'DSSSB', 'Results', 'Applications Start 16 Jun', '1,979 Posts', 'Notification Out', 'Selection Process: Written Examination. Open to 10th/12th/Graduates. Source: The Times of India (https://timesofindia.indiatimes.com)', true],
      ['e15', 'Management Trainee', 'Coal India Limited', 'CIL', 'Results', '11 Jun 2026', '660 Posts', 'Apply Now', 'Selection Process: GATE Score / CBT + Interview. Engineering/MBA. Source: Career Power (https://www.careerpower.in)', true],
      ['e16', 'Agniveer GD/Technical/Clerk', 'Indian Army', 'Army', 'Admit Card', 'Exam Ongoing', 'Thousands', 'Admit Card Out', 'Selection Process: Online CEE + Physical Fitness Test. Open to 10th/12th/ITI. Source: The Times of India (https://timesofindia.indiatimes.com)', true]
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

const runCategoryMigrations = async () => {
  console.log('🔄 Running SQL category migrations...');
  try {
    // 1. Update Govt Jobs based on company_initial
    await pool.query(`
      UPDATE jobs 
      SET category = 'Jharkhand' 
      WHERE category IN ('Govt Jobs', 'Govt') 
        AND company_initial IN ('JPSC', 'JSSC', 'JAC', 'JHGD');
    `);
    
    await pool.query(`
      UPDATE jobs 
      SET category = 'SSC' 
      WHERE category IN ('Govt Jobs', 'Govt') 
        AND company_initial = 'SSC';
    `);

    await pool.query(`
      UPDATE jobs 
      SET category = 'UPSC' 
      WHERE category IN ('Govt Jobs', 'Govt') 
        AND company_initial = 'UPSC';
    `);

    await pool.query(`
      UPDATE jobs 
      SET category = 'Railway' 
      WHERE category IN ('Govt Jobs', 'Govt') 
        AND company_initial IN ('Railway', 'RRB');
    `);

    await pool.query(`
      UPDATE jobs 
      SET category = 'Other State' 
      WHERE category IN ('Govt Jobs', 'Govt') 
        AND company_initial IN ('IAF', 'DSSSB', 'CIL', 'NCL', 'Army', 'Defence');
    `);

    // Fallback for location/other fields
    await pool.query(`
      UPDATE jobs 
      SET category = 'Jharkhand' 
      WHERE category IN ('Govt Jobs', 'Govt') 
        AND (location ILIKE '%Jharkhand%' OR company ILIKE '%Jharkhand%');
    `);

    await pool.query(`
      UPDATE jobs 
      SET category = 'Other State' 
      WHERE category IN ('Govt Jobs', 'Govt');
    `);

    // 2. Map Private/Private Jobs to 'Private'
    await pool.query(`
      UPDATE jobs 
      SET category = 'Private' 
      WHERE category IN ('Private Jobs', 'Private');
    `);

    // 3. Insert new live Jharkhand jobs if they don't already exist
    const newJobsToInsert = [
      [
        'job-17', 'General Duty Doctor', 'Civil Surgeon Office East Singhbhum', 'CSOES', '#059669',
        'East Singhbhum, Jharkhand', 'Full Time', 45000, 65000, '₹', 'monthly', 'Fresher / Experienced', 'MBBS', 'Walk-in Interview', 'Jharkhand', 'Healthcare / Medical',
        'Walk-in interview for the recruitment of General Duty Doctors under District Health Society, East Singhbhum, Jamshedpur.',
        ['Provide clinical care and medical services in district hospitals.', 'Supervise outdoor and indoor patient departments.', 'Assist in implementation of state healthcare programs.'],
        ['Must hold an MBBS degree from a recognized MCI college.', 'Valid registration certificate from state medical council.'],
        'active', '2026-06-03', '2026-06-10', 5, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/civil-surgeon-office-east-singhbhum-general-duty-doctor-recruitment-2026-walkin-3052542'
      ],
      [
        'job-18', 'Non Faculty Posts (Group B & C)', 'AIIMS Deoghar', 'AIIMSD', '#7C3AED',
        'Deoghar, Jharkhand', 'Full Time', 35400, 112400, '₹', 'monthly', 'Experienced', 'Graduate / Diploma / 12th', 'Apply Offline', 'Jharkhand', 'Healthcare / Administration',
        'Offline applications are invited for recruitment to various Non-Faculty Group B and C posts on deputation basis at AIIMS Deoghar.',
        ['Execute daily administrative and clinical support workflows.', 'Maintain registers and records under supervision of senior officers.', 'Coordinate departmental tasks across hospital wings.'],
        ['Graduate, Diploma, or 12th pass matching specific post criteria.', 'Experience in government health departments or public undertakings is preferred.'],
        'active', '2026-06-03', '2026-07-03', 11, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/aiims-deoghar-non-faculty-recruitment-2026-apply-offline-for-11-posts-3050225'
      ],
      [
        'job-19', 'Technician (Group II)', 'CSIR - Central Institute of Mining and Fuel Research', 'CIMFR', '#2563EB',
        'Dhanbad, Jharkhand', 'Full Time', 19900, 63200, '₹', 'monthly', 'Fresher / Experienced', '10th Pass + ITI', 'Apply Online', 'Jharkhand', 'Mining / Technical',
        'CSIR-CIMFR, Dhanbad invites online applications from enthusiastic Indian nationals for recruitment of Technicians (Group II) in various trades.',
        ['Operate laboratory mining apparatus and trade equipment.', 'Follow standard chemical and safety protocols under team leads.', 'Log experiment observations and daily testing statistics.'],
        ['10th class pass with science subjects from a recognized board.', 'Valid ITI certificate in relevant trade (Electrical, Fitter, etc.).'],
        'active', '2026-05-20', '2026-06-19', 30, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/csir-cimfr-technician-recruitment-2026-apply-online-for-30-posts-3049841'
      ],
      [
        'job-20', 'IT Executive', 'District Health Society Jharkhand', 'DHSJH', '#0891B2',
        'Jharkhand, India', 'Full Time', 22000, 30000, '₹', 'monthly', 'Fresher / Experienced', 'B.Tech / B.E / M.Sc', 'Apply Online', 'Jharkhand', 'IT / Healthcare Support',
        'Recruitment of IT Executives on contractual basis for Medical Colleges and District Hospitals under Jharkhand Health Department.',
        ['Manage IT hardware, local area networks, and hospital information systems.', 'Provide technical support for state tele-medicine and digital health portals.', 'Maintain system backups and troubleshoot hardware faults.'],
        ['B.Tech/B.E in Computer Science/IT or M.Sc in IT/Electronics.', 'Hands-on experience with hardware troubleshooting and basic SQL queries.'],
        'active', '2026-05-13', '2026-06-25', 29, 'mock-user-admin-id',
        'https://www.freejobalert.com/articles/medical-college-and-district-hospital-jharkhand-it-executive-recruitment-2026-apply-online-for-29-posts-3048894'
      ]
    ];

    for (const j of newJobsToInsert) {
      const check = await pool.query('SELECT COUNT(*) FROM jobs WHERE id = $1', [j[0]]);
      if (parseInt(check.rows[0].count) === 0) {
        console.log(`🌱 Migration inserting new live job: ${j[1]}`);
        const applyLink = j[24] || '';
        const params = j.slice(0, 24).concat([applyLink]);
        await pool.query(
          `INSERT INTO jobs (id, title, company, company_initial, company_color, location, type, salary_min, salary_max, salary_currency, salary_period, experience, qualification, badge_text, category, industry, description, responsibilities, requirements, status, posted_date, last_date, vacancies, posted_by, apply_link) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`,
          params
        );
      }
    }

    // 4. Delete expired jobs and exams
    await pool.query("DELETE FROM jobs WHERE id = 'job-4' OR last_date < NOW()::date;");
    await pool.query("DELETE FROM exams WHERE id = 'e4' OR (last_date = '4 Jun 2026' AND org_short = 'JHGD');");
    console.log('🗑️ Expired job and exam posts removed successfully from database.');

    console.log('✅ SQL category migrations completed successfully.');
  } catch (error) {
    console.error('❌ SQL category migrations error:', error.message);
  }
};
