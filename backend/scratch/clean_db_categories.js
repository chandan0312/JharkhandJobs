import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const otherStateKeywords = [
  'other state',
  'bihar', 'up ', 'uttar pradesh', 'rajasthan', 'mp ', 'madhya pradesh', 'haryana', 
  'delhi', 'punjab', 'gujarat', 'maharashtra', 'kerala', 'tamil nadu', 'karnataka', 
  'ap ', 'andhra pradesh', 'telangana', 'assam', 'west bengal', 'bpsc', 'uppsc', 
  'rpsc', 'mppsc', 'hpsc', 'gpsc', 'mpsc', 'kpsc', 'tnpsc', 'appsc', 'tspsc', 
  'wbpsc', 'apsc', 'ossc', 'ukpsc', 'hppsc', 'jkpsc', 'cgpsc',
  // Expanded state names, capitals, and boards
  'mizoram', 'odisha', 'orissa', 'opsc', 'osssc', 'gauhati', 'guwahati', 'manipur', 
  'nagaland', 'tripura', 'meghalaya', 'sikkim', 'arunachal', 'himachal', 'hp ', 
  'uttarakhand', 'uk ', 'jammu', 'kashmir', 'j&k', 'goa', 'chhattisgarh', 'cg ', 
  'cgpsc', 'pondicherry', 'puducherry', 'hssc', 'wbssc', 'bssc', 'gpsb', 'osssc',
  'wbcs', 'hprca', 'h cet', 'reet', 'gpssb', 'psssb', 'dsssb', 'uprvunl', 'uppcl', 
  'mppgcl', 'cspgcl', 'wbsetcl', 'wbsedcl', 'tancet', 'keam', 'mhc', 'phc', 'ahc',
  // Shortcodes matching prefixes
  'uksssc', 'upsssc', 'uks ', 'uks-', 'uks_', 'ups ', 'ups-', 'ups_', 'uks', 'ups'
];

const isOtherState = (boardName, titleText) => {
  const bn = String(boardName || '').toLowerCase();
  const tt = String(titleText || '').toLowerCase();
  
  const matchesKeyword = (str) => {
    return otherStateKeywords.some(keyword => {
      const kw = keyword.trim();
      if (kw.length <= 3) {
        // Use word boundaries to avoid matching substrings like 'up' in 'group' or 'ap' in 'apply'
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        return regex.test(str);
      }
      return str.includes(keyword);
    });
  };

  // 1. If title text matches other state keywords, it is other state
  if (matchesKeyword(tt)) {
    return true;
  }
  
  // 2. Skip if it is a Jharkhand-specific body or city in organization
  if (
    bn.includes('jharkhand') || bn.includes('jssc') || bn.includes('jpsc') || 
    bn.includes('jac') || bn.includes('jhgd') || bn.includes('juvnl') || 
    bn.includes('ranchi') || bn.includes('jamshedpur') || bn.includes('dhanbad') || 
    bn.includes('bokaro') || bn.includes('deoghar')
  ) {
    return false;
  }
  
  return matchesKeyword(bn);
};

const determineCategory = (boardName, categoryName) => {
  const bn = String(boardName || '').toLowerCase();
  const cat = String(categoryName || '').toLowerCase();
  
  if (bn.includes('jharkhand') || bn.includes('jssc') || bn.includes('jpsc') || bn.includes('jac') || bn.includes('jhgd') || bn.includes('juvnl')) {
    return 'Jharkhand';
  }
  if (bn.includes('railway') || bn.includes('rrb') || bn.includes('rrc')) {
    return 'Railway';
  }
  if (bn.includes('ssc') && !bn.includes('jssc') && !bn.includes('hssc') && !bn.includes('ossc')) {
    return 'SSC';
  }
  if (
    bn.includes('defence') || bn.includes('army') || bn.includes('navy') || 
    bn.includes('air force') || bn.includes('iaf') || bn.includes('cisf') || 
    bn.includes('ssb') || bn.includes('bsf') || bn.includes('itbp') || 
    bn.includes('nda') || bn.includes('agniveer') || bn.includes('coast guard')
  ) {
    return 'Defence';
  }
  if (
    bn.includes('bank') || bn.includes('sbi') || bn.includes('ibps') || 
    bn.includes('rbi') || bn.includes('bob') || bn.includes('pnb') || 
    bn.includes('tmb') || bn.includes('cooperative') || bn.includes('co-operative')
  ) {
    return 'Bank';
  }
  if (cat.includes('private')) {
    return 'Private';
  }
  
  return 'Other';
};

