import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Ticket,
  Award,
  KeyRound,
  BookOpen,
  Layers,
} from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'

/**
 * Derive the "Start Date" from a job's importantDates array —
 * looks for the Application Begin label.
 */
function getStartDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label?.toLowerCase().includes('begin') ||
      r.label?.toLowerCase().includes('start') ||
      r.label?.toLowerCase().includes('open')
  )
  return d?.value || job.postedOn || job.postedAt || '—'
}

/**
 * Derive the "End Date" — last date to apply.
 */
function getEndDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label?.toLowerCase().includes('last date') ||
      r.label?.toLowerCase().includes('close') ||
      r.label?.toLowerCase().includes('end date')
  )
  return d?.value || '—'
}

function getExamDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label?.toLowerCase().includes('exam') ||
      r.label?.toLowerCase().includes('date') ||
      r.label?.toLowerCase().includes('city')
  )
  return d?.value || job.tagline || 'September / October 2026'
}

/**
 * Known organization abbreviations for common Indian govt exam bodies
 */
const ORG_ABBREVIATIONS = {
  'staff selection commission': 'SSC',
  'institute of banking personnel selection': 'IBPS',
  'railway recruitment board': 'RRB',
  'railway recruitment cell': 'RRC',
  'union public service commission': 'UPSC',
  'reserve bank of india': 'RBI',
  'state bank of india': 'SBI',
  'bank of baroda': 'BOB',
  'bank of india': 'BOI',
  'central bank of india': 'Central Bank',
  'punjab national bank': 'PNB',
  'indian overseas bank': 'IOB',
  'tamilnad mercantile bank': 'TMB',
  'south indian bank': 'SIB',
  'securities and exchange board of india': 'SEBI',
  'central board of secondary education': 'CBSE',
  'national testing agency': 'NTA',
  'border security force': 'BSF',
  'central reserve police force': 'CRPF',
  'central industrial security force': 'CISF',
  'indo-tibetan border police': 'ITBP',
  'sashastra seema bal': 'SSB',
  'defence research and development organisation': 'DRDO',
  'indian space research organisation': 'ISRO',
  'uttar pradesh public service commission': 'UPPSC',
  'bihar public service commission': 'BPSC',
  'rajasthan public service commission': 'RPSC',
  'madhya pradesh public service commission': 'MPPSC',
  'delhi subordinate services selection board': 'DSSSB',
}

/**
 * Return a short, clean organization name
 */
export function getShortOrg(job) {
  if (job.orgShort && job.orgShort.trim().length > 0 && job.orgShort.trim().length <= 16) {
    return job.orgShort.trim()
  }
  const org = (job.org || '').trim()
  const lower = org.toLowerCase()
  if (ORG_ABBREVIATIONS[lower]) {
    return ORG_ABBREVIATIONS[lower]
  }
  for (const [key, abbr] of Object.entries(ORG_ABBREVIATIONS)) {
    if (lower.includes(key)) {
      return abbr
    }
  }
  if (org.length > 24) {
    return `${org.slice(0, 22)}…`
  }
  return org
}

/**
 * Clean & shorten job title for compact table display
 */
export function getShortTitle(job) {
  let title = (job.title || '').trim()
  if (!title) return 'Notification'

  title = title.replace(/\s*–\s*(Out|Updated|Listed|Re-Open)$/i, '')
  title = title.replace(/^Direct Recruitment\s+for\s+/i, '')
  title = title.replace(/^Recruitment\s+for\s+/i, '')
  title = title.replace(/\s+Notification\s+20\d\d$/i, ' 2026')

  if (title.length > 55) {
    return `${title.slice(0, 52)}…`
  }
  return title
}

/**
 * Best eligibility fallback
 */
function bestEligibility(job) {
  if (job.eligibility && job.eligibility.trim().length > 0) {
    const el = job.eligibility.trim()
    if (el.length <= 42) return el
    return `${el.slice(0, 40)}…`
  }
  const cat = (job.category || '').toLowerCase()
  if (cat === 'railway')  return '10th / ITI / Diploma'
  if (cat === 'police')   return '12th Pass'
  if (cat === 'defence')  return '10+2 / PCM'
  if (cat === 'teaching') return 'B.Ed / Post Graduate'
  if (cat === 'banking')  return 'Degree / Graduate'
  if (cat === 'ssc')      return '10th / 12th / Graduate'
  if (cat === 'upsc')     return 'Bachelor Degree'
  return 'Graduation'
}

