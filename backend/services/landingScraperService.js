import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pgDb from '../config/pgDb.js';
import mockDb from '../config/mockDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to clean HTML entities and extra spaces
const cleanText = (str) => {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Scrub references to source websites in text fields
const cleanReferenceText = (text) => {
  if (!text) return '';
  return text
    .replace(/freejobalert\.com/gi, '')
    .replace(/freejobalert/gi, '')
    .replace(/sarkariresult\.com\.cm/gi, '')
    .replace(/sarkariresult/gi, '')
    .replace(/sarkari result/gi, '')
    .replace(/free job alert/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Scrub urls pointing to the scraped source domains
const cleanUrl = (url) => {
  if (!url) return '';
  const u = String(url).toLowerCase();
  if (
    u.includes('freejobalert') || 
    u.includes('sarkariresult')
  ) {
    return '';
  }
  return url;
};

const otherStateKeywords = [
  'other state',
  'bihar', 'up ', 'uttar pradesh', 'rajasthan', 'mp ', 'madhya pradesh', 'haryana', 
  'delhi', 'punjab', 'gujarat', 'maharashtra', 'kerala', 'tamil nadu', 'karnataka', 
  'ap ', 'andhra pradesh', 'telangana', 'assam', 'west bengal', 'bpsc', 'uppsc', 
  'rpsc', 'mppsc', 'hpsc', 'gpsc', 'mpsc', 'kpsc', 'tnpsc', 'appsc', 'tspsc', 
  'wbpsc', 'apsc', 'ossc', 'ukpsc', 'hppsc', 'jkpsc', 'cgpsc',
  'mizoram', 'odisha', 'orissa', 'opsc', 'osssc', 'gauhati', 'guwahati', 'manipur', 
  'nagaland', 'tripura', 'meghalaya', 'sikkim', 'arunachal', 'himachal', 'hp ', 
  'uttarakhand', 'uk ', 'jammu', 'kashmir', 'j&k', 'goa', 'chhattisgarh', 'cg ', 
  'cgpsc', 'pondicherry', 'puducherry', 'hssc', 'wbssc', 'bssc', 'gpsb', 'osssc',
  'wbcs', 'hprca', 'h cet', 'reet', 'gpssb', 'psssb', 'dsssb', 'uprvunl', 'uppcl', 
  'mppgcl', 'cspgcl', 'wbsetcl', 'wbsedcl', 'tancet', 'keam', 'mhc', 'phc', 'ahc',
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

  if (matchesKeyword(tt)) {
    return true;
  }
  
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

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP request failed with status code ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Generates a deterministic, URL-friendly slug ID to prevent duplicate listings
const generateDeterministicId = (prefix, board, title) => {
  const normalized = `${board}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${prefix}-${normalized}`;
};

// Elegant parser helper to extract board, vacancies, and clean titles
const commonPrefixes = [
  'railway recruitment board', 'railway', 'rrb', 'ssc', 'upsc', 'ibps', 'sbi', 'rbi', 
  'ssb', 'bsf', 'cisf', 'itbp', 'lic', 'gref', 'bro', 'dsssb', 'jssc', 'jpsc', 'jac', 
  'indian navy', 'indian army', 'indian air force', 'iaf', 'ncl', 'cil'
];

const parseTitleText = (rawText) => {
  const text = cleanText(rawText);
  const lowerText = text.toLowerCase();
  
  let board = '';
  for (const prefix of commonPrefixes) {
    if (lowerText.startsWith(prefix)) {
      board = text.substring(0, prefix.length);
      break;
    }
  }
  
  const words = text.split(/\s+/);
  if (!board) {
    if (words[0] && (words[0] === words[0].toUpperCase() || /^[A-Z0-9&]+$/.test(words[0]))) {
      board = words[0];
      if (words[1] && /^[A-Z0-9]+$/.test(words[1]) && words[1].length <= 5) {
        board += ' ' + words[1];
      }
    } else {
      board = words[0] || 'Govt';
    }
  }
  
  let vacancies = 45; // default
  const vacMatch = text.match(/\b(\d{1,3}(?:,\d{3})*|\d+)\s*(?:Posts|Vacancies|Post)?\b/i);
  if (vacMatch) {
    vacancies = parseInt(vacMatch[1].replace(/,/g, ''), 10);
  }
  
  let cleanTitle = text
    .replace(new RegExp(`^${board}`, 'i'), '')
    .replace(/\b(\d{1,3}(?:,\d{3})*|\d+)\s*(?:Posts|Vacancies|Post)?\b/i, '')
    .replace(/Online Form/gi, '')
    .replace(/Offline Form/gi, '')
    .replace(/Recruitment/gi, '')
    .replace(/Notification/gi, '')
    .replace(/\(Out\)|\bOut\b/gi, '')
    .replace(/\(Short Notice\)/gi, '')
    .replace(/\b2025\b|\b2026\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanTitle.startsWith('-') || cleanTitle.startsWith('–')) {
    cleanTitle = cleanTitle.substring(1).trim();
  }
  if (!cleanTitle) {
    cleanTitle = text;
  }
  
  // Title-case the clean title
  cleanTitle = cleanTitle.split(' ').map(w => w ? w[0].toUpperCase() + w.substring(1) : '').join(' ');
  
  return { board, vacancies, cleanTitle };
};

// Extract sections of HTML by heading tags in FreeJobAlert style
const getSectionHtml = (html, headingText) => {
  const regex = new RegExp(
    `<(?:div|h[1-6]|p) class="[^"]*?nutitle[^"]*?">\\s*${headingText}\\s*<\\/(?:div|h[1-6]|p)>([\\s\\S]*?)(?:class="[^"]*?nutitle[^"]*?"|<h[1-6]|<p|$)`, 
    'i'
  );
  const match = html.match(regex);
  return match ? match[1] : '';
};

// Extract links from a block of HTML
const extractLinks = (htmlBlock) => {
  const aRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const links = [];
  while ((match = aRegex.exec(htmlBlock)) !== null) {
    links.push({
      url: match[1].trim(),
      text: cleanText(match[2])
    });
  }
  return links;
};

export const scrapeLandingPages = async () => {
  console.log('🤖 Starting Landing Scraper Agent...');
  
  const jobsToInsert = [];
  const examsToInsert = [];
  
  // ================= 1. SCRAPE FREEJOBALERT HOMEPAGE =================
  try {
    console.log('Fetching FreeJobAlert home page...');
    const fjaHtml = await fetchUrl('https://www.freejobalert.com/');
    
    // Parse Jobs from FJA
    const jobHeadings = ['New Updates', 'Job Notifications', 'State Job Notifications'];
    for (const heading of jobHeadings) {
      const sectionHtml = getSectionHtml(fjaHtml, heading);
      if (sectionHtml) {
        const links = extractLinks(sectionHtml);
        for (const link of links) {
          // If the link itself is not redirecting, clean it
          const cleanLinkVal = cleanUrl(link.url);
          const { board, vacancies, cleanTitle } = parseTitleText(link.text);
          
          if (isOtherState(board, cleanTitle)) continue;
          
          // Exclude exams/admit cards that leak into New Updates
          const textUpper = link.text.toUpperCase();
          if (textUpper.includes('ADMIT CARD') || textUpper.includes('RESULT') || textUpper.includes('ANSWER KEY')) {
            continue;
          }
          
          const category = determineCategory(board, heading === 'State Job Notifications' ? 'Jharkhand' : '');
          const id = generateDeterministicId('job', board, cleanTitle);
          
          let salaryMin = 21700;
          let salaryMax = 69100;
          if (category === 'Jharkhand' || category === 'SSC' || category === 'Railway' || category === 'Defence') {
            salaryMin = 35400;
            salaryMax = 112400;
          } else if (category === 'Bank') {
            salaryMin = 25000;
            salaryMax = 60000;
          }
          
          let companyInitial = board.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
          if (category === 'Jharkhand' && board.toUpperCase().includes('JSSC')) companyInitial = 'JSSC';
          if (category === 'Jharkhand' && board.toUpperCase().includes('JPSC')) companyInitial = 'JPSC';
          
          let companyColor = '#4B5563';
          if (category === 'Jharkhand') companyColor = '#1B8C0A';
          else if (category === 'SSC') companyColor = '#1A73E8';
          else if (category === 'Railway') companyColor = '#D97706';
          
          const cleanBoard = cleanReferenceText(board);
          const cleanTitleStr = cleanReferenceText(cleanTitle);

          jobsToInsert.push({
            id,
            title: cleanTitleStr,
            company: cleanBoard,
            companyInitial,
            companyColor,
            location: category === 'Jharkhand' ? 'Jharkhand, India' : 'All India',
            type: 'Full Time',
            salaryMin,
            salaryMax,
            salaryCurrency: '₹',
            salaryPeriod: 'monthly',
            experience: 'Fresher / Experienced',
            qualification: 'Graduation / Relevant Qualification',
            badgeText: 'Apply Online',
            category,
            industry: 'Govt Jobs',
            description: cleanReferenceText(`Recruitment of ${cleanTitleStr} vacancies by ${cleanBoard}. Selection process involves a written examination and/or interview. Please check official guidelines.`),
            responsibilities: ['Review work deliverables.', 'Maintain records and files.'],
            requirements: [`Possess qualification relevant to ${cleanTitleStr}.`, `Satisfy eligibility criteria set by ${cleanBoard}.`],
            status: 'active',
            postedDate: new Date().toISOString(),
            lastDate: null,
            vacancies,
            postedBy: 'mock-user-admin-id',
            applyLink: cleanLinkVal,
            pdfUrl: cleanLinkVal
          });
        }
      }
    }
    
    // Parse Exams from FJA
    const examHeadings = [
      { name: 'Admit Card', category: 'Admit Card', status: 'Admit Card Out' },
      { name: 'Results', category: 'Results', status: 'Result Out' },
      { name: 'Answer Keys', category: 'Answer Key', status: 'Answer Key Out' }
    ];
    for (const heading of examHeadings) {
      const sectionHtml = getSectionHtml(fjaHtml, heading.name);
      if (sectionHtml) {
        const links = extractLinks(sectionHtml);
        for (const link of links) {
          const cleanLinkVal = cleanUrl(link.url);
          const { board, cleanTitle } = parseTitleText(link.text);
          
          if (isOtherState(board, cleanTitle)) continue;
          
          const id = generateDeterministicId('exam', board, cleanTitle);
          const cleanOrg = cleanReferenceText(board);
          const cleanTitleStr = cleanReferenceText(cleanTitle);

          examsToInsert.push({
            id,
            title: cleanTitleStr,
            organization: cleanOrg,
            orgShort: board.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase(),
            category: heading.category,
            lastDate: 'Ongoing',
            posts: 'See Notification',
            status: heading.status,
            description: cleanReferenceText(`${cleanTitleStr} notification released by ${cleanOrg}. Check latest updates.`),
            isNew: true,
            applyLink: cleanLinkVal,
            pdfUrl: cleanLinkVal,
            examDate: '2026'
          });
        }
      }
    }
  } catch (err) {
    console.error('Error fetching/parsing FreeJobAlert homepage:', err.message);
  }

  // ================= 2. SCRAPE SARKARIRESULT HOMEPAGE =================
  try {
    console.log('Fetching SarkariResult home page...');
    const srHtml = await fetchUrl('https://sarkariresult.com.cm/');
    
    const parseSRSection = (html, headingText) => {
      // e.g. <p class="gb-headline gb-headline-e0e3e801 gb-headline-text">Results</p>
      const regex = new RegExp(
        `<(?:div|h[1-6]|p) class="[^"]*?gb-headline[^"]*?">\\s*${headingText}\\s*<\\/(?:div|h[1-6]|p)>([\\s\\S]*?)<\/ul>`, 
        'i'
      );
      const match = html.match(regex);
      return match ? match[1] : '';
    };

    // Parse Latest Jobs from SR
    const srJobsHtml = parseSRSection(srHtml, 'Latest Jobs');
    if (srJobsHtml) {
      const links = extractLinks(srJobsHtml);
      for (const link of links) {
        const cleanLinkVal = cleanUrl(link.url);
        const { board, vacancies, cleanTitle } = parseTitleText(link.text);
        
        if (isOtherState(board, cleanTitle)) continue;
        
        const category = determineCategory(board, '');
        const id = generateDeterministicId('job', board, cleanTitle);
        
        let salaryMin = 21700;
        let salaryMax = 69100;
        if (category === 'Jharkhand' || category === 'SSC' || category === 'Railway' || category === 'Defence') {
          salaryMin = 35400;
          salaryMax = 112400;
        }
        
        let companyInitial = board.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
        let companyColor = '#4B5563';
        if (category === 'SSC') companyColor = '#1A73E8';
        else if (category === 'Railway') companyColor = '#D97706';
        
        const cleanBoard = cleanReferenceText(board);
        const cleanTitleStr = cleanReferenceText(cleanTitle);

        jobsToInsert.push({
          id,
          title: cleanTitleStr,
          company: cleanBoard,
          companyInitial,
          companyColor,
          location: 'All India',
          type: 'Full Time',
          salaryMin,
          salaryMax,
          salaryCurrency: '₹',
          salaryPeriod: 'monthly',
          experience: 'Fresher / Experienced',
          qualification: 'Graduation / Relevant Qualification',
          badgeText: 'Apply Online',
          category,
          industry: 'Govt Jobs',
          description: cleanReferenceText(`Recruitment of ${cleanTitleStr} vacancies by ${cleanBoard}. Selection process involves a written examination and/or interview. Please check official guidelines.`),
          responsibilities: ['Review work deliverables.', 'Maintain records and files.'],
          requirements: [`Possess qualification relevant to ${cleanTitleStr}.`, `Satisfy eligibility criteria set by ${cleanBoard}.`],
          status: 'active',
          postedDate: new Date().toISOString(),
          lastDate: null,
          vacancies,
          postedBy: 'mock-user-admin-id',
          applyLink: cleanLinkVal,
          pdfUrl: cleanLinkVal
        });
      }
    }

    // Parse Exams from SR
    const srExams = [
      { name: 'Admit Cards', category: 'Admit Card', status: 'Admit Card Out' },
      { name: 'Results', category: 'Results', status: 'Result Out' },
      { name: 'Answer Key', category: 'Answer Key', status: 'Answer Key Out' }
    ];
    for (const block of srExams) {
      const srExamsHtml = parseSRSection(srHtml, block.name);
      if (srExamsHtml) {
        const links = extractLinks(srExamsHtml);
        for (const link of links) {
          const cleanLinkVal = cleanUrl(link.url);
          const { board, cleanTitle } = parseTitleText(link.text);
          
          if (isOtherState(board, cleanTitle)) continue;
          
          const id = generateDeterministicId('exam', board, cleanTitle);
          const cleanOrg = cleanReferenceText(board);
          const cleanTitleStr = cleanReferenceText(cleanTitle);

          examsToInsert.push({
            id,
            title: cleanTitleStr,
            organization: cleanOrg,
            orgShort: board.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase(),
            category: block.category,
            lastDate: 'Ongoing',
            posts: 'See Notification',
            status: block.status,
            description: cleanReferenceText(`${cleanTitleStr} notification released by ${cleanOrg}. Check latest updates.`),
            isNew: true,
            applyLink: cleanLinkVal,
            pdfUrl: cleanLinkVal,
            examDate: '2026'
          });
        }
      }
    }
  } catch (err) {
    console.error('Error fetching/parsing SarkariResult homepage:', err.message);
  }

  // ================= 3. DATABASE DEDUPLICATION & UPSERT =================
  let addedJobs = 0;
  let addedExams = 0;
  
  // Deduplicate array values fetched
  const uniqueJobs = Array.from(new Map(jobsToInsert.map(j => [j.id, j])).values());
  const uniqueExams = Array.from(new Map(examsToInsert.map(e => [e.id, e])).values());
  
  console.log(`Deduplicated: ${uniqueJobs.length} jobs, ${uniqueExams.length} exams. Starting check and insert...`);

  // A. PostgreSQL Mode
  if (global.usePgDb && pgDb.getPool()) {
    console.log('PostgreSQL database active. Inserting new records...');
    
    // Check & Insert Jobs
    for (const job of uniqueJobs) {
      try {
        const checkRes = await pgDb.query('SELECT 1 FROM jobs WHERE id = $1', [job.id]);
        if (checkRes.rows.length === 0) {
          await pgDb.query(`
            INSERT INTO jobs (id, title, company, company_initial, company_color, location, type, salary_min, salary_max, salary_currency, salary_period, experience, qualification, badge_text, category, industry, description, responsibilities, requirements, status, posted_date, vacancies, posted_by, apply_link, pdf_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
          `, [
            job.id, job.title, job.company, job.companyInitial, job.companyColor, job.location, job.type,
            job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod, job.experience, job.qualification,
            job.badgeText, job.category, job.industry, job.description, job.responsibilities, job.requirements,
            job.status, new Date(job.postedDate), job.vacancies, job.postedBy, job.applyLink, job.pdfUrl
          ]);
          addedJobs++;
        }
      } catch (err) {
        console.error(`Error inserting job ${job.id}:`, err.message);
      }
    }
    
    // Check & Insert Exams
    for (const exam of uniqueExams) {
      try {
        const checkRes = await pgDb.query('SELECT 1 FROM exams WHERE id = $1', [exam.id]);
        if (checkRes.rows.length === 0) {
          await pgDb.query(`
            INSERT INTO exams (id, title, organization, org_short, category, last_date, posts, status, description, is_new, apply_link, pdf_url, exam_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          `, [
            exam.id, exam.title, exam.organization, exam.orgShort, exam.category, exam.lastDate, exam.posts,
            exam.status, exam.description, exam.isNew, exam.applyLink, exam.pdfUrl, exam.examDate
          ]);
          addedExams++;
        }
      } catch (err) {
        console.error(`Error inserting exam ${exam.id}:`, err.message);
      }
    }
  }

  // B. JSON Fallback & Mock Database Mode
  const scrapedPath = path.join(__dirname, '..', 'config', 'scraped_data.json');
  let existingData = { jobs: [], exams: [] };
  if (fs.existsSync(scrapedPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
    } catch (e) {}
  }
  
  if (!existingData.jobs) existingData.jobs = [];
  if (!existingData.exams) existingData.exams = [];
  
  // Merge jobs into config JSON if not present
  for (const job of uniqueJobs) {
    const exists = existingData.jobs.some(j => j._id === job.id);
    if (!exists) {
      existingData.jobs.push({
        _id: job.id,
        ...job,
        salary: { min: job.salaryMin, max: job.salaryMax, currency: job.salaryCurrency, period: job.salaryPeriod }
      });
      if (!global.usePgDb) addedJobs++; // if mock is active, count this towards added
    }
  }
  
  // Merge exams into config JSON if not present
  for (const exam of uniqueExams) {
    const exists = existingData.exams.some(e => e._id === exam.id);
    if (!exists) {
      existingData.exams.push({
        _id: exam.id,
        ...exam
      });
      if (!global.usePgDb) addedExams++;
    }
  }
  
  fs.writeFileSync(scrapedPath, JSON.stringify(existingData, null, 2), 'utf-8');
  console.log(`✅ scraped_data.json updated on disk.`);
  
  if (global.useMockDb) {
    // Reload mock DB in memory
    mockDb.jobs = existingData.jobs.map(job => ({
      ...job,
      postedDate: job.postedDate ? new Date(job.postedDate) : new Date(),
      lastDate: job.lastDate ? new Date(job.lastDate) : null
    }));
    mockDb.exams = existingData.exams;
    console.log('✅ Mock In-Memory Database synchronized.');
  }
  
  return { success: true, jobsCount: addedJobs, examsCount: addedExams };
};
