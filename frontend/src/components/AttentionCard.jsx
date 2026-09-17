import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Clock, ArrowRight, ArrowUpRight } from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'
import { getJobs } from '../services/api.js'

/**
 * Robust date parser supporting Indian and standard formats:
 * - DD-MM-YYYY (e.g. '15-10-2026', '28-07-2026')
 * - DD/MM/YYYY (e.g. '15/10/2026')
 * - YYYY-MM-DD
 * - DD Mon YYYY (e.g. '10 Jul 2026', '28 Jul 2026')
 * - ISO strings / standard date strings
 */
function parseDateRobust(val) {
  if (!val || typeof val !== 'string') return null
  const s = val.trim()

  // Match DD-MM-YYYY or DD/MM/YYYY
  const ddmmyyyy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (ddmmyyyy) {
    const day = parseInt(ddmmyyyy[1], 10)
    const month = parseInt(ddmmyyyy[2], 10) - 1
    const year = parseInt(ddmmyyyy[3], 10)
    const d = new Date(year, month, day, 23, 59, 59)
    if (!isNaN(d.getTime())) return d
  }

  // Match DD Mon YYYY e.g. "28 Jul 2026" or "15 October 2026"
  const ddMonYear = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
  if (ddMonYear) {
    const d = new Date(`${ddMonYear[2]} ${ddMonYear[1]}, ${ddMonYear[3]} 23:59:59`)
    if (!isNaN(d.getTime())) return d
  }

  // Standard Date parse
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Extract raw deadline string and parsed Date from a job object.
 */
function getDeadlineInfo(job) {
  let rawDateStr = ''

  if (Array.isArray(job.importantDates)) {
    const entry = job.importantDates.find((item) => {
      const lbl = String(item?.label || '').toLowerCase()
      return (
        lbl.includes('last date') ||
        lbl.includes('close') ||
        lbl.includes('end date') ||
        lbl.includes('closing') ||
        lbl.includes('apply end')
      )
    })
    if (entry && entry.value) {
      rawDateStr = entry.value
    } else {
      const fallback = job.importantDates.find((item) => {
        const lbl = String(item?.label || '').toLowerCase()
        return lbl.includes('last') || lbl.includes('end')
      })
      if (fallback?.value) rawDateStr = fallback.value
    }
  }

  if (!rawDateStr && job.endDate) rawDateStr = job.endDate
  if (!rawDateStr && job.lastDate) rawDateStr = job.lastDate

  const parsed = parseDateRobust(rawDateStr)
  return {
    rawDateStr: rawDateStr || 'Check Details',
    parsedDate: parsed,
  }
}

/**
 * Calculate urgency badge text & status based on deadline difference in days.
 */
function getUrgencyBadge(parsedDate, now) {
  if (!parsedDate) return null

  const diffTime = parsedDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return { text: 'Ends Today!', isUrgent: true }
  } else if (diffDays === 1) {
    return { text: 'Ends Tomorrow', isUrgent: true }
  } else if (diffDays > 1 && diffDays <= 7) {
    return { text: `${diffDays} days left`, isUrgent: true }
  } else if (diffDays > 7 && diffDays <= 30) {
    return { text: `${diffDays} days left`, isUrgent: false }
  } else if (diffDays > 30) {
    return { text: 'Active', isUrgent: false }
  }
  return null
}

/**
 * High-performance, zero-layout-shift Skeleton Loader
 */
