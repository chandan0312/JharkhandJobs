import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, Sparkles, Landmark, Scale, Briefcase, Building2,
  GraduationCap, MapPin, Flame, BellRing, TrendingUp,
  ArrowRight, CheckCircle2,
} from 'lucide-react'
import SectionHeader from '../components/SectionHeader.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import JobCategoryCards from '../components/JobCategoryCards.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import RightSidebar from '../components/RightSidebar.jsx'
import SEOHead from '../components/SEOHead.jsx'
import HomeArticlesSection from '../components/HomeArticlesSection.jsx'
import { getTrending, getRecentlyPosted, getJobsByCategory } from '../services/api.js'

/* ── Skeleton loader ──────────────────────────────────────────────── */
function TableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-card"
      style={{ border: '1px solid var(--border)' }}
    >
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}
        >
          <div className="skeleton h-9 w-9 rounded-btn shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-3/5 rounded" />
            <div className="skeleton h-2.5 w-2/5 rounded" />
          </div>
          <div className="skeleton h-7 w-20 rounded-pill" />
        </div>
      ))}
    </div>
  )
}

/* ── Empty state ──────────────────────────────────────────────────── */
function EmptyBlock({ icon: Icon, label }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={22} aria-hidden="true" />
      </div>
      <p className="empty-state__title">No {label} yet</p>
      <p className="empty-state__body">New notifications are added daily — check back soon.</p>
    </div>
  )
}

/* ── Portal Identity Banner ───────────────────────────────────────── */
/* Compact single-row banner — keeps the Jharkhand portal branding    */
function PortalBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-card px-5 py-3"
      style={{
        background: 'linear-gradient(135deg, var(--brand-dark) 0%, #1B6F81 100%)',
      }}
    >
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Live dot + Portal title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Live pulse dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: '#FFFB08' }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: '#FFFB08' }}
            />
          </span>

          <div className="min-w-0">
            <span
              className="block text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'rgba(174,208,201,0.9)' }}
            >
              Jharkhand's Official Job Portal
            </span>
            <h1
              className="text-[15px] sm:text-[17px] font-black leading-tight truncate"
              style={{ color: '#FFFB08', letterSpacing: '-0.01em' }}
            >
              Jharkhand JobAlert X — JPSC · JSSC · Rojgar Mela · 2026
            </h1>
          </div>
        </div>

        {/* Right: trust badge */}
        <span
          className="shrink-0 inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[11px] font-bold"
          style={{
            background: 'rgba(255,251,8,0.12)',
            color: '#FFFB08',
            border: '1px solid rgba(255,251,8,0.25)',
          }}
        >
          <CheckCircle2 size={12} aria-hidden="true" />
          2026 Verified
        </span>
      </div>
    </div>
  )
}

/* ── Trending section header with flame icon ──────────────────────── */
function TrendingHeader() {
  return (
    <div className="flex items-center gap-2">
      {/* Accent bar */}
      <span
        className="h-5 w-1 rounded-pill shrink-0"
        style={{ background: '#f97316' }}
        aria-hidden="true"
      />
      <Flame
        size={16}
        style={{ color: '#f97316' }}
        className="animate-pulse shrink-0"
        aria-hidden="true"
      />
      <h2 className="section-title" style={{ color: 'var(--text)' }}>
        Trending This Week
      </h2>
    </div>
  )
}

