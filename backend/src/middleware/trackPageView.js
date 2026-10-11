// ---------------------------------------------------------------------------
// trackPageView middleware — receives page-view beacon POSTs from the client.
// ---------------------------------------------------------------------------
// Privacy: raw IPs are never stored. Only a 16-char hex prefix of the
// SHA-256 digest is persisted, which is enough for unique-visitor counting
// but cannot be reversed to identify an individual.
//
// Performance: We respond with 204 BEFORE writing to DB so the analytics
// beacon never adds any latency to the user's browser navigation.
// DB writes are fire-and-forget with a small async write queue.
// ---------------------------------------------------------------------------

import crypto from 'crypto'
import geoip from 'geoip-lite'
import { PageView } from '../models/index.js'

/** Parse device type from UA string. */
function parseDevice(ua = '') {
  if (/tablet|ipad|kindle|playbook/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

/** Parse browser name from UA string. */
function parseBrowser(ua = '') {
  if (/edg\//i.test(ua)) return 'Edge'
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return 'Opera'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/chrome\//i.test(ua)) return 'Chrome'
  if (/safari\//i.test(ua)) return 'Safari'
  return 'Other'
}

/** Parse OS from UA string. */
function parseOS(ua = '') {
  if (/windows/i.test(ua)) return 'Windows'
  if (/android/i.test(ua)) return 'Android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS'
  if (/macintosh|mac os x/i.test(ua)) return 'Mac'
  if (/linux/i.test(ua)) return 'Linux'
  return 'Other'
}

/** Hash the client IP to a 16-char hex string. */
function hashIp(ip = '') {
  if (!ip) return null
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

/** Extract the real client IP (handles proxies). */
function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (xff) return xff.split(',')[0].trim()
  return req.socket?.remoteAddress || req.ip || ''
}

// In-process dedup store: `dedupeKey` → last timestamp
const recentHits = new Map()
const DEDUP_WINDOW_MS = 30_000  // 30 seconds per path per visitor

// Async write queue guard: limits concurrent DB inserts
let pendingWrites = 0
const MAX_PENDING_WRITES = 50

// Periodic cleanup of the dedup map (every 2 minutes, non-blocking)
setInterval(() => {
  const cutoff = Date.now() - DEDUP_WINDOW_MS
  for (const [k, ts] of recentHits) {
    if (ts < cutoff) recentHits.delete(k)
  }
}, 120_000).unref()

/**
 * POST /api/track
 * Body: { path, referrer, sessionId }
 *
 * Always responds 204 immediately. DB write is fire-and-forget after the
 * response is sent so the analytics beacon NEVER delays page navigation.
 */
export function recordPageView(req, res) {
  // Respond immediately — never block the client's browser
  res.status(204).end()

  // Silently bail on bad input or when under write overload
  const { path = '/', referrer = '', sessionId = '' } = req.body || {}
  if (typeof path !== 'string' || path.length > 500) return
  if (pendingWrites >= MAX_PENDING_WRITES) return  // shed load gracefully

  const ua = req.headers['user-agent'] || ''
  const ip = getClientIp(req)
  const ipHash = hashIp(ip)

  // Deduplicate: same visitor + same path within 30s
  const dedupeKey = `${ipHash || sessionId}:${path}`
  const lastHit = recentHits.get(dedupeKey)
  if (lastHit && Date.now() - lastHit < DEDUP_WINDOW_MS) return
  recentHits.set(dedupeKey, Date.now())

  // Fire-and-forget async DB write — never awaited by the request lifecycle
  pendingWrites++
  ;(async () => {
    try {
      // Geo lookup (offline MaxMind DB — synchronous, < 1ms)
      let country = null
      let city = null
      try {
        const geo = geoip.lookup(ip)
        if (geo) { country = geo.country || null; city = geo.city || null }
      } catch { /* ignore */ }

      await PageView.create({
        path: path.slice(0, 500),
        referrer: referrer ? String(referrer).slice(0, 500) : null,
        device: parseDevice(ua),
        browser: parseBrowser(ua),
        os: parseOS(ua),
        country,
        city,
        ipHash,
        sessionId: sessionId ? String(sessionId).slice(0, 40) : null,
      })
    } catch {
      /* tracking failures must NEVER surface — silently discard */
    } finally {
      pendingWrites--
    }
  })()
}
