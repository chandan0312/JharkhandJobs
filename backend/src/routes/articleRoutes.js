// ---------------------------------------------------------------------------
// /api/articles routes
// ---------------------------------------------------------------------------

import { Router } from 'express'
import * as articles from '../controllers/articleController.js'
import { authRequired } from '../middleware/auth.js'
import { cacheResponse, invalidateCache } from '../middleware/cache.js'

const router = Router()

// Invalidate cache on mutations
const bustCache = (req, res, next) => {
  invalidateCache()
  next()
}

// Admin protected endpoints (Must precede /:slug to avoid parameter collisions)
router.get('/admin/all', authRequired, articles.adminList)
router.post('/', authRequired, bustCache, articles.create)
router.put('/:id', authRequired, bustCache, articles.update)
router.patch('/:id', authRequired, bustCache, articles.update)
router.delete('/:id', authRequired, bustCache, articles.remove)

// Public endpoints
router.get('/', cacheResponse(20_000), articles.list)
router.get('/:slug', cacheResponse(30_000), articles.bySlugOrId)

export default router
