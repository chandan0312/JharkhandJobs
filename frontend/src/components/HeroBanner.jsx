import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  CalendarClock,
  ArrowRight,
  Bookmark,
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
      r.label?.toLowerCase().includes('end date')
  )
  return d?.value || 'Check Details'
}

// Compact emblem badge
function Emblem({ job }) {
  const Icon = EMBLEM_ICONS[job.logo?.icon] || Landmark
  const color = job.logo?.color || '#f97316'
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      {/* soft radial glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />
      {/* subtle orbit ring */}
      <div className="absolute inset-0 rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-2 rounded-full border border-white/10" />
      {/* central seal */}
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-xl ring-2 ring-white/15"
        style={{ background: `linear-gradient(135deg, ${color}, rgba(0,0,0,0.65))` }}
      >
        <Icon size={26} strokeWidth={1.8} />
      </div>
    </div>
  )
}

export default function HeroBanner({ slides = [] }) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const count = slides.length

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i === 0 ? count - 1 : i - 1)), [count])

  useEffect(() => {
    if (count <= 1 || isPaused) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
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
      {/* Main Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#080e22] via-[#0d1633] to-[#141b3a] text-white shadow-lg border border-white/10">
        {/* Faint grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-orange-500/15 blur-2xl" />

        <div className="relative flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
          {/* Text Content */}
          <div className="min-w-0 flex-1 animate-fade-in" key={job.id}>
            {/* Category tag & highlights */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/20 px-2 py-0.5 text-xs font-extrabold text-orange-300 border border-orange-500/30">
                <Flame size={12} className="text-orange-400" aria-hidden="true" />
                Trending Opening
              </span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                {job.category}
              </span>
              {job.tagline && (
                <span className="text-xs font-medium text-slate-200 truncate max-w-[280px] hidden sm:inline">
                  {job.tagline}
                </span>
              )}
              <span className="text-xs text-slate-300 ml-auto mr-7 hidden sm:inline">
                {index + 1} / {count}
              </span>
            </div>

            {/* Title & Organization */}
            <h2 className="text-base sm:text-lg font-black leading-snug tracking-tight text-white line-clamp-2">
              <Link to={`/job/${job.id}`} className="hover:text-orange-300 transition-colors">
                {job.title}
              </Link>
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-300 truncate">{job.org}</p>

            {/* Post (Vacancies) & Last Date Row + Action Buttons */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
                {/* Total Posts */}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300 shadow-2xs">
                  <Briefcase size={13} className="text-amber-400 shrink-0" />
                  <span>{getPostCount(job)}</span>
                </span>

                {/* Last Date */}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/25 bg-rose-400/10 px-2.5 py-1 text-xs text-slate-200 shadow-2xs">
                  <CalendarClock size={13} className="text-rose-400 shrink-0" />
                  <span className="text-slate-400 font-medium">Last Date:</span>
                  <span className="font-bold text-rose-300">{getLastDate(job)}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/job/${job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95"
                >
                  <Bookmark size={13} />
                  <span>Details</span>
                </Link>
                <Link
                  to={`/job/${job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-orange-500/20 transition-all hover:brightness-110 active:scale-95"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Compact Emblem */}
          <div className="hidden shrink-0 items-center justify-center md:flex pl-3">
            <Emblem job={job} />
          </div>
        </div>

        {/* Carousel Arrow Buttons */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white border border-white/20 opacity-0 group-hover/carousel:opacity-100 backdrop-blur-md shadow-sm transition-all hover:scale-110 hover:bg-slate-900"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white border border-white/20 opacity-0 group-hover/carousel:opacity-100 backdrop-blur-md shadow-sm transition-all hover:scale-110 hover:bg-slate-900"
              aria-label="Next Slide"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Sleek, Minimal Carousel Indicator Dots Below Banner */}
      {count > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5 py-0.5">
          {slides.map((s, i) => {
            const isActive = i === index
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                aria-current={isActive}
                title={s.title}
                className="group/dot relative flex items-center justify-center p-0.5 transition-all"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-7 bg-gradient-to-r from-orange-500 to-amber-400 shadow-md shadow-orange-500/50 ring-2 ring-orange-400/50'
                      : 'w-2 bg-slate-400 dark:bg-slate-500 hover:bg-slate-300 hover:scale-125'
                  }`}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
