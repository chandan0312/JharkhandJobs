// ---------------------------------------------------------------------------
// Comprehensive Data Importer for Job Alert X
// Imports & updates:
// 1. jobs.xlsx -> Latest Jobs (kind: 'job')
// 2. admit-card-2026.csv -> Admit Cards (kind: 'admit-card')
// 3. answer key.csv -> Answer Keys & Results (kind: 'answer-key' / 'result')
// 4. sylla.xlsx -> Syllabus & Exam Pattern (kind: 'syllabus')
// ---------------------------------------------------------------------------

import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'
import { initDb, Job, Category, sequelize } from '../src/models/index.js'

export function excelDateToString(serial) {
  if (!serial) return 'Sep 2026'
  if (typeof serial === 'string') return serial.trim()
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)
    if (isNaN(date_info.getTime())) return 'Sep 2026'
    return date_info.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  return 'Sep 2026'
}

export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

export function mapCategory(catStr = '', titleStr = '') {
  const combined = `${catStr} ${titleStr}`.toLowerCase()
  if (combined.includes('bank') || combined.includes('sbi') || combined.includes('ibps') || combined.includes('rbi') || combined.includes('nabard') || combined.includes('bgssl') || combined.includes('finance')) return 'banking'
  if (combined.includes('railway') || combined.includes('rrb') || combined.includes('rcf') || combined.includes('irctc')) return 'railway'
  if (combined.includes('ssc') || combined.includes('staff selection') || combined.includes('cgl') || combined.includes('chsl') || combined.includes('cpo') || combined.includes('mts') || combined.includes('stenographer') || combined.includes('jht')) return 'ssc'
  if (combined.includes('upsc') || combined.includes('civil service') || combined.includes('ias') || combined.includes('ips') || combined.includes('ifs') || combined.includes('cms')) {
    if (combined.includes('nda') || combined.includes('cds') || combined.includes('afcat')) return 'defence'
    return 'upsc'
  }
  if (combined.includes('defence') || combined.includes('army') || combined.includes('navy') || combined.includes('air force') || combined.includes('cisf') || combined.includes('crpf') || combined.includes('bsf') || combined.includes('ssb') || combined.includes('itbp') || combined.includes('coast guard') || combined.includes('nda') || combined.includes('cds') || combined.includes('afcat')) return 'defence'
  if (combined.includes('police') || combined.includes('constable') || combined.includes('sub inspector') || combined.includes('home guard')) return 'police'
  if (combined.includes('teach') || combined.includes('professor') || combined.includes('ugc net') || combined.includes('csir') || combined.includes('school') || combined.includes('education') || combined.includes('tet') || combined.includes('ctet') || combined.includes('lecturer')) return 'teaching'
  return 'other'
}

