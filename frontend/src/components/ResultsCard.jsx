import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, ArrowRight, ArrowUpRight } from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'
import { getJobsByKind } from '../services/api.js'

export default function ResultsCard({ viewAllTo = '/latest/result' }) {
  const [results, setResults] = useState(null)

  useEffect(() => {
    let active = true
    getJobsByKind('result')
      .then((data) => active && setResults((data || []).slice(0, 5)))
      .catch(() => active && setResults([]))
    return () => { active = false }
  }, [])

  return (
    <section className="card overflow-hidden">
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3 bg-subtle/50 text-ink">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            <Award size={15} aria-hidden="true" />
          </span>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-ink">
              Latest Results
            </h2>
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold tracking-wider text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {results === null ? (
        <div className="flex h-32 items-center justify-center text-[13px] text-ink-muted">
          Loading…
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <Award size={28} className="text-ink-faint" />
          <p className="text-[13px] font-semibold text-ink">Coming Soon</p>
          <p className="text-[12px] text-ink-muted">No results published yet.</p>
        </div>
      ) : (
        <>
          {/* ── Tabular Content (compact 2-column format) ── */}
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline bg-subtle/50 text-xs font-bold uppercase tracking-wider text-ink-faint">
                <th className="py-2.5 pl-4 pr-2 w-[70%]">Result / Exam</th>
                <th className="py-2.5 pr-4 pl-1 w-[30%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {results.map((res) => (
                <tr
                  key={res.id}
                  className="group transition-colors hover:bg-brand-50/40 dark:hover:bg-brand-600/10"
                >
                  {/* Result Name & Org */}
                  <td className="py-3 pl-4 pr-2 align-middle">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BrandIcon
                        icon={res.logo?.icon || 'award'}
                        color={res.logo?.color || '#10b981'}
                        size={30}
                        square
                        className="shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/job/${res.id}`}
                          className="block line-clamp-2 text-xs font-bold leading-snug text-ink transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400"
                          title={res.title}
                        >
                          {res.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-ink-faint mt-0.5">
                          <span className="truncate max-w-[120px]" title={res.orgShort || res.org}>{res.orgShort || res.org}</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Out
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Action / View Link Button */}
                  <td className="py-2.5 pr-3.5 pl-1 text-right align-middle whitespace-nowrap">
                    <Link
                      to={`/job/${res.id}`}
                      className="btn-primary-sm"
                      aria-label={`View result for ${res.title}`}
                    >
                      View
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Card Footer ── */}
          <div className="border-t border-hairline bg-subtle/30 px-3 py-2.5 text-center">
            <Link
              to={viewAllTo}
              className="inline-flex min-h-[32px] items-center justify-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
            >
              Check All Results
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