const cleanReferenceText = (text) => {
  if (!text) return '';
  return text
    .replace(/Source:\s*FreeJobAlert\s*\(https:\/\/www\.freejobalert\.com[^)]*\)/gi, '')
    .replace(/Source:\s*FreeJobAlert\s*\(https:\/\/www\.freejobalert\.com\)/gi, '')
    .replace(/Source:\s*FreeJobAlert/gi, '')
    .replace(/Source:\s*Sarkari\s*Result\s*\(https:\/\/sarkariresult\.com\.cm[^)]*\)/gi, '')
    .replace(/Source:\s*Sarkari\s*Result/gi, '')
    .replace(/freejobalert\.com/gi, '')
    .replace(/freejobalert/gi, '')
    .replace(/sarkariresult\.com\.cm/gi, '')
    .replace(/sarkariresult/gi, '')
    .replace(/sarkari result/gi, '')
    .replace(/free job alert/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const cleanLink = (link) => {
  if (!link) return '';
  const l = String(link).toLowerCase();
  if (l.includes('freejobalert.com') || l.includes('freejobalert') || l.includes('sarkariresult')) {
    return '';
  }
  return link;
};

export const runCleanup = async () => {
  console.log('🧹 Starting Database Category & Link Cleanup...');

  // 1. Clean JSON File
  try {
    const scrapedPath = path.join(__dirname, '..', 'config', 'scraped_data.json');
    if (fs.existsSync(scrapedPath)) {
      const data = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
      let jobsCleaned = 0;
      let examsCleaned = 0;

      if (data.jobs && Array.isArray(data.jobs)) {
        const initialCount = data.jobs.length;
        data.jobs = data.jobs.filter(job => {
          // Exclude other state jobs
          if (job.category === 'Other State' || isOtherState(job.company, job.title)) {
            return false;
          }
          return true;
        }).map(job => {
          // Normalize categories
          job.category = determineCategory(job.company, job.category);
          
          // Clear freejobalert links
          job.applyLink = cleanLink(job.applyLink);
          job.pdfUrl = cleanLink(job.pdfUrl);
          
          // Scrub references in strings
          job.title = cleanReferenceText(job.title);
          job.company = cleanReferenceText(job.company);
          job.description = cleanReferenceText(job.description);
          
          return job;
        });
        jobsCleaned = initialCount - data.jobs.length;
      }

      if (data.exams && Array.isArray(data.exams)) {
        const initialCount = data.exams.length;
        data.exams = data.exams.filter(exam => {
          if (exam.category === 'Other State' || isOtherState(exam.organization, exam.title)) {
            return false;
          }
          return true;
        }).map(exam => {
          // Clear freejobalert links
          exam.applyLink = cleanLink(exam.applyLink);
          exam.pdfUrl = cleanLink(exam.pdfUrl);
          
          // Scrub references in strings
          exam.title = cleanReferenceText(exam.title);
          exam.organization = cleanReferenceText(exam.organization);
          exam.description = cleanReferenceText(exam.description);
          
          return exam;
        });
        examsCleaned = initialCount - data.exams.length;
      }

      fs.writeFileSync(scrapedPath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`✅ [JSON] Removed ${jobsCleaned} jobs & ${examsCleaned} exams belonging to other states.`);
      console.log(`✅ [JSON] normalized categories and cleared FreeJobAlert redirect links.`);
    }
  } catch (err) {
    console.error('❌ Error cleaning scraped_data.json:', err.message);
  }

  // 2. Clean PostgreSQL Database
  if (process.env.DATABASE_URL) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL
    });

    try {
      console.log('🔌 Connecting to PostgreSQL for cleanup...');
      
      // Fetch all jobs to process in JS (much safer for regex logic)
      const jobsRes = await pool.query('SELECT * FROM jobs');
      console.log(`[PG] Processing ${jobsRes.rows.length} jobs...`);
      for (const row of jobsRes.rows) {
        if (row.category === 'Other State' || isOtherState(row.company, row.title)) {
          await pool.query('DELETE FROM jobs WHERE id = $1', [row.id]);
        } else {
          const newCat = determineCategory(row.company, row.category);
          const newApplyLink = cleanLink(row.apply_link);
          const newPdfUrl = cleanLink(row.pdf_url);
          const newTitle = cleanReferenceText(row.title);
          const newCompany = cleanReferenceText(row.company);
          const newDesc = cleanReferenceText(row.description);
          await pool.query(
            'UPDATE jobs SET category = $1, apply_link = $2, pdf_url = $3, title = $4, company = $5, description = $6 WHERE id = $7',
            [newCat, newApplyLink, newPdfUrl, newTitle, newCompany, newDesc, row.id]
          );
        }
      }

      // Fetch all exams to process
      const examsRes = await pool.query('SELECT * FROM exams');
      console.log(`[PG] Processing ${examsRes.rows.length} exams/notices...`);
      for (const row of examsRes.rows) {
        if (row.category === 'Other State' || isOtherState(row.organization, row.title)) {
          await pool.query('DELETE FROM exams WHERE id = $1', [row.id]);
        } else {
          const newApplyLink = cleanLink(row.apply_link);
          const newPdfUrl = cleanLink(row.pdf_url);
          const newTitle = cleanReferenceText(row.title);
          const newOrg = cleanReferenceText(row.organization);
          const newDesc = cleanReferenceText(row.description);
          await pool.query(
            'UPDATE exams SET apply_link = $1, pdf_url = $2, title = $3, organization = $4, description = $5 WHERE id = $6',
            [newApplyLink, newPdfUrl, newTitle, newOrg, newDesc, row.id]
          );
        }
      }

      console.log('✅ [PG] PostgreSQL cleanup complete.');
    } catch (err) {
      console.error('❌ Error executing PG cleanup queries:', err.message);
    } finally {
      await pool.end();
    }
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith('clean_db_categories.js')) {
  runCleanup().catch(console.error);
}
