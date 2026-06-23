import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in environment variables.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

const clearTables = async () => {
  try {
    console.log('🔌 Connecting to PostgreSQL to clean up dummy data...');
    const client = await pool.connect();
    console.log('✅ Connected successfully.');

    const tables = [
      'forum_answers',
      'forums',
      'blog_posts',
      'quizzes',
      'jobs',
      'exams',
      'companies',
      'applications',
      'enquiries',
      'subscribers'
    ];

    console.log('🗑️ Truncating tables to clear all dummy/seed records...');
    for (const table of tables) {
      await client.query(`TRUNCATE TABLE ${table} CASCADE;`);
      console.log(`- Cleared table: ${table}`);
    }

    console.log('🎉 Database successfully cleaned! Ready for production.');
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing database:', err.message);
    process.exit(1);
  }
};

clearTables();
