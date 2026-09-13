import { Link, useLocation } from 'react-router-dom'
import { Construction, ArrowLeft } from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'

const META = {
  '/recent':     { title: 'Recent Jobs',      desc: 'Your recently viewed job posts will appear here.' },
  '/bookmarked': { title: 'Bookmarked',        desc: 'Save posts you like and revisit them here anytime.' },
  '/saved':      { title: 'Saved Searches',    desc: 'Store frequent searches and get notified of new matches.' },
  '/profile':    { title: 'Your Profile',      desc: 'Manage your personal details and preferences.' },
  '/settings':   { title: 'Settings',          desc: 'Customise your Job Alert X experience.' },
  '/logout':     { title: 'Logout',            desc: 'You have been signed out.' },
}

export default function Placeholder() {
  const { pathname } = useLocation()
  const meta = META[pathname] || { title: 'Page Not Found', desc: 'The page you are looking for doesn\'t exist.' }

  return (
    <div className="flex min-h-[50vh] items-center justify-center animate-fade-in">
      {/* All placeholder/user-personal pages are noindexed */}
      <SEOHead title={meta.title} noIndex={true} />

      <div className="card max-w-md p-10 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
          <Construction size={26} />
        </span>
        <h1 className="text-xl font-extrabold tracking-tight text-ink">{meta.title}</h1>
        <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-ink-muted">{meta.desc}</p>
        <Link to="/" className="btn-primary mt-6">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
