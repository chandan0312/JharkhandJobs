// ---------------------------------------------------------------------------
// Response serialisation.
// ---------------------------------------------------------------------------
// Turns Sequelize instances into the exact plain objects the frontend's mock
// API returns today, so `client/src/services/api.js` can be swapped for real
// HTTP calls without touching a single component.
//
// Two rules make the shapes line up with `client/src/data/seed.js`:
//   1. Internal bookkeeping columns are dropped (createdAt/updatedAt/passwordHash).
//   2. NULL columns are omitted entirely rather than emitted as `null` — the seed
//      objects simply *lack* keys like `vacancies` on an admit-card post, and the
//      UI tests them for truthiness (`post.vacancies || ''`).
// ---------------------------------------------------------------------------

const INTERNAL_FIELDS = new Set(['createdAt', 'updatedAt', 'passwordHash', 'password'])

/**
 * @param {object|Array|null} input Sequelize instance(s) or plain object(s).
 * @param {object}  [options]
 * @param {boolean} [options.keepNull=false] Emit `null` columns instead of dropping them.
 * @param {string[]} [options.omit=[]] Additional keys to strip.
 */
export function serialize(input, options = {}) {
  const { keepNull = false, omit = [] } = options

  if (input === null || input === undefined) return null
  if (Array.isArray(input)) return input.map((item) => serialize(item, options))

  const plain = typeof input.get === 'function' ? input.get({ plain: true }) : { ...input }
  const omitted = new Set([...INTERNAL_FIELDS, ...omit])

  const result = {}
  for (const [key, value] of Object.entries(plain)) {
    if (omitted.has(key)) continue
    if (!keepNull && (value === null || value === undefined)) continue
    result[key] = value
  }
  return result
}

export default serialize
