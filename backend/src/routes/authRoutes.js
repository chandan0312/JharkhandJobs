// ---------------------------------------------------------------------------
// /api/auth
// ---------------------------------------------------------------------------

import { Router } from 'express'
import * as auth from '../controllers/authController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

router.post('/login', auth.login)
router.post('/register', auth.register)
router.post('/google', auth.googleAuth)
router.get('/me', authRequired, auth.me)

export default router
