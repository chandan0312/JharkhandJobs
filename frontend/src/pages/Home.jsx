import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import JobCategoryCards from '../components/JobCategoryCards.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import RightSidebar from '../components/RightSidebar.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getTrending, getRecentlyPosted, getJobsByCategory } from '../services/api.js'
import { Clock, Sparkles, Landmark, Scale, Briefcase, Building2, GraduationCap, MapPin } from 'lucide-react'

function ComingSoonBlock({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-subtle/40 py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-500 dark:text-brand-300">
        <Icon size={20} />
      </span>
      <p className="text-[13.5px] font-semibold text-ink">Coming Soon</p>
      <p className="text-[12px] text-ink-muted">
        No active {label} yet — new notifications are added daily.
      </p>
    </div>
  )
}

export default function Home() {
  const [trending, setTrending] = useState(null)
  const [recentlyPosted, setRecentlyPosted] = useState(null)
  const [jpscJobs, setJpscJobs] = useState(null)
  const [jsscJobs, setJsscJobs] = useState(null)
  const [rojgarMelaJobs, setRojgarMelaJobs] = useState(null)
  const [privateJobs, setPrivateJobs] = useState(null)
  const [otherJobs, setOtherJobs] = useState(null)

  useEffect(() => {
    let active = true

    // 1. Trending / Featured
    getTrending()
      .then((data) => active && setTrending(data || []))
      .catch(() => active && setTrending([]))

    // 2. 5 Latest Posted Jobs
    getRecentlyPosted(6)
      .then((data) => active && setRecentlyPosted(data || []))
      .catch(() => active && setRecentlyPosted([]))

    // 3. JPSC Jobs
    getJobsByCategory('jpsc', 4, 'all')
      .then((data) => active && setJpscJobs(data || []))
      .catch(() => active && setJpscJobs([]))

    // 4. JSSC Jobs
    getJobsByCategory('jssc', 4, 'all')
      .then((data) => active && setJsscJobs(data || []))
      .catch(() => active && setJsscJobs([]))

    // 5. Rojgar Mela
    getJobsByCategory('rojgar-mela', 4, 'all')
      .then((data) => active && setRojgarMelaJobs(data || []))
      .catch(() => active && setRojgarMelaJobs([]))

    // 6. Private Jobs
    getJobsByCategory('private', 4, 'all')
      .then((data) => active && setPrivateJobs(data || []))
      .catch(() => active && setPrivateJobs([]))

    // 7. Others (Central Govt, Railway, Banking, SSC)
    getJobsByCategory('others', 4, 'all')
      .then((data) => active && setOtherJobs(data || []))
      .catch(() => active && setOtherJobs([]))

    return () => { active = false }
  }, [])

  const homeSchemas = [
    {
      '@type': 'WebSite',
      name: 'Jharkhand JobAlert X',
      url: 'https://jharkhand.jobalertx.com/',
      description: 'Jharkhand JobAlert X — Free Job Alert 2026 for Jharkhand. Latest JPSC, JSSC, Jharkhand Govt Jobs, Admit Card & Result.',
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

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_336px]">
      <SEOHead
        title="Jharkhand JobAlert X — Latest JPSC, JSSC, Rojgar Mela & Sarkari Jobs Jharkhand 2026"
        description="Jharkhand JobAlert X — Free Job Alert 2026 for Jharkhand. Get latest JPSC, JSSC, Rojgar Mela, Sarkari Naukri, Private Jobs, Admit Cards, Results, Answer Keys across Ranchi, Dhanbad, Jamshedpur & all 24 districts."
        keywords="Jharkhand JobAlert X, JPSC, JSSC, Jharkhand Govt Jobs 2026, Rojgar Mela Jharkhand, JSSC CGL 2026, JECCE Excise Constable, Jharkhand Police, Jharkhand Teacher Vacancy, Tata Steel Jamshedpur, Jharkhand Private Jobs, free job alert jharkhand"
        canonical="https://jharkhand.jobalertx.com/"
        jsonLd={homeSchemas}
      />

      {/* Main column */}
      <main className="min-w-0 space-y-6">
        {/* Creative Professional Jharkhand Headline Banner */}
        <section className="group relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-r from-teal-50/70 via-surface to-brand-50/50 dark:from-navy-900/80 dark:via-surface dark:to-navy-800/80 p-3.5 sm:p-4 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-brand-500/40 hover:shadow-md animate-fade-in">
          {/* Ambient light glow */}
          <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-brand-500/15 blur-xl transition-opacity group-hover:opacity-100" />
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gold-400/20 blur-xl transition-opacity group-hover:opacity-100" />

          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-teal-300">
                  Jharkhand's Official Job Portal
                </span>
                <span className="text-[11px] text-ink-faint hidden sm:inline flex items-center gap-1">
                  • <MapPin size={11} className="inline" /> Ranchi, Dhanbad, Jamshedpur &amp; All 24 Districts
                </span>
              </div>

              <h1 className="text-sm sm:text-base md:text-lg font-black leading-snug tracking-tight text-ink">
                <span className="bg-gradient-to-r from-brand-600 via-teal-700 to-navy-800 dark:from-teal-300 dark:via-gold-300 dark:to-teal-100 bg-clip-text text-transparent font-black">
                  Jharkhand JobAlert X — JPSC, JSSC, Rojgar Mela &amp; Private Jobs 2026
                </span>
                <span className="mx-2 hidden text-hairline md:inline font-light" aria-hidden="true">|</span>
                <span className="block text-xs sm:text-sm font-bold text-ink-muted mt-0.5 md:mt-0 md:inline tracking-normal">
                  झारखंड सरकारी नौकरी, रोजगार मेला एवं भर्ती
                </span>
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 self-start sm:self-center">
              <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-teal-200 border border-brand-500/20 shadow-2xs">
                2026 Verified
              </span>
            </div>
          </div>
        </section>

        {/* 1. Trending / Hero Carousel */}
        <section>
          <SectionHeader title="Trending in Jharkhand" />
          {trending === null ? (
            <div className="flex h-48 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : trending.length === 0 ? (
            <ComingSoonBlock icon={Sparkles} label="trending posts" />
          ) : (
            <HeroBanner slides={trending} />
          )}
        </section>

        {/* 2. Job Categories in Professional Cards */}
        <section>
          <JobCategoryCards />
        </section>

        {/* 3. Recently Posted Jobs (Latest verified updates) */}
        <section>
          <SectionHeader title="Recently Posted Jobs" viewAllTo="/latest/job" />
          {recentlyPosted === null ? (
            <div className="flex h-32 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : recentlyPosted.length === 0 ? (
            <ComingSoonBlock icon={Clock} label="recent jobs" />
          ) : (
            <RecentJobsTable jobs={recentlyPosted} viewAllTo="/latest/job" viewAllText="View All Latest Jobs" />
          )}
        </section>

        {/* 4. JPSC Recruitment */}
        <section>
          <SectionHeader title="JPSC Recruitment 2026" viewAllTo="/category/jpsc" />
          {jpscJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : jpscJobs.length === 0 ? (
            <ComingSoonBlock icon={Landmark} label="JPSC notifications" />
          ) : (
            <RecentJobsTable jobs={jpscJobs} viewAllTo="/category/jpsc" viewAllText="View All JPSC Jobs" />
          )}
        </section>

        {/* 5. JSSC Recruitment */}
        <section>
          <SectionHeader title="JSSC Recruitment 2026" viewAllTo="/category/jssc" />
          {jsscJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : jsscJobs.length === 0 ? (
            <ComingSoonBlock icon={Scale} label="JSSC notifications" />
          ) : (
            <RecentJobsTable jobs={jsscJobs} viewAllTo="/category/jssc" viewAllText="View All JSSC Jobs" />
          )}
        </section>

        {/* 6. Jharkhand Rojgar Mela */}
        <section>
          <SectionHeader title="Jharkhand Rojgar Mela 2026" viewAllTo="/rojgar-mela" />
          {rojgarMelaJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : rojgarMelaJobs.length === 0 ? (
            <ComingSoonBlock icon={Briefcase} label="Rojgar Mela camps" />
          ) : (
            <RecentJobsTable jobs={rojgarMelaJobs} viewAllTo="/rojgar-mela" viewAllText="View All Rojgar Mela Camps" />
          )}
        </section>

        {/* 7. Jharkhand Private Jobs */}
        <section>
          <SectionHeader title="Jharkhand Private Jobs 2026" viewAllTo="/private-jobs" />
          {privateJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : privateJobs.length === 0 ? (
            <ComingSoonBlock icon={Building2} label="private job openings" />
          ) : (
            <RecentJobsTable jobs={privateJobs} viewAllTo="/private-jobs" viewAllText="View All Private Jobs" />
          )}
        </section>

        {/* 8. Other Exams & Central Jobs */}
        <section>
          <SectionHeader title="Other Exams &amp; Central Govt Jobs" viewAllTo="/category/others" />
          {otherJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : otherJobs.length === 0 ? (
            <ComingSoonBlock icon={GraduationCap} label="central & other exam notifications" />
          ) : (
            <RecentJobsTable jobs={otherJobs} viewAllTo="/category/others" viewAllText="View All Central & Other Jobs" />
          )}
        </section>
      </main>

      {/* Right rail */}
      <aside className="min-w-0">
        <RightSidebar />
      </aside>
    </div>
  )
}
