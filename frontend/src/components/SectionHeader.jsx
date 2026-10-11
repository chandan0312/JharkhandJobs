import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/**
 * Consistent section header used across the home page.
 * - title:     bold section label
 * - subtitle:  optional muted subtitle
 * - viewAllTo: optional "View all" link
 * - viewAllText: link label (default "View all")
 * - action:    optional JSX appended to the right
 */
export default function SectionHeader({
  title,
  subtitle,
  viewAllTo,
  viewAllText = 'View all',
  action,
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {/* Accent left border */}
        <span
          className="h-5 w-1 rounded-pill shrink-0"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h2
            className="section-title truncate"
            style={{ color: 'var(--text)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {action}
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="link-accent whitespace-nowrap"
            aria-label={`${viewAllText} — ${title}`}
          >
            {viewAllText}
            <ChevronRight size={13} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  )
}
