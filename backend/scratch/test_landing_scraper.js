import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import { scrapeLandingPages } from '../services/landingScraperService.js';
import * as pgDb from '../config/pgDb.js';

async function runTest() {
  console.log('🚀 Running Landing Page Scraper test script...');
  
  // Connect to DB
  await connectDB();
  
  try {
    const result = await scrapeLandingPages();
    console.log('\n=================== RESULT ===================');
    console.log('Success:', result.success);
    console.log('Newly Added Jobs:', result.jobsCount);
    console.log('Newly Added Exams:', result.examsCount);
    console.log('==============================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
  } finally {
    // If pg is active, close the pool
    if (global.usePgDb && pgDb.getPool()) {
      try {
        await pgDb.getPool().end();
        console.log('🔌 Closed PostgreSQL connection pool.');
      } catch (e) {}
    }
  }
}

runTest();
