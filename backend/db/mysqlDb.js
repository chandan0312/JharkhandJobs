import mysql from 'mysql2/promise';

let pool = null;
let isConnected = false;

export const initMysqlDb = async () => {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = parseInt(process.env.DB_PORT) || 3306;

  if (!host || !user || !database || !password) {
    console.log('ℹ️  MySQL credentials incomplete in .env (DB_PASSWORD is not set).');
    console.log('💡 Jharkhand Jobs Server is operating in Mock DB Mode until MySQL password is provided.');
    return false;
  }

  console.log(`🔌 Attempting connection to MySQL Database [${database}] on ${host}:${port}...`);

  try {
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
      charset: 'utf8mb4',
      dateStrings: true,
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('🚀 MySQL Database Connected successfully to Hostinger!');
    connection.release();

    isConnected = true;
    global.useMockDb = false;
    global.useMysqlDb = true;
    global.usePgDb = false;

    // Run Schema DDL scripts
    await runDDL();

    return true;
  } catch (error) {
    console.log('\n=============================================================');
    console.log('⚠️  COULD NOT CONNECT TO MYSQL DATABASE INSTANCE');
    console.log(`❌ Error: ${error.message}`);
    console.log('💡 Jharkhand Jobs Server is falling back to In-Memory Mock DB Mode.');
    console.log('✨ Note: To connect directly to Hostinger MySQL from local/server:');
    console.log('   1. In Hostinger hPanel -> Remote MySQL: Add "%" or your IP to allowed list.');
    console.log('   2. Set valid DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in backend/.env');
    console.log('=============================================================\n');

    isConnected = false;
    global.useMockDb = true;
    global.useMysqlDb = false;
    return false;
  }
};

export const getPool = () => {
  if (!isConnected) return null;
  return pool;
};

/**
 * Translates PostgreSQL query syntax into MySQL compatible syntax:
 * 1. Replaces $1, $2, ... placeholders with ? and maps parameters in order.
 * 2. Replaces ILIKE with LIKE (MySQL is case-insensitive by default in utf8mb4_unicode_ci).
 * 3. Strips PostgreSQL type casts like ::integer or ::text.
 * 4. Serializes array/object parameters to JSON strings so mysql2 doesn't fail.
 * 5. Handles RETURNING * statements via follow-up SELECT.
 */