/* ── Home Page ────────────────────────────────────────────────────── */
export default function Home() {
  const [trending,            setTrending]            = useState(null)
  const [recentlyPosted,      setRecentlyPosted]      = useState(null)
  const [jpscJobs,            setJpscJobs]            = useState(null)
  const [jsscJobs,            setJsscJobs]            = useState(null)
  const [otherJharkhandJobs,  setOtherJharkhandJobs]  = useState(null)
  const [rojgarMelaJobs,      setRojgarMelaJobs]      = useState(null)
  const [privateJobs,         setPrivateJobs]         = useState(null)
  const [centralJobs,         setCentralJobs]         = useState(null)

  useEffect(() => {
    let active = true
    const safe = (setter) => (data) => { if (active) setter(Array.isArray(data) ? data : []) }
    const fail = (setter) => () => { if (active) setter([]) }

    getTrending()                                .then(safe(setTrending))            .catch(fail(setTrending))
    getRecentlyPosted(6)                         .then(safe(setRecentlyPosted))      .catch(fail(setRecentlyPosted))
    getJobsByCategory('jpsc', 4, 'all')          .then(safe(setJpscJobs))            .catch(fail(setJpscJobs))
    getJobsByCategory('jssc', 4, 'all')          .then(safe(setJsscJobs))            .catch(fail(setJsscJobs))
    getJobsByCategory('other-jharkhand', 4, 'all').then(safe(setOtherJharkhandJobs)) .catch(fail(setOtherJharkhandJobs))
    getJobsByCategory('rojgar-mela', 4, 'all')   .then(safe(setRojgarMelaJobs))      .catch(fail(setRojgarMelaJobs))
    getJobsByCategory('private-job', 4, 'all')   .then(safe(setPrivateJobs))         .catch(fail(setPrivateJobs))
    getJobsByCategory('central-job', 4, 'all')   .then(safe(setCentralJobs))         .catch(fail(setCentralJobs))

    return () => { active = false }
  }, [])

  const homeSchemas = [
    {
      '@type': 'WebSite',
      name: 'Jharkhand JobAlert X',
      url: 'https://jharkhand.jobalertx.com/',
      description: 'Free Job Alert 2026 for Jharkhand. Latest JPSC, JSSC, Govt Jobs, Admit Card & Result.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://jharkhand.jobalertx.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'Jharkhand JobAlert X',
      url: 'https://jharkhand.jobalertx.com/',
      logo: 'https://jharkhand.jobalertx.com/favicon.svg',
    },
  ]

  /* Helper: reusable job section */
  function JobSection({ title, subtitle, viewAllTo, viewAllText, jobs, emptyIcon, emptyLabel }) {
    return (
      <section aria-labelledby={`sec-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          viewAllTo={viewAllTo}
          viewAllText={viewAllText}
        />
        {jobs === null
          ? <TableSkeleton />
          : jobs.length === 0
          ? <EmptyBlock icon={emptyIcon} label={emptyLabel} />
          : <RecentJobsTable jobs={jobs} viewAllTo={viewAllTo} viewAllText={viewAllText} />
        }
      </section>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <SEOHead
        title="Jharkhand JobAlert X — Latest JPSC, JSSC, Rojgar Mela & Sarkari Jobs Jharkhand 2026"
        description="Jharkhand JobAlert X — Free Job Alert 2026 for Jharkhand. Get latest JPSC, JSSC, Rojgar Mela, Sarkari Naukri, Private Jobs, Admit Cards, Results across Ranchi, Dhanbad, Jamshedpur & all 24 districts."
        keywords="Jharkhand JobAlert X, JPSC, JSSC, Jharkhand Govt Jobs 2026, Rojgar Mela Jharkhand, JSSC CGL 2026, Jharkhand Police, Jharkhand Teacher Vacancy"
        canonical="https://jharkhand.jobalertx.com/"
        jsonLd={homeSchemas}
      />

      {/* ── Main feed ───────────────────────────────────────────────── */}
      <main className="min-w-0 space-y-7">

        {/* 1. Compact Portal Banner */}
        <PortalBanner />

        {/* 2. Trending This Week */}
        <section aria-label="Trending jobs this week">
          <div className="mb-3 flex items-center justify-between gap-3">
            <TrendingHeader />
            <Link
              to="/latest/job"
              className="link-accent text-[12px] whitespace-nowrap flex items-center gap-1"
            >
              View all
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          {(() => {
            const slides = (trending && trending.length > 0)
              ? trending
              : (recentlyPosted && recentlyPosted.length > 0)
              ? recentlyPosted
              : trending

            if (slides === null) {
              return (
                <div
                  className="h-[180px] rounded-card flex items-center justify-center"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                      style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                    />
                    <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Loading…</span>
                  </div>
                </div>
              )
            }

            if (slides.length === 0) {
              return <EmptyBlock icon={Sparkles} label="trending posts" />
            }

            return <HeroBanner slides={slides} />
          })()}
        </section>

        {/* 3. Browse by Category */}
        <section aria-label="Browse jobs by category">
          <JobCategoryCards />
        </section>

        {/* 4. Recently Posted */}
        <JobSection
          title="Recently Posted Jobs"
          subtitle="Latest notifications across all categories"
          viewAllTo="/latest/job"
          viewAllText="View all latest"
          jobs={recentlyPosted}
          emptyIcon={Clock}
          emptyLabel="recent jobs"
        />

        {/* 5. Career Guides & Articles */}
        <HomeArticlesSection />

        {/* 6. JPSC */}
        <JobSection
          title="JPSC Recruitment 2026"
          subtitle="Civil Services, CDPO, Engineering & Allied Posts"
          viewAllTo="/category/jpsc"
          viewAllText="All JPSC Jobs"
          jobs={jpscJobs}
          emptyIcon={Landmark}
          emptyLabel="JPSC notifications"
        />

        {/* 7. JSSC */}
        <JobSection
          title="JSSC Recruitment 2026"
          subtitle="CGL, Excise Constable & Teacher Exams"
          viewAllTo="/category/jssc"
          viewAllText="All JSSC Jobs"
          jobs={jsscJobs}
          emptyIcon={Scale}
          emptyLabel="JSSC notifications"
        />

        {/* 8. Other Jharkhand */}
        <JobSection
          title="Other Jharkhand Jobs 2026"
          subtitle="High Court, Police, Health & Government Depts"
          viewAllTo="/category/other-jharkhand"
          viewAllText="View all"
          jobs={otherJharkhandJobs}
          emptyIcon={MapPin}
          emptyLabel="other Jharkhand notifications"
        />

        {/* 9. Rojgar Mela */}
        <JobSection
          title="Jharkhand Rojgar Mela 2026"
          subtitle="District-wise camps, spot hiring & placement drives"
          viewAllTo="/category/rojgar-mela"
          viewAllText="All Rojgar Mela"
          jobs={rojgarMelaJobs}
          emptyIcon={Briefcase}
          emptyLabel="Rojgar Mela camps"
        />

        {/* 10. Private Jobs */}
        <JobSection
          title="Jharkhand Private Jobs 2026"
          subtitle="Tata Steel, Jindal, Adani & Corporate Openings"
          viewAllTo="/category/private-job"
          viewAllText="All Private Jobs"
          jobs={privateJobs}
          emptyIcon={Building2}
          emptyLabel="private job openings"
        />

        {/* 11. Central Jobs */}
        <JobSection
          title="Central Govt Jobs 2026"
          subtitle="SSC, Railway, Banking, UPSC & Defence"
          viewAllTo="/category/central-job"
          viewAllText="All Central Jobs"
          jobs={centralJobs}
          emptyIcon={GraduationCap}
          emptyLabel="central job notifications"
        />
      </main>

      {/* ── Right Sidebar ─────────────────────────────────────────────── */}
      <aside className="min-w-0" aria-label="Quick search and notifications">
        <RightSidebar />
      </aside>
    </div>
  )
}
