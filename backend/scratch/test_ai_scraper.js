import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from '../config/db.js';
import { scrapeLandingPages } from '../services/landingScraperService.js';

async function run() {
  console.log('🔌 Initializing Database Connection...');
  await connectDB();
  
  console.log('🚀 Executing landing pages scraper test...');
  try {
    const stats = await scrapeLandingPages();
    console.log('\n=============================================');
    console.log('📊 Scraper Execution Statistics:');
    console.log(JSON.stringify(stats, null, 2));
    console.log('=============================================\n');
  } catch (err) {
    console.error('❌ Scraper Execution Failed:', err.message);
  }
  process.exit(0);
}

run();
