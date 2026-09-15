// ---------------------------------------------------------------------------
// Jharkhand JobAlert X — Database Seeder (Categories & Admin Account)
// ---------------------------------------------------------------------------

import { env } from '../config/env.js'
import { closeDatabase } from '../config/db.js'
import { initDb, Category, User } from '../models/index.js'

const JHARKHAND_CATEGORIES = [
  {
    slug: 'jpsc',
    name: 'JPSC',
    fullName: 'Jharkhand Public Service Commission',
    jobs: 342,
    icon: 'landmark',
    color: '#1B6F81',
    tint: '#e6f7fb',
  },
  {
    slug: 'jssc',
    name: 'JSSC',
    fullName: 'Jharkhand Staff Selection Commission',
    jobs: 2840,
    icon: 'scale',
    color: '#09324A',
    tint: '#d5ece8',
  },
  {
    slug: 'other-jharkhand',
    name: 'Other Jharkhand Job',
    fullName: 'Other Jharkhand State Recruitment & Departments',
    jobs: 1250,
    icon: 'map-pin',
    color: '#0284c7',
    tint: '#e0f2fe',
  },
  {
    slug: 'rojgar-mela',
    name: 'Rojgar Mela',
    fullName: 'Jharkhand District Rojgar Mela & Placement Camps',
    jobs: 5000,
    icon: 'briefcase',
    color: '#d97706',
    tint: '#fef3c7',
  },
  {
    slug: 'private-job',
    name: 'Private Job',
    fullName: 'Jharkhand Private & Corporate Vacancies',
    jobs: 1800,
    icon: 'building',
    color: '#0d9488',
    tint: '#ccfbf1',
  },
  {
    slug: 'central-job',
    name: 'Central Job',
    fullName: 'Central Govt, Railway, SSC, Banking & Defence',
    jobs: 15400,
    icon: 'landmark',
    color: '#4f46e5',
    tint: '#eef2ff',
  },
]

async function seedAdmin() {
  const email = env.admin.email.trim().toLowerCase()
  const existing = await User.findOne({ where: { email } })

  if (existing) {
    console.log(`  admin: ${email} already exists`)
    return
  }

  await User.create({
    id: `admin-${Date.now()}`,
    email,
    name: env.admin.name || 'Jharkhand Admin',
    role: 'admin',
    password: env.admin.password,
  })
  console.log(`  admin: created ${email}`)
}

async function main() {
  console.log(`\nJharkhand JobAlert X Seeder -> ${env.db.host}:${env.db.port}/${env.db.name}\n`)

  await initDb({ sync: false, alter: false })

  console.log('Upserting Jharkhand categories...')
  for (const cat of JHARKHAND_CATEGORIES) {
    await Category.upsert(cat)
  }
  console.log(`✓ ${JHARKHAND_CATEGORIES.length} Jharkhand categories upserted.\n`)

  console.log('Ensuring admin account...')
  await seedAdmin()

  console.log('\nDone! All real database tables are clean and ready.\n')
}

main()
  .then(async () => {
    await closeDatabase()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('\nSeed failed:', error.message)
    await closeDatabase().catch(() => {})
    process.exit(1)
  })
