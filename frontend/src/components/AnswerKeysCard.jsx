import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, ArrowRight, ArrowUpRight } from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'
import { getJobsByKind } from '../services/api.js'

export default function AnswerKeysCard({ viewAllTo = '/latest/answer-key' }) {
  const [keys, setKeys] = useState(null)

  useEffect(() => {
    let active = true
    getJobsByKind('answer-key')
      .then((data) => active && setKeys((data || []).slice(0, 5)))
      .catch(() => active && setKeys([]))
    return () => { active = false }
  }, [])

  return (
    <section className="card overflow-hidden">
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3 bg-subtle/50 text-ink">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
            <KeyRound size={15} aria-hidden="true" />
          </span>
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-ink">
              Answer Keys
            </h2>
            <span className="inline-flex items-center rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-bold tracking-wider text-cyan-700 dark:text-cyan-300 border border-cyan-500/25">
              Keys
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {keys === null ? (
        <div className="flex h-32 items-center justify-center text-[13px] text-ink-muted">
          Loading…
        </div>
      ) : keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <KeyRound size={28} className="text-ink-faint" />
          <p className="text-[13px] font-semibold text-ink">Coming Soon</p>
          <p className="text-[12px] text-ink-muted">No answer keys published yet.</p>
        </div>
      ) : (
        <>
          {/* ── Tabular Content (compact 2-column format) ── */}
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline bg-subtle/50 text-xs font-bold uppercase tracking-wider text-ink-faint">
                <th className="py-2.5 pl-4 pr-2 w-[70%]">Exam / Key</th>
                <th className="py-2.5 pr-4 pl-1 w-[30%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {keys.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-brand-50/40 dark:hover:bg-brand-600/10"
                >
                  {/* Name & Org */}
                  <td className="py-3 pl-4 pr-2 align-middle">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BrandIcon
                        icon={item.logo?.icon || 'key'}
                        color={item.logo?.color || '#06b6d4'}
                        size={30}
                        square
                        className="shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/job/${item.id}`}
                          className="block line-clamp-2 text-xs font-bold leading-snug text-ink transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400"
                          title={item.title}
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-ink-faint mt-0.5">
                          <span className="truncate max-w-[120px]" title={item.orgShort || item.org}>{item.orgShort || item.org}</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                            Live
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="py-3 pr-4 pl-1 align-middle text-right">
                    <Link
                      to={`/job/${item.id}`}
                      className="inline-flex items-center justify-center gap-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-2.5 py-1 text-xs font-bold transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap shadow-2xs"
                      aria-label={`Check key for ${item.title}`}
                    >
                      Check Key
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}
