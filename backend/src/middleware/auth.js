// ---------------------------------------------------------------------------
// JWT authentication for the admin write routes.
// ---------------------------------------------------------------------------

import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { unauthorized, forbidden } from './error.js'

/** Sign an access token for a user instance. */
export function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  )
}

/** Extract a bearer token from the Authorization header. */
function bearerToken(req) {
  const header = req.headers.authorization
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (!token || !/^Bearer$/i.test(scheme)) return null
  return token.trim()
}

/**
 * Reject the request unless it carries a valid, unexpired token.
 * On success `req.user` holds the decoded payload.
 */
export function authRequired(req, res, next) {
  const token = bearerToken(req)
  if (!token) {
    return next(unauthorized('Missing bearer token. Send "Authorization: Bearer <token>".'))
  }

  try {
    req.user = jwt.verify(token, env.jwt.secret)
    return next()
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError' ? 'Token has expired — log in again' : 'Invalid token'
    return next(unauthorized(message))
  }
}

/** Restrict a route to specific roles. Use after `authRequired`. */
export function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) return next(unauthorized())
    if (!roles.includes(req.user.role)) {
      return next(forbidden(`Requires one of these roles: ${roles.join(', ')}`))
    }
    return next()
  }
}

export default authRequired
