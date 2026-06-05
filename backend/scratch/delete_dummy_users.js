import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    console.log('🧹 Connecting to Supabase database to delete dummy users...');
    
    const deleteRes = await pool.query(`
      DELETE FROM users 
      WHERE id LIKE 'mock-user-%' 
         OR email IN ('admin@jharkhandjobs.com', 'rohan@gmail.com', 'rohan.google@gmail.com')
    `);
    
    console.log(`✅ Successfully deleted ${deleteRes.rowCount} dummy user(s) from the database.`);
    
    // Let's verify remaining users
    const res = await pool.query('SELECT id, name, email, role, google_id FROM users');
    console.log('\n--- Remaining Users in Database ---');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('❌ Error during dummy user deletion:', err.message);
  } finally {
    await pool.end();
  }
};

run();
