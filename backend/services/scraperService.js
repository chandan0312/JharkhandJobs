import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pgDb from '../db/pgDb.js';
import mockDb from '../db/mockDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanText = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

const extractLink = (str) => {
  if (!str) return '';
  const m = str.match(/href="([^"]*)"/i);
  const rawLink = m ? m[1] : '';
  if (rawLink.includes('freejobalert') || rawLink.includes('freejobalert.com')) {
    return '';
  }
  return rawLink;
};

const cleanLink = (link) => {
  if (!link) return '';
  if (link.includes('freejobalert.com') || link.includes('freejobalert')) {
    return '';
  }
  return link;
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
  
  // 3. Check if organization contains other state keywords
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

function parseJobs(html, isJharkhandPage = false) {
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  const jobs = [];
  
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
        
        // Exclude links pointing to freejobalert (cleared in extractLink)
        const link = extractLink(tds[2]) || extractLink(tds[6]) || extractLink(tds[1]) || '';
        const idMatch = link ? (link.match(/-(\d+)(?:\.html)?$/) || link.match(/-(\d+)\/?$/)) : null;
        const id = idMatch ? `job-${idMatch[1]}` : `job-scraped-${Math.random().toString(36).substring(2, 9)}`;
        
        let title = postName;
        let vacancies = 45;
        const vacMatch = postName.match(/-\s*(\d+)\s*Posts/i);
        if (vacMatch) {
          vacancies = parseInt(vacMatch[1], 10);
          title = postName.replace(/-\s*\d+\s*Posts/i, '').trim();
        }
        
        // Exclude state level jobs from other states
        if (isOtherState(board, title)) {
          continue;
        }

        const category = determineCategory(board, isJharkhandPage ? 'Jharkhand' : '');
        
        let companyInitial = board.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
        if (category === 'Jharkhand' && board.toUpperCase().includes('JSSC')) companyInitial = 'JSSC';
        if (category === 'Jharkhand' && board.toUpperCase().includes('JPSC')) companyInitial = 'JPSC';
        
        let companyColor = '#4B5563';
        if (category === 'Jharkhand') companyColor = '#1B8C0A';
        else if (category === 'SSC') companyColor = '#1A73E8';
        else if (category === 'Railway') companyColor = '#D97706';
        else if (category === 'Bank') companyColor = '#2563EB';
        else if (category === 'Defence') companyColor = '#059669';
        else if (category === 'Other') companyColor = '#9333EA';
        
        const location = category === 'Jharkhand' ? 'Jharkhand, India' : 'All India';
        
        let salaryMin = 21700;
        let salaryMax = 69100;
        if (category === 'Other') {
          salaryMin = 56100;
          salaryMax = 177500;
        } else if (category === 'Jharkhand' || category === 'SSC' || category === 'Railway' || category === 'Defence') {
          salaryMin = 35400;
          salaryMax = 112400;
        } else if (category === 'Bank') {
          salaryMin = 25000;
          salaryMax = 60000;
        }
        
        const postedDate = parseDateString(dateStr) || new Date();
        const lastDate = parseDateString(lastDateStr);
        
        jobs.push({
          _id: id,
          title,
          company: board,
          companyInitial,
          companyColor,
          location,
          type: 'Full Time',
          salary: { min: salaryMin, max: salaryMax, currency: '₹', period: 'monthly' },
          experience: 'Fresher / Experienced',
          qualification: qual || 'Graduation',
          badgeText: 'Apply Online',
          category,
          industry: 'Govt Jobs',
          description: `Recruitment of ${title} by ${board}. Selection Process: Written Exam / Interview.`,
          responsibilities: [
            'Prepare for the exam as per the official syllabus.',
            'Follow directives and updates on the official website.'
          ],
          requirements: [
            `Must satisfy the age limit as per ${board} guidelines.`,
            `Must possess qualification: ${qual}`
          ],
          status: 'active',
          postedDate: postedDate.toISOString(),
          lastDate: lastDate ? lastDate.toISOString() : null,
          vacancies,
          applyLink: link,
          pdfUrl: link
        });
      }
    }
  }
  return jobs;
}

