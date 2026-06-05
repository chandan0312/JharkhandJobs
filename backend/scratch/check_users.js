import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    const res = await pool.query('SELECT id, name, email, role, google_id FROM users');
    console.log('--- Database Users ---');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error fetching users:', err.message);
  } finally {
    await pool.end();
  }
};

run();
