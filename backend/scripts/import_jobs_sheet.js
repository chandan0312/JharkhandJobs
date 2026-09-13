// ---------------------------------------------------------------------------
// Import & Sync 60 Jobs from Excel sheet (Job-post-2026) to MySQL & Category Stats
// ---------------------------------------------------------------------------

import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'
import { initDb, Job, Category, sequelize } from '../src/models/index.js'
import { slugify } from '../src/utils/slugify.js'

// Category theme mapping
const CATEGORY_ICONS = {
  banking: { icon: 'banknote', color: '#e11d48' },
  railway: { icon: 'train', color: '#ea580c' },
  ssc: { icon: 'landmark', color: '#2563eb' },
  upsc: { icon: 'scale', color: '#7c3aed' },
  defence: { icon: 'shield', color: '#059669' },
  police: { icon: 'siren', color: '#4f46e5' },
  teaching: { icon: 'graduation', color: '#0891b2' },
  other: { icon: 'building', color: '#0d9488' },
}

function mapCategory(catRaw, title = '') {
  const cat = String(catRaw || '').toLowerCase().trim()
  const t = String(title || '').toLowerCase().trim()

  if (cat.includes('bank')) return 'banking'
  if (cat.includes('railway')) return 'railway'
  if (cat.includes('ssc') || t.includes('ssc')) return 'ssc'
  if (cat.includes('upsc') || t.includes('upsc') || cat.includes('geoscience') || cat.includes('epfo')) return 'upsc'
  if (cat.includes('defence') || cat.includes('capf') || cat.includes('itbp') || cat.includes('army') || cat.includes('navy')) return 'defence'
  if (cat.includes('police') || t.includes('police') || cat.includes('subedar')) return 'police'
  if (cat.includes('teaching') || cat.includes('teacher') || t.includes('teacher') || t.includes('tet')) return 'teaching'

  return 'other'
}

function parseLastDate(raw) {
  if (!raw) return 'To be notified'
  if (typeof raw === 'number') {
    return XLSX.SSF.format('dd mmm yyyy', raw)
  }
  const str = String(raw).trim()
  // Check if standard date format
  return str
}

function parseVacancies(vacCol, postStr = '', titleStr = '', descStr = '') {
  if (typeof vacCol === 'number') return vacCol
  if (typeof vacCol === 'string') {
    const clean = vacCol.replace(/[^0-9]/g, '')
    if (clean) return parseInt(clean, 10)
  }
  // Try extracting from text
  const match = (postStr + ' ' + titleStr + ' ' + descStr).match(/(\d[\d,]*)\s*posts?/i)
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10) || 0
  }
  return 0
}

function parseShortEligibility(text) {
  if (!text) return 'Check Details'
  const t = text.toLowerCase()
  if (t.includes('10th') && t.includes('iti')) return '10th + ITI'
  if (t.includes('diploma') && (t.includes('b.e') || t.includes('b.tech') || t.includes('engineering'))) return 'Diploma / Degree'
  if (t.includes('b.tech') || t.includes('b.e') || t.includes('engineering')) return 'B.E / B.Tech'
  if (t.includes('mbbs') || t.includes('medical degree')) return 'MBBS / Medical'
  if (t.includes('veterinary')) return 'BVSc / Veterinary'
  if (t.includes('pharma')) return 'B.Pharm / M.Pharm'
  if (t.includes('mba') || t.includes('pgdm')) return 'MBA / PGDM'
  if (t.includes('10+2') || t.includes('12th pass')) return '12th Pass'
  if (t.includes('10th pass') || t.includes('matric')) return '10th Pass'
  if (t.includes('b.com') || t.includes('m.com')) return 'B.Com / M.Com'
  if (t.includes('graduate') || t.includes('graduation') || t.includes('bachelor')) return 'Any Graduate'
  if (t.includes('postgraduate') || t.includes('master')) return 'Post Graduate'
  if (t.includes('diploma')) return 'Diploma'
  return text.slice(0, 24).trim()
}

