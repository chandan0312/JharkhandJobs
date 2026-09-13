import fs from 'fs';

const file = "c:/Users/LENOVO/Documents/Github/JharkhandJobs/frontend/src/pages/Admin.jsx";
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

for (let i = 120; i < 200 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
