import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Status code:', res.statusCode);
      try {
        const parsed = JSON.parse(data);
        console.log('Response Payload:', JSON.stringify(parsed, null, 2));
      } catch (err) {
        console.error('Failed to parse JSON:', err.message);
        console.log('Raw data:', data);
      }
    });
  }).on('error', (err) => {
    console.error('HTTP Request Error:', err.message);
  });
}

listModels();
