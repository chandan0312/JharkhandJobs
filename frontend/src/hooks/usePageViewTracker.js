// ---------------------------------------------------------------------------
// usePageViewTracker — fires a page-view beacon on every route change.
// ---------------------------------------------------------------------------
// A random sessionId is generated once per browser and stored in localStorage
// so the server can count unique sessions without relying on raw IPs.
// ---------------------------------------------------------------------------

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../services/api.js'

/** Returns the persisted sessionId, creating one if it doesn't exist yet. */
function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem('jax_sid')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      localStorage.setItem('jax_sid', id)
    }
    return id
  } catch {
    return 'anon'
  }
}

// Avoid double-firing on React StrictMode double-invoke in dev
let lastTracked = ''

export default function usePageViewTracker() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const fullPath = pathname + search
    if (fullPath === lastTracked) return
    lastTracked = fullPath

    // Skip admin routes — we only want to track public visitor pages
    if (pathname.startsWith('/admin')) return

    const sessionId = getOrCreateSessionId()
    const referrer = document.referrer || ''

    // Fire and forget — analytics should never block the UI
    trackPageView(fullPath, referrer, sessionId).catch(() => {})
  }, [pathname, search])
}
