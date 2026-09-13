import fs from 'fs';
import path from 'path';

const file = "c:/Users/LENOVO/Documents/Github/JharkhandJobs/frontend/src/pages/JobDetails.jsx";
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.toLowerCase().includes('apply') || line.toLowerCase().includes('download') || line.toLowerCase().includes('pdf')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
