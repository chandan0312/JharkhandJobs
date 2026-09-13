import fs from 'fs';
import path from 'path';

const file1972 = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\ff446f69-30a2-46b8-81ff-a09af9040042\\.system_generated\\steps\\1972\\content.md";
const file1984 = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\ff446f69-30a2-46b8-81ff-a09af9040042\\.system_generated\\steps\\1984\\content.md";

console.log('Checking file 1972:');
if (fs.existsSync(file1972)) {
  const content = fs.readFileSync(file1972, 'utf-8');
  console.log('Length:', content.length);
  console.log('Includes Jharkhand:', content.toLowerCase().includes('jharkhand'));
  console.log('Includes JPSC:', content.toLowerCase().includes('jpsc'));
  console.log('Includes table:', content.toLowerCase().includes('<table'));
} else {
  console.log('file1972 does not exist');
}

console.log('Checking file 1984:');
if (fs.existsSync(file1984)) {
  const content = fs.readFileSync(file1984, 'utf-8');
  console.log('Length:', content.length);
  console.log('Includes Jharkhand:', content.toLowerCase().includes('jharkhand'));
  console.log('Includes JPSC:', content.toLowerCase().includes('jpsc'));
  console.log('Includes table:', content.toLowerCase().includes('<table'));
} else {
  console.log('file1984 does not exist');
}
