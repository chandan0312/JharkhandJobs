import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pgDb from '../db/pgDb.js';
import mockDb from '../db/mockDb.js';

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

const extractLink = (str) => {
  if (!str) return '';
  const m = str.match(/href="([^"]*)"/i);
  const rawLink = m ? m[1] : '';
  return cleanUrl(rawLink);
};

const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parts[2], parts[1] - 1, parts[0]);
    if (!isNaN(d.getTime())) return d;
  }
  const partsSlash = dateStr.split('/');
  if (partsSlash.length === 3) {
    const d = new Date(partsSlash[2], partsSlash[1] - 1, partsSlash[0]);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
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

const generateDeterministicId = (prefix, board, title) => {
  const normalized = `${board || ''}-${title || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${prefix}-${normalized}`;
};

// Optimizes HTML payload by stripping script/style tags for token savings
const cleanHtmlForAi = (html) => {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// AI Model Parser Engine
const parseHtmlWithGemini = async (rawHtml, isJharkhandPage) => {
  const cleanedHtml = cleanHtmlForAi(rawHtml);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
Analyze the following HTML from a FreeJobAlert listing page:
---
${cleanedHtml}
---

Identify all active job listings and exam updates (admit cards, results, answer keys). Extract the data and return it as a JSON object with two keys:
1. "jobs": An array of job objects.
2. "exams": An array of exam objects.

Each job object in "jobs" must have:
- "title": Clean title of the post (e.g. "Excise Constable", "Assistant Manager"). Do not include vacancy counts in the title itself.
- "company": Organization or board name offering the job (e.g. "JSSC", "IBPS").
- "vacancies": Total number of vacancies as an integer. If not specified, default to 45.
- "qualification": Educational qualification required.
- "lastDate": Last date to apply in 'YYYY-MM-DD' format (or null if none).
- "applyLink": Application/Notification URL (omit any links pointing to freejobalert.com or containing freejobalert).
- "category": One of: "Jharkhand" (if it is a Jharkhand state body or isJharkhandPage is true), "Railway", "SSC", "Defence", "Bank", or "Other".
- "description": 1-2 sentence description of the recruitment.

Each exam object in "exams" must have:
- "title": Clean exam title (e.g. "Excise Constable Admit Card", "CGL Result").
- "organization": Organization name (e.g. "JSSC", "SSC").
- "category": One of: "Admit Card", "Results", or "Answer Key".
- "status": E.g. "Admit Card Out", "Result Out", "Answer Key Out".
- "description": 1-2 sentence description of the exam update.
- "applyLink": URL to view updates (omit freejobalert.com links).

Return ONLY a valid JSON object. Do not wrap it in markdown code block syntax.
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  let responseText = result.response.text().trim();
  if (responseText.startsWith('```')) {
    responseText = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/g, '').trim();
  }

  const parsed = JSON.parse(responseText);
  return {
    jobs: parsed.jobs || [],
    exams: parsed.exams || []
  };
};

// Fallback Table & link parser matching class="latcpb"
const parseHtmlWithRegex = (html, isJharkhandPage) => {
  const jobs = [];
  const exams = [];

  // Parse Jobs
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = trRegex.exec(html)) !== null) {
    const trContent = match[1];
    if (trContent.includes('class="latcpb"') || trContent.includes('class=latcpb')) {
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch;
      const tds = [];
      while ((tdMatch = tdRegex.exec(trContent)) !== null) {
        tds.push(tdMatch[1].trim());
      }
      
      if (tds.length >= 5) {
        const dateStr = cleanText(tds[0]);
        const board = cleanText(tds[1]);
        const postName = cleanText(tds[2]);
        const qual = cleanText(tds[3]);
        const lastDateStr = tds[5] ? cleanText(tds[5]) : '';
        
        const link = extractLink(tds[2]) || extractLink(tds[6]) || extractLink(tds[1]) || '';
        
        let title = postName;
        let vacancies = 45;
        const vacMatch = postName.match(/-\s*(\d+)\s*Posts/i);
        if (vacMatch) {
          vacancies = parseInt(vacMatch[1], 10);
          title = postName.replace(/-\s*\d+\s*Posts/i, '').trim();
        }
        
        const category = determineCategory(board, isJharkhandPage ? 'Jharkhand' : '');
        const lastDate = parseDateString(lastDateStr);

        jobs.push({
          title,
          company: board,
          vacancies,
          qualification: qual || 'Graduation',
          lastDate: lastDate ? lastDate.toISOString().slice(0, 10) : null,
          applyLink: link,
          category,
          description: `Recruitment of ${title} by ${board}. Selection Process: Written Exam / Interview.`
        });
      }
    }
  }

  // Parse Exams
  const aRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let aMatch;
  while ((aMatch = aRegex.exec(html)) !== null) {
    const href = aMatch[1];
    const text = cleanText(aMatch[2]);
    
    if (!href.includes('/articles/') || text.length < 5 || text.includes('Sarkari') || text.includes('Exam Results')) continue;
    
    const isAdmitCard = href.includes('admit-card') || text.toLowerCase().includes('admit card') || text.toLowerCase().includes('hall ticket');
    const isResult = href.includes('result') || text.toLowerCase().includes('result') || text.toLowerCase().includes('rejection list') || text.toLowerCase().includes('marks');
    const isAnswerKey = href.includes('answer-key') || text.toLowerCase().includes('answer key') || text.toLowerCase().includes('keys');
    
    if (isAdmitCard || isResult || isAnswerKey) {
      const category = isAdmitCard ? 'Admit Card' : (isResult ? 'Results' : 'Answer Key');
      const textUpper = text.toUpperCase();
      let orgShort = 'Govt';
      let organization = 'Government Department';
      
      if (textUpper.includes('JSSC')) {
        orgShort = 'JSSC';
        organization = 'Jharkhand Staff Selection Commission';
      } else if (textUpper.includes('JPSC')) {
        orgShort = 'JPSC';
        organization = 'Jharkhand Public Service Commission';
      } else if (textUpper.includes('UPSC')) {
        orgShort = 'UPSC';
        organization = 'Union Public Service Commission';
      } else if (textUpper.includes('SSC')) {
        orgShort = 'SSC';
        organization = 'Staff Selection Commission';
      } else if (textUpper.includes('RRB') || textUpper.includes('RAILWAY')) {
        orgShort = 'Railway';
        organization = 'Railway Recruitment Board';
      }
      
      let title = text
        .replace(/JSSC|JPSC|UPSC|SSC|BPSC|UPPSC/gi, '')
        .replace(/Admit Card|Result|Answer Key|Rejection List/gi, '')
        .replace(/OUT|\(Out\)|2026|2025/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (title.startsWith('-') || title.startsWith('–')) title = title.substring(1).trim();
      if (!title) title = text;
      
      title = title.split(' ').map(w => w ? w[0].toUpperCase() + w.substring(1) : '').join(' ');
      const link = extractLink(href);

      exams.push({
        title,
        organization,
        category,
        status: isAdmitCard ? 'Admit Card Out' : (isResult ? 'Result Out' : 'Answer Key Out'),
        description: `${text}.`,
        applyLink: link
      });
    }
  }

  return { jobs, exams };
};