function parseExams(html, isJharkhandPage = false) {
  const aRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const exams = [];
  
  while ((match = aRegex.exec(html)) !== null) {
    const href = match[1];
    const text = cleanText(match[2]);
    
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
      } else if (
        textUpper.includes('UKSSSC') || textUpper.includes('UPSSSC') || 
        textUpper.includes('HPSSC') || textUpper.includes('HSSC') || 
        textUpper.includes('OSSC') || textUpper.includes('BSSC') || 
        textUpper.includes('WBSSC') || textUpper.includes('CGSSC') || 
        textUpper.includes('MPSSC') || textUpper.includes('APSSC') ||
        textUpper.includes('GPSSB') || textUpper.includes('PSSSB') ||
        textUpper.includes('OSSSC') || textUpper.includes('OPSC') ||
        textUpper.includes('BPSC') || textUpper.includes('UPPSC') ||
        textUpper.includes('RPSC') || textUpper.includes('MPPSC') ||
        textUpper.includes('TSPSC') || textUpper.includes('APPSC') ||
        textUpper.includes('MPSC') || textUpper.includes('KPSC') ||
        textUpper.includes('TNPSC') || textUpper.includes('WBCS') ||
        textUpper.includes('HPRCA')
      ) {
        orgShort = 'Other State';
        organization = 'Other State Commission';
      } else if (textUpper.includes('SSC')) {
        orgShort = 'SSC';
        organization = 'Staff Selection Commission';
      } else if (textUpper.includes('RRB') || textUpper.includes('RAILWAY')) {
        orgShort = 'Railway';
        organization = 'Railway Recruitment Board';
      } else if (textUpper.includes('HIGH COURT')) {
        if (textUpper.includes('JAC') || textUpper.includes('JHARKHAND') || textUpper.includes('RANCHI')) {
          orgShort = 'High Court';
          organization = 'Jharkhand High Court';
        } else {
          orgShort = 'Other State';
          organization = 'Other State High Court';
        }
      } else if (textUpper.includes('ARMY') || textUpper.includes('AGNIVEER')) {
        orgShort = 'Army';
        organization = 'Indian Army';
      } else if (textUpper.includes('NAVY')) {
        orgShort = 'Navy';
        organization = 'Indian Navy';
      }
      
      // Exclude state level notifications from other states
      if (isOtherState(organization, text)) {
        continue;
      }

      const idMatch = href.match(/-(\d+)(?:\.html)?$/) || href.match(/-(\d+)\/?$/);
      const id = idMatch ? `exam-${idMatch[1]}` : `exam-scraped-${Math.random().toString(36).substring(2, 9)}`;
      
      let title = text
        .replace(/JSSC|JPSC|UPSC|SSC|BPSC|UPPSC/gi, '')
        .replace(/Admit Card|Result|Answer Key|Rejection List/gi, '')
        .replace(/OUT|\(Out\)|2026|2025/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (title.startsWith('-') || title.startsWith('–')) title = title.substring(1).trim();
      if (!title) title = text;
      
      title = title.split(' ').map(w => w ? w[0].toUpperCase() + w.substring(1) : '').join(' ');
      
      const link = extractLink(href); // Clears freejobalert redirects

      exams.push({
        _id: id,
        title,
        organization,
        orgShort,
        category,
        lastDate: 'Ongoing',
        posts: 'See Notification',
        status: isAdmitCard ? 'Admit Card Out' : (isResult ? 'Result Out' : 'Answer Key Out'),
        description: `${text}.`,
        isNew: true,
        applyLink: link,
        pdfUrl: link,
        examDate: '2026'
      });
    }
  }
  return exams;
}

