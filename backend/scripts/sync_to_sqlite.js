// Sync all jobs from MySQL to local SQLite database so both are always 100% in sync
import { Job as MySQLJob } from '../src/models/index.js'
import sqlite3 from 'sqlite3'
import path from 'path'

async function syncToSqlite() {
  console.log('[sync] Fetching all records from MySQL...')
  const allJobs = await MySQLJob.findAll()
  console.log(`[sync] Found ${allJobs.length} records. Syncing to sarkarifynx.sqlite...`)

  const dbPath = path.resolve('data/sarkarifynx.sqlite')
  const db = new sqlite3.Database(dbPath)

  db.serialize(() => {
    // Add columns if they do not exist
    const cols = [
      'detailedDescription TEXT',
      'applyUrl TEXT',
      'notificationPdfUrl TEXT',
      'officialWebsiteUrl TEXT',
      'inTicker INTEGER DEFAULT 0',
      'eligibilityShort TEXT',
    ]
    cols.forEach(c => {
      db.run(`ALTER TABLE jobs ADD COLUMN ${c}`, () => {})
    })

    db.run('DELETE FROM jobs')
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO jobs (
        id, title, org, orgShort, category, kind, tagline, shortInfo, detailedDescription,
        applyUrl, notificationPdfUrl, officialWebsiteUrl, eligibility, eligibilityShort, postedAt, postedOn,
        views, applications, vacancies, featured, inTicker, logo, importantDates, fee,
        ageLimit, posts, links, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)

    let inserted = 0
    for (const j of allJobs) {
      const data = j.toJSON()
      stmt.run([
        data.id,
        data.title,
        data.org,
        data.orgShort,
        data.category,
        data.kind,
        data.tagline,
        data.shortInfo,
        data.detailedDescription,
        data.applyUrl,
        data.notificationPdfUrl,
        data.officialWebsiteUrl,
        data.eligibility,
        data.eligibilityShort || '',
        data.postedAt,
        data.postedOn,
        data.views || 0,
        data.applications || 0,
        data.vacancies || 0,
        data.featured ? 1 : 0,
        data.inTicker ? 1 : 0,
        typeof data.logo === 'object' ? JSON.stringify(data.logo) : data.logo,
        typeof data.importantDates === 'object' ? JSON.stringify(data.importantDates) : data.importantDates,
        typeof data.fee === 'object' ? JSON.stringify(data.fee) : data.fee,
        typeof data.ageLimit === 'object' ? JSON.stringify(data.ageLimit) : data.ageLimit,
        typeof data.posts === 'object' ? JSON.stringify(data.posts) : data.posts,
        typeof data.links === 'object' ? JSON.stringify(data.links) : data.links,
      ])
      inserted++
    }
    stmt.finalize(() => {
      console.log(`✓ Synced ${inserted} records into local SQLite database (${dbPath})!`)
      db.close()
      process.exit(0)
    })
  })
}

syncToSqlite().catch(err => {
  console.error('[sync] Error:', err)
  process.exit(1)
})