export const scrapeLandingPages = async () => {
  console.log('🤖 Starting Landing Scraper Agent (AI-Powered)...');
  
  const jobsToInsert = [];
  const examsToInsert = [];

  const targets = [
    { url: 'https://www.freejobalert.com/jharkhand-government-jobs/', isJharkhand: true },
    { url: 'https://www.freejobalert.com/government-jobs/', isJharkhand: false },
    { url: 'https://www.freejobalert.com/bank-jobs/', isJharkhand: false }
  ];

  for (const target of targets) {
    try {
      console.log(`Fetching page: ${target.url}...`);
      const html = await fetchUrl(target.url);
      
      let data = null;
      if (process.env.GEMINI_API_KEY) {
        try {
          console.log(`🤖 Using AI model (Gemini) to parse: ${target.url}`);
          data = await parseHtmlWithGemini(html, target.isJharkhand);
        } catch (err) {
          console.error(`⚠️ Gemini API parsing failed for ${target.url}, falling back to regex:`, err.message);
        }
      }

      if (!data) {
        console.log(`🔌 Running regex fallback parser for: ${target.url}`);
        data = parseHtmlWithRegex(html, target.isJharkhand);
      }

      // Format and push extracted Jobs
      if (data.jobs && Array.isArray(data.jobs)) {
        for (const job of data.jobs) {
          const board = job.company || 'Govt';
          const title = job.title || 'Job Listing';
          
          if (isOtherState(board, title)) continue;

          const category = determineCategory(board, target.isJharkhand ? 'Jharkhand' : (job.category || ''));
          const id = job.applyLink ? (
            (job.applyLink.match(/-(\d+)(?:\.html)?$/) || job.applyLink.match(/-(\d+)\/?$/))?.[1] ? 
            `job-${(job.applyLink.match(/-(\d+)(?:\.html)?$/) || job.applyLink.match(/-(\d+)\/?$/))[1]}` : 
            generateDeterministicId('job', board, title)
          ) : generateDeterministicId('job', board, title);

          let salaryMin = job.salaryMin || 21700;
          let salaryMax = job.salaryMax || 69100;
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
          else if (category === 'Bank') companyColor = '#2563EB';

          jobsToInsert.push({
            id,
            title: cleanReferenceText(title),
            company: cleanReferenceText(board),
            companyInitial,
            companyColor,
            location: category === 'Jharkhand' ? 'Jharkhand, India' : 'All India',
            type: 'Full Time',
            salaryMin,
            salaryMax,
            salaryCurrency: '₹',
            salaryPeriod: 'monthly',
            experience: 'Fresher / Experienced',
            qualification: job.qualification || 'Graduation / Relevant Qualification',
            badgeText: 'Apply Online',
            category,
            industry: 'Govt Jobs',
            description: cleanReferenceText(job.description || `Recruitment of ${title} vacancies by ${board}.`),
            responsibilities: ['Review work deliverables.', 'Maintain records and files.'],
            requirements: [`Possess qualification relevant to ${title}.`, `Satisfy eligibility criteria set by ${board}.`],
            status: 'active',
            postedDate: new Date().toISOString(),
            lastDate: job.lastDate ? new Date(job.lastDate).toISOString().slice(0, 10) : null,
            vacancies: job.vacancies || 45,
            postedBy: 'mock-user-admin-id',
            applyLink: cleanUrl(job.applyLink),
            pdfUrl: cleanUrl(job.applyLink)
          });
        }
      }

      // Format and push extracted Exams
      if (data.exams && Array.isArray(data.exams)) {
        for (const exam of data.exams) {
          const org = exam.organization || 'Government Department';
          const title = exam.title || 'Exam Notice';
          
          if (isOtherState(org, title)) continue;

          const id = exam.applyLink ? (
            (exam.applyLink.match(/-(\d+)(?:\.html)?$/) || exam.applyLink.match(/-(\d+)\/?$/))?.[1] ? 
            `exam-${(exam.applyLink.match(/-(\d+)(?:\.html)?$/) || exam.applyLink.match(/-(\d+)\/?$/))[1]}` : 
            generateDeterministicId('exam', org, title)
          ) : generateDeterministicId('exam', org, title);

          examsToInsert.push({
            id,
            title: cleanReferenceText(title),
            organization: cleanReferenceText(org),
            orgShort: org.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase(),
            category: exam.category || 'Admit Card',
            lastDate: 'Ongoing',
            posts: 'See Notification',
            status: exam.status || 'Admit Card Out',
            description: cleanReferenceText(exam.description || `${title} notice by ${org}.`),
            isNew: true,
            applyLink: cleanUrl(exam.applyLink),
            pdfUrl: cleanUrl(exam.applyLink),
            examDate: '2026'
          });
        }
      }

    } catch (err) {
      console.error(`❌ Error processing target page ${target.url}:`, err.message);
    }
  }

  // ================= Deduplication & Upsert =================
  let addedJobs = 0;
  let addedExams = 0;
  
  const uniqueJobs = Array.from(new Map(jobsToInsert.map(j => [j.id, j])).values());
  const uniqueExams = Array.from(new Map(examsToInsert.map(e => [e.id, e])).values());

  console.log(`Deduplicated: ${uniqueJobs.length} jobs, ${uniqueExams.length} exams. Updating DB...`);

  // A. PostgreSQL Upsert Mode
  if (global.usePgDb && pgDb.getPool()) {
    console.log('PostgreSQL active. Upserting landing scraper results...');
    
    // Upsert Jobs
    for (const job of uniqueJobs) {
      try {
        const lastDate = job.lastDate ? new Date(job.lastDate) : null;
        await pgDb.query(`
          INSERT INTO jobs (id, title, company, company_initial, company_color, location, type, salary_min, salary_max, salary_currency, salary_period, experience, qualification, badge_text, category, industry, description, responsibilities, requirements, status, posted_date, last_date, vacancies, posted_by, apply_link, pdf_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            company = EXCLUDED.company,
            company_initial = EXCLUDED.company_initial,
            company_color = EXCLUDED.company_color,
            location = EXCLUDED.location,
            qualification = EXCLUDED.qualification,
            category = EXCLUDED.category,
            last_date = EXCLUDED.last_date,
            vacancies = EXCLUDED.vacancies,
            apply_link = EXCLUDED.apply_link,
            pdf_url = EXCLUDED.pdf_url,
            updated_at = NOW()
        `, [
          job.id, job.title, job.company, job.companyInitial, job.companyColor, job.location, job.type,
          job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod, job.experience, job.qualification,
          job.badgeText, job.category, job.industry, job.description, job.responsibilities, job.requirements,
          job.status, new Date(job.postedDate), lastDate, job.vacancies, job.postedBy, job.applyLink, job.pdfUrl
        ]);
        addedJobs++;
      } catch (err) {
        console.error(`Error inserting job ${job.id}:`, err.message);
      }
    }
    
    // Upsert Exams
    for (const exam of uniqueExams) {
      try {
        await pgDb.query(`
          INSERT INTO exams (id, title, organization, org_short, category, last_date, posts, status, description, is_new, apply_link, pdf_url, exam_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            organization = EXCLUDED.organization,
            org_short = EXCLUDED.org_short,
            category = EXCLUDED.category,
            status = EXCLUDED.status,
            description = EXCLUDED.description,
            apply_link = EXCLUDED.apply_link,
            pdf_url = EXCLUDED.pdf_url,
            updated_at = NOW()
        `, [
          exam.id, exam.title, exam.organization, exam.orgShort, exam.category, exam.lastDate, exam.posts,
          exam.status, exam.description, exam.isNew, exam.applyLink, exam.pdfUrl, exam.examDate
        ]);
        addedExams++;
      } catch (err) {
        console.error(`Error inserting exam ${exam.id}:`, err.message);
      }
    }
  }

  // B. Fallback JSON File & Mock DB Sync
  const scrapedPath = path.join(__dirname, '..', 'config', 'scraped_data.json');
  let existingData = { jobs: [], exams: [] };
  if (fs.existsSync(scrapedPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
    } catch (e) {}
  }
  
  if (!existingData.jobs) existingData.jobs = [];
  if (!existingData.exams) existingData.exams = [];
  
  // Merge jobs into config JSON if not present or update if present
  for (const job of uniqueJobs) {
    const idx = existingData.jobs.findIndex(j => j._id === job.id);
    const mockJob = {
      _id: job.id,
      title: job.title,
      company: job.company,
      companyInitial: job.companyInitial,
      companyColor: job.companyColor,
      location: job.location,
      type: job.type,
      salary: { min: job.salaryMin, max: job.salaryMax, currency: job.salaryCurrency, period: job.salaryPeriod },
      experience: job.experience,
      qualification: job.qualification,
      badgeText: job.badgeText,
      category: job.category,
      industry: job.industry,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      status: job.status,
      postedDate: job.postedDate,
      lastDate: job.lastDate,
      vacancies: job.vacancies,
      applyLink: job.applyLink,
      pdfUrl: job.pdfUrl
    };
    if (idx !== -1) {
      existingData.jobs[idx] = { ...existingData.jobs[idx], ...mockJob };
    } else {
      existingData.jobs.push(mockJob);
      if (!global.usePgDb) addedJobs++;
    }
  }
  
  // Merge exams into config JSON if not present or update if present
  for (const exam of uniqueExams) {
    const idx = existingData.exams.findIndex(e => e._id === exam.id);
    const mockExam = {
      _id: exam.id,
      title: exam.title,
      organization: exam.organization,
      orgShort: exam.orgShort,
      category: exam.category,
      lastDate: exam.lastDate,
      posts: exam.posts,
      status: exam.status,
      description: exam.description,
      isNew: exam.isNew,
      applyLink: exam.applyLink,
      pdfUrl: exam.pdfUrl,
      examDate: exam.examDate
    };
    if (idx !== -1) {
      existingData.exams[idx] = { ...existingData.exams[idx], ...mockExam };
    } else {
      existingData.exams.push(mockExam);
      if (!global.usePgDb) addedExams++;
    }
  }
  
  fs.writeFileSync(scrapedPath, JSON.stringify(existingData, null, 2), 'utf-8');
  console.log(`✅ scraped_data.json updated with landing scraper results.`);
  
  if (global.useMockDb) {
    mockDb.jobs = existingData.jobs.map(job => ({
      ...job,
      postedDate: job.postedDate ? new Date(job.postedDate) : new Date(),
      lastDate: job.lastDate ? new Date(job.lastDate) : null
    }));
    mockDb.exams = existingData.exams;
    console.log('✅ Mock In-Memory Database synchronized with landing scraper.');
  }
  
  return { success: true, jobsCount: addedJobs, examsCount: addedExams };
};
