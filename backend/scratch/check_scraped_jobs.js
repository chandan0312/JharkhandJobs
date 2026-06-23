import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jharkhandjobs'
});

async function main() {
  try {
    const jobsRes = await pool.query("SELECT id, title, company, category, status FROM jobs WHERE id LIKE 'job-%'");
    console.log('--- Scraped Jobs in DB ---');
    console.log(`Total: ${jobsRes.rows.length}`);
    jobsRes.rows.slice(0, 10).forEach(row => {
      console.log(`- [${row.id}] ${row.company}: ${row.title} (${row.category})`);
    });

    const examsRes = await pool.query("SELECT id, title, organization, category, status FROM exams WHERE id LIKE 'exam-%'");
    console.log('\n--- Scraped Exams in DB ---');
    console.log(`Total: ${examsRes.rows.length}`);
    examsRes.rows.slice(0, 10).forEach(row => {
      console.log(`- [${row.id}] ${row.organization}: ${row.title} (${row.category})`);
    });
  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    await pool.end();
  }
}

main();