export function detectOrg(title = '', rawCategory = '') {
  const t = title.toUpperCase()
  if (t.includes('UPSC')) return { org: 'Union Public Service Commission', orgShort: 'UPSC' }
  if (t.includes('UPSSSC')) return { org: 'Uttar Pradesh Subordinate Services Selection Commission', orgShort: 'UPSSSC' }
  if (t.includes('UPPSC')) return { org: 'Uttar Pradesh Public Service Commission', orgShort: 'UPPSC' }
  if (t.includes('BPSC')) return { org: 'Bihar Public Service Commission', orgShort: 'BPSC' }
  if (t.includes('JSSC')) return { org: 'Jharkhand Staff Selection Commission', orgShort: 'JSSC' }
  if (t.includes('RPSC')) return { org: 'Rajasthan Public Service Commission', orgShort: 'RPSC' }
  if (t.includes('RSSB') || t.includes('RSMSSB')) return { org: 'Rajasthan Staff Selection Board', orgShort: 'RSMSSB' }
  if (t.includes('MPESB') || t.includes('MP VYAPAM')) return { org: 'Madhya Pradesh Employees Selection Board', orgShort: 'MPESB' }
  if (t.includes('SSC')) return { org: 'Staff Selection Commission', orgShort: 'SSC' }
  if (t.includes('RRB')) return { org: 'Railway Recruitment Board', orgShort: 'RRB' }
  if (t.includes('SBI')) return { org: 'State Bank of India', orgShort: 'SBI' }
  if (t.includes('IBPS')) return { org: 'Institute of Banking Personnel Selection', orgShort: 'IBPS' }
  if (t.includes('NTA')) return { org: 'National Testing Agency', orgShort: 'NTA' }
  if (t.includes('ISRO')) return { org: 'Indian Space Research Organisation', orgShort: 'ISRO' }
  if (t.includes('DRDO')) return { org: 'Defence Research and Development Organisation', orgShort: 'DRDO' }
  if (t.includes('AIIMS')) return { org: 'All India Institute of Medical Sciences', orgShort: 'AIIMS' }
  if (t.includes('CISF')) return { org: 'Central Industrial Security Force', orgShort: 'CISF' }
  if (t.includes('BSNL')) return { org: 'Bharat Sanchar Nigam Limited', orgShort: 'BSNL' }
  if (t.includes('CCI')) return { org: 'Cotton Corporation of India', orgShort: 'CCI' }
  if (t.includes('AFCAT') || t.includes('AIR FORCE')) return { org: 'Indian Air Force', orgShort: 'IAF' }
  if (t.includes('ARMY')) return { org: 'Indian Army', orgShort: 'Indian Army' }
  if (t.includes('NAVY')) return { org: 'Indian Navy', orgShort: 'Indian Navy' }
  if (t.includes('HIGH COURT')) return { org: 'High Court', orgShort: 'High Court' }
  if (t.includes('PSPCL')) return { org: 'Punjab State Power Corporation Limited', orgShort: 'PSPCL' }
  if (t.includes('NCL')) return { org: 'Northern Coalfields Limited', orgShort: 'NCL' }
  if (t.includes('BGSSL')) return { org: 'Baroda Global Shared Services Limited', orgShort: 'BGSSL' }
  if (t.includes('RCFL')) return { org: 'Rashtriya Chemicals and Fertilizers Limited', orgShort: 'RCFL' }
  if (t.includes('NBEMS')) return { org: 'National Board of Examinations in Medical Sciences', orgShort: 'NBEMS' }
  if (t.includes('UP POLICE') || t.includes('UP HOME GUARD')) return { org: 'Uttar Pradesh Police Recruitment & Promotion Board', orgShort: 'UPPRPB' }

  // Extract from title or fallback
  const firstWord = title.split(' ')[0] || 'Govt'
  return { org: `${firstWord} Recruitment Authority`, orgShort: firstWord }
}

const CATEGORY_ICONS = {
  banking: { icon: 'banknote', color: '#e11d48' },
  railway: { icon: 'train', color: '#ea580c' },
  ssc: { icon: 'landmark', color: '#2563eb' },
  upsc: { icon: 'award', color: '#7c3aed' },
  defence: { icon: 'shield', color: '#059669' },
  police: { icon: 'siren', color: '#d97706' },
  teaching: { icon: 'graduation-cap', color: '#0d9488' },
  other: { icon: 'building', color: '#4f46e5' },
}

