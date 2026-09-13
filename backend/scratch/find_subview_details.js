import fs from 'fs';

const file = "c:/Users/LENOVO/Documents/Github/JharkhandJobs/frontend/src/pages/Admin.jsx";
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

const searchTerms = [
  "activeMenu === 'Users'",
  "activeMenu === 'Subscribers'",
  "activeMenu === 'Contacts'",
  "activeMenu === 'Newsletter'",
  "activeMenu === 'Study Material'",
  "activeMenu === 'Success Stories'",
  "activeMenu === 'Reports'",
  "activeMenu === 'Settings'",
  "activeMenu === 'Discussion'"
];

searchTerms.forEach(term => {
  console.log(`\n=== Matches for: ${term} ===`);
  lines.forEach((line, idx) => {
    if (line.includes(term)) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
      // print surrounding 10 lines
      const start = Math.max(0, idx - 2);
      const end = Math.min(lines.length - 1, idx + 12);
      for (let i = start; i <= end; i++) {
        console.log(`  [${i + 1}] ${lines[i]}`);
      }
    }
  });
});
