// ---------------------------------------------------------------------------
// API router — everything below is mounted at /api.
// ---------------------------------------------------------------------------

import { Router } from 'express'
import jobRoutes from './jobRoutes.js'
import authRoutes from './authRoutes.js'
import feedbackRoutes from './feedbackRoutes.js'
import uploadRoutes from './uploadRoutes.js'
import * as reference from '../controllers/referenceController.js'
import * as jobs from '../controllers/jobController.js'
import * as admin from '../controllers/adminController.js'
import * as analytics from '../controllers/analyticsController.js'
import { recordPageView } from '../middleware/trackPageView.js'
import { authRequired } from '../middleware/auth.js'
import { sequelize } from '../config/db.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { JOB_KINDS } from '../models/index.js'
import { cacheResponse } from '../middleware/cache.js'

const router = Router()

/** Liveness + database reachability. */
router.get(
  '/health',
  asyncHandler(async (req, res) => {
    let database = 'up'
    try {
      await sequelize.authenticate()
    } catch {
      database = 'down'
    }
    res.status(database === 'up' ? 200 : 503).json({
      status: database === 'up' ? 'ok' : 'degraded',
      database,
      uptime: Math.round(process.uptime()),
    })
  })
)

/**
 * The five post kinds and their display labels. Lets the frontend drop the
 * hardcoded `kindLabels` map from seed.js if it ever wants to.
 */
router.get('/kinds', cacheResponse(300_000), (req, res) => {
  res.json({
    job: 'Latest Jobs',
    'admit-card': 'Admit Cards',
    result: 'Results',
    'answer-key': 'Answer Keys',
    syllabus: 'Syllabus',
  })
})

router.use('/auth', authRoutes)
router.use('/jobs', jobRoutes)
router.use('/feedback', feedbackRoutes)
router.use('/upload', uploadRoutes)

// Top-level search, matching the README's `GET /api/search?q=`.
router.get('/search', cacheResponse(15_000), jobs.search)

// Cached reference & aggregation routes for instant response (< 1ms)
router.get('/categories', cacheResponse(60_000), reference.listCategories)
router.get('/categories/:slug', cacheResponse(60_000), reference.categoryBySlug)
router.get('/recruiters', cacheResponse(60_000), reference.listRecruiters)
router.get('/courses', cacheResponse(60_000), reference.listCourses)
router.get('/now-playing', cacheResponse(60_000), reference.getNowPlaying)

// --- Admin (JWT required) ---
router.get('/admin/dashboard', authRequired, admin.dashboard)
router.get('/admin/analytics', authRequired, analytics.getAnalytics)

// --- Public page-view tracking beacon (no auth) ---
router.post('/track', recordPageView)

/** Self-describing index of the available endpoints. */
router.get('/', (req, res) => {
  res.json({
    name: 'Job Fynx API',
    version: '1.0.0',
    kinds: JOB_KINDS,
    endpoints: {
      health: 'GET /api/health',
      kinds: 'GET /api/kinds',
      jobs: 'GET /api/jobs?category=&kind=&featured=&q=&limit=&offset=',
      trending: 'GET /api/jobs/trending',
      recent: 'GET /api/jobs/recent?limit=5',
      stats: 'GET /api/jobs/stats',
      job: 'GET /api/jobs/:id',
      registerView: 'POST /api/jobs/:id/view',
      search: 'GET /api/search?q=',
      categories: 'GET /api/categories',
      recruiters: 'GET /api/recruiters',
      courses: 'GET /api/courses',
      nowPlaying: 'GET /api/now-playing',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me  (bearer token)',
      admin: {
        create: 'POST /api/jobs  (bearer token)',
        update: 'PUT /api/jobs/:id  (bearer token)',
        remove: 'DELETE /api/jobs/:id  (bearer token)',
      },
    },
  })
})

export default router
