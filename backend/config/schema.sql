-- ==========================================
-- Jharkhand Jobs Complete Database Schema
-- ==========================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
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
);

-- 2. Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  job_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  recently_added BOOLEAN DEFAULT FALSE,
  company_color VARCHAR(50)
);

-- 3. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
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
  pdf_url VARCHAR(555) DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Exams Table
CREATE TABLE IF NOT EXISTS exams (
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
  apply_link VARCHAR(555) DEFAULT '',
  pdf_url VARCHAR(555) DEFAULT '',
  exam_date VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
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
);

-- 6. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(255) PRIMARY KEY,
  job_id VARCHAR(255),
  user_id VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  resume_path VARCHAR(555),
  status VARCHAR(50) DEFAULT 'pending',
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(255) PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(50),
  bg_color VARCHAR(50),
  description TEXT,
  duration INTEGER DEFAULT 600,
  questions JSONB DEFAULT '[]'
);

-- 8. Discussion Forums Table
CREATE TABLE IF NOT EXISTS forums (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(100),
  author VARCHAR(255) NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  views INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Forum Answers Table
CREATE TABLE IF NOT EXISTS forum_answers (
  id VARCHAR(255) PRIMARY KEY,
  forum_id VARCHAR(255) NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
  author VARCHAR(255) NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================================
-- Incremental Column Migrations (For Existing Databases)
-- ==========================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_data TEXT DEFAULT '{}';

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vacancies INTEGER DEFAULT 45;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_link VARCHAR(555) DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(555) DEFAULT '';

ALTER TABLE exams ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS apply_link VARCHAR(555) DEFAULT '';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(555) DEFAULT '';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_date VARCHAR(100) DEFAULT '';
