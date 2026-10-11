// ---------------------------------------------------------------------------
// Entrypoint — connect to MariaDB/SQLite, then start listening.
// ---------------------------------------------------------------------------
// Performance & reliability hardening:
//  - keep-alive timeout set to 65s (> typical LB/proxy 60s) to avoid 502s
//  - headers timeout to prevent slow-header DoS
//  - graceful drain: stop accepting new connections on SIGTERM, drain
//    existing ones before exit so no request is mid-flight dropped
//  - max connections set to 1024 to handle traffic spikes
// ---------------------------------------------------------------------------

import { env, assertSecureConfig } from './config/env.js'
import { closeDatabase } from './config/db.js'
import { initDb } from './models/index.js'
import { createApp } from './app.js'

async function start() {
  assertSecureConfig()

  // Connect to DB (no sync yet - we add columns manually first)
  await initDb({ sync: false, alter: false })
  console.log(`[db] connected to ${env.db.name} at ${env.db.host}:${env.db.port}`)

  // Safely ensure new columns exist without breaking existing tables

  try {
    const { sequelize } = await import('./models/index.js')
    const qi = sequelize.getQueryInterface()
    const desc = await qi.describeTable('jobs').catch(() => ({}))
    if (desc && !desc.inTicker) {
      await qi.addColumn('jobs', 'inTicker', {
        type: sequelize.Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      console.log('[db] added inTicker column to jobs table')
    }
    if (desc && !desc.featured) {
      await qi.addColumn('jobs', 'featured', {
        type: sequelize.Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      console.log('[db] added featured column to jobs table')
    }
    if (desc && !desc.full_description) {
      await qi.addColumn('jobs', 'full_description', {
        type: sequelize.Sequelize.DataTypes.TEXT('long'),
        allowNull: true,
      })
      console.log('[db] added full_description column to jobs table')
    }
    if (desc && !desc.salary) {
      await qi.addColumn('jobs', 'salary', {
        type: sequelize.Sequelize.DataTypes.STRING(500),
        allowNull: true,
      })
      console.log('[db] added salary column to jobs table')
    }
    if (desc && !desc.logo) {
      await qi.addColumn('jobs', 'logo', {
        type: sequelize.Sequelize.DataTypes.JSON,
        allowNull: true,
      })
      console.log('[db] added logo column to jobs table')
    }
    if (desc && !desc.importantDates) {
      await qi.addColumn('jobs', 'importantDates', {
        type: sequelize.Sequelize.DataTypes.JSON,
        allowNull: true,
      })
      console.log('[db] added importantDates column to jobs table')
    }
    if (desc && !desc.fee) {
      await qi.addColumn('jobs', 'fee', {
        type: sequelize.Sequelize.DataTypes.JSON,
        allowNull: true,
      })
      console.log('[db] added fee column to jobs table')
    }
    if (desc && !desc.ageLimit) {
      await qi.addColumn('jobs', 'ageLimit', {
        type: sequelize.Sequelize.DataTypes.JSON,
        allowNull: true,
      })
      console.log('[db] added ageLimit column to jobs table')
    }
    if (desc && !desc.posts) {
      await qi.addColumn('jobs', 'posts', {
        type: sequelize.Sequelize.DataTypes.JSON,
        allowNull: true,
      })
      console.log('[db] added posts column to jobs table')
    }
    if (desc && !desc.links) {
      await qi.addColumn('jobs', 'links', {
        type: sequelize.Sequelize.DataTypes.JSON,
        allowNull: true,
      })
      console.log('[db] added links column to jobs table')
    }
  } catch (err) {
    console.warn('[db] column check notice:', err.message)
  }


  const app = createApp()
  const server = app.listen(env.port, () => {
    console.log(`[api] Job Alert X API listening on http://localhost:${env.port}`)
    console.log(`[api] endpoint index: http://localhost:${env.port}/api`)
    console.log(`[api] CORS origin(s): ${env.clientOrigin}`)
  })

  // ── HTTP server performance tuning ──────────────────────────────────────
  // 65s keep-alive is just above typical load-balancer 60s idle timeout,
  // preventing unexpected 502s on long-lived connections.
  server.keepAliveTimeout    = 65_000   // ms
  server.headersTimeout      = 70_000   // ms (must be > keepAliveTimeout)
  server.maxConnections      = 1_024    // concurrent TCP connections cap
  server.timeout             = 0        // disable per-connection idle timeout (keep-alive handles it)

  // ── Graceful shutdown ────────────────────────────────────────────────────
  let shuttingDown = false

  const shutdown = async (signal) => {
    if (shuttingDown) return
    shuttingDown = true
    console.log(`\n[api] ${signal} received — draining connections…`)

    // Stop accepting new connections; wait for in-flight requests to finish
    server.close(async () => {
      console.log('[api] all connections drained — closing database')
      await closeDatabase().catch(() => {})
      console.log('[api] shutdown complete')
      process.exit(0)
    })

    // Force-exit after 15s if drain takes too long
    setTimeout(() => {
      console.error('[api] shutdown timeout — forcing exit')
      process.exit(1)
    }, 15_000).unref()
  }

  process.on('SIGINT',  () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  // ── Unhandled rejection safety net ──────────────────────────────────────
  process.on('unhandledRejection', (reason) => {
    console.error('[api] unhandledRejection:', reason)
    // Do NOT exit — log and continue; let the per-request error handler deal with it
  })

  process.on('uncaughtException', (error) => {
    console.error('[api] uncaughtException:', error)
    // Uncaught exceptions leave the process in an unknown state — exit and let pm2/docker restart
    shutdown('uncaughtException')
  })
}

start().catch(async (error) => {
  console.error('[api] failed to start:', error.message)
  await closeDatabase().catch(() => {})
  process.exit(1)
})
