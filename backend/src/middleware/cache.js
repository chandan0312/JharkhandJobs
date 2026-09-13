// ---------------------------------------------------------------------------
// High-Speed In-Memory Cache Middleware for Express
// ---------------------------------------------------------------------------
// Features:
//  1. TTL-based expiry — stale entries are evicted on read + periodic sweep
//  2. Max 500 entries cap — LRU eviction prevents unbounded memory growth
//  3. ETag support — 304 Not Modified for unchanged responses (saves bandwidth)
//  4. stale-while-revalidate headers for zero-lag client caching
// ---------------------------------------------------------------------------

const cacheStore = new Map()
const DEFAULT_TTL_MS = 30_000   // 30 seconds
const MAX_ENTRIES    = 500      // max cached routes before LRU eviction

// Periodic sweep: remove expired entries every minute (non-blocking)
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cacheStore) {
    if (now - entry.timestamp >= entry.ttl) cacheStore.delete(key)
  }
}, 60_000).unref()

/**
 * LRU eviction: delete the oldest entry when cache is full.
 * Map iteration order is insertion order so first key = oldest.
 */
function evictOldest() {
  const firstKey = cacheStore.keys().next().value
  if (firstKey !== undefined) cacheStore.delete(firstKey)
}

/**
 * Fast, non-cryptographic hash of a string for ETag generation.
 * Uses the djb2 algorithm (deterministic, < 1µs).
 */
function quickHash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
    h = h >>> 0  // keep unsigned 32-bit
  }
  return h.toString(36)
}

/**
 * Express middleware: cache GET responses in memory with TTL + ETag.
 * Returns cached response immediately if available and fresh (< 1ms).
 */
export function cacheResponse(ttlMs = DEFAULT_TTL_MS) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next()

    const key = req.originalUrl || req.url
    const cached = cacheStore.get(key)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < cached.ttl) {
      // Move to end (refresh LRU position)
      cacheStore.delete(key)
      cacheStore.set(key, cached)

      // ETag / 304 Not Modified support
      if (req.headers['if-none-match'] === cached.etag) {
        return res.status(304).end()
      }

      res.setHeader('X-Cache', 'HIT')
      res.setHeader('ETag', cached.etag)
      res.setHeader('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}, stale-while-revalidate=60`)
      return res.json(cached.body)
    }

    // Intercept res.json to store response in cache
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const serialised = JSON.stringify(body)
        const etag = `"${quickHash(serialised)}"`

        if (cacheStore.size >= MAX_ENTRIES) evictOldest()
        cacheStore.set(key, { body, etag, timestamp: Date.now(), ttl: ttlMs })

        res.setHeader('ETag', etag)
      }
      res.setHeader('X-Cache', 'MISS')
      res.setHeader('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}, stale-while-revalidate=60`)
      return originalJson(body)
    }

    next()
  }
}

/**
 * Invalidate all cached GET responses.
 * Called after any admin create / edit / delete mutation.
 */
export function invalidateCache() {
  cacheStore.clear()
}
