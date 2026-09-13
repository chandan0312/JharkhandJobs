import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'

/**
 * A titled "box" listing links to posts — the classic sarkari layout unit used
 * for Latest Jobs / Admit Cards / Results columns.
 *
 * props:
 *   title      section heading
 *   icon,color emblem for the header (optional)
 *   items      array of job objects
 *   viewAllTo  route for the footer link (optional)
 *   accent     hex colour for the header underline (optional)
 */
export default function CategoryBox({ title, icon, color = '#5558e6', items = [], viewAllTo, accent }) {
  const bar = accent || color
  return (
    <section className="card flex flex-col overflow-hidden">
      <header className="flex items-center gap-2.5 border-b border-hairline px-4 py-3">
        {icon ? <BrandIcon icon={icon} color={color} size={30} square /> : (
          <span className="h-4 w-1.5 rounded-full" style={{ backgroundColor: bar }} />
        )}
        <h3 className="text-[14px] font-bold text-ink">{title}</h3>
        <span className="ml-auto rounded-full bg-subtle px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
          {items.length}
        </span>
      </header>

      <ul className="flex-1 divide-y divide-hairline">
        {items.length === 0 && (
          <li className="px-4 py-6 text-center text-[13px] text-ink-faint">No posts yet.</li>
        )}
        {items.map((job, i) => (
          <li key={job.id}>
            <Link
              to={`/job/${job.id}`}
              className="flex items-start gap-2.5 px-4 py-2.5 transition-colors hover:bg-subtle"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: bar }}
              />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-[13px] font-medium text-ink-soft hover:text-brand-600">
                  {job.title}
                </span>
                <span className="text-[11px] text-ink-faint">{job.postedAt}</span>
              </span>
              {i < 2 && (
                <span className="mt-0.5 shrink-0 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                  New
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="flex items-center justify-center gap-1 border-t border-hairline px-4 py-2.5 text-[13px] font-semibold text-brand-600 transition-colors hover:bg-subtle"
        >
          View More <ArrowRight size={14} />
        </Link>
      )}
    </section>
  )
}
