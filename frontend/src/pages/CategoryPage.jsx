import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Layers, Search } from 'lucide-react'
import BrandIcon from '../components/BrandIcon.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getJobsByCategory, getJobsByKind, getKindLabel, getCategories } from '../services/api.js'

// Static kind labels used for facet chips (matches server /api/kinds)
const KIND_LABELS = {
  job: 'Latest Jobs',
  'admit-card': 'Admit Cards',
  result: 'Results',
  'answer-key': 'Answer Keys',
  syllabus: 'Syllabus',
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active
          ? 'bg-brand-600 text-white'
          : 'border border-hairline bg-surface text-ink-soft hover:bg-subtle'
      }`}
    >
      {children}
    </button>
  )
}

export default function CategoryPage({ defaultSlug }) {
  const params = useParams()
  const location = useLocation()

  let slug = params.slug || defaultSlug
  if (!slug && !params.kind) {
    if (location.pathname.includes('rojgar-mela')) slug = 'rojgar-mela'
    else if (location.pathname.includes('private-jobs')) slug = 'private'
  }
  const kind = params.kind
  const mode = slug ? 'category' : 'kind'

  const [jobs, setJobs] = useState(null)
  const [filter, setFilter] = useState(mode === 'category' ? 'job' : 'all')
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])

  // Load categories for metadata (name, icon, color)
  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => active && setCategories(data || []))
      .catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    setJobs(null)
    setFilter(mode === 'category' ? 'job' : 'all')
    setSearch('')
    const load = mode === 'category' ? getJobsByCategory(slug, undefined, 'all') : getJobsByKind(kind)
    load
      .then((data) => active && setJobs(data || []))
      .catch(() => active && setJobs([]))
    return () => {
      active = false
    }
  }, [slug, kind, mode])

  const category = categories.find((c) => c.slug === slug)

  // Header content
  const heading =
    mode === 'category'
      ? { title: category?.name || slug?.toUpperCase(), subtitle: category?.fullName || 'Latest notifications in this category', icon: category?.icon, color: category?.color || '#5558e6' }
      : { title: KIND_LABELS[kind] || 'Latest Posts', subtitle: 'Freshly published notifications across all departments', icon: null, color: '#5558e6' }

  // Sub-filter facet: in category mode we filter by kind; in kind mode by category.
  const facets = useMemo(() => {
    if (!jobs) return []
    if (mode === 'category') {
      const order = ['job', 'admit-card', 'result', 'answer-key', 'syllabus']
      return order
        .map((k) => {
          const count = jobs.filter((j) => j.kind === k).length
          return { value: k, label: `${KIND_LABELS[k] || k} (${count})`, count }
        })
        .filter((f) => f.count > 0)
    }
    const present = [...new Set(jobs.map((j) => j.category).filter(Boolean))]
    return present.map((c) => {
      const count = jobs.filter((j) => j.category === c).length
      const catName = categories.find((x) => x.slug === c)?.name || c
      return { value: c, label: `${catName} (${count})`, count }
    })
  }, [jobs, mode, categories])

  const visible = useMemo(() => {
    if (!jobs) return []
    let list = jobs
    if (filter !== 'all') {
      list = list.filter((j) => (mode === 'category' ? j.kind === filter : j.category === filter))
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter((j) =>
        j.title?.toLowerCase().includes(q) ||
        j.org?.toLowerCase().includes(q) ||
        j.orgShort?.toLowerCase().includes(q)
      )
    }
    return list
  }, [jobs, filter, mode, search])

  const categoryBreadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jobalertx.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: heading.title,
        item: `https://jobalertx.com/${mode === 'category' ? `category/${slug}` : `latest/${kind}`}`,
      },
    ],
  }

  // Per-category keyword maps using high-volume, low-difficulty keywords from SEO data
  const CATEGORY_KEYWORD_MAP = {
    jpsc: 'jpsc recruitment 2026, jpsc civil services 2026, jpsc application form 2026, jpsc cdpo, jpsc jharkhand jobs, jharkhand public service commission, jharkhand job alert x',
    jssc: 'jssc recruitment 2026, jssc cgl 2026, jssc jcce excise constable, jssc lady supervisor, jssc jharkhand vacancy 2026, jharkhand staff selection commission, jharkhand job alert x',
    'rojgar-mela': 'jharkhand rojgar mela 2026, rojgar mela ranchi, rojgar mela dhanbad, rojgar mela bokaro, rojgar mela jamshedpur, district employment exchange jharkhand, rojgar bharti camp 2026, jharkhand job alert x',
    private: 'jharkhand private jobs 2026, tata steel jamshedpur careers, jindal steel patratu jobs, private company jobs ranchi, jharkhand job vacancies 2026, jharkhand job alert x',
    others: 'central govt jobs 2026, railway rrb recruitment 2026, ssc recruitment 2026, bank jobs 2026, defence recruitment 2026, job alert x',
    ssc: 'free job alert ssc, ssc cgl recruitment 2026, ssc chsl 2026, ssc mts 2026, govt job notification 2026, new vacancy 2026, 12th pass govt job, central govt jobs, latest govt jobs, free job alert 2026, sarkari job alert, job alert x',
    railway: 'free job alert railway, rrb ntpc 2026, railway recruitment 2026, railway group d 2026, government job vacancy 2026, new job vacancy 2026, govt job notification 2026, free job alert 2026, latest govt jobs, 12th pass govt job, sarkari naukri, job alert x',
    banking: 'ibps po 2026, ibps clerk 2026, sbi po 2026, sbi clerk 2026, bank job alert, government job vacancy 2026, new job vacancy 2026, free job alert 2026, latest govt jobs, central govt jobs, job notification 2026, job alert x',
    upsc: 'upsc cse 2026, upsc recruitment 2026, government job vacancy 2026, central govt jobs, latest govt jobs, free job alert 2026, govt job notification 2026, sarkari naukri, job notification 2026, sarkari job alert, job alert x',
    defence: 'defence job alert, army recruitment 2026, navy recruitment 2026, airforce recruitment 2026, government job vacancy 2026, new job vacancy 2026, free job alert 2026, 12th pass govt job, latest govt jobs, job alert x',
    police: 'police recruitment 2026, constable bharti 2026, up police 2026, government job vacancy 2026, new vacancy 2026, free job alert 2026, 12th pass govt job, latest govt jobs, sarkari naukri, job alert x',
    teaching: 'teacher recruitment 2026, tet 2026, ctet 2026, government job vacancy 2026, new vacancy 2026, free job alert 2026, latest govt jobs, sarkari naukri, job notification 2026, job alert x',
    nursing: 'nursing job alert, ans recruitment 2026, nurse vacancy 2026, government job vacancy 2026, free job alert 2026, new job vacancy 2026, latest govt jobs, job alert x',
    odisha: 'free job alert odisha, odisha free job alert, odisha job alert, odisha govt job, freejobalert odisha, odisha government jobs 2026, new vacancy 2026 odisha, latest govt jobs, job alert x',
    punjab: 'free job alert punjab, punjab job alert, job alert punjab, punjab govt jobs, govt jobs in punjab, free job alert 2026 punjab, new vacancy 2026, job alert x',
    bihar: 'free job alert bihar, bihar job alert, job alert bihar, bihar govt job, government job vacancy 2026, new vacancy 2026 bihar, free job alert 2026, job alert x',
    rajasthan: 'free job alert rajasthan, rajasthan job alert, job alert rajasthan, rajasthan govt job, government job vacancy 2026, new vacancy 2026, free job alert 2026, job alert x',
    hp: 'free job alert hp, hp job alert, job alert hp, hp free job alert, hp govt job, himachal pradesh govt jobs 2026, new vacancy 2026, free job alert 2026, job alert x',
    cg: 'free job alert cg, cg job alert, cg free job alert, job alert cg, chhattisgarh govt jobs 2026, government job vacancy 2026, free job alert 2026, job alert x',
    jharkhand: 'free job alert jharkhand, job alert jharkhand, jharkhand govt jobs 2026, government job vacancy 2026, free job alert 2026, new vacancy 2026, job alert x',
    mp: 'free job alert mp, job alert mp, mp job alert, mp govt jobs 2026, government job vacancy 2026, free job alert 2026, new vacancy 2026, job alert x',
    haryana: 'free job alert haryana, haryana job alert, job alert haryana, haryana govt jobs 2026, government job vacancy 2026, free job alert 2026, new vacancy 2026, job alert x',
    karnataka: 'free job alert karnataka, karnataka job alert, job alert karnataka, karnataka forest department recruitment 2026, government job vacancy 2026, free job alert 2026, job alert x',
    ap: 'free job alert ap, ap job alert, job alert ap, ap free job alert, andhra pradesh govt jobs 2026, government job vacancy 2026, free job alert 2026, job alert x',
    assam: 'assam job alert, job alert assam, assam govt jobs 2026, government job vacancy 2026, free job alert 2026, new vacancy 2026, job alert x',
  }

  // Per-kind keyword maps
  const KIND_KEYWORD_MAP = {
    'admit-card': 'admit card 2026, free job alert admit card, download admit card 2026, govt exam admit card, ssc admit card, railway admit card, ibps admit card, police admit card, latest notification, job alert x',
    result: 'sarkari result 2026, govt exam result 2026, ssc result, railway result, ibps result, police result, iti result 2026, free job alert result, latest notification, job alert x',
    'answer-key': 'answer key 2026, official answer key download, ssc answer key, railway answer key, police answer key, latest answer key 2026, objection window, free job alert, job alert x',
    syllabus: 'exam syllabus 2026, ssc syllabus, railway syllabus, ibps syllabus, upsc syllabus, exam pattern 2026, free job alert syllabus, job alert x',
    job: 'free job alert, government job vacancy 2026, new job vacancy 2026, govt job notification 2026, latest govt jobs, new vacancy 2026, 12th pass govt job, central govt jobs, sarkari naukri, job alert x',
  }

  const categoryKeywords = mode === 'category'
    ? (CATEGORY_KEYWORD_MAP[slug] || `${heading.title} jobs 2026, ${heading.title} recruitment 2026, free job alert 2026, govt job notification 2026, government job vacancy 2026, latest govt jobs, sarkari naukri, new vacancy 2026, job alert x`)
    : (KIND_KEYWORD_MAP[kind] || `${heading.title} 2026, free job alert 2026, government job vacancy 2026, latest govt jobs, job alert x`)

  return (
    <div className="animate-fade-in space-y-6">
      <SEOHead
        title={mode === 'category'
          ? `${heading.title} Jobs 2026 — Free Job Alert, New Vacancy & Recruitment Notification`
          : `${heading.title} 2026 — Free Job Alert, Latest Govt Notifications`}
        description={mode === 'category'
          ? `Free Job Alert — Latest ${heading.title} recruitment 2026, new vacancy notifications, online application form, admit card, result and answer key. Get instant govt job notification 2026 on Job Alert X.`
          : `Latest ${heading.title} 2026 — Free job alert for all govt exam notifications, download links, eligibility details and important dates on Job Alert X.`}
        keywords={categoryKeywords}
        canonical={`https://jobalertx.com/${mode === 'category' ? `category/${slug}` : `latest/${kind}`}`}
        jsonLd={[categoryBreadcrumbs]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {heading.icon ? (
            <BrandIcon icon={heading.icon} color={heading.color} size={52} square />
          ) : (
            <span
              className="flex h-[52px] w-[52px] items-center justify-center rounded-xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${heading.color}, #3a3ca5)` }}
            >
              <Layers size={24} />
            </span>
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">{heading.title}</h1>
            <p className="text-[13.5px] text-ink-muted">{heading.subtitle}</p>
          </div>
        </div>

        {/* Search within page */}
        {jobs && jobs.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, org..."
              className="w-full rounded-xl border border-hairline bg-surface py-2 pl-9 pr-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        )}
      </div>

      {/* Filters */}
      {facets.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
            All{jobs ? ` (${jobs.length})` : ''}
          </Chip>
          {facets.map((f) => (
            <Chip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
            </Chip>
          ))}
        </div>
      )}

      {/* Results in Professional Tabular Format */}
      {jobs === null ? (
        <div className="flex h-48 items-center justify-center text-[14px] text-ink-muted">Loading posts…</div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-subtle/40 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
            <Layers size={22} />
          </span>
          <p className="text-[15px] font-semibold text-ink">Coming Soon</p>
          <p className="text-[13px] text-ink-muted">
            No posts found in this section yet — new notifications are added daily.
          </p>
        </div>
      ) : (
        <RecentJobsTable
          jobs={visible}
          kind={mode === 'kind' ? kind : (filter === 'all' ? undefined : filter)}
          showFooter={false}
        />
      )}
    </div>
  )
}
