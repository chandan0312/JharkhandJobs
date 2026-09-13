import fs from 'fs';

const file = "c:/Users/LENOVO/Documents/Github/JharkhandJobs/frontend/src/pages/Admin.jsx";
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

console.log('--- 1. State definition (lines 108-115) ---');
for (let i = 107; i < 115; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

console.log('\n--- 2. Job submit logic (lines 215-252) ---');
for (let i = 214; i < 252; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

console.log('\n--- 3. Edit job handler (lines 1838-1855) ---');
for (let i = 1837; i < 1855; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
