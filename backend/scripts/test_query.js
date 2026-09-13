import { sequelize } from '../src/config/db.js'
import { Job } from '../src/models/index.js'

async function test() {
  try {
    console.log('Testing Sequelize Job.findAll...')
    const rows = await Job.findAll({
      where: { kind: 'job' },
      limit: 3,
    })
    console.log('SUCCESS! Rows found:', rows.length)
    if (rows[0]) {
      console.log('Sample record:', {
        id: rows[0].id,
        org: rows[0].org,
        category: rows[0].category,
        kind: rows[0].kind,
      })
    }
  } catch (e) {
    console.error('Sequelize Error:', e.message)
    if (e.sql) console.error('SQL:', e.sql)
  } finally {
    await sequelize.close()
    process.exit(0)
  }
}

test()
