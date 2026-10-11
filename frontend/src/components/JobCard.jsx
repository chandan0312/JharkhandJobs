import { Link } from 'react-router-dom'
import { Calendar, Briefcase, GraduationCap, ChevronRight, Clock, Users } from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'

const KIND_BADGE = {
  job: {
    label: 'Latest Job',
    cls: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-[#151c38] dark:text-indigo-300 dark:border-indigo-500/30',
  },
  'admit-card': {
    label: 'Admit Card',
    cls: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-[#2a1c10] dark:text-amber-300 dark:border-amber-500/30',
  },
  result: {
    label: 'Result',
    cls: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-[#0f241a] dark:text-emerald-300 dark:border-emerald-500/30',
  },
  'answer-key': {
    label: 'Answer Key',
    cls: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-[#0c2436] dark:text-cyan-300 dark:border-cyan-500/30',
  },
  syllabus: {
    label: 'Syllabus',
    cls: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200 dark:bg-[#29132d] dark:text-fuchsia-300 dark:border-fuchsia-500/30',
  },
}

function getEligibility(job) {
  if (job.eligibilityShort) return job.eligibilityShort
  const cat = job.category?.toLowerCase() || ''
  if (cat.includes('ssc')) return 'Graduation'
  if (cat.includes('upsc')) return 'Graduation'
  if (cat.includes('railway')) return '10th / ITI / Diploma'
  if (cat.includes('police')) return '12th Pass'
  if (cat.includes('banking')) return 'Graduation'
  if (cat.includes('defence')) return '10+2 / PCM'
  if (cat.includes('teaching')) return 'B.Ed / CTET'
  return 'Graduation'
}

function getStartDate(job) {
  if (job.startDate) return job.startDate
  const begin = job.importantDates?.find(
    (d) =>
      d.label.toLowerCase().includes('begin') ||
      d.label.toLowerCase().includes('released') ||
      d.label.toLowerCase().includes('declared')
  )
  if (begin) return begin.value
  return job.postedOn || '24 May 2024'
}

function getEndDate(job) {
  if (job.endDate) return job.endDate
  const end = job.importantDates?.find(
    (d) =>
      d.label.toLowerCase().includes('last date') ||
      d.label.toLowerCase().includes('exam date') ||
      d.label.toLowerCase().includes('tier')
  )
  if (end) return end.value
  return '24 Jun 2024'
}

function getPostCount(job) {
  if (job.vacancies) return job.vacancies.toLocaleString('en-IN')
  if (job.posts && Array.isArray(job.posts) && job.posts.length > 0) {
    const total = job.posts.reduce((acc, p) => acc + (p.total || 0), 0)
    if (total > 0) return total.toLocaleString('en-IN')
  }
  return '17,727'
}

/**
 * variant:
 *   'compact' (default) — simple clean centered card for Home page
 *   'detailed' / 'row'  — feature-rich 4-stat card with dates, post, eligibility, and badge
 */
export default function JobCard({ job, variant = 'compact' }) {
  if (!job) return null

  // === SIMPLE COMPACT CARD FOR HOME PAGE ===
  if (variant === 'compact') {
    return (
      <Link
        to={`/job/${job.id}`}
        className="card group relative flex flex-col items-center p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-cardhover hover:border-brand-300 dark:hover:border-white/20"
      >
        <BrandIcon icon={job.logo?.icon || 'landmark'} color={job.logo?.color || '#1B6F81'} size={56} />
        <h3 className="mt-3.5 line-clamp-2 text-[14px] font-bold leading-snug text-ink group-hover:text-brand-600 transition-colors">
          {job.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12px] text-ink-muted">{job.org}</p>
        <div className="mt-3.5 w-full border-t border-hairline pt-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-ink-faint">
            <Clock size={12.5} />
            {job.postedAt}
          </span>
        </div>
      </Link>
    )
  }

  // === DETAILED 4-STAT CARD (FOR CATEGORY, SEARCH & DETAIL PAGES) ===
  const badge = KIND_BADGE[job.kind] || KIND_BADGE.job
  const startDate = getStartDate(job)
  const endDate = getEndDate(job)
  const postCount = getPostCount(job)
  const eligibility = getEligibility(job)

  return (
    <Link
      to={`/job/${job.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface border border-hairline p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-cardhover dark:bg-[#0c1324] dark:border-white/[0.08] dark:hover:border-cyan-500/30 dark:hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
    >
      {/* Subtle Top Ambient Glow (Dark Mode only) */}
      <span
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-opacity group-hover:opacity-100 hidden dark:block"
        aria-hidden="true"
      />

      {/* === TOP ROW: BRAND ICON + TITLE + BADGE === */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <span
              className="absolute inset-0 rounded-full blur-sm opacity-20 dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity"
              style={{ backgroundColor: job.logo?.color || '#ef4444' }}
            />
            <BrandIcon
              icon={job.logo?.icon || 'landmark'}
              color={job.logo?.color || '#ef4444'}
              size={50}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[16px] sm:text-[17px] font-black tracking-tight text-ink group-hover:text-brand-600 dark:text-white dark:group-hover:text-cyan-300 transition-colors">
              {job.title}
            </h3>
            <p className="truncate text-[12.5px] font-medium text-ink-muted dark:text-slate-400 mt-0.5">
              {job.org}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold shadow-sm ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      {/* === MIDDLE ROW: 4 STATS GRID BOX === */}
      <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-xl bg-subtle/80 border border-hairline p-3 text-center shadow-inner dark:bg-[#070c18] dark:border-white/[0.05]">
        <div className="flex flex-col items-center min-w-0 px-1">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink-faint dark:text-slate-400">
            <Calendar size={12} className="shrink-0" />
            <span className="truncate">Start Date</span>
          </span>
          <span className="truncate text-[12px] sm:text-[12.5px] font-bold text-ink dark:text-slate-100 mt-1">
            {startDate}
          </span>
        </div>

        <div className="flex flex-col items-center min-w-0 px-1 border-l border-hairline dark:border-white/[0.06]">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink-faint dark:text-slate-400">
            <Calendar size={12} className="shrink-0" />
            <span className="truncate">End Date</span>
          </span>
          <span className="truncate text-[12px] sm:text-[12.5px] font-bold text-ink dark:text-slate-100 mt-1">
            {endDate}
          </span>
        </div>

        <div className="flex flex-col items-center min-w-0 px-1 border-l border-hairline dark:border-white/[0.06]">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink-faint dark:text-slate-400">
            <Briefcase size={12} className="shrink-0" />
            <span className="truncate">Post</span>
          </span>
          <span className="truncate text-[12px] sm:text-[12.5px] font-bold text-orange-600 dark:text-amber-300 mt-1">
            {postCount}
          </span>
        </div>

        <div className="flex flex-col items-center min-w-0 px-1 border-l border-hairline dark:border-white/[0.06]">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink-faint dark:text-slate-400">
            <GraduationCap size={12} className="shrink-0" />
            <span className="truncate">Eligibility</span>
          </span>
          <span className="truncate text-[12px] sm:text-[12.5px] font-bold text-ink dark:text-slate-100 mt-1" title={eligibility}>
            {eligibility}
          </span>
        </div>
      </div>

      {/* === BOTTOM ROW: CHEVRON NAVIGATION ARROW === */}
      <div className="mt-3.5 flex items-center justify-end">
        <span className="inline-flex items-center text-ink-faint group-hover:text-ink dark:text-slate-400 dark:group-hover:text-white transition-colors">
          <ChevronRight
            size={19}
            className="transition-transform duration-200 group-hover:translate-x-1 text-ink-faint group-hover:text-brand-600 dark:text-slate-400 dark:group-hover:text-cyan-300"
          />
        </span>
      </div>
    </Link>
  )
}
