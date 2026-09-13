import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ClipboardList } from 'lucide-react'
import BrandIcon from '../components/BrandIcon.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getCategories } from '../services/api.js'

export default function ExamsPage() {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => active && setCategories(data || []))
      .catch(() => active && setCategories([]))
    return () => { active = false }
  }, [])

  const examsBreadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jobalertx.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Exams & Categories',
        item: 'https://jobalertx.com/exams',
      },
    ],
  }

  return (
    <div className="animate-fade-in">
      <SEOHead
        title="All Government Exams, Recruitment Categories & Syllabus 2026"
        description="Explore all government exam categories including SSC CGL/CHSL, UPSC CSE, Railway RRB NTPC, Banking IBPS/SBI, Defence, Police, and Teaching on Job Alert X."
        keywords="sarkari exam, all govt exams 2026, ssc exams, railway exams, bank exams, upsc exams, defence recruitment, police jobs, job alert x"
        canonical="https://jobalertx.com/exams"
        jsonLd={[examsBreadcrumbs]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">All Exams &amp; Categories</h1>
        <p className="text-[13.5px] text-ink-muted">Browse government job categories across every department.</p>
      </div>

      {categories === null ? (
        <div className="flex h-48 items-center justify-center text-[14px] text-ink-muted">
          Loading categories…
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-subtle/40 py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
            <ClipboardList size={22} />
          </span>
          <p className="text-[15px] font-semibold text-ink">Coming Soon</p>
          <p className="text-[13px] text-ink-muted">
            Categories will appear here once added. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="card group flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-cardhover"
            >
              <BrandIcon icon={c.icon} color={c.color} size={52} square />
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold text-ink group-hover:text-brand-600">{c.name}</h2>
                <p className="truncate text-[12.5px] text-ink-muted">{c.fullName}</p>
                <p className="mt-1 text-[12px] font-medium text-ink-faint">
                  {c.jobs} listings
                </p>
              </div>
              <ArrowUpRight size={18} className="shrink-0 text-ink-faint transition-colors group-hover:text-brand-600" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
