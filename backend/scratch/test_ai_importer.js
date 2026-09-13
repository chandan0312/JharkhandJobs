import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { extractContentWithAi } from '../services/aiImporterService.js';

async function run() {
  console.log('📡 Starting Single URL AI Content Extraction Test...');
  const testUrl = 'https://www.freejobalert.com/jharkhand-government-jobs/';
  const testCategory = 'Job';
  const testExam = 'Jharkhand Police Constable Recruitment 2026';

  try {
    const data = await extractContentWithAi(testUrl, testCategory, testExam);
    console.log('\n=============================================');
    console.log('✨ AI Extracted Data Result:');
    console.log(JSON.stringify(data, null, 2));
    console.log('=============================================\n');
    console.log('✅ Extraction succeeded!');
  } catch (err) {
    console.error('❌ Extraction Failed:', err.message);
  }
}

run();
