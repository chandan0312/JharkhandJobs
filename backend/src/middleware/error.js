// ---------------------------------------------------------------------------
// Error helpers + the central error handler.
// ---------------------------------------------------------------------------

import { isProduction } from '../config/env.js'

/** An error carrying an intended HTTP status code. */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    if (details) this.details = details
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details)
export const unauthorized = (message = 'Authentication required') => new HttpError(401, message)
export const forbidden = (message = 'Not permitted') => new HttpError(403, message)
export const notFoundError = (message = 'Not found') => new HttpError(404, message)
export const serviceUnavailable = (message = 'Service unavailable') => new HttpError(503, message)

/** Terminal 404 for unmatched routes. */
export function notFound(req, res) {
  res.status(404).json({
    error: 'Not found',
    message: `No route matches ${req.method} ${req.originalUrl}`,
  })
}

/**
 * Central error handler. Maps Sequelize's error classes onto sensible HTTP
 * statuses so callers get 400/409 for bad input instead of a blanket 500.
 */
// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
export function errorHandler(error, req, res, next) {
  console.error('[API Error in route]', req.method, req.originalUrl, error.message, error.sql || '')
  let status = error.status || 500
  let message = error.message || 'Internal server error'
  let details = error.details

  switch (error.name) {
    case 'SequelizeValidationError':
      status = 400
      message = 'Validation failed'
      details = error.errors?.map((e) => ({ field: e.path, message: e.message }))
      break

    case 'SequelizeUniqueConstraintError':
      status = 409
      message = 'A record with those details already exists'
      details = error.errors?.map((e) => ({ field: e.path, message: e.message }))
      break

    case 'SequelizeForeignKeyConstraintError':
      status = 409
      message = 'Referenced record does not exist'
      break

    case 'SequelizeDatabaseError':
      // Malformed input (bad ENUM value, oversized string) reads as client error.
      status = error.status || 400
      message = isProduction ? 'Invalid request data' : error.message
      break

    case 'SequelizeConnectionError':
    case 'SequelizeConnectionRefusedError':
    case 'SequelizeHostNotFoundError':
    case 'SequelizeAccessDeniedError':
      status = 503
      message = 'Database unavailable'
      break

    default:
      break
  }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl} ->`, error)
  }

  const body = { error: message }
  if (details) body.details = details
  if (!isProduction && status >= 500) body.stack = error.stack

  res.status(status).json(body)
}

export default errorHandler
