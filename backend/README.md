# SarkariFynx — API (Phase 2)

REST backend for the SarkariFynx government-jobs portal.

**Stack:** Node 18+ · Express 4 · MariaDB (via Sequelize 6) · JWT auth

Responses are shape-compatible with the frontend's mock layer
(`client/src/services/api.js`), so wiring the React app to this API is a
drop-in change — no component edits required.

---

## Setup

> Requires Node.js 18+ and a running **MariaDB** server (10.2+ for JSON columns).

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set at minimum `DB_USER` / `DB_PASSWORD`. Then:

```bash
npm run seed
npm run dev
```

The API starts on <http://localhost:4000>; the endpoint index is at
<http://localhost:4000/api>.

You do **not** need to create the database or any tables by hand — the app runs
`CREATE DATABASE IF NOT EXISTS` on boot and Sequelize creates the tables.

### Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start with nodemon (reloads on change) |
| `npm start` | Start once (production) |
| `npm run seed` | Create schema + upsert the reference dataset + admin user. Safe to re-run. |
| `npm run seed:reset` | Same, but wipes the seeded tables first (**deletes admin-created posts**) |

---

## Environment

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `4000` | |
| `DB_HOST` / `DB_PORT` | `127.0.0.1` / `3306` | |
| `DB_NAME` | `sarkarifynx` | Created automatically if absent |
| `DB_USER` / `DB_PASSWORD` | `root` / *empty* | Needs `CREATE` on first run |
| `DB_LOGGING` | `false` | `true` echoes every SQL statement |
| `JWT_SECRET` | *dev fallback* | **Required in production** — the server refuses to boot in production without it |
| `JWT_EXPIRES_IN` | `7d` | |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | `admin@sarkarifynx.in` / `admin12345` / … | Used by the seeder only. Change before deploying. |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Comma-separated allow-list, or `*` |

---

## Endpoints

All routes are prefixed with `/api`.

### Public reads

| Method & path | Mock equivalent | Notes |
|---------------|-----------------|-------|
| `GET /health` | — | Liveness + DB reachability (503 if DB is down) |
| `GET /kinds` | `getKindLabel` | The five post kinds and their labels |
| `GET /jobs` | `getJobs` | Filters: `?category=`, `?kind=`, `?featured=`, `?q=`, `?limit=`, `?offset=` |
| `GET /jobs/trending` | `getTrending` | Featured posts (hero carousel) |
| `GET /jobs/recent` | `getRecentlyPosted` | Newest `kind=job` posts, `?limit=` (default 5) |
| `GET /jobs/stats` | — | `{ total, byKind }` for the admin tiles |
| `GET /jobs/:id` | `getJobById` | `id` is the slug, e.g. `ssc-cgl-2024`. 404 if unknown. |
| `POST /jobs/:id/view` | — | Atomically increments the view counter |
| `GET /search?q=` | `searchJobs` | LIKE across title / org / orgShort / category / tagline. Empty `q` returns `[]`. |
| `GET /categories` | `getCategories` | |
| `GET /categories/:slug` | — | |
| `GET /recruiters` | `getRecruiters` | |
| `GET /courses` | `getPopularCourses` | |
| `GET /now-playing` | `getNowPlaying` | |

`GET /jobs?category=ssc` replaces `getJobsByCategory('ssc')`, and
`GET /jobs?kind=result` replaces `getJobsByKind('result')`.

### Auth

| Method & path | Notes |
|---------------|-------|
| `POST /auth/login` | `{ email, password }` → `{ token, user }` |
| `GET /auth/me` | Requires `Authorization: Bearer <token>` |

### Admin writes — all require a bearer token

| Method & path | Notes |
|---------------|-------|
| `POST /jobs` | Creates a post. Slug derived from `title` (or an explicit `id`), de-duplicated with a `-2` suffix. Missing `logo` inherits the category's icon/colour; missing `links` gets a default "Apply Online". |
| `PUT` / `PATCH /jobs/:id` | Partial update. The primary key cannot be rewritten. |
| `DELETE /jobs/:id` | `204` on success, `404` if already gone |

Unknown fields in a write body are ignored rather than persisted.

### Example

```bash
curl -s http://localhost:4000/api/jobs/ssc-cgl-2024

TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@sarkarifynx.in","password":"admin12345"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -s -X POST http://localhost:4000/api/jobs \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Test Recruitment 2026","org":"Test Board","category":"banking","kind":"job","vacancies":42}'
```

---

## Data model

| Table | Key | Purpose |
|-------|-----|---------|
| `jobs` | `id` (slug) | Every post: jobs, admit cards, results, answer keys, syllabus |
| `categories` | `slug` | Departments (SSC, UPSC, Banking, …) |
| `recruiters` | `id` | "Top Recruiters" rail |
| `popular_courses` | `id` | "Most Popular" cards |
| `now_playing` | `id` (always 1) | Singleton widget row |
| `users` | `id` | Admin accounts (bcrypt hashes) |

**Why `jobs` mixes scalar and JSON columns.** Anything the API filters, searches
or sorts on is a real column (`category`, `kind`, `featured`, `title`, …), so it
can be indexed. The nested, display-only structures — `importantDates`, `fee`,
`posts`, `links`, `ageLimit`, `logo` — are JSON columns. That keeps every
response byte-compatible with the frontend's seed objects without joins or
reassembly, which is what makes the frontend swap a drop-in.

`jobs.category` mirrors `categories.slug` but no foreign key is declared: an
editor must be able to publish a post for a department before that department
exists as a curated category row.

**Ordering.** Posts carry human-written strings (`"3 hours ago"`,
`"23 Aug 2026"`) rather than real dates, so the seeder assigns descending
`createdAt` values in `seedData.js` order. "Newest first" queries therefore
reproduce the frontend's seed order exactly.

`src/seed/seedData.js` is a deliberate duplicate of
`client/src/data/seed.js` — the server must not import across into the client
package. Keep the two in step when either changes.

---

## Wiring up the frontend (not done yet)

The frontend still uses its mock layer. To go live:

1. Add `VITE_API_URL=http://localhost:4000/api` to `client/.env`.
2. Replace each function body in `client/src/services/api.js` with an HTTP call:

```js
const http = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const getJobs = () => http.get('/jobs').then((r) => r.data)
export const getJobById = (id) => http.get(`/jobs/${id}`).then((r) => r.data)
export const getJobsByCategory = (slug) => http.get('/jobs', { params: { category: slug } }).then((r) => r.data)
export const getJobsByKind = (kind) => http.get('/jobs', { params: { kind } }).then((r) => r.data)
export const getTrending = () => http.get('/jobs/trending').then((r) => r.data)
export const getRecentlyPosted = () => http.get('/jobs/recent').then((r) => r.data)
export const searchJobs = (q) => (q?.trim() ? http.get('/search', { params: { q } }).then((r) => r.data) : Promise.resolve([]))
```

Component code stays unchanged. `getKindLabel` can remain a local map or read
`GET /api/kinds`.

3. The admin dashboard is currently in-memory. To persist, log in via
   `POST /api/auth/login`, keep the token, and send it on write requests.

---

## Notes

- One intentional difference from the seed data: posts always return
  `featured: false` where the seed simply omitted the key. The frontend only
  tests `featured` for truthiness (`jobs.filter(j => j.featured)`), so behaviour
  is identical.
- `npm run seed` uses `sync({ alter: true })` so an existing database picks up
  model changes. Prefer real migrations in production.
- Sample data is illustrative and not tied to any real recruitment notification.
