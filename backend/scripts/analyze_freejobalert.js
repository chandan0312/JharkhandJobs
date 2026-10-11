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

const csvPath = 'c:/Users/LENOVO/Desktop/All India Job/freejobalert_bank_jobs_2026-08-31.csv'
const raw = fs.readFileSync(csvPath, 'utf8')
const rows = parseCSV(raw)
const headers = rows[0].map((h) => h.trim())
const items = rows.slice(1).map((r) => {
  const obj = {}
  headers.forEach((h, i) => {
    obj[h] = (r[i] || '').trim()
  })
  return obj
})

console.log(`Total records: ${items.length}`)
console.log('Headers:', headers)

// Analyze missing/blank/special fields
let missingVacancies = 0
let missingStartDate = 0
let missingEndDate = 0
let missingEligibility = 0
let missingLinks = 0

items.forEach((item, idx) => {
  if (!item.vacancy || item.vacancy.toLowerCase().includes('not')) missingVacancies++
  if (!item.start_date || item.start_date.toLowerCase().includes('not')) missingStartDate++
  if (!item.end_date || item.end_date.toLowerCase().includes('not')) missingEndDate++
  if (!item.eligibility) missingEligibility++
  if (!item.apply_link || !item.notification_link) missingLinks++
})

console.log('\n--- DATA QUALITY REPORT ---')
console.log(`Missing/unspecified vacancies: ${missingVacancies}`)
console.log(`Missing/unspecified start dates: ${missingStartDate}`)
console.log(`Missing/unspecified end dates: ${missingEndDate}`)
console.log(`Missing eligibility: ${missingEligibility}`)
console.log(`Missing links: ${missingLinks}`)

console.log('\n--- SAMPLE 5 ITEMS ---')
console.log(JSON.stringify(items.slice(0, 5), null, 2))
