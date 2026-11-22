// ---------------------------------------------------------------------------
// Express application.
// ---------------------------------------------------------------------------
// Kept separate from `index.js` (which connects to MariaDB and listens) so the
// app can be imported and exercised without a live database.
// ---------------------------------------------------------------------------

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'

import { env, corsOrigin } from './config/env.js'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'
import * as sitemap from './controllers/sitemapController.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')

  // Gzip compression for all JSON and static responses
  app.use(compression())

  app.use(cors({ origin: corsOrigin(), credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (env.nodeEnv !== 'test') {
    app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
  }

  app.get('/', (req, res) => {
    const acceptHeader = req.get('Accept') || ''

    // Serve markdown homepage for AI agents
    if (acceptHeader.includes('text/markdown')) {
      import('fs').then(fs => fs.promises.readFile(new URL('../public/index.md', import.meta.url).pathname, 'utf8'))
        .then(content => {
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.setHeader('Link', '<https://jharkhand.jobalertx.com/llms.txt>; rel="alternate"; type="text/markdown"')
          res.send(content)
        })
        .catch(() => res.json({
          name: 'Job Alert X API',
          status: 'ok',
          docs: '/api',
        }))
      return
    }

    res.json({
      name: 'Job Alert X API',
      status: 'ok',
      docs: '/api',
    })
  })

  app.use('/api', apiRoutes)

  // ---------------------------------------------------------------------------
  // LLMS.txt - AI agent resource discovery
  // Serves the same content in text/markdown when Accept: text/markdown is sent
  // ---------------------------------------------------------------------------
  const llmsTxtPath = new URL('../public/llms.txt', import.meta.url).pathname
  const normalizedLlmsPath = process.platform === 'win32' && llmsTxtPath.startsWith('/') ? llmsTxtPath.slice(1) : llmsTxtPath

  app.get('/llms.txt', (req, res) => {
    const acceptHeader = req.get('Accept') || ''

    // Check if client wants markdown
    if (acceptHeader.includes('text/markdown')) {
      import('fs').then(fs => fs.promises.readFile(normalizedLlmsPath, 'utf8'))
        .then(content => {
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          res.setHeader('Link', '<https://jharkhand.jobalertx.com/llms.txt>; rel="alternate"; type="text/markdown"')
          res.send(content)
        })
        .catch(() => res.status(404).send('llms.txt not found'))
      return
    }

    // Default: serve as plain text
    import('fs').then(fs => fs.promises.readFile(normalizedLlmsPath, 'utf8'))
      .then(content => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Link', '<https://jharkhand.jobalertx.com/llms.txt>; rel="alternate"; type="text/markdown"')
        res.send(content)
      })
      .catch(() => res.status(404).send('llms.txt not found'))
  })

  // ---------------------------------------------------------------------------
  // MCP Server Card (SEP-1649)
  // Published at /.well-known/mcp/server-card.json
  // ---------------------------------------------------------------------------
  app.get('/.well-known/mcp/server-card.json', (req, res) => {
    const serverCard = {
      name: 'Jharkhand JobAlert X',
      version: '1.0.0',
      endpoint: 'https://jharkhand.jobalertx.com/api',
      capabilities: {
        search: {
          description: 'Search for jobs, articles, and exam information',
          input_schema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
              type: { type: 'string', enum: ['jobs', 'articles', 'exams'], description: 'Content type to search' }
            },
            required: ['query']
          }
        },
        job_alerts: {
          description: 'Get latest job alerts for Jharkhand',
          input_schema: {
            type: 'object',
            properties: {
              category: { type: 'string', description: 'Job category filter' },
              limit: { type: 'integer', default: 10, description: 'Number of results' }
            }
          }
        },
        contact: {
          description: 'Contact the portal support team',
          input_schema: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'Your message' },
              subject: { type: 'string', description: 'Subject' }
            },
            required: ['message']
          }
        }
      },
      description: 'Jharkhand JobAlert X provides verified job alerts, recruitment notifications, and career resources for Jharkhand government and private sector jobs.',
      url: 'https://jharkhand.jobalertx.com/',
      contact_point: {
        email: 'support@jobalertx.com',
        telephone: '+91-8789862771'
      }
    }

    res.setHeader('Content-Type', 'application/json')
    res.json(serverCard)
  })

  // ---------------------------------------------------------------------------
  // Google Search Console verification route
  // ---------------------------------------------------------------------------
  app.get('/google:code.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(`google-site-verification: google${req.params.code}.html`)
  })

  // ---------------------------------------------------------------------------
  // Dynamic XML Sitemaps (generated from live database — one per content type)
  // Static sitemap-core.xml and sitemap.xml (sitemap index) are served from
  // the client/public directory by the frontend host (Nginx/CDN).
  // These dynamic endpoints cover all individual post pages.
  // ---------------------------------------------------------------------------
  app.get('/sitemap-jobs.xml',        sitemap.jobsSitemap)
  app.get('/sitemap-admit-cards.xml', sitemap.admitCardsSitemap)
  app.get('/sitemap-results.xml',     sitemap.resultsSitemap)
  app.get('/sitemap-answer-keys.xml', sitemap.answerKeysSitemap)
  app.get('/sitemap-syllabus.xml',    sitemap.syllabusSitemap)
  app.get('/sitemap-articles.xml',    sitemap.articlesSitemap)

  // Serve uploaded documents statically
  const uploadDir = new URL('../uploads', import.meta.url).pathname
  // Normalize windows leading slash if present in pathname
  const normalizedUploadDir = process.platform === 'win32' && uploadDir.startsWith('/') ? uploadDir.slice(1) : uploadDir
  app.use('/uploads', express.static(normalizedUploadDir))

  // Order matters: 404 for unmatched routes, then the central error handler.
  app.use(notFound)
  app.use(errorHandler)

  return app
}

export default createApp

