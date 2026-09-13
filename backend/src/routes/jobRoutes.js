// ---------------------------------------------------------------------------
// /api/jobs
// ---------------------------------------------------------------------------

import { Router } from 'express'
import * as jobs from '../controllers/jobController.js'
import { authRequired } from '../middleware/auth.js'
import { cacheResponse, invalidateCache } from '../middleware/cache.js'

const router = Router()

// Middleware to invalidate cache on any admin mutation
const bustCache = (req, res, next) => {
  invalidateCache()
  next()
}

// Static segments must precede `/:id`, otherwise Express would match
// "trending" as an id and return 404.
router.get('/trending', cacheResponse(30_000), jobs.trending)
router.get('/ticker', cacheResponse(30_000), jobs.ticker)
router.get('/recent', cacheResponse(30_000), jobs.recent)
router.get('/stats', cacheResponse(15_000), jobs.stats)

router.get('/', cacheResponse(20_000), jobs.list)
router.get('/:id', cacheResponse(30_000), jobs.byId)
router.post('/:id/view', jobs.registerView)

// --- Admin (JWT required) with automatic cache invalidation ---
router.post('/', authRequired, bustCache, jobs.create)
router.put('/:id', authRequired, bustCache, jobs.update)
router.patch('/:id', authRequired, bustCache, jobs.update)
router.delete('/:id', authRequired, bustCache, jobs.remove)

export default router
