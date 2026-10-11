// ---------------------------------------------------------------------------
// /api/feedback
// ---------------------------------------------------------------------------

import { Router } from 'express'
import * as feedback from '../controllers/feedbackController.js'
import { authRequired, requireRole } from '../middleware/auth.js'

const router = Router()

// Submissions carry names, emails and free-text messages, so reading them is
// restricted to staff. `authRequired` alone is not enough — every registered
// visitor holds a valid token.
const adminOnly = [authRequired, requireRole('admin', 'editor')]

// Public route: submit feedback & suggestions
router.post('/', feedback.submit)

// Admin-only protected routes
router.get('/stats', adminOnly, feedback.stats)
router.get('/', adminOnly, feedback.list)
router.patch('/:id/status', adminOnly, feedback.updateStatus)
router.delete('/:id', adminOnly, feedback.remove)

export default router