function extractOrgDetails(title, desc = '') {
  let org = ''
  let orgShort = ''

  // Known orgs
  if (title.includes('BGSSL')) { org = 'Baroda Global Shared Services Limited'; orgShort = 'BGSSL' }
  else if (title.includes('RCFL')) { org = 'Rashtriya Chemicals and Fertilizers Limited'; orgShort = 'RCFL' }
  else if (title.includes('RITES')) { org = 'RITES Limited'; orgShort = 'RITES' }
  else if (title.includes('PMBI')) { org = 'Pharmaceuticals & Medical Devices Bureau of India'; orgShort = 'PMBI' }
  else if (title.includes('IOCL')) { org = 'Indian Oil Corporation Limited'; orgShort = 'IOCL' }
  else if (title.includes('Bank of Baroda') || title.includes('BOB')) { org = 'Bank of Baroda'; orgShort = 'BOB' }
  else if (title.includes('SBI')) { org = 'State Bank of India'; orgShort = 'SBI' }
  else if (title.includes('BEL')) { org = 'Bharat Electronics Limited'; orgShort = 'BEL' }
  else if (title.includes('PFRDA')) { org = 'Pension Fund Regulatory and Development Authority'; orgShort = 'PFRDA' }
  else if (title.includes('UPSC')) { org = 'Union Public Service Commission'; orgShort = 'UPSC' }
  else if (title.includes('MECL')) { org = 'Mineral Exploration and Consultancy Limited'; orgShort = 'MECL' }
  else if (title.includes('SSC')) { org = 'Staff Selection Commission'; orgShort = 'SSC' }
  else if (title.includes('India Post')) { org = 'Department of Posts, India'; orgShort = 'India Post' }
  else if (title.includes('GAIL')) { org = 'Gas Authority of India Limited'; orgShort = 'GAIL' }
  else if (title.includes('Sahitya Akademi')) { org = 'Sahitya Akademi'; orgShort = 'SA' }
  else if (title.includes('UPSSSC')) { org = 'Uttar Pradesh Subordinate Services Selection Commission'; orgShort = 'UPSSSC' }
  else if (title.includes('UP Anganwadi')) { org = 'Women and Child Development Department UP'; orgShort = 'WCD UP' }
  else if (title.includes('UP Special TET')) { org = 'Uttar Pradesh Basic Education Board'; orgShort = 'UPBEB' }
  else if (title.includes('JSSC')) { org = 'Jharkhand Staff Selection Commission'; orgShort = 'JSSC' }
  else if (title.includes('BSIP')) { org = 'Birbal Sahni Institute of Palaeosciences'; orgShort = 'BSIP' }
  else if (title.includes('IBPS')) { org = 'Institute of Banking Personnel Selection'; orgShort = 'IBPS' }
  else if (title.includes('BPSC')) { org = 'Bihar Public Service Commission'; orgShort = 'BPSC' }
  else if (title.includes('Rajasthan Safai Karmchari')) { org = 'Local Self Government Department Rajasthan'; orgShort = 'LSG Raj' }
  else if (title.includes('RRC SR')) { org = 'Southern Railway Recruitment Cell'; orgShort = 'RRC SR' }
  else if (title.includes('MPESB')) { org = 'Madhya Pradesh Employees Selection Board'; orgShort = 'MPESB' }
  else if (title.includes('Bank of India') || title.includes('BOI')) { org = 'Bank of India'; orgShort = 'BOI' }
  else if (title.includes('IIT BHU')) { org = 'Indian Institute of Technology (BHU) Varanasi'; orgShort = 'IIT BHU' }
  else if (title.includes('CONCOR')) { org = 'Container Corporation of India'; orgShort = 'CONCOR' }
  else if (title.includes('NIC')) { org = 'National Informatics Centre'; orgShort = 'NIC' }
  else if (title.includes('UKSSSC')) { org = 'Uttarakhand Subordinate Service Selection Commission'; orgShort = 'UKSSSC' }
  else if (title.includes('ITBP')) { org = 'Indo-Tibetan Border Police'; orgShort = 'ITBP' }
  else if (title.includes('UCO Bank')) { org = 'UCO Bank'; orgShort = 'UCO' }
  else if (title.includes('HPPSC')) { org = 'Himachal Pradesh Public Service Commission'; orgShort = 'HPPSC' }
  else if (title.includes('ISRO')) { org = 'Indian Space Research Organisation'; orgShort = 'ISRO' }
  else if (title.includes('RRC ECOR')) { org = 'East Coast Railway Recruitment Cell'; orgShort = 'RRC ECOR' }
  else if (title.includes('UKPSC')) { org = 'Uttarakhand Public Service Commission'; orgShort = 'UKPSC' }
  else if (title.includes('Indian Overseas Bank') || title.includes('IOB')) { org = 'Indian Overseas Bank'; orgShort = 'IOB' }
  else if (title.includes('BCECEB')) { org = 'Bihar Combined Entrance Competitive Examination Board'; orgShort = 'BCECEB' }
  else if (title.includes('PGCIL')) { org = 'Power Grid Corporation of India Limited'; orgShort = 'PGCIL' }
  else if (title.includes('NTPC')) { org = 'National Thermal Power Corporation'; orgShort = 'NTPC' }
  else if (title.includes('RRB')) { org = 'Railway Recruitment Board'; orgShort = 'RRB' }
  else if (title.includes('RSSB')) { org = 'Rajasthan Staff Selection Board'; orgShort = 'RSSB' }
  else if (title.includes('MP High Court')) { org = 'Madhya Pradesh High Court'; orgShort = 'MPHC' }
  else if (title.includes('GIMS Noida')) { org = 'Government Institute of Medical Sciences Noida'; orgShort = 'GIMS' }
  else if (title.includes('ICF')) { org = 'Integral Coach Factory Chennai'; orgShort = 'ICF' }
  else if (title.includes('RCF Kapurthala')) { org = 'Rail Coach Factory Kapurthala'; orgShort = 'RCF' }
  else if (title.includes('Himachal Pradesh High Court')) { org = 'Himachal Pradesh High Court'; orgShort = 'HPHC' }
  else if (title.includes('AAI')) { org = 'Airports Authority of India'; orgShort = 'AAI' }
  else {
    const parts = title.split('Recruitment')[0].trim()
    org = parts || title.slice(0, 40)
    orgShort = org.slice(0, 10)
  }

  return { org, orgShort }
}

