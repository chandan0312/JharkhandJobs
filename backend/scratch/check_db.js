import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jharkhandjobs'
});

async function main() {
  try {
    const jobsRes = await pool.query('SELECT id, title, company, last_date, category, status FROM jobs');
    console.log('All Jobs in DB:', jobsRes.rows.length);
    console.log(JSON.stringify(jobsRes.rows, null, 2));

    const examsRes = await pool.query('SELECT id, title, category, last_date, status FROM exams');
    console.log('All Exams in DB:', examsRes.rows.length);
    console.log(JSON.stringify(examsRes.rows, null, 2));

    const blogsRes = await pool.query('SELECT id, title, category, published_date FROM blog_posts');
    console.log('All Blog Posts in DB:', blogsRes.rows.length);
    console.log(JSON.stringify(blogsRes.rows, null, 2));

    const forumsRes = await pool.query('SELECT id, title, category, author, views, replies, created_at FROM forums');
    console.log('All Forum Posts in DB:', forumsRes.rows.length);
    console.log(JSON.stringify(forumsRes.rows, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    await pool.end();
  }
}

main();