export default function RecentJobsTable({
  jobs = [],
  kind,
  viewAllTo = '/latest/job',
  viewAllText = 'View All Jobs',
  showFooter = true,
}) {
  const activeKind = kind || (jobs.length > 0 ? jobs[0]?.kind : 'job') || 'job'

  // Dynamic action button text
  const actionLabel =
    activeKind === 'admit-card'
      ? 'Admit Card'
      : activeKind === 'result'
      ? 'View Result'
      : activeKind === 'answer-key'
      ? 'Answer Key'
      : activeKind === 'syllabus'
      ? 'View Syllabus'
      : 'Apply Now'

  return (
    <div className="rjt-wrapper">
      {/* ── Mobile Responsive Card View (< 640px) ── */}
      <div className="block sm:hidden divide-y divide-hairline">
        {jobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted">
            No active notifications available in this section.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={`m-${job.id}`} className="p-3.5 space-y-2.5 transition-colors hover:bg-subtle/40">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <BrandIcon icon={job.logo?.icon || 'landmark'} color={job.logo?.color || '#5558e6'} size={28} square />
                  <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300 border border-brand-500/20">
                    {getShortOrg(job)}
                  </span>
                </div>
                {job.vacancies && activeKind === 'job' ? (
                  <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-500/30">
                    {Number(job.vacancies).toLocaleString('en-IN')} Posts
                  </span>
                ) : null}
              </div>

              <Link to={`/job/${job.id}`} className="block text-sm font-bold leading-snug text-ink hover:text-brand-600 transition-colors line-clamp-2">
                {getShortTitle(job)}
              </Link>

              {/* Key Details on Mobile */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                {activeKind === 'job' && (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-ink-faint">Last Date:</span>
                      <strong className="text-rose-600 dark:text-rose-400">{getEndDate(job)}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-ink-faint">Eligibility:</span>
                      <span className="truncate max-w-[140px]">{bestEligibility(job)}</span>
                    </span>
                  </>
                )}
                {activeKind === 'admit-card' && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-ink-faint">Exam Date:</span>
                    <strong className="text-rose-600 dark:text-rose-400">{getExamDate(job)}</strong>
                  </span>
                )}
                {activeKind === 'result' && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-ink-faint">Status:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{job.tagline || 'Declared'}</strong>
                  </span>
                )}
                {activeKind === 'answer-key' && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-ink-faint">Status:</span>
                    <strong className="text-cyan-600 dark:text-cyan-400">{job.tagline?.split('—')[0]?.trim() || 'Available'}</strong>
                  </span>
                )}
                {activeKind === 'syllabus' && (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-ink-faint">Pattern:</span>
                    <strong className="text-purple-600 dark:text-purple-400">Exam Scheme & Syllabus</strong>
                  </span>
                )}
              </div>

              {/* Tap Target Action Button (>= 44px height for touch) */}
              <div className="pt-1">
                <Link
                  to={`/job/${job.id}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all"
                >
                  <span>{actionLabel}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop & Tablet Table (>= 640px) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="rjt-table">
          <thead>
            <tr className="rjt-head-row">
              <th className="rjt-th rjt-th-job">
                <span className="rjt-th-inner">
                  {activeKind === 'admit-card' && <Ticket size={13} className="text-rose-500" />}
                  {activeKind === 'result' && <Award size={13} className="text-emerald-500" />}
                  {activeKind === 'answer-key' && <KeyRound size={13} className="text-cyan-500" />}
                  {activeKind === 'syllabus' && <BookOpen size={13} className="text-purple-500" />}
                  {activeKind === 'job' && <Briefcase size={13} className="text-blue-500" />}
                  {activeKind === 'syllabus' ? 'Curriculum / Exam Board' : 'Notification / Authority'}
                </span>
              </th>

              {activeKind === 'job' && (
                <>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><CalendarDays size={13} /> Start Date</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><CalendarDays size={13} /> End Date</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner">Posts</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><GraduationCap size={13} /> Eligibility</span>
                  </th>
                </>
              )}

              {activeKind === 'admit-card' && (
                <>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><CalendarDays size={13} /> Release Date</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><CalendarDays size={13} /> Exam Date / City</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><GraduationCap size={13} /> Eligibility / Post</span>
                  </th>
                </>
              )}

              {activeKind === 'result' && (
                <>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><CalendarDays size={13} /> Result Date</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><Award size={13} /> Status / Merit</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><Briefcase size={13} /> Overview</span>
                  </th>
                </>
              )}

              {activeKind === 'answer-key' && (
                <>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><CalendarDays size={13} /> Key Date</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><KeyRound size={13} /> Status</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><Briefcase size={13} /> Exam Details</span>
                  </th>
                </>
              )}

              {activeKind === 'syllabus' && (
                <>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><CalendarDays size={13} /> Updated On</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><Layers size={13} /> Exam Scheme</span>
                  </th>
                  <th className="rjt-th">
                    <span className="rjt-th-inner"><GraduationCap size={13} /> Preparation Scope</span>
                  </th>
                </>
              )}

              <th className="rjt-th rjt-th-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-ink-muted">
                  No active notifications available in this section.
                </td>
              </tr>
            ) : (
              jobs.map((job, idx) => (
                <tr key={job.id} className={`rjt-row ${idx % 2 === 1 ? 'rjt-row-alt' : ''}`}>
                  {/* Job / Org */}
                  <td className="rjt-td rjt-td-job">
                    <div className="rjt-job-cell">
                      <BrandIcon icon={job.logo?.icon || 'landmark'} color={job.logo?.color || '#5558e6'} size={34} square />
                      <div className="rjt-job-info">
                        <Link to={`/job/${job.id}`} className="rjt-job-title" title={job.title}>
                          {getShortTitle(job)}
                        </Link>
                        <span className="rjt-job-org" title={job.org}>
                          {getShortOrg(job)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* KIND-SPECIFIC COLUMNS */}
                  {activeKind === 'job' && (
                    <>
                      <td className="rjt-td rjt-date">{getStartDate(job)}</td>
                      <td className="rjt-td rjt-date rjt-date-end">{getEndDate(job)}</td>
                      <td className="rjt-td">
                        {job.vacancies ? (
                          <span className="rjt-vacancies">
                            {Number(job.vacancies).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="rjt-vacancies-na">—</span>
                        )}
                      </td>
                      <td className="rjt-td rjt-eligibility">
                        {bestEligibility(job)}
                      </td>
                    </>
                  )}

                  {activeKind === 'admit-card' && (
                    <>
                      <td className="rjt-td rjt-date">{job.postedOn || 'Active'}</td>
                      <td className="rjt-td rjt-date rjt-date-end font-semibold text-rose-600 dark:text-rose-400">
                        {getExamDate(job)}
                      </td>
                      <td className="rjt-td rjt-eligibility">
                        {bestEligibility(job)}
                      </td>
                    </>
                  )}

                  {activeKind === 'result' && (
                    <>
                      <td className="rjt-td rjt-date">{job.postedOn || 'Active'}</td>
                      <td className="rjt-td">
                        <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {job.tagline || 'Declared'}
                        </span>
                      </td>
                      <td className="rjt-td rjt-eligibility text-xs text-ink-muted">
                        {job.shortInfo?.slice(0, 45)}…
                      </td>
                    </>
                  )}

                  {activeKind === 'answer-key' && (
                    <>
                      <td className="rjt-td rjt-date">{job.postedOn || 'Active'}</td>
                      <td className="rjt-td">
                        <span className="inline-flex items-center rounded-md bg-cyan-500/15 px-2 py-0.5 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                          {job.tagline?.split('—')[0]?.trim() || 'Available'}
                        </span>
                      </td>
                      <td className="rjt-td rjt-eligibility text-xs text-ink-muted">
                        Provisional / Final Objection Window
                      </td>
                    </>
                  )}

                  {activeKind === 'syllabus' && (
                    <>
                      <td className="rjt-td rjt-date">{job.postedOn || 'Active'}</td>
                      <td className="rjt-td">
                        <span className="inline-flex items-center rounded-md bg-purple-500/15 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          CBT & Written Scheme
                        </span>
                      </td>
                      <td className="rjt-td rjt-eligibility text-xs text-ink-muted">
                        Topic-wise Pattern & Marking
                      </td>
                    </>
                  )}

                  {/* Action */}
                  <td className="rjt-td rjt-td-center">
                    <Link
                      to={`/job/${job.id}`}
                      className="rjt-apply-btn"
                      aria-label={`View ${job.title}`}
                    >
                      {actionLabel}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── View All footer ── */}
      {showFooter && viewAllTo && jobs.length > 0 && (
        <div className="rjt-footer">
          <Link to={viewAllTo} className="rjt-view-all">
            {viewAllText}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </div>
  )
}
