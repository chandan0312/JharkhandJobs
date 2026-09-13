import fs from 'fs';

const file1972 = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\ff446f69-30a2-46b8-81ff-a09af9040042\\.system_generated\\steps\\1972\\content.md";
const file1984 = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\ff446f69-30a2-46b8-81ff-a09af9040042\\.system_generated\\steps\\1984\\content.md";

function parseHTML(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  
  // We want to find tr elements that contain class "latcpb" or similar
  // Or we can find all trs, then find tds with latcpb, latcr, latceb, latcqb, latclb, etc.
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  const records = [];
  
  while ((match = trRegex.exec(html)) !== null) {
    const trContent = match[1];
    
    // Check if this is a header or data row by looking for class names
    if (trContent.includes('class="latcpb"') || trContent.includes('class=latcpb')) {
      // It's a job row!
      // Let's parse each td
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch;
      const tds = [];
      while ((tdMatch = tdRegex.exec(trContent)) !== null) {
        tds.push(tdMatch[1].trim());
      }
      
      if (tds.length >= 5) {
        // We have a record!
        // tds[0]: Date
        // tds[1]: Recruitment Board (often has a link or text)
        // tds[2]: Exam/Post Name (often has a link or text)
        // tds[3]: Qualification
        // tds[4]: Advt No (optional, sometimes missing or index shifted)
        // tds[5]: Last Date (optional)
        // tds[6]: More Info link (optional)
        
        // Let's clean tags from cell content
        const cleanText = (str) => {
          if (!str) return '';
          return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        };
        
        // Extract link if any
        const extractLink = (str) => {
          if (!str) return '';
          const m = str.match(/href="([^"]*)"/i);
          return m ? m[1] : '';
        };
        
        const date = cleanText(tds[0]);
        const board = cleanText(tds[1]);
        const postName = cleanText(tds[2]);
        const qual = cleanText(tds[3]);
        const lastDate = tds[5] ? cleanText(tds[5]) : '';
        
        // Links can be in tds[2] or tds[6] or tds[1]
        let link = extractLink(tds[2]) || extractLink(tds[6]) || extractLink(tds[1]) || extractLink(tds[5]);
        
        records.push({
          date,
          board,
          postName,
          qual,
          lastDate,
          link
        });
      }
    }
  }
  return records;
}

const allIndia = parseHTML(file1972);
console.log(`Parsed ${allIndia.length} jobs from All India.`);
console.log('Sample All India:', allIndia.slice(0, 5));

const jharkhand = parseHTML(file1984);
console.log(`Parsed ${jharkhand.length} jobs from Jharkhand.`);
console.log('Sample Jharkhand:', jharkhand.slice(0, 5));
