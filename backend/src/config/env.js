// ---------------------------------------------------------------------------
// Centralised environment configuration.
// ---------------------------------------------------------------------------
// Every other module reads config from here rather than touching process.env
// directly, so defaults and coercion live in exactly one place.
// ---------------------------------------------------------------------------

import dotenv from 'dotenv'

dotenv.config()

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const toBool = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase())
}

const DEV_JWT_SECRET = 'sarkarifynx-dev-only-secret-do-not-use-in-production'

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 4000),

  db: {
    dialect: process.env.DB_DIALECT || (process.env.DB_HOST === 'sqlite' ? 'sqlite' : 'mysql'),
    storage: process.env.DB_STORAGE || './data/sarkarifynx.sqlite',
    host: process.env.DB_HOST || '127.0.0.1',
    port: toInt(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'sarkarifynx',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    logging: toBool(process.env.DB_LOGGING, false),
  },

  jwt: {
    secret: process.env.JWT_SECRET || DEV_JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Seed admin — only ever used by `npm run seed`.
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@jobalertx.com',
    password: process.env.ADMIN_PASSWORD || 'admin12345',
    name: process.env.ADMIN_NAME || 'Job Alert X Admin',
  },

  // Google OAuth. The Identity Services flow verifies an ID token against the
  // client ID alone, so no client secret is read here.
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
  },

  clientOrigin: process.env.ALLOWED_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:5173',
}

export const isProduction = env.nodeEnv === 'production'
export const usingDefaultJwtSecret = env.jwt.secret === DEV_JWT_SECRET

/**
 * Refuse to boot in production with an unsafe or missing JWT secret; warn loudly
 * in development so the fallback is never mistaken for a configured value.
 */
export function assertSecureConfig() {
  if (!usingDefaultJwtSecret) return

  if (isProduction) {
    throw new Error(
      'JWT_SECRET is not set. Refusing to start in production with the built-in ' +
        'development secret. Generate one with:\n' +
        '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"'
    )
  }

  console.warn(
    '[config] JWT_SECRET is not set — using the insecure development secret. ' +
      'Set JWT_SECRET in .env before deploying.'
  )
}

/** CORS `origin` value: `true` (reflect any) or an array of allowed origins. */
export function corsOrigin() {
  if (env.clientOrigin.trim() === '*') return true
  return env.clientOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export default env
