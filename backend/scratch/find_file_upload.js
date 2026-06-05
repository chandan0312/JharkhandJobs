import fs from 'fs';

const file = "c:/Users/LENOVO/Documents/Github/JharkhandJobs/frontend/src/pages/Admin.jsx";
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('handleExamFileUpload') || line.includes('uploadingFile')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
