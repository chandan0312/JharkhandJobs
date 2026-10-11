import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

import pool from '../src/config/db.js'

async function checkRemote() {
  try {
    console.log('Connected to host:', process.env.DB_HOST)
    console.log('DB Name:', process.env.DB_NAME)
    
    const [cols] = await pool.query('SHOW COLUMNS FROM jobs')
    console.log('Columns on Hostinger jobs table:', cols.map(c => c.Field))
    
    const [row] = await pool.query('SELECT id, title FROM jobs LIMIT 1')
    console.log('Sample row:', row[0])
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    process.exit(0)
  }
}

checkRemote()