function AttentionSkeleton() {
  return (
    <div className="divide-y divide-hairline animate-pulse" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-3.5 gap-2.5">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-subtle/80 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-3.5 bg-subtle/90 rounded w-4/5" />
              <div className="flex items-center gap-2">
                <div className="h-2.5 bg-subtle/70 rounded w-16" />
                <div className="h-2.5 bg-rose-500/20 rounded w-24" />
              </div>
            </div>
          </div>
          <div className="h-7 w-14 rounded-lg bg-subtle/80 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export default function AttentionCard({ viewAllTo = '/category/all' }) {
  const [closingJobs, setClosingJobs] = useState(null)

  useEffect(() => {
    let active = true

    // Fetch lightweight payload (20 items) with cached HTTP
    getJobs({ limit: 20 })
      .then((data) => {
        if (!active) return
        const list = Array.isArray(data) ? data : []
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const processed = []
        for (const job of list) {
          const { rawDateStr, parsedDate } = getDeadlineInfo(job)
          if (!rawDateStr && !parsedDate) continue

          const badge = getUrgencyBadge(parsedDate, now)
          const diffDays = parsedDate
            ? Math.ceil((parsedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : null

          processed.push({
            ...job,
            displayLastDate: rawDateStr,
            parsedDate,
            diffDays,
            badge,
          })
        }

        // 1. Separate upcoming deadlines (diffDays >= 0)
        const upcoming = processed
          .filter((j) => j.diffDays !== null && j.diffDays >= 0)
          .sort((a, b) => a.diffDays - b.diffDays)

        if (upcoming.length >= 3) {
          setClosingJobs(upcoming.slice(0, 5))
        } else {
          const combined = [...upcoming]
          for (const item of processed) {
            if (!combined.some((c) => c.id === item.id)) {
              combined.push(item)
            }
            if (combined.length >= 5) break
          }
          setClosingJobs(combined.slice(0, 5))
        }
      })
      .catch(() => active && setClosingJobs([]))

    return () => {
      active = false
    }
  }, [])

  return (
    <section
      className="card overflow-hidden border-rose-500/25 dark:border-rose-500/20 shadow-xs transition-shadow duration-200 hover:shadow-md will-change-transform"
      aria-labelledby="attention-card-heading"
    >
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between border-b border-hairline px-3.5 sm:px-4 py-3 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent text-ink">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shadow-xs">
            <AlertTriangle size={15} className="animate-pulse" aria-hidden="true" />
          </span>
          <div className="flex items-center gap-1.5">
            <h2 id="attention-card-heading" className="text-xs sm:text-sm font-bold tracking-tight text-ink">
              Attention
            </h2>
            <span className="inline-flex items-center rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-extrabold tracking-wider text-rose-700 dark:text-rose-300 border border-rose-500/25">
              Ending Soon
            </span>
          </div>
        </div>
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      </div>

      {/* ── Subtitle notification banner ── */}
      <div className="bg-subtle/70 px-3.5 sm:px-4 py-1.5 border-b border-hairline/60 flex items-center gap-1.5 text-[11px] text-ink-muted">
        <Clock size={12} className="text-rose-500 shrink-0" aria-hidden="true" />
        <span className="truncate">Exams & recruitments closing soon — submit online now!</span>
      </div>

      {/* ── Content (Zero Layout Shift with Skeleton) ── */}
      {closingJobs === null ? (
        <AttentionSkeleton />
      ) : closingJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
          <AlertTriangle size={26} className="text-ink-faint" />
          <p className="text-[13px] font-semibold text-ink">No Urgent Deadlines</p>
          <p className="text-[12px] text-ink-muted">All active application windows are currently on schedule.</p>
        </div>
      ) : (
        <>
          {/* ── Tabular List ── */}
          <div className="divide-y divide-hairline">
            {closingJobs.map((job) => (
              <div
                key={job.id}
                className="group flex items-center justify-between gap-2.5 p-3 sm:p-3.5 transition-colors duration-150 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
              >
                {/* Exam Name, Org & Last Date */}
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <BrandIcon
                    icon={job.logo?.icon || 'building'}
                    color={job.logo?.color || '#e11d48'}
                    size={28}
                    square
                    className="shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/job/${job.id}`}
                      className="block line-clamp-2 text-xs font-bold leading-snug text-ink transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400"
                      title={job.title}
                    >
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-faint mt-1">
                      <span className="truncate max-w-[90px] sm:max-w-[120px] font-medium" title={job.orgShort || job.org}>
                        {job.orgShort || job.org}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 shrink-0">
                        <span className="text-ink-muted">Last:</span>
                        <span className="font-bold">{job.displayLastDate}</span>
                      </span>
                      {job.badge && (
                        <span
                          className={`inline-flex items-center text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                            job.badge.isUrgent
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {job.badge.text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action / Apply Button */}
                <div className="shrink-0">
                  <Link
                    to={`/job/${job.id}`}
                    className="inline-flex min-h-[30px] items-center justify-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs transition-transform duration-150 hover:bg-rose-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    aria-label={`View and apply for ${job.title}`}
                  >
                    Apply
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* ── Card Footer ── */}
          <div className="border-t border-hairline bg-subtle/30 px-3 py-2 text-center">
            <Link
              to={viewAllTo}
              className="inline-flex min-h-[32px] items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
            >
              View All Govt Jobs & Deadlines
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
