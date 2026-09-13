// ---------------------------------------------------------------------------
// SEOHead — per-page SEO management using document APIs.
// ---------------------------------------------------------------------------
// Updates document.title, meta tags, canonical, and JSON-LD dynamically for
// each route. Runs client-side via useEffect after React mounts.
//
// IMPORTANT: Because this is a CSR SPA, canonical and structured data are set
// after JavaScript execution. For full SSR reliability these values should
// eventually be moved to server-rendered HTML. In the interim, this component
// covers the Googlebot second-pass rendering window.
// ---------------------------------------------------------------------------

import { useEffect } from 'react'

const SITE_NAME = 'Job Alert X'
const DEFAULT_DESCRIPTION =
  'Job Alert X — India\'s Free Government Jobs Portal. Latest sarkari naukri, SSC, UPSC, Railway, Banking jobs, admit cards, results, answer keys and syllabus updates 2026.'

/**
 * @param {object} props
 * @param {string}          props.title         — Page title (appended with site name)
 * @param {string}         [props.description]  — Meta description (max ~155 chars)
 * @param {string}         [props.keywords]     — Meta keywords
 * @param {string}         [props.canonical]    — Canonical URL (absolute)
 * @param {string}         [props.ogImage]      — Open Graph image URL
 * @param {string}         [props.ogType]       — Open Graph type (default: 'website')
 * @param {object|object[]}[props.jsonLd]       — JSON-LD structured data object or array
 * @param {boolean}        [props.noIndex]      — If true, adds noindex,follow robots meta
 * @param {string}         [props.datePublished]— ISO date string for datePublished
 * @param {string}         [props.dateModified] — ISO date string for dateModified
 */
export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
  noIndex = false,
  datePublished,
  dateModified,
}) {
  useEffect(() => {
    // ── Document title ───────────────────────────────────────────────────────
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Free Job Alert 2026, Latest Govt Jobs & Sarkari Naukri`
    document.title = fullTitle

    // ── Helper: set or create a meta tag ────────────────────────────────────
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // ── Robots: honour noIndex prop ──────────────────────────────────────────
    setMeta('name', 'robots',
      noIndex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )
    setMeta('name', 'googlebot',
      noIndex
        ? 'noindex, follow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    )

    // ── Standard meta ────────────────────────────────────────────────────────
    setMeta('name', 'description', description)
    if (keywords) setMeta('name', 'keywords', keywords)

    // ── Open Graph ───────────────────────────────────────────────────────────
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:locale', 'en_IN')
    if (canonical) setMeta('property', 'og:url', canonical)
    if (ogImage) setMeta('property', 'og:image', ogImage)

    // ── Twitter Card ─────────────────────────────────────────────────────────
    setMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    if (ogImage) setMeta('name', 'twitter:image', ogImage)

    // ── Article dates (when provided) ────────────────────────────────────────
    if (datePublished) setMeta('property', 'article:published_time', datePublished)
    if (dateModified) setMeta('property', 'article:modified_time', dateModified)

    // ── Canonical ────────────────────────────────────────────────────────────
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', canonical)
    } else if (canonicalEl) {
      // No canonical specified for this page — remove any stale one
      canonicalEl.remove()
    }

    // ── JSON-LD (supports single object or array via @graph) ─────────────────
    const scriptId = 'seo-json-ld'
    let scriptEl = document.getElementById(scriptId)
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.id = scriptId
        scriptEl.type = 'application/ld+json'
        document.head.appendChild(scriptEl)
      }
      const payload = Array.isArray(jsonLd)
        ? { '@context': 'https://schema.org', '@graph': jsonLd }
        : jsonLd
      scriptEl.textContent = JSON.stringify(payload)
    } else if (scriptEl) {
      scriptEl.remove()
    }

    // ── Cleanup: remove JSON-LD when component unmounts ─────────────────────
    return () => {
      const ldScript = document.getElementById(scriptId)
      if (ldScript) ldScript.remove()
    }
  }, [title, description, keywords, canonical, ogImage, ogType, jsonLd, noIndex, datePublished, dateModified])

  return null
}
