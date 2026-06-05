import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    const today = new Date('2026-06-05');
    
    console.log('Checking Jobs...');
    const jobsRes = await pool.query('SELECT id, title, last_date FROM jobs');
    for (const job of jobsRes.rows) {
      if (job.last_date) {
        const lastDate = new Date(job.last_date);
        if (lastDate < today) {
          console.log(`❌ Expired Job: ID=${job.id}, Title="${job.title}", LastDate=${job.last_date}`);
        } else {
          console.log(`✅ Active Job: ID=${job.id}, Title="${job.title}", LastDate=${job.last_date}`);
        }
      } else {
        console.log(`ℹ️ No-deadline Job: ID=${job.id}, Title="${job.title}"`);
      }
    }

    console.log('\nChecking Exams...');
    const examsRes = await pool.query('SELECT id, title, last_date FROM exams');
    for (const exam of examsRes.rows) {
      const dateStr = exam.last_date;
      if (!dateStr) {
        console.log(`ℹ️ No-deadline Exam: ID=${exam.id}, Title="${exam.title}"`);
        continue;
      }
      
      // Try parsing date from string, e.g. "30 Jun 2026", "22 Jun 2026"
      const parsedDate = Date.parse(dateStr);
      if (!isNaN(parsedDate)) {
        const lastDate = new Date(parsedDate);
        if (lastDate < today) {
          console.log(`❌ Expired Exam: ID=${exam.id}, Title="${exam.title}", LastDate="${dateStr}"`);
        } else {
          console.log(`✅ Active Exam: ID=${exam.id}, Title="${exam.title}", LastDate="${dateStr}"`);
        }
      } else {
        console.log(`❓ Non-parseable Exam Date: ID=${exam.id}, Title="${exam.title}", LastDate="${dateStr}"`);
      }
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
