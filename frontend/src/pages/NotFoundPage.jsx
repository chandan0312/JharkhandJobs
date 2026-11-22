import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Home as HomeIcon } from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center animate-fade-in">
      <SEOHead
        title="Page Not Found — Jharkhand JobAlert X"
        description="The page you are looking for doesn't exist or has been moved."
        noIndex={true}
      />

      <div className="card max-w-md p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
          <Search size={26} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink">Page Not Found</h1>
        <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-ink-muted">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <HomeIcon size={16} className="mr-1" />
            Back to Home
          </Link>
          <Link to="/search" className="btn-secondary">
            <Search size={16} className="mr-1" />
            Search Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}