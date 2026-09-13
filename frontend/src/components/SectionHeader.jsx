import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * Section heading with an optional "View All" action, e.g.
 *   RECENTLY POSTED JOBS            View All →
 */
export default function SectionHeader({ title, viewAllTo, eyebrow = false, className = '' }) {
  return (
    <div className={`mb-3.5 flex items-center justify-between gap-4 border-b border-hairline/60 pb-2 ${className}`}>
      {eyebrow ? (
        <span className="eyebrow">{title}</span>
      ) : (
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink">{title}</h2>
      )}
      {viewAllTo && (
        <Link to={viewAllTo} className="link-muted shrink-0 text-xs font-semibold">
          View All
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
