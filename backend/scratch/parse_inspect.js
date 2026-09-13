import fs from 'fs';

const cleanText = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

const extractLink = (str) => {
  if (!str) return '';
  const m = str.match(/href="([^"]*)"/i);
  return m ? m[1] : '';
};

const html = fs.readFileSync('scratch/gov_jobs_live.html', 'utf-8');
const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
let match;
const boards = new Set();

while ((match = trRegex.exec(html)) !== null) {
  const trContent = match[1];
  if (trContent.includes('class="latcpb"') || trContent.includes('class=latcpb')) {
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
    const tds = [];
    while ((tdMatch = tdRegex.exec(trContent)) !== null) {
      tds.push(tdMatch[1].trim());
    }
    if (tds.length >= 2) {
      boards.add(cleanText(tds[1]));
    }
  }
}

console.log('Boards in gov_jobs_live.html:');
console.log(Array.from(boards));