export const query = async (sqlText, params = []) => {
  if (!isConnected || !pool) {
    throw new Error('MySQL is not connected. Attempted query on disconnected pool.');
  }

  let sql = sqlText.trim();
  let transformedParams = Array.isArray(params) ? [...params] : [];

  // Check if query requested RETURNING *
  const hasReturning = /RETURNING\s+\*/i.test(sql);
  if (hasReturning) {
    sql = sql.replace(/RETURNING\s+\*/gi, '').trim();
  }

  // Remove Postgres casts like ::integer or ::text
  sql = sql.replace(/::[a-zA-Z_]+/g, '');

  // Convert ILIKE to LIKE
  sql = sql.replace(/\bILIKE\b/gi, 'LIKE');

  // Convert $1, $2, ... placeholders to ?
  // If query uses $1, $2, ..., we need to replace each $N with ?
  // and ensure params are matched correctly
  if (/\$[0-9]+/.test(sql)) {
    const orderedParams = [];
    sql = sql.replace(/\$([0-9]+)/g, (match, index) => {
      const paramIdx = parseInt(index, 10) - 1;
      if (paramIdx >= 0 && paramIdx < params.length) {
        orderedParams.push(params[paramIdx]);
      } else {
        orderedParams.push(null);
      }
      return '?';
    });
    transformedParams = orderedParams;
  }

  // Format array & object parameters into JSON strings for MySQL
  const sanitizedParams = transformedParams.map(param => {
    if (param === undefined) return null;
    if (param !== null && typeof param === 'object' && !(param instanceof Date) && !Buffer.isBuffer(param)) {
      return JSON.stringify(param);
    }
    return param;
  });

  // Determine if this is an INSERT or UPDATE on a specific table for RETURNING emulation
  let returningTable = null;
  let returningId = null;

  if (hasReturning) {
    const insertMatch = sql.match(/INSERT\s+INTO\s+`?([a-zA-Z0-9_]+)`?/i);
    const updateMatch = sql.match(/UPDATE\s+`?([a-zA-Z0-9_]+)`?/i);
    
    if (insertMatch) {
      returningTable = insertMatch[1];
      // By convention in our models, $1 or params[0] is the entity ID
      if (sanitizedParams.length > 0 && typeof sanitizedParams[0] === 'string') {
        returningId = sanitizedParams[0];
      }
    } else if (updateMatch) {
      returningTable = updateMatch[1];
      // In UPDATE ... WHERE id = $1, the ID is usually the first or last param
      // Check query: WHERE id = ?
      const idMatch = sql.match(/WHERE\s+id\s*=\s*\?/i);
      if (idMatch) {
        // Find which parameter corresponds to id
        // In our models, UPDATE sets id = $1, so sanitizedParams[0] is id
        returningId = sanitizedParams[0];
      }
    }
  }

  // Execute query using pool.query
  const [results] = await pool.query(sql, sanitizedParams);

  // If RETURNING * was requested and we know table & id, fetch the saved record
  if (hasReturning && returningTable && returningId) {
    try {
      const [rows] = await pool.query(`SELECT * FROM \`${returningTable}\` WHERE id = ? LIMIT 1`, [returningId]);
      normalizeRows(rows);
      return {
        rows,
        rowCount: rows.length,
      };
    } catch {
      // Fallback
    }
  }

  // Handle standard result
  if (Array.isArray(results)) {
    normalizeRows(results);
    return {
      rows: results,
      rowCount: results.length,
    };
  }

  return {
    rows: [],
    rowCount: results.affectedRows || 0,
    insertId: results.insertId,
  };
};

/**
 * Normalizes rows returned by MySQL:
 * - Maps COUNT(*) to .count for Postgres compatibility
 * - Parses JSON fields if returned as strings
 */
const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) return;
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;

    // Normalizing COUNT(*)
    for (const key of Object.keys(row)) {
      if (/count\(\*\)/i.test(key)) {
        row.count = parseInt(row[key], 10);
      }
    }

    // Parse JSON fields safely if stringified
    for (const field of ['responsibilities', 'requirements', 'tags', 'saved_jobs', 'profile_data', 'questions']) {
      if (typeof row[field] === 'string') {
        try {
          row[field] = JSON.parse(row[field]);
        } catch {
          // Keep as string
        }
      }
    }
  }
};

