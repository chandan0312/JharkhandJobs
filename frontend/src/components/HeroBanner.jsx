import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  CalendarClock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Scale,
  Banknote,
  TrainFront,
  ShieldCheck,
  Siren,
  Anchor,
  Flame,
} from 'lucide-react'
import { formatReducedDate } from '../utils/dateHelper.js'

const EMBLEM_ICONS = {
  landmark: Landmark,
  scale: Scale,
  banknote: Banknote,
  train: TrainFront,
  shield: ShieldCheck,
  siren: Siren,
  anchor: Anchor,
}

function getPostCount(job) {
  if (job.vacancies) return `${Number(job.vacancies).toLocaleString('en-IN')} Posts`
  if (job.posts && Array.isArray(job.posts) && job.posts.length > 0) {
    const total = job.posts.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
    if (total > 0) return `${total.toLocaleString('en-IN')} Posts`
  }
  return 'Various Posts'
}

function getLastDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label?.toLowerCase().includes('last date') ||
      r.label?.toLowerCase().includes('close') ||
      r.label?.toLowerCase().includes('end date'),
  )
  return d?.value || 'Check Details'
}

/* ── Org logo tile ──────────────────────────────────────────────── */
function OrgTile({ job }) {
  const Icon = EMBLEM_ICONS[job.logo?.icon] || Landmark
  const color = job.logo?.color || '#0066f5'

  return (
    <div className="relative hidden shrink-0 items-center justify-center md:flex pl-4">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-25"
          style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
          aria-hidden="true"
        />
        {/* Orbit ring */}
        <div className="absolute inset-0 rounded-full border border-dashed opacity-20" style={{ borderColor: color }} aria-hidden="true" />
        {/* Central tile — 56px per spec */}
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-card text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, rgba(0,0,0,0.5))` }}
        >
          <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default function HeroBanner({ slides = [] }) {
  const [index,    setIndex]    = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const count = slides.length

  const go   = useCallback((i) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i === 0 ? count - 1 : i - 1)), [count])

  useEffect(() => {
    if (count <= 1 || isPaused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [count, isPaused, next])

  if (!count) return null
  const job = slides[index]

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Main Banner Card ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-card"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {/* Accent glow top-right */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          {/* ── Text content ───────────────────────────────────────── */}
          <div className="min-w-0 flex-1 animate-fade-in" key={job.id}>
            {/* Tags row */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-badge px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                style={{
                  background: 'rgba(249,115,22,0.1)',
                  color: '#f97316',
                  border: '1px solid rgba(249,115,22,0.2)',
                }}
              >
                <Flame size={11} aria-hidden="true" />
                Trending
              </span>
              <span className="badge">
                {job.category}
              </span>
              {job.tagline && (
                <span
                  className="hidden sm:inline text-[12px] font-medium truncate max-w-[240px]"
                  style={{ color: 'var(--text-2)' }}
                >
                  {job.tagline}
                </span>
              )}
              <span
                className="ml-auto mr-8 hidden sm:inline text-[12px] tabular-nums"
                style={{ color: 'var(--text-muted)' }}
              >
                {index + 1} / {count}
              </span>
            </div>

            {/* Job title */}
            <h2
              className="text-[16px] sm:text-[18px] font-bold leading-snug tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              <Link
                to={`/job/${job.id}`}
                className="transition-colors hover:text-[var(--accent)]"
              >
                {job.title}
              </Link>
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--text-2)' }}>{job.org}</p>

            {/* Bottom row — meta + actions */}
            <div
              className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div className="flex flex-wrap items-center gap-2.5 text-[12px]">
                {/* Vacancies */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-row px-2.5 py-1 font-semibold"
                  style={{
                    background: 'var(--warning-bg)',
                    color: 'var(--warning)',
                    border: '1px solid color-mix(in srgb, var(--warning) 25%, transparent)',
                  }}
                >
                  <Briefcase size={12} aria-hidden="true" />
                  {getPostCount(job)}
                </span>
                {/* Last date */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-row px-2.5 py-1 font-medium"
                  style={{
                    background: 'var(--danger-bg)',
                    color: 'var(--danger)',
                    border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)',
                  }}
                >
                  <CalendarClock size={12} aria-hidden="true" />
                  Last date: <strong>{formatReducedDate(getLastDate(job))}</strong>
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/job/${job.id}`}
                  className="btn-ghost"
                  style={{ height: 32, fontSize: 12, padding: '0 12px' }}
                >
                  Details
                </Link>
                <Link
                  to={`/job/${job.id}`}
                  className="btn-accent"
                  style={{ height: 32, fontSize: 12, padding: '0 14px' }}
                >
                  Apply Now
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── 56px org tile (desktop) ─────────────────────────── */}
          <OrgTile job={job} />
        </div>

        {/* Carousel arrow buttons */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 btn-icon opacity-0 group-hover/carousel:opacity-100 shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-icon opacity-0 group-hover/carousel:opacity-100 shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* ── Indicator dots ─────────────────────────────────────────── */}
      {count > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5 py-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              aria-current={i === index ? 'true' : undefined}
              className="group/dot flex items-center justify-center p-0.5 transition-all"
            >
              <span
                className="block h-1.5 rounded-pill transition-all duration-300"
                style={{
                  width: i === index ? 28 : 8,
                  background: i === index ? 'var(--accent)' : 'var(--border-strong)',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
