import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  Users,
  Briefcase,
  CalendarDays,
  Download,
  ExternalLink,
  ChevronRight,
  Globe,
  FileText,
  BookOpen,
  Ticket,
  BarChart2,
  ClipboardList,
  HelpCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import BrandIcon from '../components/BrandIcon.jsx'
import CategoryBox from '../components/CategoryBox.jsx'
import TableView from '../components/TableView.jsx'
import SEOHead from '../components/SEOHead.jsx'
import RichContentRenderer from '../components/RichContentRenderer.jsx'
import { getJobById, getJobsByCategory, getKindLabel, getCategories, getJobs } from '../services/api.js'

/** Safely parse a date string; returns null if invalid. */
function safeDate(val) {
  if (!val) return null
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}

/** Format ISO date string to human-readable DD Mon YYYY */
function formatDate(isoOrString) {
  if (!isoOrString) return null
  const d = safeDate(isoOrString)
  if (!d) return isoOrString
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const KIND_CONFIG = {
  job: {
    actionLabel: 'Apply Online',
    pdfLabel: 'Download Notification (PDF)',
    pdfSubtitle: 'Official Recruitment Notification & Guidelines',
  },
  'admit-card': {
    actionLabel: 'Download Admit Card',
    pdfLabel: 'Exam Instructions (PDF)',
    pdfSubtitle: 'Official Examination Instructions & Notice',
  },
  result: {
    actionLabel: 'Check Result',
    pdfLabel: 'Download Merit List / Cutoff (PDF)',
    pdfSubtitle: 'Official Selection & Cutoff List',
  },
  'answer-key': {
    actionLabel: 'Download Answer Key',
    pdfLabel: 'Official Key Notice (PDF)',
    pdfSubtitle: 'Official Answer Key & Objection Guidelines',
  },
  syllabus: {
    actionLabel: 'View Exam Pattern',
    pdfLabel: 'Download Syllabus (PDF)',
    pdfSubtitle: 'Official Examination Scheme & Detailed Syllabus',
  },
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface px-3.5 py-2.5">
      <Icon size={17} className="text-brand-600" />
      <div className="leading-tight">
        <p className="text-[13px] font-bold text-ink">{value}</p>
        <p className="text-[11px] text-ink-faint">{label}</p>
      </div>
    </div>
  )
}

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(undefined) // undefined = loading, null = not found
  const [related, setRelated] = useState([])
  const [crossKindLinks, setCrossKindLinks] = useState([]) // same exam, different kinds
  const [categories, setCategories] = useState([])

  // Load categories for metadata (name, icon, color)
  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => active && setCategories(data || []))
      .catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    setJob(undefined)
    setCrossKindLinks([])
    getJobById(id)
      .then((data) => {
        if (!active) return
        setJob(data || null)
        if (data) {
          // Load related posts in the same category
          getJobsByCategory(data.category)
            .then((list) => {
              if (active) setRelated((list || []).filter((j) => j.id !== data.id).slice(0, 6))
            })
            .catch(() => {})

          // Find cross-kind pages for same category (admit cards, results, answer keys, syllabus)
          // We load ALL kinds from this category to find related content types
          const ALL_KINDS = ['job', 'admit-card', 'result', 'answer-key', 'syllabus']
          const otherKinds = ALL_KINDS.filter((k) => k !== data.kind)
          Promise.all(
            otherKinds.map((k) =>
              getJobs({ category: data.category, kind: k, limit: 1 })
                .then((list) => (list && list.length ? { kind: k, post: list[0] } : null))
                .catch(() => null)
            )
          ).then((results) => {
            if (active) setCrossKindLinks(results.filter(Boolean))
          })
        }
      })
      .catch(() => active && setJob(null))
    return () => {
      active = false
    }
  }, [id])

  if (job === undefined) {
    return (
      <div className="flex h-64 items-center justify-center text-[14px] text-ink-muted">
        Loading post…
      </div>
    )
  }

  if (job === null) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <h1 className="text-lg font-bold text-ink">Post not found</h1>
        <p className="mt-2 text-[13px] text-ink-muted">
          The post you’re looking for doesn’t exist or may have been removed.
        </p>
        <Link to="/" className="btn-primary mt-5">
          <ArrowLeft size={16} /> Back to Discover
        </Link>
      </div>
    )
  }

  const category = categories.find((c) => c.slug === job.category)
  const actionCfg = KIND_CONFIG[job.kind] || KIND_CONFIG.job

  // Determine primary action URL (either applyUrl or the primary link)
  const primaryActionUrl = job.applyUrl || job.links?.find((l) => l.primary && l.href && l.href !== '#')?.href

  // Find expiration date from important dates if present
  const lastDateEntry = job.importantDates?.find(
    (d) => d.label?.toLowerCase().includes('last') || d.label?.toLowerCase().includes('close')
  )
  const parsedLastDate = lastDateEntry?.value ? safeDate(lastDateEntry.value) : null
  const validThroughDate = parsedLastDate
    ? parsedLastDate.toISOString().split('T')[0]
    : new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]

  // ── Structured Data ────────────────────────────────────────────────────────
  // JobPosting schema is ONLY valid for actual job recruitment posts.
  // Admit cards, results, answer keys, and syllabus use Article schema instead.
  const pageUrl = `https://jobalertx.com/job/${job.id}`
  const pageDescription = job.detailedDescription || job.shortInfo || job.tagline || job.title
  const datePostedIso = job.postedOn
    ? (safeDate(job.postedOn)?.toISOString() || new Date().toISOString())
    : new Date().toISOString()
  const updatedAtIso = job.updatedAt
    ? (safeDate(job.updatedAt)?.toISOString() || datePostedIso)
    : datePostedIso

  const mainSchema = job.kind === 'job'
    ? {
        '@type': 'JobPosting',
        title: job.title,
        description: pageDescription,
        identifier: {
          '@type': 'PropertyValue',
          name: job.org,
          value: job.id,
        },
        hiringOrganization: {
          '@type': 'Organization',
          name: job.org,
          sameAs: job.officialWebsiteUrl || undefined,
        },
        datePosted: datePostedIso,
        validThrough: validThroughDate,
        employmentType: 'FULL_TIME',
        directApply: Boolean(primaryActionUrl),
        applicantLocationRequirements: {
          '@type': 'Country',
          name: 'India',
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
          },
        },
        totalJobOpenings: Number(job.vacancies) || undefined,
      }
    : {
        // For admit-card, result, answer-key, syllabus — use Article
        '@type': 'Article',
        headline: job.title,
        description: pageDescription,
        author: {
          '@type': 'Organization',
          name: 'Job Alert X',
          url: 'https://jobalertx.com/',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Job Alert X',
          url: 'https://jobalertx.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://jobalertx.com/favicon.svg',
          },
        },
        datePublished: datePostedIso,
        dateModified: updatedAtIso,
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      }

  const breadcrumbSchema = {
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
        name: category?.name || 'Govt Jobs',
        item: `https://jobalertx.com/category/${job.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: job.title,
        item: pageUrl,
      },
    ],
  }

  // Build FAQ schema from importantDates & key fields for job posts
  const faqItems = job.kind === 'job' ? [
    job.vacancies && {
      q: `How many vacancies are there in ${job.title}?`,
      a: `There are a total of ${Number(job.vacancies).toLocaleString('en-IN')} vacancies in ${job.title}.`,
    },
    job.eligibilityShort && {
      q: `What is the educational qualification for ${job.title}?`,
      a: `The required educational qualification for ${job.title} is: ${job.eligibilityShort}.`,
    },
    job.ageLimit && {
      q: `What is the age limit for ${job.title}?`,
      a: `The age limit for ${job.title} is Minimum ${job.ageLimit.min} years and Maximum ${job.ageLimit.max} years. ${job.ageLimit.note || 'Age relaxation is applicable as per government rules.'}`,
    },
    (() => {
      const feeRow = job.fee?.find((f) => f.label?.toLowerCase().includes('general'))
      return feeRow ? {
        q: `What is the application fee for ${job.title}?`,
        a: `The application fee for General/OBC/EWS category candidates is ${feeRow.value}. SC/ST/PwD candidates may be exempt or have reduced fees as per the official notification.`,
      } : null
    })(),
    (() => {
      const lastDate = job.importantDates?.find((d) => d.label?.toLowerCase().includes('last'))
      return lastDate ? {
        q: `What is the last date to apply for ${job.title}?`,
        a: `The last date to apply for ${job.title} is ${lastDate.value}. Candidates must submit the online application before this date.`,
      } : null
    })(),
    primaryActionUrl && {
      q: `How to apply for ${job.title}?`,
      a: `To apply for ${job.title}: 1. Visit the official website at ${job.officialWebsiteUrl || 'the official recruitment portal'}. 2. Click on the Apply Online link. 3. Register with your email and mobile number. 4. Fill in the application form with correct details. 5. Upload required documents and pay the application fee. 6. Submit and download the confirmation page.`,
    },
  ].filter(Boolean) : []

  const faqSchema = faqItems.length > 0 ? {
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null

  const allSchemas = [mainSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]

  const keywords = `${job.title}, ${job.org}, ${job.orgShort || ''}, ${category?.name || ''} recruitment 2026, free job alert 2026, government job vacancy 2026, new vacancy 2026, govt job notification 2026, online application form, sarkari result, admit card, latest notification, sarkari naukri, latest govt jobs, job alert x`

  return (
    <div className="animate-fade-in">
      <SEOHead
        title={`${job.title} — ${job.org}`}
        description={`${job.title} ${job.kind === 'job' ? 'recruitment' : ''} by ${job.org}. ${job.vacancies ? `Total vacancies: ${Number(job.vacancies).toLocaleString('en-IN')}. ` : ''}Eligibility: ${job.eligibilityShort || 'Check Details'}. Download notification PDF, admit card, results and answer keys on Job Alert X.`}
        keywords={keywords}
        canonical={pageUrl}
        ogType={job.kind === 'job' ? 'website' : 'article'}
        jsonLd={allSchemas}
        datePublished={datePostedIso}
        dateModified={updatedAtIso}
      />

      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-[12.5px] text-ink-faint">
        <Link to="/" className="hover:text-brand-600">Discover</Link>
        <ChevronRight size={13} />
        <Link to={`/category/${job.category}`} className="hover:text-brand-600">
          {category?.name || 'Category'}
        </Link>
        <ChevronRight size={13} />
        <span className="text-ink-muted">{job.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        {/* Main Content Column */}
        <main className="min-w-0 space-y-5">
          {/* Header card */}
          <header className="card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <BrandIcon
                icon={job.logo?.icon || 'landmark'}
                color={job.logo?.color || '#5558e6'}
                size={60}
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-600/15 dark:text-brand-200">
                  {getKindLabel(job.kind)}
                </span>
                <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-ink">
                  {job.title}
                </h1>
                <p className="mt-1 text-[14px] text-ink-muted">{job.org}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={Eye} label="Views" value={job.views?.toLocaleString('en-IN')} />
              {job.applications ? (
                <Stat icon={Users} label="Applications" value={job.applications.toLocaleString('en-IN')} />
              ) : null}
              {job.vacancies ? (
                <Stat icon={Briefcase} label="Total Posts" value={job.vacancies.toLocaleString('en-IN')} />
              ) : null}
              <Stat
                icon={CalendarDays}
                label="Posted"
                value={
                  job.postedOn || job.postedAt
                    ? <time dateTime={safeDate(job.postedOn || job.postedAt)?.toISOString() || undefined}>{job.postedOn || job.postedAt}</time>
                    : 'Recent'
                }
              />
            </div>
            {/* Last updated timestamp — important for E-E-A-T */}
            {job.updatedAt && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-faint">
                <RefreshCw size={11} />
                Last updated:{' '}
                <time dateTime={safeDate(job.updatedAt)?.toISOString()}>
                  {formatDate(job.updatedAt)}
                </time>
              </p>
            )}

            {/* Quick Action Header Bar */}
            {(primaryActionUrl || job.notificationPdfUrl || job.officialWebsiteUrl) && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-hairline pt-4">
                {primaryActionUrl && (
                  <a
                    href={primaryActionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    <span>{actionCfg.actionLabel}</span>
                    <ExternalLink size={14} />
                  </a>
                )}

                {job.notificationPdfUrl && (
                  <a
                    href={job.notificationPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 shadow-xs transition-colors hover:bg-red-500/20 active:scale-[0.98]"
                  >
                    <Download size={15} />
                    <span>{actionCfg.pdfLabel}</span>
                  </a>
                )}

                {job.officialWebsiteUrl && (
                  <a
                    href={job.officialWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-xs font-semibold text-ink-soft shadow-xs transition-colors hover:bg-subtle hover:text-ink active:scale-[0.98]"
                  >
                    <Globe size={14} className="text-blue-500" />
                    <span>Official Website</span>
                  </a>
                )}
              </div>
            )}
          </header>

          {/* Overview */}
          {job.shortInfo && (
            <section className="card p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2 border-b border-hairline pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                  <FileText size={15} />
                </span>
                <h2 className="text-[15px] font-bold text-ink">Notification Overview</h2>
              </div>
              <p className="text-[14px] leading-relaxed text-ink-soft">{job.shortInfo}</p>
            </section>
          )}

          {/* Detailed Description / Full Blog Article */}
          {job.detailedDescription && (
            <section className="card p-5 sm:p-7">
              <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <BookOpen size={17} />
                  </span>
                  <div>
                    <h2 className="text-[16px] font-extrabold text-ink">Full Notification &amp; Detailed Guide</h2>
                    <p className="text-[11px] text-ink-faint">Complete eligibility, vacancy breakdown, syllabus, &amp; application instructions</p>
                  </div>
                </div>
                {job.notificationPdfUrl && (
                  <a
                    href={job.notificationPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Download size={13} /> Official PDF
                  </a>
                )}
              </div>
              <RichContentRenderer content={job.detailedDescription} />
            </section>
          )}

          {/* Dates + fee */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {job.importantDates?.length ? (
              <TableView title="Important Dates" rows={job.importantDates} />
            ) : null}
            {job.fee?.length ? <TableView title="Application Fee" rows={job.fee} /> : null}
          </div>

          {/* Age limit */}
          {job.ageLimit && (
            <TableView
              title="Age Limit"
              rows={[
                { label: 'Minimum Age', value: `${job.ageLimit.min} years` },
                { label: 'Maximum Age', value: `${job.ageLimit.max} years` },
                { label: 'Note', value: job.ageLimit.note },
              ]}
            />
          )}

          {/* Vacancy / posts */}
          {job.posts?.length ? (
            <TableView
              title="Vacancy Details"
              columns={[
                { key: 'name', label: 'Post Name' },
                { key: 'total', label: 'Total Posts' },
                { key: 'eligibility', label: 'Eligibility' },
              ]}
              rows={job.posts}
            />
          ) : null}

          {/* Eligibility */}
          {job.eligibility && (
            <section className="card p-5 sm:p-6">
              <h2 className="mb-2 text-[15px] font-bold text-ink">Eligibility Criteria</h2>
              <p className="text-[14px] leading-relaxed text-ink-soft">{job.eligibility}</p>
            </section>
          )}

          {/* FAQ Section — auto-generated for job posts */}
          {faqItems.length > 0 && (
            <section className="card p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                  <HelpCircle size={15} />
                </span>
                <h2 className="text-[15px] font-bold text-ink">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {faqItems.map(({ q, a }, idx) => (
                  <details key={idx} className="group rounded-xl border border-hairline bg-subtle/40 p-4 open:bg-brand-500/5 open:border-brand-500/20 transition-all">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-2 text-[13.5px] font-semibold text-ink">
                      <span>{q}</span>
                      <ChevronRight size={15} className="mt-0.5 shrink-0 text-ink-faint transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{a}</p>
                  </details>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-ink-faint">
                ⚠️ Always verify information on the{' '}
                {job.officialWebsiteUrl ? (
                  <a href={job.officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">official website</a>
                ) : 'official website'}
                {' '}before applying.
              </p>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-5">
          {/* Important links & Official Downloads Card */}
          <section className="card p-5 space-y-4">
            <div className="border-b border-hairline pb-3">
              <h2 className="text-[14px] font-bold text-ink flex items-center gap-2">
                <Download size={16} className="text-orange-500" />
                Important Links &amp; Actions
              </h2>
              <p className="mt-0.5 text-[11.5px] text-ink-muted">
                Official online portal links and downloadable notification files.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Prominent Apply / Action button */}
              {primaryActionUrl && (
                <a
                  href={primaryActionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center text-xs font-bold gap-2 py-3 shadow-md shadow-brand-500/15"
                >
                  <span>{actionCfg.actionLabel}</span>
                  <ExternalLink size={15} />
                </a>
              )}

              {/* Dedicated Notification PDF Download Card / Button */}
              {job.notificationPdfUrl && (
                <a
                  href={job.notificationPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="group flex w-full items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-left transition-all hover:bg-red-500/20 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white shadow-xs">
                      <Download size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-red-600 dark:text-red-300 truncate">
                        {actionCfg.pdfLabel}
                      </p>
                      <p className="text-[10.5px] text-ink-muted truncate">Official PDF Attachment</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-red-500 shrink-0 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}

              {/* Official Authority Website Link */}
              {job.officialWebsiteUrl && (
                <a
                  href={job.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full justify-between text-xs py-2.5 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={15} className="text-blue-500" />
                    Official Website
                  </span>
                  <ExternalLink size={14} className="text-ink-faint" />
                </a>
              )}

              {/* Additional custom links configured in post */}
              {job.links?.filter((l) => l.href && l.href !== '#' && l.href !== primaryActionUrl && l.href !== job.notificationPdfUrl && l.href !== job.officialWebsiteUrl).map((link, idx) => {
                const isDownload = link.label.toLowerCase().includes('download') || link.label.toLowerCase().includes('pdf')
                const Icon = isDownload ? Download : ExternalLink
                return (
                  <a
                    key={`${link.label}-${idx}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full justify-between text-xs py-2.5 font-semibold"
                  >
                    <span className="truncate">{link.label}</span>
                    <Icon size={14} className="text-ink-faint shrink-0" />
                  </a>
                )
              })}
            </div>

            <div className="rounded-xl border border-hairline bg-subtle/50 p-3 text-[11px] leading-relaxed text-ink-muted">
              <span className="font-semibold text-ink">Official Verification Notice:</span> Always cross-check dates, vacancy distribution, and eligibility criteria on the official notification PDF before submitting applications.
            </div>
          </section>

          {/* Cross-kind links: Admit Card, Result, Answer Key, Syllabus for same category */}
          {crossKindLinks.length > 0 && (
            <section className="card p-5 space-y-3">
              <div className="border-b border-hairline pb-2.5">
                <h2 className="text-[13.5px] font-bold text-ink flex items-center gap-2">
                  <ClipboardList size={15} className="text-brand-600" />
                  Related {category?.name || 'Exam'} Resources
                </h2>
              </div>
              <div className="space-y-1.5">
                {crossKindLinks.map(({ kind, post }) => {
                  const kindIcons = {
                    'admit-card': <Ticket size={14} className="text-purple-500" />,
                    result: <BarChart2 size={14} className="text-green-500" />,
                    'answer-key': <FileText size={14} className="text-orange-500" />,
                    syllabus: <BookOpen size={14} className="text-blue-500" />,
                    job: <Briefcase size={14} className="text-brand-500" />,
                  }
                  const kindLabels = {
                    'admit-card': 'Admit Card',
                    result: 'Result',
                    'answer-key': 'Answer Key',
                    syllabus: 'Syllabus',
                    job: 'Recruitment',
                  }
                  return (
                    <Link
                      key={kind}
                      to={`/job/${post.id}`}
                      className="flex items-center gap-2.5 rounded-lg border border-hairline bg-surface px-3 py-2 text-[12.5px] text-ink-soft hover:border-brand-500/30 hover:text-ink hover:bg-subtle transition-all"
                    >
                      {kindIcons[kind]}
                      <span className="font-medium">{kindLabels[kind]}</span>
                      <ChevronRight size={12} className="ml-auto text-ink-faint" />
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Related posts in same category */}
          {related.length > 0 && (
            <CategoryBox
              title={`More in ${category?.name || 'this category'}`}
              icon={category?.icon}
              color={category?.color}
              items={related}
              viewAllTo={`/category/${job.category}`}
            />
          )}
        </aside>
      </div>
    </div>
  )
}
