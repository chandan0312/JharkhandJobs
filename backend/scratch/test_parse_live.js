import fs from 'fs';
import path from 'path';

const cleanText = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

const extractLink = (str) => {
  if (!str) return '';
  const m = str.match(/href="([^"]*)"/i);
  return m ? m[1] : '';
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

function parseJobs(filePath, isJharkhandPage = false) {
  const html = fs.readFileSync(filePath, 'utf-8');
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
        const link = extractLink(tds[2]) || extractLink(tds[6]) || extractLink(tds[1]) || '';
        
        if (!link || !postName) continue;
        
        const idMatch = link.match(/-(\d+)(?:\.html)?$/) || link.match(/-(\d+)\/?$/);
        const id = idMatch ? `job-${idMatch[1]}` : `job-scraped-${Math.random().toString(36).substring(2, 9)}`;
        
        let title = postName;
        let vacancies = 45;
        const vacMatch = postName.match(/-\s*(\d+)\s*Posts/i);
        if (vacMatch) {
          vacancies = parseInt(vacMatch[1], 10);
          title = postName.replace(/-\s*\d+\s*Posts/i, '').trim();
        }
        
        let category = 'Other State';
        const boardUpper = board.toUpperCase();
        
        if (isJharkhandPage || ['JPSC', 'JSSC', 'JAC', 'JHGD', 'JUVNL', 'CSOES', 'DHSJH'].some(k => boardUpper.includes(k))) {
          category = 'Jharkhand';
        } else if (boardUpper.includes('UPSC')) {
          category = 'UPSC';
        } else if (boardUpper.includes('SSC')) {
          category = 'SSC';
        } else if (['RAILWAY', 'RRB', 'RRC'].some(k => boardUpper.includes(k))) {
          category = 'Railway';
        } else if (['BANK', 'SBI', 'IBPS', 'RBI', 'BOB', 'PNB'].some(k => boardUpper.includes(k))) {
          category = 'Bank';
        }
        
        let companyInitial = board.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
        if (category === 'Jharkhand' && boardUpper.includes('JSSC')) companyInitial = 'JSSC';
        if (category === 'Jharkhand' && boardUpper.includes('JPSC')) companyInitial = 'JPSC';
        
        let companyColor = '#4B5563';
        if (category === 'Jharkhand') companyColor = '#1B8C0A';
        else if (category === 'SSC') companyColor = '#1A73E8';
        else if (category === 'Railway') companyColor = '#D97706';
        else if (category === 'Bank') companyColor = '#2563EB';
        else if (category === 'UPSC') companyColor = '#9333EA';
        
        const location = category === 'Jharkhand' ? 'Jharkhand, India' : 'All India';
        
        let salaryMin = 21700;
        let salaryMax = 69100;
        if (category === 'UPSC') {
          salaryMin = 56100;
          salaryMax = 177500;
        } else if (category === 'Jharkhand' || category === 'SSC' || category === 'Railway') {
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

function parseExams(filePath, isJharkhandPage = false) {
  const html = fs.readFileSync(filePath, 'utf-8');
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
      
      const idMatch = href.match(/-(\d+)(?:\.html)?$/) || href.match(/-(\d+)\/?$/);
      const id = idMatch ? `exam-${idMatch[1]}` : `exam-scraped-${Math.random().toString(36).substring(2, 9)}`;
      
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
      } else if (textUpper.includes('HIGH COURT')) {
        orgShort = 'High Court';
        organization = 'Jharkhand High Court';
      } else if (textUpper.includes('ARMY') || textUpper.includes('AGNIVEER')) {
        orgShort = 'Army';
        organization = 'Indian Army';
      } else if (textUpper.includes('NAVY')) {
        orgShort = 'Navy';
        organization = 'Indian Navy';
      } else if (textUpper.includes('BPSC')) {
        orgShort = 'BPSC';
        organization = 'Bihar Public Service Commission';
      } else if (textUpper.includes('UPPSC') || textUpper.includes('UP POLICE')) {
        orgShort = 'UP Govt';
        organization = 'Uttar Pradesh Government';
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
      
      exams.push({
        _id: id,
        title,
        organization,
        orgShort,
        category,
        lastDate: 'Ongoing',
        posts: 'See Notification',
        status: isAdmitCard ? 'Admit Card Out' : (isResult ? 'Result Out' : 'Answer Key Out'),
        description: `${text}. Source: FreeJobAlert (${href})`,
        isNew: true,
        applyLink: href,
        pdfUrl: href,
        examDate: '2026'
      });
    }
  }
  return exams;
}

const main = () => {
  const allIndiaJobs = parseJobs('scratch/gov_jobs_live.html', false);
  const jharkhandJobs = parseJobs('scratch/jh_jobs_live.html', true);
  const allJobs = [...jharkhandJobs, ...allIndiaJobs];
  
  const uniqueJobsMap = new Map();
  for (const job of allJobs) {
    uniqueJobsMap.set(job.applyLink, job);
  }
  const uniqueJobs = Array.from(uniqueJobsMap.values());
  
  const allIndiaExams = parseExams('scratch/gov_jobs_live.html', false);
  const jharkhandExams = parseExams('scratch/jh_jobs_live.html', true);
  const allExamsList = [...jharkhandExams, ...allIndiaExams];
  
  const uniqueExamsMap = new Map();
  for (const exam of allExamsList) {
    uniqueExamsMap.set(exam.applyLink, exam);
  }
  const uniqueExams = Array.from(uniqueExamsMap.values());
  
  console.log(`Extracted jobs: ${uniqueJobs.length}`);
  const catCounts = {};
  for (const j of uniqueJobs) {
    catCounts[j.category] = (catCounts[j.category] || 0) + 1;
  }
  console.log('Job Categories:', catCounts);
  
  console.log(`Extracted exam notices: ${uniqueExams.length}`);
  const examCatCounts = {};
  for (const e of uniqueExams) {
    examCatCounts[e.category] = (examCatCounts[e.category] || 0) + 1;
  }
  console.log('Exam Categories:', examCatCounts);
};

main();
