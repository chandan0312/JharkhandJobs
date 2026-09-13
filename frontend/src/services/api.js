// ---------------------------------------------------------------------------
// SarkariFynx / Job Alert X — High-Performance API Service Layer
// ---------------------------------------------------------------------------
// Features:
// 1. In-memory response cache with TTL + Stale-While-Revalidate for instant load
// 2. Request deduplication (coalesces simultaneous parallel requests)
// 3. Automatic cache invalidation on admin mutations (create, update, delete)
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// In-memory cache store: key -> { data, timestamp, ttl }
const memoryCache = new Map()

// In-flight request deduplication store: key -> Promise
const inFlightRequests = new Map()

/**
 * Clear the client-side memory and session cache (called after mutations or manually).
 */
export function clearApiCache() {
  memoryCache.clear()
  try {
    const toRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('jax_cache_')) {
        toRemove.push(key)
      }
    }
    toRemove.forEach((k) => sessionStorage.removeItem(k))
  } catch {
    /* ignore storage access restrictions */
  }
}

/**
 * Low-level HTTP helper with multi-tier memory + session caching & in-flight deduplication.
 */
async function http(method, path, { token, body, params, ttl = 60_000, bypassCache = false } = {}) {
  const url = new URL(`${API_BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const cacheKey = `${method}:${url.pathname}?${url.searchParams.toString()}${token ? `:${token}` : ''}`

  // If this is a mutation, clear client cache so stale data is never shown
  if (method !== 'GET') {
    clearApiCache()
  }

  // Check multi-tier cache for GET requests
  if (method === 'GET' && !bypassCache) {
    // Tier 1: In-memory Map (ultra-fast 0ms)
    const cached = memoryCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      return cached.data
    }

    // Tier 2: SessionStorage (persists across page reloads & back/forward navigation)
    try {
      const stored = sessionStorage.getItem(`jax_cache_${cacheKey}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && (Date.now() - parsed.timestamp) < parsed.ttl) {
          memoryCache.set(cacheKey, parsed)
          return parsed.data
        }
      }
    } catch {
      /* ignore session storage read errors */
    }

    // Deduplicate in-flight concurrent requests to the same URL
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey)
    }
  }

  const executeRequest = async () => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    try {
      const res = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      // 204 No Content (delete)
      if (res.status === 204) return null

      const data = await res.json()

      if (!res.ok) {
        const err = new Error(data?.message || data?.error || `HTTP ${res.status}`)
        err.status = res.status
        err.data = data
        throw err
      }

      // Store in memory & session cache for GET requests
      if (method === 'GET') {
        const item = {
          data,
          timestamp: Date.now(),
          ttl,
        }
        memoryCache.set(cacheKey, item)
        try {
          sessionStorage.setItem(`jax_cache_${cacheKey}`, JSON.stringify(item))
        } catch {
          /* ignore storage quota exceptions */
        }
      }

      return data
    } finally {
      inFlightRequests.delete(cacheKey)
    }
  }

  if (method === 'GET' && !bypassCache) {
    const requestPromise = executeRequest()
    inFlightRequests.set(cacheKey, requestPromise)
    return requestPromise
  }

  return executeRequest()
}

// ---------------------------------------------------------------------------
// Public read APIs (Cached for high performance & instant navigation)
// ---------------------------------------------------------------------------

/** GET /api/jobs/trending — featured posts for the home-page hero carousel. */
export const getTrending = () => http('GET', '/api/jobs/trending', { ttl: 45_000 })

/** GET /api/jobs/ticker — posts displayed in the moving header marquee. */
export const getTickerJobs = () => http('GET', '/api/jobs/ticker', { ttl: 45_000 })

/** GET /api/jobs/recent — recently posted jobs strip. */
export const getRecentlyPosted = (limit = 5) =>
  http('GET', '/api/jobs/recent', { params: { limit }, ttl: 30_000 })

/** GET /api/jobs — list all jobs, optionally filtered. */
export const getJobs = (params) => http('GET', '/api/jobs', { params, ttl: 30_000 })

/** GET /api/jobs/:id */
export const getJobById = (id) => http('GET', `/api/jobs/${encodeURIComponent(id)}`, { ttl: 60_000 })

/** GET /api/jobs?category=slug&kind=kind (defaults to kind='job') */
export const getJobsByCategory = (slug, limit, kind = 'job') => {
  const params = { category: slug }
  if (limit) params.limit = limit
  if (kind && kind !== 'all') params.kind = kind
  return http('GET', '/api/jobs', { params, ttl: 30_000 })
}

/** GET /api/jobs?kind=kind */
export const getJobsByKind = (kind) =>
  http('GET', '/api/jobs', { params: { kind }, ttl: 30_000 })

