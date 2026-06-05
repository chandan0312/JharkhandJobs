import fs from 'fs';

const file1972 = "C:/Users/LENOVO/.gemini/antigravity-ide/brain/ff446f69-30a2-46b8-81ff-a09af9040042/.system_generated/steps/1972/content.md";
const file1984 = "C:/Users/LENOVO/.gemini/antigravity-ide/brain/ff446f69-30a2-46b8-81ff-a09af9040042/.system_generated/steps/1984/content.md";

function searchLinks(filePath, name) {
  console.log(`\n=== Links search in ${name} ===`);
  const html = fs.readFileSync(filePath, 'utf-8');
  
  // Find all <a> tags
  const aRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const results = [];
  while ((match = aRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    const isAdmitCard = href.includes('admit-card') || text.toLowerCase().includes('admit card') || text.toLowerCase().includes('hall ticket');
    const isResult = href.includes('result') || text.toLowerCase().includes('result') || text.toLowerCase().includes('rejection list') || text.toLowerCase().includes('marks');
    const isAnswerKey = href.includes('answer-key') || text.toLowerCase().includes('answer key') || text.toLowerCase().includes('keys');
    
    // Ignore generic navigation links
    if ((isAdmitCard || isResult || isAnswerKey) && href.includes('/articles/') && text.length > 5 && !text.includes('Sarkari') && !text.includes('Exam Results')) {
      results.push({
        text,
        href,
        type: isAdmitCard ? 'Admit Card' : (isResult ? 'Results' : 'Answer Key')
      });
    }
  }
  
  console.log(`Found ${results.length} related links.`);
  console.log('Samples:', results.slice(0, 15));
}

searchLinks(file1972, '1972 (All India)');
searchLinks(file1984, '1984 (Jharkhand)');
