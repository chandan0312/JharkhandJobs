// ---------------------------------------------------------------------------
// Slug helpers.
// ---------------------------------------------------------------------------
// A job's slug is its primary key and its public URL (/job/ssc-cgl-2024), so
// the rules here intentionally match the client-side derivation in
// `client/src/pages/AdminDashboard.jsx`:
//   title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
// ---------------------------------------------------------------------------

// Unicode combining diacritical marks, removed after NFKD normalisation.
const COMBINING_MARKS = /[̀-ͯ]/g

/** Normalise arbitrary text into a lowercase, hyphen-separated slug. */
export function slugify(input) {
  return String(input ?? '')
    .normalize('NFKD') // decompose accents so "Śrī" becomes "sri", not "-r-"
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Slugify `base`, then append -2, -3, … until `exists(slug)` reports it is free.
 *
 * @param {string} base
 * @param {(slug: string) => Promise<boolean>} exists
 * @param {number} [maxAttempts=100]
 */
export async function uniqueSlug(base, exists, maxAttempts = 100) {
  const root = slugify(base) || 'post'

  if (!(await exists(root))) return root

  for (let suffix = 2; suffix <= maxAttempts; suffix += 1) {
    const candidate = `${root}-${suffix}`
    if (!(await exists(candidate))) return candidate
  }

  throw new Error(`Could not derive a unique slug from "${base}" after ${maxAttempts} attempts`)
}

export default slugify
