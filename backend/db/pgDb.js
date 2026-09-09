import pg from 'pg';
const { Pool } = pg;
import bcrypt from 'bcryptjs';

import * as mysqlDb from './mysqlDb.js';

let pool = null;
let isConnected = false;

export const initPgDb = async () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jharkhand_jobs';
  
  console.log('🔌 Attempting connection to PostgreSQL Database...');
  
  pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 4000,
  });

  try {
    const client = await pool.connect();
    console.log('🚀 PostgreSQL Database Connected successfully!');
    client.release();
    isConnected = true;
    global.useMockDb = false;
    global.usePgDb = true;

    // Run Schema DDL scripts
    await runDDL();
    
    return true;
  } catch (error) {
    isConnected = false;
    global.usePgDb = false;
    return false;
  }
};

export const getPool = () => {
  if (global.useMysqlDb) return mysqlDb.getPool();
  if (!isConnected) return null;
  return pool;
};

export const query = async (text, params) => {
  if (global.useMysqlDb) {
    return mysqlDb.query(text, params);
  }
  if (!isConnected) {
    throw new Error('Database is not connected. Attempted query on disconnected pool.');
  }
  return pool.query(text, params);
};

export const runDDL = async () => {
  console.log('⚙️  Running PostgreSQL Schema Builders...');
  
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      mobile VARCHAR(50) DEFAULT '',
      role VARCHAR(50) DEFAULT 'user',
      google_id VARCHAR(255) UNIQUE,
      profile_image TEXT DEFAULT '',
      email_verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT DEFAULT NULL,
      reset_password_token TEXT DEFAULT NULL,
      reset_password_expires TIMESTAMP DEFAULT NULL,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

  // Ensure profile_data & auth columns exist dynamically
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_data TEXT DEFAULT '{}';`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(50) DEFAULT '';`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT DEFAULT '';`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT DEFAULT NULL;`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token TEXT DEFAULT NULL;`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP DEFAULT NULL;`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  // Ensure vacancies & link columns exist dynamically
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vacancies INTEGER DEFAULT 45;`);
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_link VARCHAR(555) DEFAULT '';`);
  await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(555) DEFAULT '';`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS apply_link VARCHAR(555) DEFAULT '';`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(555) DEFAULT '';`);
  await pool.query(`ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_date VARCHAR(100) DEFAULT '';`);
  console.log('✅ PostgreSQL Schema Built successfully.');
};
