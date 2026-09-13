import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 API Key present:', !!apiKey);
  if (apiKey) {
    console.log('🔑 API Key prefix:', apiKey.substring(0, 5) + '...');
  } else {
    console.error('❌ GEMINI_API_KEY is not defined in .env file!');
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('📡 Calling listModels()...');
    
    // In the JS SDK, genAI has a listModels method or similar?
    // Let's check: actually, standard is genAI.getGenerativeModel()
    // Let's try calling a model list or listModels
    // If it fails, let's see why.
    // Wait, let's try calling gemini-2.5-flash with a simple request first:
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent('Say Hello');
    console.log('✨ Success! Response:', response.response.text());
  } catch (err) {
    console.error('❌ Detailed Error:', err);
  }
}

run();
