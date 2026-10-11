// ---------------------------------------------------------------------------
// Import jobs/updates directly from Excel (.xlsx) or CSV into Job Alert X DB
// Usage: node scripts/import_excel.js [optional_path_to_excel_or_csv]
// ---------------------------------------------------------------------------

import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'
import { initDb, Job } from '../src/models/index.js'

function parsePipedDates(str) {
  if (!str || typeof str !== 'string') return []
  return str.split('|').map((part) => {
    const [label, ...valParts] = part.split(':')
    return {
      label: (label || '').trim(),
      value: valParts.join(':').trim(),
    }
  }).filter((x) => x.label && x.value)
}

function parsePipedFee(str) {
  if (!str || typeof str !== 'string') return []
  return str.split('|').map((part) => {
    const [label, ...valParts] = part.split(':')
    return {
      label: (label || '').trim(),
      value: valParts.join(':').trim(),
    }
  }).filter((x) => x.label && x.value)
}

function parsePipedPosts(str) {
  if (!str || typeof str !== 'string') return []
  return str.split('|').map((part) => {
    const match = part.match(/^(.*?)\((\d+)\)/)
    if (match) {
      return {
        name: match[1].trim(),
        total: parseInt(match[2], 10) || 0,
        eligibility: '',
      }
    }
    return { name: part.trim(), total: 0, eligibility: '' }
  }).filter((x) => x.name)
}

function parseAgeLimit(str) {
  if (!str) return { min: 18, max: 35, note: '' }
  const minMatch = str.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (minMatch) {
    return {
      min: parseInt(minMatch[1], 10),
      max: parseInt(minMatch[2], 10),
      note: str.trim(),
    }
  }
  return { min: 18, max: 35, note: String(str).trim() }
}

async function run() {
  const defaultFile = path.resolve('c:/Users/LENOVO/Desktop/All India Job/job_alert_x_sample_data.xlsx')
  const filePath = process.argv[2] ? path.resolve(process.argv[2]) : defaultFile

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  console.log(`[import] Reading: ${filePath}`)
  const workbook = XLSX.readFile(filePath)
  const firstSheetName = workbook.SheetNames[0]
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName])

  console.log(`[import] Found ${rows.length} rows in sheet. Connecting to DB...`)
  await initDb({ sync: true, alter: true })

  let imported = 0
  for (const row of rows) {
    if (!row.id || !row.title || !row.org) continue

    const links = []
    if (row.applyLink) links.push({ label: 'Apply Online / Download', href: row.applyLink, primary: true })
    if (row.notificationPdfLink) links.push({ label: 'Official Notification PDF', href: row.notificationPdfLink })
    if (row.officialWebsite) links.push({ label: 'Official Website', href: row.officialWebsite })

    const jobData = {
      id: String(row.id).trim().toLowerCase(),
      title: String(row.title).trim(),
      org: String(row.org).trim(),
      orgShort: row.orgShort ? String(row.orgShort).trim() : '',
      category: row.category ? String(row.category).trim().toLowerCase() : 'ssc',
      kind: row.kind ? String(row.kind).trim().toLowerCase() : 'job',
      tagline: row.tagline ? String(row.tagline).trim() : '',
      shortInfo: row.shortInfo ? String(row.shortInfo).trim() : '',
      eligibility: row.eligibility ? String(row.eligibility).trim() : '',
      postedOn: row.postedOn ? String(row.postedOn).trim() : new Date().toLocaleDateString('en-GB'),
      postedAt: 'Just now',
      vacancies: row.vacancies ? parseInt(row.vacancies, 10) || 0 : 0,
      featured: String(row.featured).toUpperCase() === 'TRUE',
      importantDates: parsePipedDates(row.importantDates),
      fee: parsePipedFee(row.applicationFee),
      ageLimit: parseAgeLimit(row.ageLimit),
      posts: parsePipedPosts(row.postDetails),
      links,
      logo: {
        icon: row.category === 'railway' ? 'train' : row.category === 'police' ? 'siren' : row.category === 'banking' ? 'banknote' : 'landmark',
        color: '#f97316',
      },
    }

    const [record, created] = await Job.upsert(jobData)
    imported++
    console.log(`  ✓ ${created ? 'Created' : 'Updated'}: [${jobData.kind.toUpperCase()}] ${jobData.title}`)
  }

  console.log(`\n🎉 Successfully imported/synced ${imported} notifications into database!`)
  process.exit(0)
}

run().catch((err) => {
  console.error('[import] Error:', err)
  process.exit(1)
})
