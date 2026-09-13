import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeSql = (val) => {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return isNaN(val) ? '0' : String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (val instanceof Date) {
    return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
};

const formatDate = (dateVal) => {
  if (!dateVal) return 'NULL';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'NULL';
    return `'${d.toISOString().slice(0, 19).replace('T', ' ')}'`;
  } catch {
    return 'NULL';
  }
};

async function generateDump() {
  console.log('Generating MySQL SQL Dump for JharkhandJobs...');
  
  let sql = `-- ==============================================================================
-- JharkhandJobs MySQL Database Dump
-- Target Database: u682864865_jharkhand_db
-- Generated: ${new Date().toISOString()}
-- Compatible with MySQL 5.7+, 8.0+ and MariaDB
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ------------------------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) DEFAULT '',
  \`mobile\` VARCHAR(50) DEFAULT '',
  \`role\` VARCHAR(50) DEFAULT 'user',
  \`google_id\` VARCHAR(255) DEFAULT NULL,
  \`profile_image\` TEXT DEFAULT NULL,
  \`email_verified\` TINYINT(1) DEFAULT 0,
  \`verification_token\` TEXT DEFAULT NULL,
  \`reset_password_token\` TEXT DEFAULT NULL,
  \`reset_password_expires\` DATETIME DEFAULT NULL,
  \`last_login\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`saved_jobs\` JSON DEFAULT NULL,
  \`profile_data\` JSON DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_users_email\` (\`email\`),
  UNIQUE KEY \`uniq_users_google_id\` (\`google_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: companies
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`companies\`;
CREATE TABLE \`companies\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`industry\` VARCHAR(255) DEFAULT '',
  \`job_count\` INT DEFAULT 0,
  \`featured\` TINYINT(1) DEFAULT 0,
  \`recently_added\` TINYINT(1) DEFAULT 0,
  \`company_color\` VARCHAR(50) DEFAULT '#005691',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: jobs
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`jobs\`;
CREATE TABLE \`jobs\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`company\` VARCHAR(255) NOT NULL,
  \`company_initial\` VARCHAR(50) DEFAULT '',
  \`company_color\` VARCHAR(50) DEFAULT '#005691',
  \`location\` VARCHAR(255) DEFAULT '',
  \`type\` VARCHAR(100) DEFAULT 'Full Time',
  \`salary_min\` DECIMAL(12, 2) DEFAULT 0,
  \`salary_max\` DECIMAL(12, 2) DEFAULT 0,
  \`salary_currency\` VARCHAR(10) DEFAULT '₹',
  \`salary_period\` VARCHAR(50) DEFAULT 'monthly',
  \`experience\` VARCHAR(100) DEFAULT '',
  \`qualification\` VARCHAR(255) DEFAULT 'Graduation',
  \`badge_text\` VARCHAR(100) DEFAULT '',
  \`category\` VARCHAR(100) DEFAULT 'Govt Jobs',
  \`industry\` VARCHAR(255) DEFAULT '',
  \`description\` LONGTEXT,
  \`responsibilities\` JSON DEFAULT NULL,
  \`requirements\` JSON DEFAULT NULL,
  \`status\` VARCHAR(50) DEFAULT 'active',
  \`posted_date\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`last_date\` DATETIME DEFAULT NULL,
  \`vacancies\` INT DEFAULT 45,
  \`posted_by\` VARCHAR(255) DEFAULT 'admin',
  \`apply_link\` VARCHAR(555) DEFAULT '',
  \`pdf_url\` VARCHAR(555) DEFAULT '',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_jobs_category\` (\`category\`),
  KEY \`idx_jobs_status\` (\`status\`),
  KEY \`idx_jobs_company\` (\`company\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: exams
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`exams\`;
CREATE TABLE \`exams\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`organization\` VARCHAR(255) DEFAULT '',
  \`org_short\` VARCHAR(50) DEFAULT '',
  \`category\` VARCHAR(100) DEFAULT 'Upcoming Exams',
  \`last_date\` VARCHAR(100) DEFAULT '',
  \`posts\` VARCHAR(100) DEFAULT '',
  \`status\` VARCHAR(100) DEFAULT 'Apply Now',
  \`description\` LONGTEXT,
  \`is_new\` TINYINT(1) DEFAULT 1,
  \`apply_link\` VARCHAR(555) DEFAULT '',
  \`pdf_url\` VARCHAR(555) DEFAULT '',
  \`exam_date\` VARCHAR(100) DEFAULT '',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_exams_category\` (\`category\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: blog_posts
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`blog_posts\`;
CREATE TABLE \`blog_posts\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL,
  \`excerpt\` TEXT,
  \`content\` LONGTEXT,
  \`category\` VARCHAR(100) DEFAULT '',
  \`author\` VARCHAR(255) DEFAULT 'Admin',
  \`cover_image\` VARCHAR(555) DEFAULT '',
  \`tags\` JSON DEFAULT NULL,
  \`views\` INT DEFAULT 0,
  \`published_date\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_blog_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: applications
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`applications\`;
CREATE TABLE \`applications\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`job_id\` VARCHAR(255) DEFAULT NULL,
  \`user_id\` VARCHAR(255) DEFAULT NULL,
  \`full_name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) DEFAULT '',
  \`resume_path\` VARCHAR(555) DEFAULT '',
  \`status\` VARCHAR(50) DEFAULT 'pending',
  \`applied_date\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_applications_job_id\` (\`job_id\`),
  KEY \`idx_applications_user_id\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: quizzes
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`quizzes\`;
CREATE TABLE \`quizzes\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`key\` VARCHAR(255) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`icon\` VARCHAR(100) DEFAULT '',
  \`color\` VARCHAR(50) DEFAULT '',
  \`bg_color\` VARCHAR(50) DEFAULT '',
  \`description\` TEXT,
  \`duration\` INT DEFAULT 600,
  \`questions\` JSON DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_quiz_key\` (\`key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: forums
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`forums\`;
CREATE TABLE \`forums\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) DEFAULT NULL,
  \`category\` VARCHAR(100) DEFAULT '',
  \`author\` VARCHAR(255) NOT NULL,
  \`author_id\` VARCHAR(255) NOT NULL,
  \`views\` INT DEFAULT 0,
  \`replies\` INT DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_forum_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: forum_answers
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`forum_answers\`;
CREATE TABLE \`forum_answers\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`forum_id\` VARCHAR(255) NOT NULL,
  \`author\` VARCHAR(255) NOT NULL,
  \`author_id\` VARCHAR(255) NOT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_forum_answers_forum_id\` (\`forum_id\`),
  CONSTRAINT \`fk_forum_answers_forum\` FOREIGN KEY (\`forum_id\`) REFERENCES \`forums\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: enquiries
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`enquiries\`;
CREATE TABLE \`enquiries\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`message\` LONGTEXT NOT NULL,
  \`status\` VARCHAR(50) DEFAULT 'pending',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table: subscribers
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`subscribers\`;
CREATE TABLE \`subscribers\` (
  \`id\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_subscribers_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  // Seed Admin Users
  console.log('Seeding admin users...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin@123', salt);
  
  sql += `\n-- ------------------------------------------------------------------------------\n-- Data: Admin Users (Password: Admin@123)\n-- ------------------------------------------------------------------------------\n`;
  sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`phone\`, \`mobile\`, \`role\`, \`email_verified\`, \`saved_jobs\`, \`profile_data\`, \`created_at\`, \`updated_at\`) VALUES\n`;
  sql += `('admin-jharkhandjobs03', 'Jharkhand Jobs Admin', 'jharkhandjobs03@gmail.com', '${passwordHash}', '9876543210', '9876543210', 'admin', 1, '[]', '{"bio": "Super Administrator"}', NOW(), NOW()),\n`;
  sql += `('admin-system', 'System Administrator', 'admin@jharkhandjobs.com', '${passwordHash}', '9876543211', '9876543211', 'admin', 1, '[]', '{"bio": "System Administrator"}', NOW(), NOW())`;
  sql += ` ON DUPLICATE KEY UPDATE \`role\` = 'admin';\n\n`;

  // Seed Companies
  console.log('Seeding companies...');
  const companies = [
    { id: 'c1', name: 'Tata Steel', industry: 'Manufacturing', jobCount: 45, featured: 1, companyColor: '#005691' },
    { id: 'c2', name: 'HCLTech', industry: 'IT / Software', jobCount: 38, featured: 1, companyColor: '#2563EB' },
    { id: 'c3', name: 'Tech Mahindra', industry: 'IT / Software', jobCount: 32, featured: 1, companyColor: '#E11D48' },
    { id: 'c4', name: 'Vedanta', industry: 'Manufacturing', jobCount: 25, featured: 1, companyColor: '#059669' },
    { id: 'c5', name: 'Cipla', industry: 'Healthcare', jobCount: 18, featured: 1, companyColor: '#DC2626' },
    { id: 'c6', name: 'Reliance Industries', industry: 'Telecommunications', jobCount: 50, featured: 1, companyColor: '#1E3A8A' },
    { id: 'c7', name: 'Deloitte', industry: 'Consulting', jobCount: 30, featured: 1, companyColor: '#86EFAC' },
    { id: 'c8', name: 'ITC Limited', industry: 'FMCG', jobCount: 20, featured: 1, companyColor: '#D97706' },
    { id: 'c9', name: 'Birlasoft', industry: 'IT / Software', jobCount: 22, featured: 1, companyColor: '#7C3AED' },
    { id: 'c10', name: 'L&T', industry: 'Infrastructure', jobCount: 40, featured: 1, companyColor: '#EF4444' },
    { id: 'c11', name: 'Jindal Steel', industry: 'Manufacturing', jobCount: 15, recentlyAdded: 1, companyColor: '#0B72B9' },
    { id: 'c12', name: 'SAIL', industry: 'Manufacturing', jobCount: 12, recentlyAdded: 1, companyColor: '#1E40AF' },
    { id: 'c13', name: 'ECI', industry: 'Infrastructure', jobCount: 10, recentlyAdded: 1, companyColor: '#4B5563' },
    { id: 'c14', name: 'Piramal', industry: 'Healthcare', jobCount: 8, recentlyAdded: 1, companyColor: '#B45309' },
    { id: 'c15', name: 'Godrej', industry: 'FMCG', jobCount: 14, recentlyAdded: 1, companyColor: '#10B981' }
  ];

  sql += `-- ------------------------------------------------------------------------------\n-- Data: Companies\n-- ------------------------------------------------------------------------------\n`;
  sql += `INSERT INTO \`companies\` (\`id\`, \`name\`, \`industry\`, \`job_count\`, \`featured\`, \`recently_added\`, \`company_color\`) VALUES\n`;
  const companyRows = companies.map(c => 
    `(${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.industry)}, ${c.jobCount || 0}, ${c.featured ? 1 : 0}, ${c.recentlyAdded ? 1 : 0}, ${escapeSql(c.companyColor || '#005691')})`
  );
  sql += companyRows.join(',\n') + ';\n\n';

  // Seed Jobs and Exams from scraped_data.json
  const scrapedPath = path.join(__dirname, '../config/scraped_data.json');
  if (fs.existsSync(scrapedPath)) {
    const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));

    // Jobs
    if (scraped.jobs && Array.isArray(scraped.jobs) && scraped.jobs.length > 0) {
      console.log(`Seeding ${scraped.jobs.length} jobs...`);
      sql += `-- ------------------------------------------------------------------------------\n-- Data: Jobs (${scraped.jobs.length} items)\n-- ------------------------------------------------------------------------------\n`;
      sql += `INSERT INTO \`jobs\` (\`id\`, \`title\`, \`company\`, \`company_initial\`, \`company_color\`, \`location\`, \`type\`, \`salary_min\`, \`salary_max\`, \`salary_currency\`, \`salary_period\`, \`experience\`, \`qualification\`, \`badge_text\`, \`category\`, \`industry\`, \`description\`, \`responsibilities\`, \`requirements\`, \`status\`, \`posted_date\`, \`last_date\`, \`vacancies\`, \`posted_by\`, \`apply_link\`, \`pdf_url\`, \`created_at\`, \`updated_at\`) VALUES\n`;
      
      const jobRows = scraped.jobs.map(j => {
        const id = j._id || j.id || `job-${Math.random().toString(36).substring(2, 9)}`;
        const title = j.title || 'Job Opening';
        const company = j.company || 'Jharkhand Organization';
        const initial = j.companyInitial || company.substring(0, 3).toUpperCase();
        const color = j.companyColor || '#005691';
        const location = j.location || 'Jharkhand, India';
        const type = j.type || 'Full Time';
        const salMin = j.salary && j.salary.min !== undefined ? Number(j.salary.min) : 0;
        const salMax = j.salary && j.salary.max !== undefined ? Number(j.salary.max) : 0;
        const currency = (j.salary && j.salary.currency) || '₹';
        const period = (j.salary && j.salary.period) || 'monthly';
        const exp = j.experience || 'Fresher / Experienced';
        const qual = j.qualification || 'Graduation';
        const badge = j.badgeText || '';
        const cat = j.category || 'Govt Jobs';
        const ind = j.industry || 'Public Service';
        const desc = j.description || '';
        const resp = JSON.stringify(Array.isArray(j.responsibilities) ? j.responsibilities : []);
        const reqs = JSON.stringify(Array.isArray(j.requirements) ? j.requirements : []);
        const status = j.status || 'active';
        const posted = formatDate(j.postedDate || new Date());
        const last = formatDate(j.lastDate);
        const vac = j.vacancies !== undefined ? Number(j.vacancies) : 45;
        const postedBy = j.postedBy || 'admin';
        const applyLink = j.applyLink || '';
        const pdfUrl = j.pdfUrl || '';

        return `(${escapeSql(id)}, ${escapeSql(title)}, ${escapeSql(company)}, ${escapeSql(initial)}, ${escapeSql(color)}, ${escapeSql(location)}, ${escapeSql(type)}, ${salMin}, ${salMax}, ${escapeSql(currency)}, ${escapeSql(period)}, ${escapeSql(exp)}, ${escapeSql(qual)}, ${escapeSql(badge)}, ${escapeSql(cat)}, ${escapeSql(ind)}, ${escapeSql(desc)}, ${escapeSql(resp)}, ${escapeSql(reqs)}, ${escapeSql(status)}, ${posted}, ${last}, ${vac}, ${escapeSql(postedBy)}, ${escapeSql(applyLink)}, ${escapeSql(pdfUrl)}, NOW(), NOW())`;
      });

      sql += jobRows.join(',\n') + ';\n\n';
    }

    // Exams
    if (scraped.exams && Array.isArray(scraped.exams) && scraped.exams.length > 0) {
      console.log(`Seeding ${scraped.exams.length} exams...`);
      sql += `-- ------------------------------------------------------------------------------\n-- Data: Exams (${scraped.exams.length} items)\n-- ------------------------------------------------------------------------------\n`;
      sql += `INSERT INTO \`exams\` (\`id\`, \`title\`, \`organization\`, \`org_short\`, \`category\`, \`last_date\`, \`posts\`, \`status\`, \`description\`, \`is_new\`, \`apply_link\`, \`pdf_url\`, \`exam_date\`, \`created_at\`, \`updated_at\`) VALUES\n`;
      
      const examRows = scraped.exams.map(e => {
        const id = e._id || e.id || `exam-${Math.random().toString(36).substring(2, 9)}`;
        const title = e.title || 'Exam Notice';
        const org = e.organization || 'Jharkhand Commission';
        const short = e.orgShort || 'JSSC';
        const cat = e.category || 'Upcoming Exams';
        const last = e.lastDate || '';
        const posts = e.posts || '';
        const status = e.status || 'Apply Now';
        const desc = e.description || '';
        const isNew = e.isNew !== undefined ? (e.isNew ? 1 : 0) : 1;
        const apply = e.applyLink || '';
        const pdf = e.pdfUrl || '';
        const examDate = e.examDate || '';

        return `(${escapeSql(id)}, ${escapeSql(title)}, ${escapeSql(org)}, ${escapeSql(short)}, ${escapeSql(cat)}, ${escapeSql(last)}, ${escapeSql(posts)}, ${escapeSql(status)}, ${escapeSql(desc)}, ${isNew}, ${escapeSql(apply)}, ${escapeSql(pdf)}, ${escapeSql(examDate)}, NOW(), NOW())`;
      });

      sql += examRows.join(',\n') + ';\n\n';
    }
  }

  // Quizzes sample
  sql += `-- ------------------------------------------------------------------------------\n-- Data: Quizzes\n-- ------------------------------------------------------------------------------\n`;
  sql += `INSERT INTO \`quizzes\` (\`id\`, \`key\`, \`title\`, \`icon\`, \`color\`, \`bg_color\`, \`description\`, \`duration\`, \`questions\`) VALUES
('quiz-jh-gk', 'jharkhand-gk', 'Jharkhand General Knowledge Practice', 'Brain', '#2563EB', '#EFF6FF', 'Test your knowledge on Jharkhand history, geography, festivals and culture.', 600, '[{"id": 1, "question": "What is the capital of Jharkhand?", "options": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"], "correctAnswer": 0}, {"id": 2, "question": "Which waterfall is known as Niagara Falls of India in Jharkhand?", "options": ["Hundru Falls", "Dassam Falls", "Jonha Falls", "Lodh Falls"], "correctAnswer": 0}]')
ON DUPLICATE KEY UPDATE \`title\` = VALUES(\`title\`);\n\n`;

  // Discussion Forums sample
  sql += `-- ------------------------------------------------------------------------------\n-- Data: Forums\n-- ------------------------------------------------------------------------------\n`;
  sql += `INSERT INTO \`forums\` (\`id\`, \`title\`, \`slug\`, \`category\`, \`author\`, \`author_id\`, \`views\`, \`replies\`, \`created_at\`) VALUES
('forum-jpsc-prep', 'Best preparation strategy for upcoming JPSC Civil Services Prelims', 'best-preparation-strategy-jpsc-prelims', 'Exam Prep', 'Jharkhand Jobs Admin', 'admin-jharkhandjobs03', 142, 1, NOW())
ON DUPLICATE KEY UPDATE \`views\` = \`views\` + 1;\n\n`;

  sql += `INSERT INTO \`forum_answers\` (\`id\`, \`forum_id\`, \`author\`, \`author_id\`, \`content\`, \`created_at\`) VALUES
('fa-1', 'forum-jpsc-prep', 'Jharkhand Jobs Admin', 'admin-jharkhandjobs03', 'Focus on Jharkhand specific GK books like Manish Ranjan or Udaan, along with standard NCERTs for General Studies.', NOW())
ON DUPLICATE KEY UPDATE \`content\` = VALUES(\`content\`);\n\n`;

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

  // Write files
  const rootDumpPath = path.join(__dirname, '../../jharkhand_db_mysql.sql');
  const backendDbDumpPath = path.join(__dirname, '../db/jharkhand_db_mysql.sql');

  fs.writeFileSync(rootDumpPath, sql, 'utf8');
  fs.writeFileSync(backendDbDumpPath, sql, 'utf8');

  console.log(`✅ MySQL Dump successfully generated!`);
  console.log(`   📁 Workspace Root: ${rootDumpPath} (${(fs.statSync(rootDumpPath).size / 1024).toFixed(1)} KB)`);
  console.log(`   📁 Backend DB: ${backendDbDumpPath}`);
}

generateDump().catch(err => {
  console.error('Error generating dump:', err);
});
