// ---------------------------------------------------------------------------
// Auth controller — login, register, Google OAuth, and session management.
// ---------------------------------------------------------------------------

import { User } from '../models/index.js'
import { signToken } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { badRequest, unauthorized, notFoundError, serviceUnavailable } from '../middleware/error.js'
import { OAuth2Client } from 'google-auth-library'
import { env } from '../config/env.js'

const googleClient = new OAuth2Client(env.google?.clientId)

/**
 * POST /api/auth/login  { email, password } -> { token, user }
 *
 * Wrong email and wrong password return the same message so the endpoint cannot
 * be used to enumerate which accounts exist.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    throw badRequest('`email` and `password` are required')
  }

  const user = await User.findOne({
    where: { email: String(email).trim().toLowerCase() },
  })

  const valid = user ? await user.verifyPassword(password) : false
  if (!valid) throw unauthorized('Invalid email or password')

  res.json({ token: signToken(user), user: user.toJSON() })
})

/**
 * POST /api/auth/register  { name, email, password } -> { token, user }
 *
 * Creates a new regular user account (role: 'user').
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body ?? {}

  if (!email || !password) {
    throw badRequest('`email` and `password` are required')
  }
  if (!name || !String(name).trim()) {
    throw badRequest('`name` is required')
  }
  if (String(password).length < 8) {
    throw badRequest('Password must be at least 8 characters long')
  }

  // Check if user already exists
  const existing = await User.findOne({
    where: { email: String(email).trim().toLowerCase() },
  })
  if (existing) {
    throw badRequest('An account with this email already exists')
  }

  const user = await User.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password,
    role: 'user',
  })

  res.status(201).json({ token: signToken(user), user: user.toJSON() })
})

/**
 * POST /api/auth/google  { credential } -> { token, user }
 *
 * Verifies a Google ID token (from Google Identity Services) and either
 * finds the existing user or creates a new one.
 */
export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body ?? {}

  if (!credential) {
    throw badRequest('`credential` (Google ID token) is required')
  }

  // Without a client ID there is nothing to verify the token's audience
  // against. Decoding it unverified would let anyone mint a credential for
  // any email address — including the admin account — so refuse instead.
  if (!env.google?.clientId) {
    throw serviceUnavailable(
      'Google sign-in is not configured on this server. Set GOOGLE_CLIENT_ID in the API .env.'
    )
  }

  let payload
  const configuredClientId = env.google.clientId.trim()

  try {
    const client = new OAuth2Client(configuredClientId)
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: configuredClientId,
    })
    payload = ticket.getPayload()
  } catch (error) {
    console.warn('[google-auth] library verifyIdToken failed, attempting tokeninfo fallback:', error.message)
    // Fallback: verify directly with Google's tokeninfo API
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      )
      if (response.ok) {
        const data = await response.json()
        if (data.aud === configuredClientId || data.azp === configuredClientId) {
          payload = data
        } else {
          console.error('[google-auth] Audience mismatch. Expected:', configuredClientId, 'Got aud:', data.aud, 'azp:', data.azp)
          throw new Error('Google token audience does not match configured Client ID')
        }
      } else {
        const errJson = await response.json().catch(() => ({}))
        console.error('[google-auth] Google tokeninfo error:', errJson)
        throw new Error(errJson.error_description || error.message)
      }
    } catch (fallbackError) {
      console.error('[google-auth] Verification failed completely:', fallbackError.message)
      throw unauthorized('Invalid Google credential: ' + fallbackError.message)
    }
  }

  if (!payload?.email) {
    throw badRequest('Google credential does not contain an email')
  }

  // Google sets this false for unconfirmed addresses; accepting them would let
  // someone claim an email they do not control.
  if (payload.email_verified === false) {
    throw unauthorized('This Google account does not have a verified email address')
  }

  const googleId = payload.sub
  const email = payload.email.toLowerCase()
  const name = payload.name || email.split('@')[0]
  const avatar = payload.picture || null

  // Try to find by googleId first, then by email
  let user = await User.findOne({ where: { googleId } })

  if (!user) {
    user = await User.findOne({ where: { email } })

    if (user) {
      // Link Google account to existing user
      user.googleId = googleId
      if (avatar && !user.avatar) user.avatar = avatar
      await user.save()
    } else {
      // Create new user from Google profile
      user = await User.create({
        email,
        name,
        googleId,
        avatar,
        role: 'user',
        // No password needed — Google-only account
      })
    }
  } else {
    // Update avatar if changed
    if (avatar && user.avatar !== avatar) {
      user.avatar = avatar
      await user.save()
    }
  }

  res.json({ token: signToken(user), user: user.toJSON() })
})

/** GET /api/auth/me — resolve the bearer token to the current account. */
export const me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.sub)
  if (!user) throw notFoundError('The account for this token no longer exists')
  res.json(user.toJSON())
})

export default { login, register, googleAuth, me }
