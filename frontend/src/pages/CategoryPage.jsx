import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import {
  Layers, Search, Landmark, Scale, MapPin, Users,
  Building2, GraduationCap, Briefcase, Ticket,
  Award, KeyRound, BookOpen, CheckCircle2,
} from 'lucide-react'
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

// ─── Color palette for every category slug ───────────────────────────────────
const CHIP_THEMES = {
  // ── Category mode chips (sub-kind filter) ──
  job: {
    icon: Briefcase,
    bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
    ring: 'ring-orange-400/60',
    glow: '0 4px 20px rgba(249,115,22,0.45)',
    text: 'text-white',
    inactive: 'bg-orange-500/10 border-orange-400/30 text-orange-600 dark:text-orange-300 hover:bg-orange-500/20',
  },
  'admit-card': {
    icon: Ticket,
    bg: 'bg-gradient-to-r from-rose-500 to-pink-500',
    ring: 'ring-rose-400/60',
    glow: '0 4px 20px rgba(244,63,94,0.45)',
    text: 'text-white',
    inactive: 'bg-rose-500/10 border-rose-400/30 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20',
  },
  result: {
    icon: Award,
    bg: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    ring: 'ring-amber-400/60',
    glow: '0 4px 20px rgba(245,158,11,0.45)',
    text: 'text-white',
    inactive: 'bg-amber-500/10 border-amber-400/30 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20',
  },
  'answer-key': {
    icon: KeyRound,
    bg: 'bg-gradient-to-r from-cyan-500 to-teal-500',
    ring: 'ring-cyan-400/60',
    glow: '0 4px 20px rgba(6,182,212,0.45)',
    text: 'text-white',
    inactive: 'bg-cyan-500/10 border-cyan-400/30 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20',
  },
  syllabus: {
    icon: BookOpen,
    bg: 'bg-gradient-to-r from-violet-500 to-purple-500',
    ring: 'ring-violet-400/60',
    glow: '0 4px 20px rgba(139,92,246,0.45)',
    text: 'text-white',
    inactive: 'bg-violet-500/10 border-violet-400/30 text-violet-600 dark:text-violet-300 hover:bg-violet-500/20',
  },
  // ── Category slug chips (in /latest/job) ──
  jpsc: {
    icon: Landmark,
    bg: 'bg-gradient-to-r from-[#1B6F81] to-[#0d8f9e]',
    ring: 'ring-teal-400/60',
    glow: '0 4px 20px rgba(27,111,129,0.50)',
    text: 'text-white',
    inactive: 'bg-teal-500/10 border-teal-400/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20',
  },
  jssc: {
    icon: Scale,
    bg: 'bg-gradient-to-r from-[#09324A] to-[#0d5e82]',
    ring: 'ring-sky-400/60',
    glow: '0 4px 20px rgba(9,50,74,0.55)',
    text: 'text-white',
    inactive: 'bg-sky-500/10 border-sky-400/30 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20',
  },
  'other-jharkhand': {
    icon: MapPin,
    bg: 'bg-gradient-to-r from-blue-600 to-indigo-500',
    ring: 'ring-blue-400/60',
    glow: '0 4px 20px rgba(37,99,235,0.50)',
    text: 'text-white',
    inactive: 'bg-blue-500/10 border-blue-400/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20',
  },
  'rojgar-mela': {
    icon: Users,
    bg: 'bg-gradient-to-r from-amber-600 to-orange-500',
    ring: 'ring-amber-400/60',
    glow: '0 4px 20px rgba(217,119,6,0.50)',
    text: 'text-white',
    inactive: 'bg-amber-500/10 border-amber-400/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20',
  },
  'private-job': {
    icon: Building2,
    bg: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    ring: 'ring-emerald-400/60',
    glow: '0 4px 20px rgba(5,150,105,0.50)',
    text: 'text-white',
    inactive: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20',
  },
  'central-job': {
    icon: GraduationCap,
    bg: 'bg-gradient-to-r from-indigo-600 to-violet-600',
    ring: 'ring-indigo-400/60',
    glow: '0 4px 20px rgba(79,70,229,0.50)',
    text: 'text-white',
    inactive: 'bg-indigo-500/10 border-indigo-400/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20',
  },
}

const CHIP_DEFAULT = {
  icon: Layers,
  bg: 'bg-gradient-to-r from-slate-600 to-slate-500',
  ring: 'ring-slate-400/60',
  glow: '0 4px 20px rgba(100,116,139,0.40)',
  text: 'text-white',
  inactive: 'bg-slate-500/10 border-slate-400/30 text-slate-600 dark:text-slate-300 hover:bg-slate-500/20',
}

// Derive short label for display (strip the count)
function chipLabel(raw) {
  // raw is like 'Latest Jobs (12)', strip the count
  return raw.replace(/\s*\(\d+\)$/, '')
}
function chipCount(raw) {
  const m = raw.match(/\((\d+)\)$/)
  return m ? m[1] : null
}

function ColorChip({ value, label, active, onClick }) {
  const theme = CHIP_THEMES[value] || CHIP_DEFAULT
  const Icon = theme.icon
  const display = chipLabel(label)
  const count = chipCount(label)

  return (
    <button
      type="button"
      onClick={onClick}
      style={active ? { boxShadow: theme.glow } : {}}
      className={[
        'group relative flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-all duration-200 select-none',
        'focus:outline-none focus-visible:ring-2',
        active
          ? `${theme.bg} ${theme.text} border-transparent ring-2 ${theme.ring} scale-[1.04]`
          : `${theme.inactive} border`,
      ].join(' ')}
    >
      <Icon
        size={12}
        className={`transition-transform duration-200 ${active ? 'scale-110' : 'opacity-70 group-hover:scale-110'}`}
      />
      <span>{display}</span>
      {count && (
        <span
          className={[
            'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none min-w-[18px]',
            active ? 'bg-white/25 text-white' : 'bg-current/10 opacity-75',
          ].join(' ')}
        >
          {count}
        </span>
      )}
      {active && (
        <span className="absolute inset-0 rounded-full animate-ping-once opacity-0 ring-2 ring-white/30" />
      )}
    </button>
  )
}