/** GET /api/categories (Cached for 5 minutes) */
export const getCategories = () => http('GET', '/api/categories', { ttl: 300_000 })

/** GET /api/recruiters (Cached for 5 minutes) */
export const getRecruiters = () => http('GET', '/api/recruiters', { ttl: 300_000 })

/** GET /api/courses — popular courses section. */
export const getPopularCourses = () => http('GET', '/api/courses', { ttl: 300_000 })

/** GET /api/now-playing */
export const getNowPlaying = () => http('GET', '/api/now-playing', { ttl: 60_000 })

/** GET /api/kinds — kind → display label map. */
export const getKinds = () => http('GET', '/api/kinds', { ttl: 300_000 })

/** GET /api/search?q= */
export const searchJobs = (query) =>
  http('GET', '/api/search', { params: { q: query }, ttl: 15_000 })

/**
 * Synchronous kind-label helper.
 */
export const getKindLabel = (kind) => {
  const labels = {
    job: 'Latest Jobs',
    'admit-card': 'Admit Cards',
    result: 'Results',
    'answer-key': 'Answer Keys',
    syllabus: 'Syllabus',
  }
  return labels[kind] || 'Posts'
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const loginAdmin = (email, password) =>
  http('POST', '/api/auth/login', { body: { email, password } })

export const registerUser = (name, email, password) =>
  http('POST', '/api/auth/register', { body: { name, email, password } })

export const googleAuth = (credential) =>
  http('POST', '/api/auth/google', { body: { credential } })

export const getMe = (token) =>
  http('GET', '/api/auth/me', { token, bypassCache: true })

// ---------------------------------------------------------------------------
// Admin CRUD (Mutations automatically bust cache)
// ---------------------------------------------------------------------------

export const createJob = (token, payload) =>
  http('POST', '/api/jobs', { token, body: payload })

export const updateJob = (token, id, payload) =>
  http('PUT', `/api/jobs/${encodeURIComponent(id)}`, { token, body: payload })

export const deleteJob = (token, id) =>
  http('DELETE', `/api/jobs/${encodeURIComponent(id)}`, { token })

// --- Admin Reads ---
export const fetchJobs = (params) =>
  http('GET', '/api/jobs', { params, bypassCache: true })

export const fetchJobStats = () =>
  http('GET', '/api/jobs/stats', { bypassCache: true })

export const fetchJobById = (id) =>
  http('GET', `/api/jobs/${encodeURIComponent(id)}`, { bypassCache: true })

export const fetchDashboard = (token) =>
  http('GET', '/api/admin/dashboard', { token, bypassCache: true })

export const fetchAnalytics = (token) =>
  http('GET', '/api/admin/analytics', { token, bypassCache: true })

/**
 * POST /api/track — send a page-view beacon (fire and forget).
 */
export async function trackPageView(path, referrer, sessionId) {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  try {
    await fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, referrer, sessionId }),
      // keepalive allows the beacon to survive page unloads
      keepalive: true,
    })
  } catch {
    /* tracking failures must never surface to the user */
  }
}

/**
 * Upload PDF or official notification document (Admin only).
 */
export async function uploadPdfDoc(token, file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/api/upload/pdf`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload PDF document')
  }
  return data
}

/**
 * Upload image for blog posts and rich descriptions (Admin only).
 */
export async function uploadImage(token, file) {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${API_BASE}/api/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload image')
  }
  return data
}

// ---------------------------------------------------------------------------
// Feedback & Suggestions
// ---------------------------------------------------------------------------

export const submitFeedback = (payload) =>
  http('POST', '/api/feedback', { body: payload })

export const fetchFeedbacks = (token, params) =>
  http('GET', '/api/feedback', { token, params, bypassCache: true })

export const updateFeedbackStatus = (token, id, status) =>
  http('PATCH', `/api/feedback/${encodeURIComponent(id)}/status`, { token, body: { status } })

export const deleteFeedback = (token, id) =>
  http('DELETE', `/api/feedback/${encodeURIComponent(id)}`, { token })

export const fetchFeedbackStats = (token) =>
  http('GET', '/api/feedback/stats', { token, bypassCache: true })

export default {
  getTrending,
  getRecentlyPosted,
  getJobs,
  getJobById,
  getJobsByCategory,
  getJobsByKind,
  getCategories,
  getRecruiters,
  getPopularCourses,
  getNowPlaying,
  getKinds,
  getKindLabel,
  searchJobs,
  loginAdmin,
  registerUser,
  googleAuth,
  getMe,
  createJob,
  updateJob,
  deleteJob,
  fetchJobs,
  fetchJobStats,
  fetchJobById,
  fetchDashboard,
  submitFeedback,
  fetchFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
  fetchFeedbackStats,
  clearApiCache,
}