async function run() {
  const filePath = path.resolve('data/jobs.xlsx')
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  console.log(`[import] Reading: ${filePath}`)
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

  console.log(`[import] Found ${rows.length} rows in sheet "${sheetName}". Connecting to database...`)
  await initDb({ sync: true, alter: false })

  // Pre-load existing jobs to match by slug or exact title
  const existingJobs = await Job.findAll()
  const existingById = new Map(existingJobs.map((j) => [j.id.toLowerCase().trim(), j]))
  const existingByTitle = new Map(existingJobs.map((j) => [j.title.toLowerCase().trim(), j]))

  let inserted = 0
  let updated = 0

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx]
    const rawTitle = (row['Job title'] || '').trim()
    if (!rawTitle) continue

    const post = (row['post'] || '').trim()
    const rawCat = (row['job category'] || '').trim()
    const vacCol = row['total vacancy']
    const lastDateRaw = row['last date']
    const elig = (row['eligibility'] || '').trim()
    const applyLink = (row['apply link'] || '').trim()
    const notifLink = (row['notification link'] || '').trim()
    const desc = (row['description'] || '').trim()

    const category = mapCategory(rawCat, rawTitle)
    const formattedLastDate = parseLastDate(lastDateRaw)
    const vacancies = parseVacancies(vacCol, post, rawTitle, desc)
    const eligShort = parseShortEligibility(elig)
    const { org, orgShort } = extractOrgDetails(rawTitle, desc)
    const logoTheme = CATEGORY_ICONS[category] || CATEGORY_ICONS.other

    // Determine target ID/slug
    const derivedSlug = slugify(rawTitle)
    const existing = existingByTitle.get(rawTitle.toLowerCase()) || existingById.get(derivedSlug)
    const id = existing ? existing.id : derivedSlug

    const links = []
    if (applyLink) links.push({ label: 'Apply Online', href: applyLink, primary: true })
    if (notifLink) links.push({ label: 'Official Notification PDF', href: notifLink })
    if (links.length === 0) links.push({ label: 'Official Website', href: 'https://jobalertx.com', primary: true })

    const importantDates = [
      { label: 'Application Begin', value: 'Active / Open' },
      { label: 'Last Date to Apply', value: formattedLastDate },
      { label: 'Exam Date / Selection', value: 'As per schedule' },
    ]

    const fee = [
      { label: 'General / OBC / EWS', value: 'As per notification' },
      { label: 'SC / ST / PwD', value: 'Exempted / Concessional' },
      { label: 'Payment Mode', value: 'Online Net Banking / Debit / UPI' },
    ]

    const ageLimit = {
      min: 18,
      max: 35,
      note: 'Age relaxation applicable as per central / state government rules.',
    }

    const postsArray = [
      {
        name: post || rawTitle,
        total: vacancies,
        eligibility: elig,
      },
    ]

    const jobData = {
      id,
      title: rawTitle,
      org: existing?.org || org,
      orgShort: existing?.orgShort || orgShort,
      category,
      kind: 'job',
      tagline: post || rawTitle,
      shortInfo: desc || existing?.shortInfo || `${rawTitle} - Check eligibility, vacancies and apply online.`,
      detailedDescription: desc || existing?.detailedDescription || desc,
      applyUrl: applyLink || existing?.applyUrl || '',
      notificationPdfUrl: notifLink || existing?.notificationPdfUrl || '',
      officialWebsiteUrl: applyLink || existing?.officialWebsiteUrl || '',
      eligibility: elig || existing?.eligibility || '',
      eligibilityShort: eligShort,
      postedOn: existing?.postedOn || '04 Sep 2026',
      postedAt: existing?.postedAt || 'Recently Updated',
      views: existing?.views || Math.floor(Math.random() * 800) + 400,
      applications: existing?.applications || Math.floor(vacancies * 2.5) || 120,
      vacancies: vacancies > 0 ? vacancies : (existing?.vacancies || 0),
      featured: vacancies >= 1000 || idx < 5,
      inTicker: idx < 6,
      logo: logoTheme,
      importantDates,
      fee,
      ageLimit,
      posts: postsArray,
      links,
    }

    const [record, created] = await Job.upsert(jobData)
    if (created) {
      inserted++
      console.log(`  [NEW] #${idx + 1} [${category.toUpperCase()}] ${rawTitle} (${vacancies} posts)`)
    } else {
      updated++
      console.log(`  [UPDATE] #${idx + 1} [${category.toUpperCase()}] ${rawTitle} (${vacancies} posts)`)
    }
  }

  console.log(`\n✓ Sync complete: ${inserted} created, ${updated} updated in MySQL.`)

  // Update Category Table with live vacancy sum and active post count
  console.log('\nRecalculating Category stats in DB...')
  const categories = await Category.findAll()
  for (const cat of categories) {
    const stats = await Job.findOne({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'postsCount'],
        [sequelize.fn('SUM', sequelize.col('vacancies')), 'totalVacancies'],
      ],
      where: { category: cat.slug },
    })
    const vacanciesSum = parseInt(stats?.get('totalVacancies'), 10) || 0
    const postsCount = parseInt(stats?.get('postsCount'), 10) || 0
    cat.jobs = vacanciesSum > 0 ? vacanciesSum : postsCount
    await cat.save()
    console.log(`  Category [${cat.slug}]: ${postsCount} jobs, ${vacanciesSum} vacancies`)
  }

  console.log('\nAll categories updated successfully!')
  await sequelize.close()
  process.exit(0)
}

run().catch((err) => {
  console.error('[import] Error:', err)
  process.exit(1)
})