// (Chip replaced by ColorChip above)

export default function CategoryPage({ defaultSlug }) {
  const params = useParams()
  const location = useLocation()

  let slug = params.slug || defaultSlug
  if (!slug && !params.kind) {
    if (location.pathname.includes('rojgar-mela')) slug = 'rojgar-mela'
    else if (location.pathname.includes('private-jobs') || location.pathname.includes('private-job')) slug = 'private-job'
    else if (location.pathname.includes('other-jharkhand')) slug = 'other-jharkhand'
    else if (location.pathname.includes('central-job') || location.pathname.includes('central-jobs')) slug = 'central-job'
  }
  // Normalize slug aliases
  if (slug === 'private' || slug === 'private-jobs') slug = 'private-job'
  if (slug === 'others' || slug === 'other' || slug === 'central') slug = 'central-job'
  if (slug === 'jharkhand' || slug === 'other-jharkhand-job' || slug === 'other-jharkhand-jobs') slug = 'other-jharkhand'

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
    const ORDER = ['jpsc', 'jssc', 'other-jharkhand', 'rojgar-mela', 'private-job', 'central-job']
    const present = [...new Set(jobs.map((j) => j.category).filter(Boolean))]
    const allCategories = [...new Set([...ORDER, ...present])]
    return allCategories
      .map((c) => {
        const count = jobs.filter((j) => {
          if (c === 'private-job') return j.category === 'private-job' || j.category === 'private'
          if (c === 'central-job') return j.category === 'central-job' || j.category === 'others' || j.category === 'other'
          if (c === 'other-jharkhand') return j.category === 'other-jharkhand' || j.category === 'jharkhand'
          return j.category === c
        }).length
        const catName = categories.find((x) => x.slug === c)?.name || (c === 'other-jharkhand' ? 'Other Jharkhand Job' : c === 'central-job' ? 'Central Job' : c === 'private-job' ? 'Private Job' : c.toUpperCase())
        return { value: c, label: `${catName} (${count})`, count }
      })
      .filter((f) => f.count > 0)
  }, [jobs, mode, categories])

  const visible = useMemo(() => {
    if (!jobs) return []
    let list = jobs
    if (filter !== 'all') {
      list = list.filter((j) => {
        if (mode === 'category') return j.kind === filter
        if (filter === 'private-job') return j.category === 'private-job' || j.category === 'private'
        if (filter === 'central-job') return j.category === 'central-job' || j.category === 'others' || j.category === 'other'
        if (filter === 'other-jharkhand') return j.category === 'other-jharkhand' || j.category === 'jharkhand'
        return j.category === filter
      })
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
    'other-jharkhand': 'other jharkhand jobs 2026, jharkhand high court recruitment, jharkhand police, jharkhand teacher vacancy, jharkhand municipal jobs, jharkhand health recruitment, jharkhand job alert x',
    'rojgar-mela': 'jharkhand rojgar mela 2026, rojgar mela ranchi, rojgar mela dhanbad, rojgar mela bokaro, rojgar mela jamshedpur, district employment exchange jharkhand, rojgar bharti camp 2026, jharkhand job alert x',
    'private-job': 'jharkhand private jobs 2026, tata steel jamshedpur careers, jindal steel patratu jobs, private company jobs ranchi, jharkhand corporate job vacancies 2026, jharkhand job alert x',
    private: 'jharkhand private jobs 2026, tata steel jamshedpur careers, jindal steel patratu jobs, private company jobs ranchi, jharkhand job vacancies 2026, jharkhand job alert x',
    'central-job': 'central govt jobs 2026, railway rrb recruitment 2026, ssc recruitment 2026, bank jobs 2026, defence recruitment 2026, upsc 2026, job alert x',
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

      {/* ── Category Filter Bar ── */}
      {facets.length > 1 && (
        <div className="relative">
          {/* Glassmorphic strip */}
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              {/* 'All' chip */}
              <button
                type="button"
                onClick={() => setFilter('all')}
                style={filter === 'all' ? { boxShadow: '0 4px 20px rgba(99,102,241,0.45)' } : {}}
                className={[
                  'group relative flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-all duration-200 select-none',
                  'focus:outline-none',
                  filter === 'all'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white border-transparent ring-2 ring-slate-400/60 scale-[1.04]'
                    : 'bg-slate-500/10 border-slate-400/30 text-slate-600 dark:text-slate-300 hover:bg-slate-500/20',
                ].join(' ')}
              >
                <CheckCircle2
                  size={12}
                  className={`transition-transform duration-200 ${filter === 'all' ? 'scale-110' : 'opacity-70 group-hover:scale-110'}`}
                />
                <span>All</span>
                {jobs && (
                  <span className={[
                    'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none min-w-[18px]',
                    filter === 'all' ? 'bg-white/25 text-white' : 'opacity-75',
                  ].join(' ')}>
                    {jobs.length}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="h-5 w-px bg-hairline shrink-0" />

              {/* Per-facet chips */}
              {facets.map((f) => (
                <ColorChip
                  key={f.value}
                  value={f.value}
                  label={f.label}
                  active={filter === f.value}
                  onClick={() => setFilter(f.value)}
                />
              ))}
            </div>
          </div>

          {/* Right-fade scroll hint */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-page to-transparent" />
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
