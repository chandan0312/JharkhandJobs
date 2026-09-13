import connectDB from '../db/index.js';

console.log('Testing connectDB from backend/db/index.js...');
connectDB().then((res) => {
  console.log('Result:', res);
  process.exit(0);
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
