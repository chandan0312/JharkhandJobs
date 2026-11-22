import { Link, useLocation } from 'react-router-dom'
import { Construction, ArrowLeft, Clock, Bookmark, Save, User, Settings, LogOut } from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'

const META = {
  '/recent':     { icon: Clock, title: 'Recent Jobs',      desc: 'Your recently viewed job posts will appear here.' },
  '/bookmarked': { icon: Bookmark, title: 'Bookmarked',        desc: 'Save posts you like and revisit them here anytime.' },
  '/saved':      { icon: Save, title: 'Saved Searches',    desc: 'Store frequent searches and get notified of new matches.' },
  '/profile':    { icon: User, title: 'Your Profile',      desc: 'Manage your personal details and preferences.' },
  '/settings':   { icon: Settings, title: 'Settings',          desc: 'Customise your Job Alert X experience.' },
  '/logout':     { icon: LogOut, title: 'Logout',            desc: 'You have been signed out.' },
}

export default function Placeholder() {
  const { pathname } = useLocation()
  const meta = META[pathname] || { icon: Construction, title: 'Page Not Found', desc: 'The page you are looking for doesn\'t exist or has been moved.' }
  const Icon = meta.icon || Construction

  return (
    <div className="flex min-h-[50vh] items-center justify-center animate-fade-in">
      {/* All placeholder/user-personal pages are noindexed */}
      <SEOHead title={meta.title} noIndex={true} />

      <div className="card max-w-md p-10 text-center">
        <Icon size={26} className="mx-auto mb-4 text-brand-600" />
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