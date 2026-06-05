import fs from 'fs';

const file = "c:/Users/LENOVO/Documents/Github/JharkhandJobs/frontend/src/pages/Admin.jsx";
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

for (let i = 1990; i < 2270 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