async function run() {
  console.log('🚀 Starting Comprehensive Data Import into Job Alert X DB...')

  await initDb({ sync: true, alter: false })
  console.log('✓ Database connection established.')

  const dataDir = path.resolve('data')
  const usedSlugs = new Set()

  // Pre-load existing slugs
  const existingJobs = await Job.findAll({ attributes: ['id'] })
  existingJobs.forEach((j) => usedSlugs.add(j.id))
  console.log(`✓ Loaded ${existingJobs.length} existing post IDs.`)

  function getUniqueSlug(base) {
    let slug = slugify(base)
    if (!slug) slug = `post-${Date.now()}`
    let candidate = slug
    let counter = 1
    while (usedSlugs.has(candidate)) {
      candidate = `${slug}-${counter}`
      counter++
    }
    usedSlugs.add(candidate)
    return candidate
  }

  let importedTotal = 0

  // ---------------------------------------------------------------------------
  // 1. IMPORT JOBS (jobs.xlsx)
  // ---------------------------------------------------------------------------
  const jobsFile = path.join(dataDir, 'jobs.xlsx')
  if (fs.existsSync(jobsFile)) {
    console.log(`\n📄 Processing Jobs from: ${jobsFile}`)
    const wb = XLSX.readFile(jobsFile)
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
    console.log(`Found ${rows.length} job rows.`)

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      const title = String(r['Job title'] || '').trim()
      if (!title) continue

      const postName = String(r['post'] || title).trim()
      const rawCat = String(r['job category'] || '')
      const category = mapCategory(rawCat, title)
      const { org, orgShort } = detectOrg(title, rawCat)
      const vacancies = r['total vacancy'] ? parseInt(r['total vacancy'], 10) || 0 : 0
      const lastDate = excelDateToString(r['last date'])
      const eligibility = String(r['eligibility'] || 'As per official recruitment notification criteria.').trim()
      const applyLink = r['apply link'] ? String(r['apply link']).trim() : ''
      const notifLink = r['notification link'] ? String(r['notification link']).trim() : ''
      const desc = String(r['description'] || `${org} has invited online applications for ${postName} with ${vacancies > 0 ? vacancies + ' vacancies' : 'multiple openings'}. Eligible candidates can apply online before the last date ${lastDate}.`).trim()

      const id = getUniqueSlug(title)

      const links = []
      if (applyLink) links.push({ label: 'Apply Online', href: applyLink, primary: true })
      if (notifLink) links.push({ label: 'Official Notification PDF', href: notifLink, primary: false })
      links.push({ label: 'Official Website', href: applyLink || notifLink || 'https://www.google.com', primary: false })

      const jobData = {
        id,
        title,
        org,
        orgShort,
        category,
        kind: 'job',
        tagline: `${postName} (${vacancies > 0 ? vacancies + ' Posts' : 'Various Posts'})`,
        shortInfo: desc.slice(0, 180) + '...',
        detailedDescription: desc,
        applyUrl: applyLink,
        notificationPdfUrl: notifLink,
        officialWebsiteUrl: applyLink || notifLink,
        eligibility,
        vacancies,
        postedOn: '04 Sep 2026',
        postedAt: i < 15 ? 'Today' : 'Recently Updated',
        featured: i < 8,
        inTicker: i < 5,
        views: Math.floor(Math.random() * 2500) + 800,
        applications: Math.floor(Math.random() * 300) + 50,
        logo: CATEGORY_ICONS[category] || CATEGORY_ICONS.other,
        importantDates: [
          { label: 'Application Process', value: 'Active Now' },
          { label: 'Last Date to Apply', value: lastDate },
          { label: 'Exam / Interview Date', value: 'To be notified soon' },
        ],
        fee: [
          { label: 'General / OBC / EWS', value: 'As per notification' },
          { label: 'SC / ST / PwD / Female', value: 'Exempted / Concession' },
          { label: 'Payment Mode', value: 'Online Net Banking / Debit Card / UPI' },
        ],
        ageLimit: {
          min: 18,
          max: 35,
          note: 'Relaxation in upper age limit is applicable for reserved categories as per Government rules.',
        },
        posts: [
          {
            name: postName,
            total: vacancies || 'Various',
            eligibility,
          },
        ],
        links,
      }

      await Job.upsert(jobData)
      importedTotal++
    }
    console.log(`✓ Imported ${rows.length} jobs.`)
  }

  // ---------------------------------------------------------------------------
  // 2. IMPORT ADMIT CARDS (admit-card-2026.csv)
  // ---------------------------------------------------------------------------
  const admitFile = path.join(dataDir, 'admit-card-2026.csv')
  if (fs.existsSync(admitFile)) {
    console.log(`\n📄 Processing Admit Cards from: ${admitFile}`)
    const content = fs.readFileSync(admitFile, 'utf8')
    const lines = content.split(/\r?\n/).filter(Boolean)
    const header = lines[0].split('\t').map((h) => h.trim().toLowerCase())

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split('\t')
      if (cols.length < 2) continue

      const title = cols[0].replace(/^"|"$/g, '').trim()
      const rawCat = cols[1]?.replace(/^"|"$/g, '').trim()
      const postName = cols[2]?.replace(/^"|"$/g, '').trim() || title
      const vacancies = parseInt(cols[3], 10) || 0
      const lastDate = cols[4]?.replace(/^"|"$/g, '').trim()
      const eligibility = cols[5]?.replace(/^"|"$/g, '').trim() || 'Refer to examination hall ticket rules.'
      const applyLink = cols[6]?.replace(/^"|"$/g, '').trim()
      const notifLink = cols[7]?.replace(/^"|"$/g, '').trim()
      const admitCardLink = cols[8]?.replace(/^"|"$/g, '').trim()
      const examDate = cols[9]?.replace(/^"|"$/g, '').trim() || 'September / October 2026'
      const desc = cols[10]?.replace(/^"|"$/g, '').trim() || `${title} has been officially issued. Candidates can download their admit card / exam city slip using application number and date of birth.`

      const category = mapCategory(rawCat, title)
      const { org, orgShort } = detectOrg(title, rawCat)
      const id = getUniqueSlug(title)

      const links = []
      if (admitCardLink) links.push({ label: 'Download Admit Card / Hall Ticket', href: admitCardLink, primary: true })
      if (notifLink) links.push({ label: 'Exam Date / Notice PDF', href: notifLink, primary: false })
      if (applyLink) links.push({ label: 'Official Portal', href: applyLink, primary: false })

      const admitData = {
        id,
        title,
        org,
        orgShort,
        category,
        kind: 'admit-card',
        tagline: `Exam Date: ${examDate} — Hall Ticket Out`,
        shortInfo: desc.slice(0, 180) + '...',
        detailedDescription: `${desc}\n\nAll registered applicants must verify their examination centre, reporting time, shift schedule, roll number and instructions mentioned on the admit card. Carry an original photo ID card along with printed hall ticket to the exam centre.`,
        applyUrl: admitCardLink || applyLink,
        notificationPdfUrl: notifLink,
        officialWebsiteUrl: applyLink || admitCardLink,
        eligibility,
        vacancies,
        postedOn: '04 Sep 2026',
        postedAt: i < 5 ? 'Today' : 'Recently Updated',
        featured: i < 5,
        inTicker: i < 4,
        views: Math.floor(Math.random() * 3200) + 1200,
        applications: 0,
        logo: CATEGORY_ICONS[category] || CATEGORY_ICONS.other,
        importantDates: [
          { label: 'Admit Card Release Date', value: 'Available Now' },
          { label: 'Examination Date', value: examDate },
          { label: 'Exam City Details', value: 'Released' },
        ],
        fee: [
          { label: 'Admit Card Download', value: 'Free (Login Required)' },
        ],
        ageLimit: {
          min: 18,
          max: 40,
          note: 'As per original exam notification eligibility.',
        },
        posts: [
          {
            name: postName,
            total: vacancies || 'Multiple',
            eligibility,
          },
        ],
        links,
      }

      await Job.upsert(admitData)
      importedTotal++
    }
    console.log(`✓ Imported ${lines.length - 1} admit cards.`)
  }

  // ---------------------------------------------------------------------------
  // 3. IMPORT ANSWER KEYS & RESULTS (answer key.csv)
  // ---------------------------------------------------------------------------
  const ansFile = path.join(dataDir, 'answer key.csv')
  if (fs.existsSync(ansFile)) {
    console.log(`\n📄 Processing Answer Keys & Results from: ${ansFile}`)
    const content = fs.readFileSync(ansFile, 'utf8')
    const lines = content.split(/\r?\n/).filter(Boolean)

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split('\t')
      if (cols.length < 1) continue

      const rawExamName = cols[0]?.replace(/^"|"$/g, '').trim()
      if (!rawExamName) continue

      const pubDate = cols[1]?.trim() || 'Sep 2026'
      const customLink = cols[3]?.trim() || ''
      const status = cols[4]?.trim() || 'Available'

      const isResult = /result|cutoff|merit|score/i.test(rawExamName)
      const kind = isResult ? 'result' : 'answer-key'

      const cleanTitle = rawExamName.replace(/\s*–\s*(Out|Updated|Listed|Re-Open)$/i, '').trim()
      const { org, orgShort } = detectOrg(cleanTitle)
      const category = mapCategory('', cleanTitle)

      const id = getUniqueSlug(cleanTitle)

      let desc = ''
      let actionBtn = ''
      if (isResult) {
        desc = `${org} has officially declared the ${cleanTitle}. Candidates who participated in the examination can check their qualifying status, merit list roll numbers, and category-wise cutoff marks from the official portal.`
        actionBtn = 'Check Result / Merit List'
      } else {
        desc = `${org} has officially released the ${cleanTitle}. Candidates can download the provisional answer key along with question paper and response sheet, calculate estimated scores, and submit representations / objections online within the stipulated timeline.`
        actionBtn = 'Download Answer Key PDF'
      }

      const defaultLink = customLink || `https://www.google.com/search?q=${encodeURIComponent(cleanTitle + ' official')}`

      const links = [
        { label: actionBtn, href: defaultLink, primary: true },
        { label: 'Official Objection / Notice Portal', href: defaultLink, primary: false },
        { label: 'Official Website', href: defaultLink, primary: false },
      ]

      const itemData = {
        id,
        title: cleanTitle,
        org,
        orgShort,
        category,
        kind,
        tagline: `${status === 'Out' ? 'Status: Released / Live' : 'Status: ' + status} — Check Online`,
        shortInfo: desc.slice(0, 180) + '...',
        detailedDescription: desc,
        applyUrl: defaultLink,
        notificationPdfUrl: defaultLink,
        officialWebsiteUrl: defaultLink,
        eligibility: 'Candidates who appeared in the examination.',
        vacancies: 0,
        postedOn: pubDate,
        postedAt: i < 8 ? 'Today' : 'Recently Updated',
        featured: i < 6,
        inTicker: i < 4,
        views: Math.floor(Math.random() * 2800) + 900,
        applications: 0,
        logo: CATEGORY_ICONS[category] || CATEGORY_ICONS.other,
        importantDates: [
          { label: isResult ? 'Result Declaration Date' : 'Answer Key Release Date', value: pubDate },
          { label: isResult ? 'Cutoff & Scorecard' : 'Objection Window Last Date', value: 'Check Official Notice' },
        ],
        fee: [
          { label: isResult ? 'Scorecard Download' : 'Objection Fee', value: isResult ? 'Free' : '₹50 - ₹100 per question (if raising objection)' },
        ],
        ageLimit: {
          min: 18,
          max: 40,
          note: 'Applicable as per candidate registration.',
        },
        posts: [
          {
            name: cleanTitle,
            total: 'All Appeared Candidates',
            eligibility: 'Appeared in examination.',
          },
        ],
        links,
      }

      await Job.upsert(itemData)
      importedTotal++
    }
    console.log(`✓ Imported ${lines.length - 1} answer keys & results.`)
  }

  // ---------------------------------------------------------------------------
  // 4. IMPORT SYLLABUS (sylla.xlsx)
  // ---------------------------------------------------------------------------
  const syllaFile = path.join(dataDir, 'sylla.xlsx')
  if (fs.existsSync(syllaFile)) {
    console.log(`\n📄 Processing Syllabus from: ${syllaFile}`)
    const wb = XLSX.readFile(syllaFile)
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
    console.log(`Found ${rows.length} syllabus rows.`)

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      const rawCat = String(r['category'] || '').trim()
      const board = String(r['recruitment_board'] || 'Govt Board').trim()
      const examName = String(r['exam_name'] || '').trim()
      if (!examName) continue

      const title = `${board} ${examName} Syllabus & Exam Pattern 2026`
      const category = mapCategory(rawCat, `${board} ${examName}`)
      const { org, orgShort } = detectOrg(`${board} ${examName}`, rawCat)
      const postDate = excelDateToString(r['post_date'])
      const syllabusLink = r['syllabus_or_notification_link'] ? String(r['syllabus_or_notification_link']).trim() : ''

      const id = getUniqueSlug(`${board}-${examName}-syllabus-2026`)

      const desc = `${org} has published the comprehensive Syllabus and Examination Pattern for the ${examName} Recruitment 2026. Aspirants preparing for this competitive examination should review the topic-wise breakdown, marking scheme, negative marking criteria, exam duration, and preparation guide provided in the official document.`

      const linkUrl = syllabusLink || `https://www.google.com/search?q=${encodeURIComponent(title)}`

      const links = [
        { label: 'Download Syllabus PDF', href: linkUrl, primary: true },
        { label: 'Exam Pattern & Scheme', href: linkUrl, primary: false },
        { label: 'Official Authority Portal', href: linkUrl, primary: false },
      ]

      const syllaData = {
        id,
        title,
        org,
        orgShort,
        category,
        kind: 'syllabus',
        tagline: `${board} ${examName} Exam Scheme & Marking Pattern`,
        shortInfo: desc.slice(0, 180) + '...',
        detailedDescription: desc,
        applyUrl: linkUrl,
        notificationPdfUrl: syllabusLink,
        officialWebsiteUrl: linkUrl,
        eligibility: 'Open to all aspiring candidates preparing for this examination.',
        vacancies: 0,
        postedOn: postDate,
        postedAt: i < 15 ? 'Today' : 'Recently Updated',
        featured: i < 8,
        inTicker: i < 4,
        views: Math.floor(Math.random() * 2100) + 600,
        applications: 0,
        logo: CATEGORY_ICONS[category] || CATEGORY_ICONS.other,
        importantDates: [
          { label: 'Syllabus Updated', value: postDate },
          { label: 'Exam Pattern Type', value: 'CBT / Written Examination' },
        ],
        fee: [
          { label: 'Syllabus PDF Download', value: 'Free' },
        ],
        ageLimit: {
          min: 18,
          max: 35,
          note: 'As prescribed in the recruitment advertisement.',
        },
        posts: [
          {
            name: `${board} ${examName}`,
            total: 'N/A (Curriculum)',
            eligibility: 'Prescribed educational qualifications as per recruitment notification.',
          },
        ],
        links,
      }

      await Job.upsert(syllaData)
      importedTotal++
    }
    console.log(`✓ Imported ${rows.length} syllabus records.`)
  }

  // ---------------------------------------------------------------------------
  // 5. High-Profile 2026 Results (for complete coverage across all categories)
  // ---------------------------------------------------------------------------
  const highProfileResults = [
    {
      title: 'UPSC Civil Services Prelims Result 2026 with Name & Roll List',
      org: 'Union Public Service Commission',
      orgShort: 'UPSC',
      category: 'upsc',
      examDate: 'May / June 2026',
      link: 'https://upsc.gov.in/',
      desc: 'Union Public Service Commission has officially announced the Civil Services (Preliminary) Examination 2026 results. Qualified candidates are eligible to appear in the CSE Mains Examination.',
    },
    {
      title: 'SSC CGL Tier-1 Result & Cutoff Marks 2026',
      org: 'Staff Selection Commission',
      orgShort: 'SSC',
      category: 'ssc',
      examDate: 'July 2026',
      link: 'https://ssc.gov.in/',
      desc: 'Staff Selection Commission has declared the Combined Graduate Level (Tier-I) Examination 2026 results along with post-wise cutoff marks and merit list.',
    },
    {
      title: 'SBI PO Mains Final Result & Interview Call Letter 2026',
      org: 'State Bank of India',
      orgShort: 'SBI',
      category: 'banking',
      examDate: 'August 2026',
      link: 'https://sbi.co.in/careers',
      desc: 'State Bank of India has published the SBI PO Mains Examination 2026 results. Shortlisted candidates can download their psychometric test and interview call letters.',
    },
    {
      title: 'UP Police Constable Written Exam Result & Cutoff 2026',
      org: 'Uttar Pradesh Police Recruitment & Promotion Board',
      orgShort: 'UPPRPB',
      category: 'police',
      examDate: 'August 2026',
      link: 'https://uppbpb.gov.in/',
      desc: 'UPPRPB has announced the written examination results for 60,244 UP Police Constable posts. Qualified candidates are called for DV/PST and Physical Efficiency Test.',
    },
    {
      title: 'RRB NTPC CBT Stage 1 Final Scorecard & Result 2026',
      org: 'Railway Recruitment Board',
      orgShort: 'RRB',
      category: 'railway',
      examDate: '2026',
      link: 'https://indianrailways.gov.in/',
      desc: 'Railway Recruitment Boards have released the normalized score card and qualification status for RRB Non-Technical Popular Categories (NTPC) recruitment.',
    },
  ]

  console.log(`\n📄 Adding ${highProfileResults.length} high-profile flagship results...`)
  for (const item of highProfileResults) {
    const id = getUniqueSlug(item.title)
    const resData = {
      id,
      title: item.title,
      org: item.org,
      orgShort: item.orgShort,
      category: item.category,
      kind: 'result',
      tagline: 'Final Result & Cutoff Marks Released',
      shortInfo: item.desc.slice(0, 180) + '...',
      detailedDescription: item.desc,
      applyUrl: item.link,
      notificationPdfUrl: item.link,
      officialWebsiteUrl: item.link,
      eligibility: 'Candidates who appeared in the examination.',
      vacancies: 0,
      postedOn: '04 Sep 2026',
      postedAt: 'Today',
      featured: true,
      inTicker: true,
      views: Math.floor(Math.random() * 4500) + 1500,
      applications: 0,
      logo: CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other,
      importantDates: [
        { label: 'Result Declaration', value: 'Declared Today' },
        { label: 'Scorecard Download Link', value: 'Active Now' },
      ],
      fee: [{ label: 'Result Verification', value: 'Free' }],
      ageLimit: { min: 18, max: 40, note: 'As per exam guidelines.' },
      posts: [{ name: item.title, total: 'All Candidates', eligibility: 'Exam qualified' }],
      links: [
        { label: 'Download Result / Merit List (PDF)', href: item.link, primary: true },
        { label: 'Check Cutoff Marks', href: item.link, primary: false },
        { label: 'Official Authority Portal', href: item.link, primary: false },
      ],
    }
    await Job.upsert(resData)
    importedTotal++
  }

  // Summary by kind
  const countsByKind = await Job.findAll({
    attributes: ['kind', [sequelize.fn('COUNT', sequelize.col('kind')), 'count']],
    group: ['kind'],
  })

  console.log('\n=============================================================')
  console.log(`🎉 SUCCESS! Processed & imported ${importedTotal} total records!`)
  console.log('Current Database Breakdown by Kind:')
  countsByKind.forEach((c) => {
    console.log(`  • ${c.kind.padEnd(12)}: ${c.get('count')} records`)
  })
  console.log('=============================================================')

  process.exit(0)
}

run().catch((err) => {
  console.error('[import] Fatal error:', err)
  process.exit(1)
})
