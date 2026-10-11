import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react'
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
 * Strip redundant labels like "Last Date:" or "Closing Date:" for clean tabular display.
 */
function cleanDateString(str) {
  if (!str) return ''
  return String(str)
    .replace(/^(last\s*date|closing\s*date|end\s*date|apply\s*end)[\s:]*/i, '')
    .trim()
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
  } else if (typeof job.importantDates === 'string') {
    const parts = job.importantDates.split('|')
    const match = parts.find((p) => {
      const lower = p.toLowerCase()
      return lower.includes('last date') || lower.includes('close') || lower.includes('end date')
    })
    if (match) {
      const splitVal = match.split(':')
      rawDateStr = splitVal.length > 1 ? splitVal.slice(1).join(':').trim() : match.trim()
    }
  }

  if (!rawDateStr && job.endDate) rawDateStr = job.endDate
  if (!rawDateStr && job.lastDate) rawDateStr = job.lastDate

  const parsed = parseDateRobust(rawDateStr)
  return {
    rawDateStr: cleanDateString(rawDateStr) || 'Check Details',
    parsedDate: parsed,
  }
}

/**
 * Compact skeleton loader matching 5 rows with zero layout shift.
 */
function AttentionSkeleton() {
  return (
    <div className="divide-y divide-hairline animate-pulse" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
          <div className="h-3.5 bg-subtle/80 rounded w-3/5" />
          <div className="h-5 bg-rose-500/10 rounded w-16 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export default function AttentionCard({ viewAllTo = '/category/all' }) {
  const [closingJobs, setClosingJobs] = useState(null)

  useEffect(() => {
    let active = true

    // Fetch up to 50 jobs to ensure finding the top 5 ending soonest
    getJobs({ limit: 50 })
      .then((data) => {
        if (!active) return
        const list = Array.isArray(data) ? data : []
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const processed = []
        for (const job of list) {
          const { rawDateStr, parsedDate } = getDeadlineInfo(job)
          if (!rawDateStr && !parsedDate) continue

          const diffDays = parsedDate
            ? Math.ceil((parsedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : null

          processed.push({
            id: job.id,
            title: job.title,
            displayLastDate: rawDateStr,
            parsedDate,
            diffDays,
          })
        }

        // 1. Separate upcoming deadlines (diffDays >= 0) sorted ascending by urgency
        const upcoming = processed
          .filter((j) => j.diffDays !== null && j.diffDays >= 0)
          .sort((a, b) => a.diffDays - b.diffDays)

        // 2. Select top 5 ending soonest (fallback to closest dates if fewer than 5 future dates exist)
        if (upcoming.length >= 5) {
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
      <div className="flex items-center justify-between border-b border-hairline px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent text-ink">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shadow-2xs">
            <AlertTriangle size={13} className="animate-pulse" aria-hidden="true" />
          </span>
          <div className="flex items-center gap-1.5">
            <h2 id="attention-card-heading" className="text-xs sm:text-sm font-bold tracking-tight text-ink">
              Attention
            </h2>
            <span className="inline-flex items-center rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-rose-700 dark:text-rose-300 border border-rose-500/25">
              Ending Soon
            </span>
          </div>
        </div>
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      </div>

      {/* ── Content: 5 Small Rows (Title & Last Date) ── */}
      {closingJobs === null ? (
        <AttentionSkeleton />
      ) : closingJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center px-4">
          <AlertTriangle size={22} className="text-ink-faint" />
          <p className="text-xs font-semibold text-ink">No Urgent Deadlines</p>
          <p className="text-[11px] text-ink-muted">All active application windows are currently on schedule.</p>
        </div>
      ) : (
        <>
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline bg-subtle/60 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                <th className="py-2 pl-3.5 pr-2 w-[65%] sm:w-[68%]">Job Title</th>
                <th className="py-2 pr-3.5 pl-1 w-[35%] sm:w-[32%] text-right">Last Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {closingJobs.map((job) => (
                <tr
                  key={job.id}
                  className="group transition-colors hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                >
                  {/* Job Title Link */}
                  <td className="py-2 pl-3.5 pr-2 align-middle">
                    <Link
                      to={`/job/${job.id}`}
                      className="block text-xs font-semibold leading-snug text-ink transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400 line-clamp-2"
                      title={job.title}
                    >
                      {job.title}
                    </Link>
                  </td>

                  {/* Last Date Badge */}
                  <td className="py-2 pr-3.5 pl-1 text-right align-middle whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 tabular-nums">
                      <Clock size={10} className="shrink-0 opacity-70" aria-hidden="true" />
                      {job.displayLastDate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Card Footer ── */}
          <div className="border-t border-hairline bg-subtle/30 px-3 py-1.5 text-center">
            <Link
              to={viewAllTo}
              className="inline-flex min-h-[28px] items-center justify-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
            >
              View All Deadlines
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