export const scrapeAndUpsertData = async () => {
  console.log('🤖 Starting Live Web Scraper service...');
  try {
    const govHtml = await fetchUrl('https://www.freejobalert.com/government-jobs/');
    const jhHtml = await fetchUrl('https://www.freejobalert.com/jharkhand-government-jobs/');
    
    console.log('📄 Pages successfully fetched. Parsing jobs and notices...');
    const allIndiaJobs = parseJobs(govHtml, false);
    const jharkhandJobs = parseJobs(jhHtml, true);
    const parsedJobs = [...jharkhandJobs, ...allIndiaJobs];
    
    const uniqueJobsMap = new Map();
    for (const job of parsedJobs) {
      uniqueJobsMap.set(job._id, job);
    }
    const uniqueJobs = Array.from(uniqueJobsMap.values());
    
    const allIndiaExams = parseExams(govHtml, false);
    const jharkhandExams = parseExams(jhHtml, true);
    const parsedExams = [...jharkhandExams, ...allIndiaExams];
    
    const uniqueExamsMap = new Map();
    for (const exam of parsedExams) {
      uniqueExamsMap.set(exam._id, exam);
    }
    const uniqueExams = Array.from(uniqueExamsMap.values());

    console.log(`📊 Extracted ${uniqueJobs.length} jobs and ${uniqueExams.length} exam notices.`);

    // 1. PostgreSQL Database Upsert
    if (global.usePgDb && pgDb.getPool()) {
      console.log('🔌 PostgreSQL active. Upserting records...');
      
      // Upsert Jobs
      for (const job of uniqueJobs) {
        const lastDate = job.lastDate ? new Date(job.lastDate) : null;
        const postedDate = job.postedDate ? new Date(job.postedDate) : new Date();
        
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
          job._id, job.title, job.company, job.companyInitial, job.companyColor, job.location, job.type,
          job.salary.min, job.salary.max, job.salary.currency, job.salary.period, job.experience, job.qualification,
          job.badgeText, job.category, job.industry, job.description, job.responsibilities, job.requirements,
          job.status, postedDate, lastDate, job.vacancies, 'mock-user-admin-id', job.applyLink, job.pdfUrl
        ]);
      }

      // Upsert Exams
      for (const exam of uniqueExams) {
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
          exam._id, exam.title, exam.organization, exam.orgShort, exam.category, exam.lastDate, exam.posts,
          exam.status, exam.description, exam.isNew, exam.applyLink, exam.pdfUrl, exam.examDate
        ]);
      }
      
      console.log('✅ PostgreSQL Sync completed successfully.');
    }

    // 2. Fallback JSON File & Mock DB Sync
    const scrapedPath = path.join(__dirname, '..', 'config', 'scraped_data.json');
    let existingData = { jobs: [], exams: [] };
    if (fs.existsSync(scrapedPath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
      } catch (e) {}
    }

    // Merge Jobs
    const jobsList = existingData.jobs || [];
    for (const job of uniqueJobs) {
      const idx = jobsList.findIndex(j => j._id === job._id);
      if (idx !== -1) {
        jobsList[idx] = { ...jobsList[idx], ...job };
      } else {
        jobsList.push(job);
      }
    }
    
    // Merge Exams
    const examsList = existingData.exams || [];
    for (const exam of uniqueExams) {
      const idx = examsList.findIndex(e => e._id === exam._id);
      if (idx !== -1) {
        examsList[idx] = { ...examsList[idx], ...exam };
      } else {
        examsList.push(exam);
      }
    }

    // Filter out other states from file lists
    const cleanJobs = jobsList.filter(job => !isOtherState(job.company, job.title)).map(job => {
      job.category = determineCategory(job.company, job.category);
      job.applyLink = cleanLink(job.applyLink);
      job.pdfUrl = cleanLink(job.pdfUrl);
      return job;
    });
    const cleanExams = examsList.filter(exam => !isOtherState(exam.organization, exam.title)).map(exam => {
      exam.applyLink = cleanLink(exam.applyLink);
      exam.pdfUrl = cleanLink(exam.pdfUrl);
      return exam;
    });

    // Write back to config file
    fs.writeFileSync(scrapedPath, JSON.stringify({ jobs: cleanJobs, exams: cleanExams }, null, 2), 'utf-8');
    console.log(`✅ scraped_data.json updated on disk (${cleanJobs.length} jobs, ${cleanExams.length} exams).`);

    // Synchronize mockDb arrays in memory
    if (global.useMockDb) {
      // Reload in memory
      mockDb.jobs = cleanJobs.map(job => ({
        ...job,
        postedDate: job.postedDate ? new Date(job.postedDate) : new Date(),
        lastDate: job.lastDate ? new Date(job.lastDate) : null
      }));
      mockDb.exams = cleanExams;
      console.log('✅ Mock In-Memory Database synchronized with scraped data.');
    }

    return { success: true, jobsCount: uniqueJobs.length, examsCount: uniqueExams.length };
  } catch (error) {
    console.error('❌ Scraper service encountered an error:', error.message);
    throw error;
  }
};
