import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const dumpUsers = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });

  try {
    const res = await pool.query('SELECT id, name, email, role, saved_jobs, profile_data FROM users');
    console.log('Users in DB:');
    console.log(res.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
};

dumpUsers();
