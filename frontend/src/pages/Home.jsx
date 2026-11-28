import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flame, ArrowRight, CheckCircle2 } from 'lucide-react'
import SectionHeader from '../components/SectionHeader.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import JobCategoryCards from '../components/JobCategoryCards.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import RightSidebar from '../components/RightSidebar.jsx'
import SEOHead from '../components/SEOHead.jsx'
import HomeArticlesSection from '../components/HomeArticlesSection.jsx'
import AttentionCard from '../components/AttentionCard.jsx'
import { Skeleton } from '../components/Skeleton.jsx'
import { getTrending, getRecentlyPosted, getJobsByCategory } from '../services/api.js'
import { isJobExpired } from '../utils/dateHelper.js'
import { SITE_CONFIG } from '../config/siteConfig.js'

/* ── Portal Identity Banner (Light & Dark mode adaptive) ─────────────── */
function PortalBanner() {
  return (
    <section
      aria-label="Jharkhand JobAlert X portal overview"
      className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface px-4 py-3.5 sm:px-5 sm:py-4 shadow-sm transition-colors"
    >
      {/* Subtle accent glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-35"
        style={{ background: 'radial-gradient(circle, var(--brand-flame), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Daily Verified Updates
            </span>
            <span className="text-[11px] text-ink-faint hidden sm:inline">
              • Jharkhand&apos;s Official Job Portal
            </span>
          </div>

          <h1 className="text-sm sm:text-base md:text-lg font-extrabold leading-snug tracking-tight text-ink">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-teal-700 dark:from-orange-400 dark:via-amber-300 dark:to-teal-300 bg-clip-text text-transparent font-black">
              Jharkhand JobAlert X 2026 — JPSC, JSSC, Rojgar Mela &amp; Sarkari Jobs
            </span>
            <span className="mx-2 hidden text-hairline md:inline font-light" aria-hidden="true">|</span>
            <span className="block text-xs sm:text-sm font-bold text-ink-muted mt-0.5 md:mt-0 md:inline tracking-normal">
              झारखंड सरकारी नौकरी, भर्ती, एडमिट कार्ड एवं रिजल्ट 2026
            </span>
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300 border border-brand-500/20 shadow-sm">
            <CheckCircle2 size={12} aria-hidden="true" />
            2026 Verified
          </span>
        </div>
      </div>
    </section>
  )
}

/* ── Trending section header with flame icon ──────────────────────── */
function TrendingHeader() {
  return (
    <div className="flex items-center gap-2">
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
    const safe = (setter) => (data) => {
      if (active) {
        const list = Array.isArray(data) ? data.filter((j) => !isJobExpired(j)) : []
        setter(list)
      }
    }
    const fail = (setter) => () => { if (active) setter([]) }

    getTrending()                                 .then(safe(setTrending))           .catch(fail(setTrending))
    getRecentlyPosted(6)                          .then(safe(setRecentlyPosted))     .catch(fail(setRecentlyPosted))
    getJobsByCategory('jpsc', 4, 'all')           .then(safe(setJpscJobs))           .catch(fail(setJpscJobs))
    getJobsByCategory('jssc', 4, 'all')           .then(safe(setJsscJobs))           .catch(fail(setJsscJobs))
    getJobsByCategory('other-jharkhand', 4, 'all').then(safe(setOtherJharkhandJobs)) .catch(fail(setOtherJharkhandJobs))
    getJobsByCategory('rojgar-mela', 4, 'all')    .then(safe(setRojgarMelaJobs))     .catch(fail(setRojgarMelaJobs))
    getJobsByCategory('private-job', 4, 'all')    .then(safe(setPrivateJobs))        .catch(fail(setPrivateJobs))
    getJobsByCategory('central-job', 4, 'all')    .then(safe(setCentralJobs))        .catch(fail(setCentralJobs))

    return () => { active = false }
  }, [])

  const homeSchemas = [
    {
      '@context': 'https://schema.org',
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
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Jharkhand JobAlert X',
      url: 'https://jharkhand.jobalertx.com/',
      logo: 'https://jharkhand.jobalertx.com/favicon.svg',
      description: "Jharkhand's #1 free job portal for JPSC, JSSC, Rojgar Mela, Police, Teacher Vacancies, and Sarkari Naukri 2026.",
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@jobalertx.com',
        telephone: '+91-8789862771',
        contactType: 'Customer Service',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN-JH',
      },
      sameAs: [
        'https://t.me/jobalertx',
        'https://youtube.com/@jobalertx',
        'https://twitter.com/jobalertx',
        'https://linkedin.com/company/jobalertx',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebContent',
      name: 'Jharkhand Job Categories',
      description: 'Job listings organized by recruitment type: JPSC, JSSC, Rojgar Mela, Police, and private sector jobs.',
      hasPart: [
        {
          '@type': 'ItemList',
          name: 'JPSC Recruitment 2026',
          description: 'Jharkhand PSC Civil Services, CDPO, and Engineering Services exams.',
          url: 'https://jharkhand.jobalertx.com/category/jpsc',
        },
        {
          '@type': 'ItemList',
          name: 'JSSC Recruitment 2026',
          description: 'Jharkhand SSC CGL, Excise Constable, and Teacher vacancies.',
          url: 'https://jharkhand.jobalertx.com/category/jssc',
        },
        {
          '@type': 'ItemList',
          name: 'Rojgar Mela 2026',
          description: 'District-wise job fairs and placement drives.',
          url: 'https://jharkhand.jobalertx.com/rojgar-mela',
        },
      ],
    },
  ]

  function JobSection({ title, subtitle, viewAllTo, viewAllText, jobs }) {
    if (jobs === null) {
      return (
        <section>
          <SectionHeader title={title} subtitle={subtitle} viewAllTo={viewAllTo} viewAllText={viewAllText} />
          <Skeleton.Table rows={4} cols={3} />
        </section>
      )
    }
    if (jobs.length === 0) return null
    return (
      <section aria-labelledby={`sec-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          viewAllTo={viewAllTo}
          viewAllText={viewAllText}
        />
        <RecentJobsTable jobs={jobs} viewAllTo={viewAllTo} viewAllText={viewAllText} />
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
        {/* Quick links to important pages */}
        <div className="flex flex-wrap gap-2 text-[13px] text-ink-muted">
          <Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400">About</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400">Contact</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400">Privacy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400">Terms</Link>
          <span>·</span>
          <a href="mailto:support@jobalertx.com" className="hover:text-brand-600 dark:hover:text-brand-400">Email</a>
          <span>·</span>
          <a href="tel:+918789862771" className="hover:text-brand-600 dark:hover:text-brand-400">Phone</a>
        </div>

        {/* 1. Compact Portal Identity Banner */}
        <PortalBanner />

        {/* AdSense Ready Notice */}
        {!SITE_CONFIG.adsense.isApproved && (
          <div
            className="rounded-card border border-teal-500/30 bg-teal-500/5 px-4 py-3 text-center text-[13px] font-medium text-teal-700 dark:text-teal-400 animate-fade-in"
            aria-label="AdSense pre-approval notice"
          >
            <span className="font-semibold">Site under AdSense Review:</span> No advertisements currently displayed. Contact: <a href="mailto:support@jobalertx.com" className="underline text-teal-600 dark:text-teal-300 hover:opacity-80">support@jobalertx.com</a>
          </div>
        )}

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
              return <Skeleton.Hero />
            }

            if (slides.length === 0) {
              return null
            }

            return <HeroBanner slides={slides} />
          })()}
        </section>

        {/* 3. Browse by Category */}
        <section aria-label="Browse jobs by category">
          <JobCategoryCards />
        </section>

        {/* 3b. Mobile Attention Banner — appears just below hero and browse category */}
        <div className="xl:hidden">
          <AttentionCard />
        </div>

        {/* 4. Recently Posted */}
        <JobSection
          title="Recently Posted Jobs"
          subtitle="Latest notifications across all Jharkhand categories"
          viewAllTo="/latest/job"
          viewAllText="View all latest"
          jobs={recentlyPosted}
        />

        {/* 5. JPSC */}
        <JobSection
          title="JPSC Recruitment 2026"
          subtitle="Civil Services, CDPO, Engineering & Allied Posts"
          viewAllTo="/category/jpsc"
          viewAllText="All JPSC Jobs"
          jobs={jpscJobs}
        />

        {/* 6. JSSC */}
        <JobSection
          title="JSSC Recruitment 2026"
          subtitle="CGL, Excise Constable & Teacher Exams"
          viewAllTo="/category/jssc"
          viewAllText="All JSSC Jobs"
          jobs={jsscJobs}
        />

        {/* 7. Other Jharkhand */}
        <JobSection
          title="Other Jharkhand Jobs 2026"
          subtitle="High Court, Police, Health & Government Depts"
          viewAllTo="/category/other-jharkhand"
          viewAllText="View all"
          jobs={otherJharkhandJobs}
        />

        {/* 8. Rojgar Mela */}
        <JobSection
          title="Jharkhand Rojgar Mela 2026"
          subtitle="District-wise camps, spot hiring & placement drives"
          viewAllTo="/category/rojgar-mela"
          viewAllText="All Rojgar Mela"
          jobs={rojgarMelaJobs}
        />

        {/* 9. Private Jobs */}
        <JobSection
          title="Jharkhand Private Jobs 2026"
          subtitle="Tata Steel, Jindal, Adani & Corporate Openings"
          viewAllTo="/category/private-job"
          viewAllText="All Private Jobs"
          jobs={privateJobs}
        />

        {/* 10. Central Jobs */}
        <JobSection
          title="Central Govt Jobs 2026"
          subtitle="SSC, Railway, Banking, UPSC & Defence"
          viewAllTo="/category/central-job"
          viewAllText="All Central Jobs"
          jobs={centralJobs}
        />

        {/* 11. Career Guides & Articles — Placed at the bottom */}
        <HomeArticlesSection />
      </main>

      {/* ── Right Sidebar ─────────────────────────────────────────────── */}
      <aside className="min-w-0" aria-label="Quick search and notifications">
        <RightSidebar />
      </aside>
    </div>
  )
}
