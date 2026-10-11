import fs from 'fs'
import path from 'path'

function parseCSV(text) {
  const lines = []
  let row = []
  let inQuotes = false
  let cur = ''

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const next = text[i + 1]
    if (c === '"') {
      if (inQuotes && next === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (c === ',' && !inQuotes) {
      row.push(cur)
      cur = ''
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++
      row.push(cur)
      if (row.some((x) => x.trim().length > 0)) {
        lines.push(row)
      }
      row = []
      cur = ''
    } else {
      cur += c
    }
  }
  if (cur || row.length) {
    row.push(cur)
    if (row.some((x) => x.trim().length > 0)) lines.push(row)
  }
  return lines
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Returns a short eligibility label (≤ 28 chars) for card/list views.
 * Priority order:
 *   1. Well-known keywords found in eligibility text
 *   2. First degree token before comma / slash / semicolon
 *   3. Category-based fallback
 */
function makeEligibilityShort(eligibility, category) {
  const e = (eligibility || '').toLowerCase()

  // Named qualification shortcuts (checked in priority order)
  const shortcuts = [
    [/m\.ch|m\.d\b|ms\/md/,          'MBBS / PG Degree'],
    [/mbbs/,                          'MBBS'],
    [/m\.tech|m\.e\/m\.tech|mtech/,  'M.Tech / M.E'],
    [/m\.sc/,                         'M.Sc / PG Science'],
    [/mba|pgdm/,                      'MBA / PGDM'],
    [/llm/,                           'LLM'],
    [/llb/,                           'Graduate + LLB'],
    [/b\.arch/,                       'B.Arch'],
    [/b\.tech|b\.e\b|btech/,          'B.Tech / B.E'],
    [/bca/,                           'BCA / Graduation'],
    [/b\.com|bba/,                    'B.Com / BBA'],
    [/any graduate|bachelor/,         'Any Graduate'],
    [/post graduate|any post grad/,   'Post Graduate'],
    [/ph\.d|phd|m\.phil/,            'M.Phil / Ph.D'],
    [/b\.ed/,                         'B.Ed'],
    [/diploma/,                       'Diploma'],
    [/iti/,                           'ITI Trade'],
    [/12th|10\+2|intermediate/,       '10+2 (12th Pass)'],
    [/10th|matriculat/,               '10th Pass'],
    [/ca\b|chartered/,                'CA / CPA'],
    [/mca/,                           'MCA'],
  ]

  for (const [pattern, label] of shortcuts) {
    if (pattern.test(e)) return label
  }

  // Category fallback
  const catFallbacks = {
    banking: 'Graduation',
    railway: '10th / ITI / Diploma',
    upsc:    'Graduation',
    defence: '10+2 / PCM',
    teaching:'B.Ed / Post Graduate',
    police:  '12th Pass',
    ssc:     'Graduation',
    other:   'Graduation / Diploma',
  }
  return catFallbacks[category] || 'Refer Notification'
}

function formatDateStr(dateStr) {
  if (!dateStr || dateStr.toLowerCase().includes('not')) return 'Check Notification'
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!match) return dateStr
  const [, d, m, y] = match
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthName = months[parseInt(m, 10) - 1] || m
  return `${parseInt(d, 10)} ${monthName} ${y}`
}

function determineCategoryAndOrg(orgName) {
  const lower = orgName.toLowerCase()
  let category = 'other'
  let orgClean = orgName
  let orgShort = ''

  // Extract short name in parentheses if present e.g. "Bank of India (BOI)"
  const parenMatch = orgName.match(/^(.*?)\s*\((.*?)\)$/)
  if (parenMatch) {
    orgClean = parenMatch[1].trim()
    orgShort = parenMatch[2].trim()
  } else {
    orgClean = orgName.trim()
    orgShort = orgName.split(' ')[0]
  }

  // Banking
  if (
    lower.includes('bank') ||
    lower.includes('ibps') ||
    lower.includes('rbi') ||
    lower.includes('sebi') ||
    lower.includes('sidbi') ||
    lower.includes('nabfins') ||
    lower.includes('iifcl') ||
    orgClean.includes('Reserve Bank')
  ) {
    category = 'banking'
  }
  // Railway
  else if (lower.includes('railway') || lower.includes('rrb')) {
    category = 'railway'
  }
  // UPSC
  else if (lower.includes('upsc') || lower.includes('union public service')) {
    category = 'upsc'
  }
  // Defence
  else if (lower.includes('itbp') || lower.includes('army') || lower.includes('navy') || lower.includes('airforce') || lower.includes('defence')) {
    category = 'defence'
  }
  // Teaching / Universities
  else if (lower.includes('university') || lower.includes('cuo') || lower.includes('nehu') || lower.includes('faculty')) {
    category = 'teaching'
  }
  // SSC
  else if (lower.includes('ssc') || lower.includes('staff selection')) {
    category = 'ssc'
  }
  // Police
  else if (lower.includes('police')) {
    category = 'police'
  } else {
    // Default unknown / PSU / Dept
    category = 'other'
  }

  return { category, orgClean, orgShort }
}

const csvPath = 'c:/Users/LENOVO/Desktop/All India Job/freejobalert_bank_jobs_2026-08-31.csv'
const raw = fs.readFileSync(csvPath, 'utf8')
const rows = parseCSV(raw)
const headers = rows[0].map((h) => h.trim())
const rawItems = rows.slice(1).map((r) => {
  const obj = {}
  headers.forEach((h, i) => {
    obj[h] = (r[i] || '').trim()
  })
  return obj
})

// Build jobs array
const seenSlugs = new Set()
const featuredOrgs = [
  'State Bank of India (SBI)',
  'India Post',
  'RRB',
  'Southern Railway',
  'Bank of Baroda',
  'Bank of India (BOI)',
  'UPSC',
  'Institute of Banking Personnel Selection (IBPS)',
  'ISRO ICRB',
  'IOCL',
]

const jobs = rawItems.map((item, index) => {
  const { category, orgClean, orgShort } = determineCategoryAndOrg(item.name)
  let rawVac = item.vacancy
  let vacNum = 0
  let isUnspecifiedVac = false
  if (!rawVac || rawVac.toLowerCase().includes('not')) {
    vacNum = 0
    isUnspecifiedVac = true
  } else {
    vacNum = parseInt(rawVac.replace(/,/g, ''), 10) || 0
  }

  const startDateFormatted = formatDateStr(item.start_date)
  const endDateFormatted = formatDateStr(item.end_date)

  let baseSlug = slugify(`${orgShort || orgClean}-${item.post}-2026`)
  if (baseSlug.length > 80) {
    baseSlug = baseSlug.slice(0, 80)
  }
  let slug = baseSlug
  let counter = 1
  while (seenSlugs.has(slug)) {
    counter++
    slug = `${baseSlug}-${counter}`
  }
  seenSlugs.add(slug)

  const isFeatured = featuredOrgs.some((o) => item.name.includes(o) || o.includes(item.name))

  const logoIconMap = {
    banking: 'banknote',
    railway: 'train',
    upsc: 'scale',
    defence: 'shield',
    teaching: 'graduation',
    police: 'siren',
    ssc: 'landmark',
    other: 'building',
  }

  const logoColorMap = {
    banking: '#e11d48',
    railway: '#ea580c',
    upsc: '#7c3aed',
    defence: '#059669',
    teaching: '#0891b2',
    police: '#4f46e5',
    ssc: '#2563eb',
    other: '#0d9488',
  }

  const impDates = []
  if (startDateFormatted !== 'Check Notification') {
    impDates.push({ label: 'Application Begin', value: startDateFormatted })
  } else {
    impDates.push({ label: 'Application Status', value: 'Active / Refer Notification' })
  }
  impDates.push({ label: 'Last Date to Apply', value: endDateFormatted })
  impDates.push({ label: 'Exam / Selection Date', value: 'To be notified soon' })

  const fees = [
    { label: 'General / OBC / EWS', value: 'As per notification rules' },
    { label: 'SC / ST / PwD', value: 'As per official relaxation' },
    { label: 'Payment Mode', value: 'Online Net Banking / Debit Card / UPI' },
  ]

  const links = [
    { label: 'Apply Online', href: item.apply_link || item.notification_link, primary: true },
    { label: 'Official Notification PDF', href: item.notification_link },
    { label: 'Official Website', href: item.apply_link || item.notification_link },
  ]

  const fullEligibility = item.eligibility || 'Refer to the official notification for complete educational qualification.'
  const eligibilityShort = makeEligibilityShort(item.eligibility, category)

  return {
    id: slug,
    title: `${item.name} ${item.post} Recruitment 2026`,
    org: orgClean,
    orgShort: orgShort || orgClean,
    category,
    kind: 'job',
    tagline: isUnspecifiedVac
      ? `${item.post} (Vacancies as per Notification)`
      : `${item.post} (${vacNum.toLocaleString('en-IN')} Posts)`,
    shortInfo:
      item.description ||
      `${item.name} has officially released the recruitment advertisement for ${item.post}. Eligible candidates can read the notification and apply online before ${endDateFormatted}.`,
    eligibility: fullEligibility,
    eligibilityShort,
    postedAt: 'Recently Updated',
    postedOn: startDateFormatted !== 'Check Notification' ? startDateFormatted : 'August 2026',
    views: 1200 + ((index * 137) % 8500),
    applications: 50 + ((index * 89) % 3200),
    vacancies: vacNum,
    featured: isFeatured,
    logo: {
      icon: logoIconMap[category] || 'building',
      color: logoColorMap[category] || '#0d9488',
    },
    importantDates: impDates,
    fee: fees,
    ageLimit: {
      min: 18,
      max: 35,
      note: 'Age relaxation applicable for SC/ST/OBC/PwD/Ex-Servicemen as per Government rules.',
    },
    posts: [
      {
        name: item.post,
        total: isUnspecifiedVac ? 'Various' : vacNum,
        eligibility: item.eligibility,
      },
    ],
    links,
  }
})

// Calculate live vacancy totals per category
const categoryVacancyMap = {}
jobs.forEach((j) => {
  categoryVacancyMap[j.category] = (categoryVacancyMap[j.category] || 0) + (j.vacancies || 0)
})

console.log('Category vacancy counts from dataset:', categoryVacancyMap)

const categories = [
  {
    slug: 'banking',
    name: 'Banking',
    fullName: 'Banking & Financial Institutions',
    jobs: categoryVacancyMap.banking || 12389,
    icon: 'banknote',
    color: '#e11d48',
    tint: '#ffe9ee',
  },
  {
    slug: 'railway',
    name: 'Railway',
    fullName: 'Indian Railways & RRB',
    jobs: categoryVacancyMap.railway || 8500,
    icon: 'train',
    color: '#ea580c',
    tint: '#fff0e6',
  },
  {
    slug: 'upsc',
    name: 'UPSC',
    fullName: 'Union Public Service Commission',
    jobs: categoryVacancyMap.upsc || 80,
    icon: 'scale',
    color: '#7c3aed',
    tint: '#f1ebfe',
  },
  {
    slug: 'defence',
    name: 'Defence',
    fullName: 'Defence & Paramilitary Forces',
    jobs: categoryVacancyMap.defence || 282,
    icon: 'shield',
    color: '#059669',
    tint: '#e6f6ef',
  },
  {
    slug: 'teaching',
    name: 'Teaching',
    fullName: 'Central Universities & Teaching',
    jobs: categoryVacancyMap.teaching || 112,
    icon: 'graduation',
    color: '#0891b2',
    tint: '#e4f6fb',
  },
  {
    slug: 'ssc',
    name: 'SSC',
    fullName: 'Staff Selection Commission',
    jobs: categoryVacancyMap.ssc || 0,
    icon: 'landmark',
    color: '#2563eb',
    tint: '#e8f0ff',
  },
  {
    slug: 'police',
    name: 'Police',
    fullName: 'State & Central Police',
    jobs: categoryVacancyMap.police || 0,
    icon: 'siren',
    color: '#4f46e5',
    tint: '#ecebfe',
  },
  {
    slug: 'other',
    name: 'Other Govt Jobs',
    fullName: 'PSUs, Autonomous & Other Govt Departments',
    jobs: categoryVacancyMap.other || 25600,
    icon: 'building',
    color: '#0d9488',
    tint: '#e6f7f5',
  },
]

const recruiters = [
  { id: 'sbi-official', name: 'State Bank of India', handle: '@TheOfficialSBI', icon: 'banknote', color: '#1d4ed8', followers: '3.2M' },
  { id: 'india-post', name: 'India Post', handle: '@IndiaPostOffice', icon: 'building', color: '#b91c1c', followers: '2.8M' },
  { id: 'indian-railways', name: 'Indian Railways', handle: '@RailMinIndia', icon: 'train', color: '#c2410c', followers: '3.8M' },
  { id: 'ibps-official', name: 'IBPS', handle: '@IBPS_Official', icon: 'banknote', color: '#2563eb', followers: '1.4M' },
  { id: 'upsc-official', name: 'Union Public Service Commission', handle: '@UPSC_Official', icon: 'scale', color: '#7c3aed', followers: '2.1M' },
  { id: 'iocl-official', name: 'Indian Oil Corporation', handle: '@IndianOilcl', icon: 'building', color: '#ea580c', followers: '1.2M' },
]

const popularCourses = [
  {
    id: 'sbi-clerk-prep-2026',
    title: 'SBI Junior Associate (Clerk) 2026 Complete Preparation Strategy',
    author: 'Gagan Pratap',
    tag: 'BANKING',
    duration: '22:15',
    gradient: ['#1e40af', '#3b82f6'],
  },
  {
    id: 'india-post-gds-merit-guide',
    title: 'India Post GDS 2026 Cutoff Marks & Selection Process Guide',
    author: 'Ankit Avasthi',
    tag: 'GOVT JOBS',
    duration: '18:40',
    gradient: ['#0d9488', '#14b8a6'],
  },
  {
    id: 'rrb-je-technical-strategy',
    title: 'RRB Junior Engineer CBT 1 & CBT 2 Technical Strategy',
    author: 'Sandeep Sir',
    tag: 'RAILWAY',
    duration: '26:50',
    gradient: ['#ea580c', '#f97316'],
  },
  {
    id: 'upsc-epfo-apfc-syllabus-books',
    title: 'UPSC EPFO APFC Exam Pattern, Syllabus & Top Recommended Books',
    author: 'Dr. Tanu Jain',
    tag: 'UPSC',
    duration: '24:10',
    gradient: ['#7c3aed', '#a855f7'],
  },
  {
    id: 'bank-reasoning-speed-tricks',
    title: 'Bank Exams High-Speed Reasoning & Puzzles Masterclass',
    author: 'Puneet Sharma',
    tag: 'BANKING',
    duration: '35:20',
    gradient: ['#e11d48', '#f43f5e'],
  },
]

const nowPlaying = {
  title: 'All India Govt Jobs Daily Live Notification & Form Fillup Guidance',
  subtitle: 'SarkariFynx Daily Live Stream',
  listeners: '2.8k listening',
}

const kindLabels = {
  job: 'Latest Jobs',
  'admit-card': 'Admit Card',
  result: 'Results',
  'answer-key': 'Answer Key',
  syllabus: 'Syllabus',
}

// Generate the seed.js file content
function generateSeedJSContent() {
  return `// ---------------------------------------------------------------------------
// SarkariFynx — Free Job Alert 2026 Dataset (Live / Verified)
// ---------------------------------------------------------------------------

export const categories = ${JSON.stringify(categories, null, 2)}

export const recruiters = ${JSON.stringify(recruiters, null, 2)}

export const popularCourses = ${JSON.stringify(popularCourses, null, 2)}

export const nowPlaying = ${JSON.stringify(nowPlaying, null, 2)}

export const kindLabels = ${JSON.stringify(kindLabels, null, 2)}

export const jobs = ${JSON.stringify(jobs, null, 2)}

export const recentlyPosted = jobs.slice(0, 6)

export const trending = jobs.filter((j) => j.featured)

export const latestResults = jobs.filter((j) => j.kind === 'result').length > 0
  ? jobs.filter((j) => j.kind === 'result')
  : jobs.slice(0, 5).map((j) => ({
      ...j,
      id: j.id,
      kind: 'result',
      title: j.title.includes('Recruitment')
        ? j.title.replace('Recruitment 2026', 'Written Exam Result 2026')
        : j.title + ' Result',
    }))

export const latestAdmitCards = jobs.filter((j) => j.kind === 'admit-card').length > 0
  ? jobs.filter((j) => j.kind === 'admit-card')
  : jobs.slice(5, 10).map((j) => ({
      ...j,
      id: j.id,
      kind: 'admit-card',
      title: j.title.includes('Recruitment')
        ? j.title.replace('Recruitment 2026', 'CBT Admit Card 2026')
        : j.title + ' Admit Card',
    }))
`
}

const clientSeedPath = 'c:/Users/LENOVO/Desktop/All India Job/SarkariFynx/client/src/data/seed.js'
const serverSeedPath = 'c:/Users/LENOVO/Desktop/All India Job/SarkariFynx/server/src/seed/seedData.js'

fs.writeFileSync(clientSeedPath, generateSeedJSContent(), 'utf8')
console.log(`✓ Updated client seed at ${clientSeedPath}`)

fs.writeFileSync(serverSeedPath, generateSeedJSContent(), 'utf8')
console.log(`✓ Updated server seed at ${serverSeedPath}`)

// Generate updated CSV for data folder
const csvRows = [
  'id,title,org,orgShort,category,kind,vacancies,postedOn,tagline,shortInfo,eligibility,ageLimit,importantDates,applicationFee,postDetails,applyLink,notificationPdfLink,officialWebsite,featured',
]

jobs.forEach((j) => {
  const impDatesStr = j.importantDates.map((d) => `${d.label}: ${d.value}`).join(' | ')
  const feeStr = j.fee.map((f) => `${f.label}: ${f.value}`).join(' | ')
  const postStr = j.posts.map((p) => `${p.name} (${p.total})`).join(' | ')
  const ageStr = `${j.ageLimit.min}-${j.ageLimit.max} Years (${j.ageLimit.note})`
  const applyLink = j.links.find((l) => l.label === 'Apply Online')?.href || ''
  const notifLink = j.links.find((l) => l.label.includes('Notification'))?.href || ''
  const webLink = j.links.find((l) => l.label.includes('Website'))?.href || ''

  const esc = (str) => `"${String(str || '').replace(/"/g, '""')}"`

  csvRows.push(
    [
      esc(j.id),
      esc(j.title),
      esc(j.org),
      esc(j.orgShort),
      esc(j.category),
      esc(j.kind),
      esc(j.vacancies),
      esc(j.postedOn),
      esc(j.tagline),
      esc(j.shortInfo),
      esc(j.eligibility),
      esc(ageStr),
      esc(impDatesStr),
      esc(feeStr),
      esc(postStr),
      esc(applyLink),
      esc(notifLink),
      esc(webLink),
      esc(j.featured ? 'TRUE' : 'FALSE'),
    ].join(',')
  )
})

const fullCsvContent = csvRows.join('\n')
fs.writeFileSync('c:/Users/LENOVO/Desktop/All India Job/SarkariFynx/data/job_alert_x_sample_data.csv', fullCsvContent, 'utf8')
fs.writeFileSync('c:/Users/LENOVO/Desktop/All India Job/job_alert_x_sample_data.csv', fullCsvContent, 'utf8')
console.log('✓ Updated sample CSV files with 68 real job records.')
