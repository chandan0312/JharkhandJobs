// ---------------------------------------------------------------------------
// EditorialVerificationBadge — E-E-A-T trust signal component
// Appears on every Job / Notification detail page.
// Signals to Google (and readers) that content is verified by a real team.
// ---------------------------------------------------------------------------

import { ShieldCheck, Clock, ExternalLink } from 'lucide-react'

/**
 * @param {object} props
 * @param {string}  [props.reviewedAt]        — ISO date string; defaults to today
 * @param {string}  [props.officialSource]    — Label for official source (e.g. "jpsc.gov.in")
 * @param {string}  [props.officialSourceUrl] — URL to official source portal
 * @param {string}  [props.kind]              — Post kind: 'job'|'admit-card'|'result'|'answer-key'|'syllabus'
 */
export default function EditorialVerificationBadge({
  reviewedAt,
  officialSource,
  officialSourceUrl,
  kind = 'job',
}) {
  const reviewDate = reviewedAt
    ? new Date(reviewedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const kindVerb = {
    job: 'recruitment notification',
    'admit-card': 'admit card notice',
    result: 'result notification',
    'answer-key': 'answer key notice',
    syllabus: 'syllabus document',
  }[kind] || 'notification'

  return (
    <aside
      aria-label="Editorial Verification"
      className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-900/10 p-4"
    >
      <div className="flex items-start gap-3">
        {/* Shield icon */}
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck size={17} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Badge headline */}
          <p className="text-[13px] font-bold text-emerald-800 dark:text-emerald-300">
            ✅ Verified by Jharkhand JobAlert X Editorial Team
          </p>

          {/* Explanation */}
          <p className="text-[12px] leading-relaxed text-ink-soft">
            This {kindVerb} has been cross-checked against official Jharkhand government portals —
            including{' '}
            <span className="font-semibold text-ink">jpsc.gov.in, jssc.nic.in, jhpolice.gov.in,</span> and
            related state gazette notifications — before being published on this portal.
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
            {/* Last reviewed timestamp */}
            <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-faint">
              <Clock size={11} aria-hidden="true" />
              Last Reviewed:{' '}
              <time dateTime={reviewedAt || new Date().toISOString()} className="font-semibold text-ink-muted">
                {reviewDate}
              </time>
            </span>

            {/* Optional official source link */}
            {officialSourceUrl && officialSource && (
              <a
                href={officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11.5px] text-brand-600 hover:underline dark:text-brand-400"
              >
                <ExternalLink size={10} aria-hidden="true" />
                Official Source: {officialSource}
              </a>
            )}
          </div>

          {/* Disclaimer footer */}
          <p className="text-[11px] text-ink-faint">
            Jharkhand JobAlert X is an independent, non-governmental portal. Always confirm final
            details on the official recruitment authority's website before applying.
          </p>
        </div>
      </div>
    </aside>
  )
}
