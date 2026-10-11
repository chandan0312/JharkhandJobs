// ---------------------------------------------------------------------------
// Database connection (MySQL via Sequelize).
// ---------------------------------------------------------------------------

import { Sequelize } from 'sequelize'
import mysql from 'mysql2/promise'
import { env } from './env.js'

// MySQL identifiers cannot be parameterised, so the database name is
// interpolated into `CREATE DATABASE`. Validate it to keep that safe.
const SAFE_DB_NAME = /^[A-Za-z0-9_$]+$/

export const sequelize =
  env.db.dialect === 'sqlite'
    ? new Sequelize({
        dialect: 'sqlite',
        storage: env.db.storage || './data/sarkarifynx.sqlite',
        logging: env.db.logging ? (sql) => console.log(`[sql] ${sql}`) : false,
      })
    : new Sequelize(env.db.name, env.db.user, env.db.password, {
        host: env.db.host,
        port: env.db.port,
        dialect: 'mysql',
        logging: env.db.logging ? (sql) => console.log(`[sql] ${sql}`) : false,
        pool: { max: 10, min: 0, acquire: 30_000, idle: 10_000 },
        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
        },
        dialectOptions: {
          // Job posts contain ₹ / en-dashes — utf8mb4 end to end.
          charset: 'utf8mb4',
        },
      })

/**
 * Create the target database if it is missing.
 *
 * Sequelize connects to an existing schema, so this runs first on a raw
 * connection with no `database` selected. Keeps first-run setup to a single
 * `npm run seed` with no manual SQL.
 */
export async function ensureDatabase() {
  if (env.db.dialect === 'sqlite') {
    const fs = await import('fs')
    const path = await import('path')
    const storagePath = env.db.storage || './data/sarkarifynx.sqlite'
    const dir = path.dirname(storagePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    return
  }

  if (!SAFE_DB_NAME.test(env.db.name)) {
    throw new Error(
      `Invalid DB_NAME "${env.db.name}". Use only letters, digits, underscore or $.`
    )
  }

  // On production / Hostinger, database is already created via hPanel.
  // We only attempt CREATE DATABASE IF NOT EXISTS and ignore errors if it fails.
  let connection
  try {
    connection = await mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.name,
      connectTimeout: 10_000,
    })
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.db.name}\` ` +
        'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    )
  } catch (error) {
    // Gracefully ignore on shared hosting / pre-existing databases
    console.log(`[db] ensureDatabase notice: ${error.message} (proceeding with existing database)`)
  } finally {
    if (connection) await connection.end().catch(() => {})
  }
}

export async function closeDatabase() {
  await sequelize.close()
}

export default sequelize
