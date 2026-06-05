import fs from 'fs';

const file = "c:/Users/LENOVO/Documents/Github/JharkhandJobs/frontend/src/pages/Admin.jsx";
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

for (let i = 2730; i < Math.min(lines.length, 2780); i++) {
  console.log(`[${i + 1}] ${lines[i]}`);
}