export const runDDL = async () => {
  console.log('⚙️  Running MySQL Schema Builders for Hostinger...');

  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255) UNIQUE NOT NULL,
      \`password\` VARCHAR(255) NOT NULL,
      \`phone\` VARCHAR(50) DEFAULT '',
      \`mobile\` VARCHAR(50) DEFAULT '',
      \`role\` VARCHAR(50) DEFAULT 'user',
      \`google_id\` VARCHAR(255) UNIQUE,
      \`profile_image\` TEXT DEFAULT NULL,
      \`email_verified\` TINYINT(1) DEFAULT 0,
      \`verification_token\` TEXT DEFAULT NULL,
      \`reset_password_token\` TEXT DEFAULT NULL,
      \`reset_password_expires\` DATETIME DEFAULT NULL,
      \`last_login\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      \`saved_jobs\` JSON DEFAULT NULL,
      \`profile_data\` JSON DEFAULT NULL,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Companies table
    `CREATE TABLE IF NOT EXISTS \`companies\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`industry\` VARCHAR(255) DEFAULT '',
      \`job_count\` INT DEFAULT 0,
      \`featured\` TINYINT(1) DEFAULT 0,
      \`recently_added\` TINYINT(1) DEFAULT 0,
      \`company_color\` VARCHAR(50) DEFAULT '#005691'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Jobs table
    `CREATE TABLE IF NOT EXISTS \`jobs\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
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
      KEY \`idx_jobs_category\` (\`category\`),
      KEY \`idx_jobs_status\` (\`status\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Exams table
    `CREATE TABLE IF NOT EXISTS \`exams\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
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
      KEY \`idx_exams_category\` (\`category\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Blog posts table
    `CREATE TABLE IF NOT EXISTS \`blog_posts\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`slug\` VARCHAR(255) UNIQUE NOT NULL,
      \`excerpt\` TEXT,
      \`content\` LONGTEXT,
      \`category\` VARCHAR(100) DEFAULT '',
      \`author\` VARCHAR(255) DEFAULT 'Admin',
      \`cover_image\` VARCHAR(555) DEFAULT '',
      \`tags\` JSON DEFAULT NULL,
      \`views\` INT DEFAULT 0,
      \`published_date\` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Applications table
    `CREATE TABLE IF NOT EXISTS \`applications\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`job_id\` VARCHAR(255),
      \`user_id\` VARCHAR(255),
      \`full_name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL,
      \`phone\` VARCHAR(50) DEFAULT '',
      \`resume_path\` VARCHAR(555) DEFAULT '',
      \`status\` VARCHAR(50) DEFAULT 'pending',
      \`applied_date\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      KEY \`idx_app_job\` (\`job_id\`),
      KEY \`idx_app_user\` (\`user_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Quizzes table
    `CREATE TABLE IF NOT EXISTS \`quizzes\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`key\` VARCHAR(255) UNIQUE NOT NULL,
      \`title\` VARCHAR(255) NOT NULL,
      \`icon\` VARCHAR(100) DEFAULT '',
      \`color\` VARCHAR(50) DEFAULT '',
      \`bg_color\` VARCHAR(50) DEFAULT '',
      \`description\` TEXT,
      \`duration\` INT DEFAULT 600,
      \`questions\` JSON DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Discussion Forums table
    `CREATE TABLE IF NOT EXISTS \`forums\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`slug\` VARCHAR(255) UNIQUE,
      \`category\` VARCHAR(100) DEFAULT '',
      \`author\` VARCHAR(255) NOT NULL,
      \`author_id\` VARCHAR(255) NOT NULL,
      \`views\` INT DEFAULT 0,
      \`replies\` INT DEFAULT 0,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Forum Answers table
    `CREATE TABLE IF NOT EXISTS \`forum_answers\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`forum_id\` VARCHAR(255) NOT NULL,
      \`author\` VARCHAR(255) NOT NULL,
      \`author_id\` VARCHAR(255) NOT NULL,
      \`content\` LONGTEXT NOT NULL,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
      KEY \`idx_forum_answers_forum_id\` (\`forum_id\`),
      CONSTRAINT \`fk_fa_forum\` FOREIGN KEY (\`forum_id\`) REFERENCES \`forums\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Enquiries table
    `CREATE TABLE IF NOT EXISTS \`enquiries\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`email\` VARCHAR(255) NOT NULL,
      \`subject\` VARCHAR(255) NOT NULL,
      \`message\` LONGTEXT NOT NULL,
      \`status\` VARCHAR(50) DEFAULT 'pending',
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // Subscribers table
    `CREATE TABLE IF NOT EXISTS \`subscribers\` (
      \`id\` VARCHAR(255) PRIMARY KEY,
      \`email\` VARCHAR(255) UNIQUE NOT NULL,
      \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  ];

  for (const statement of tables) {
    try {
      await pool.query(statement);
    } catch (err) {
      console.warn(`DDL warning: ${err.message}`);
    }
  }

  console.log('✅ MySQL Schema verified successfully.');
};

export default {
  initMysqlDb,
  getPool,
  query,
  runDDL
};
