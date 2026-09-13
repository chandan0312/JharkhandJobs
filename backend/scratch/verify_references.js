import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import * as pgDb from '../config/pgDb.js';

async function check() {
  await connectDB();
  
  if (global.usePgDb) {
    try {
      const jobs = await pgDb.query(`
        SELECT id, title, company, description, apply_link, pdf_url 
        FROM jobs 
        WHERE description ILIKE '%freejob%' OR description ILIKE '%sarkari%'
           OR title ILIKE '%freejob%' OR title ILIKE '%sarkari%'
           OR company ILIKE '%freejob%' OR company ILIKE '%sarkari%'
           OR apply_link ILIKE '%freejob%' OR apply_link ILIKE '%sarkari%'
           OR pdf_url ILIKE '%freejob%' OR pdf_url ILIKE '%sarkari%'
      `);
      console.log('PostgreSQL Matching Jobs:', jobs.rows.length);
      if (jobs.rows.length > 0) {
        console.log(jobs.rows.slice(0, 5));
      }

      const exams = await pgDb.query(`
        SELECT id, title, organization, description, apply_link, pdf_url 
        FROM exams 
        WHERE description ILIKE '%freejob%' OR description ILIKE '%sarkari%'
           OR title ILIKE '%freejob%' OR title ILIKE '%sarkari%'
           OR organization ILIKE '%freejob%' OR organization ILIKE '%sarkari%'
           OR apply_link ILIKE '%freejob%' OR apply_link ILIKE '%sarkari%'
           OR pdf_url ILIKE '%freejob%' OR pdf_url ILIKE '%sarkari%'
      `);
      console.log('PostgreSQL Matching Exams:', exams.rows.length);
      if (exams.rows.length > 0) {
        console.log(exams.rows.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (pgDb.getPool()) {
        await pgDb.getPool().end();
      }
    }
  }
}

check();
