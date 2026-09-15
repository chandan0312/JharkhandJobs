import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Landmark,
  Banknote,
  TrainFront,
  Scale,
  ShieldCheck,
  Siren,
  GraduationCap,
  Building2,
  MapPin,
} from 'lucide-react'

import { getCategories } from '../services/api.js'

// Visual styling tokens mapped per category slug
const CATEGORY_THEMES = {
  jpsc: {
    icon: Landmark,
    gradient: 'bg-gradient-to-b from-[#1B6F81] via-[#155d6c] to-[#09324A]',
    border: 'border-teal-400/40 hover:border-teal-300',
    iconBg: 'bg-teal-400/25 text-teal-100 border border-teal-300/30',
    badgeBg: 'bg-teal-400/20 text-teal-100 border border-teal-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(27,111,129,0.55)]',
    defaultSubtitle: 'Civil Services, CDPO & Engg',
  },
  jssc: {
    icon: Scale,
    gradient: 'bg-gradient-to-b from-[#09324A] via-[#0d4060] to-[#041926]',
    border: 'border-cyan-400/40 hover:border-cyan-300',
    iconBg: 'bg-cyan-400/25 text-cyan-100 border border-cyan-300/30',
    badgeBg: 'bg-cyan-400/20 text-cyan-100 border border-cyan-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(9,50,74,0.65)]',
    defaultSubtitle: 'CGL, Excise & Teacher Exams',
  },
  'other-jharkhand': {
    icon: MapPin,
    gradient: 'bg-gradient-to-b from-[#0369a1] via-[#0284c7] to-[#082f49]',
    border: 'border-sky-400/40 hover:border-sky-300',
    iconBg: 'bg-sky-400/25 text-sky-100 border border-sky-300/30',
    badgeBg: 'bg-sky-400/20 text-sky-100 border border-sky-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(2,132,199,0.55)]',
    defaultSubtitle: 'High Court, Police, Health & Depts',
  },
  'rojgar-mela': {
    icon: Landmark,
    gradient: 'bg-gradient-to-b from-[#b45309] via-[#92400e] to-[#451a03]',
    border: 'border-amber-400/40 hover:border-amber-300',
    iconBg: 'bg-amber-400/25 text-amber-100 border border-amber-300/30',
    badgeBg: 'bg-amber-400/20 text-amber-100 border border-amber-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(217,119,6,0.55)]',
    defaultSubtitle: 'District Camps & Spot Hiring',
  },
  'private-job': {
    icon: Building2,
    gradient: 'bg-gradient-to-b from-[#0f766e] via-[#115e59] to-[#042421]',
    border: 'border-emerald-400/40 hover:border-emerald-300',
    iconBg: 'bg-emerald-400/25 text-emerald-100 border border-emerald-300/30',
    badgeBg: 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(15,118,110,0.55)]',
    defaultSubtitle: 'Tata Steel, Jindal & Corporates',
  },
  private: {
    icon: Building2,
    gradient: 'bg-gradient-to-b from-[#0f766e] via-[#115e59] to-[#042421]',
    border: 'border-emerald-400/40 hover:border-emerald-300',
    iconBg: 'bg-emerald-400/25 text-emerald-100 border border-emerald-300/30',
    badgeBg: 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(15,118,110,0.55)]',
    defaultSubtitle: 'Tata Steel, Jindal & Corporates',
  },
  'central-job': {
    icon: GraduationCap,
    gradient: 'bg-gradient-to-b from-[#3730a3] via-[#4338ca] to-[#1e1b4b]',
    border: 'border-indigo-400/40 hover:border-indigo-300',
    iconBg: 'bg-indigo-400/25 text-indigo-100 border border-indigo-300/30',
    badgeBg: 'bg-indigo-400/20 text-indigo-100 border border-indigo-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(67,56,202,0.55)]',
    defaultSubtitle: 'SSC, Railway, Banking & UPSC',
  },
  others: {
    icon: GraduationCap,
    gradient: 'bg-gradient-to-b from-[#3730a3] via-[#4338ca] to-[#1e1b4b]',
    border: 'border-indigo-400/40 hover:border-indigo-300',
    iconBg: 'bg-indigo-400/25 text-indigo-100 border border-indigo-300/30',
    badgeBg: 'bg-indigo-400/20 text-indigo-100 border border-indigo-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(67,56,202,0.55)]',
    defaultSubtitle: 'SSC, Railway, Banking & UPSC',
  },
  other: {
    icon: GraduationCap,
    gradient: 'bg-gradient-to-b from-[#3730a3] via-[#4338ca] to-[#1e1b4b]',
    border: 'border-indigo-400/40 hover:border-indigo-300',
    iconBg: 'bg-indigo-400/25 text-indigo-100 border border-indigo-300/30',
    badgeBg: 'bg-indigo-400/20 text-indigo-100 border border-indigo-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(67,56,202,0.55)]',
    defaultSubtitle: 'SSC, Railway, Banking & UPSC',
  },
}


export default function JobCategoryCards() {
  const sliderRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Fetch real categories and live vacancy/post counts from database
  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setCategories(data)
          if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0
          }
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const checkScroll = () => {
    if (!sliderRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    el.scrollLeft = 0
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction) => {
    if (!sliderRef.current) return
    const containerWidth = sliderRef.current.clientWidth
    const offset = direction === 'left' ? -containerWidth * 0.8 : containerWidth * 0.8
    sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <div className="space-y-3">
      {/* ── Header: Title & Slider Controls ── */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            <Sparkles size={14} />
          </span>
          <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-ink">
            Top Job Categories
          </h2>
          <span className="text-xs font-semibold text-ink-muted hidden sm:inline">
            • Explore major government recruitment sectors
          </span>
        </div>

        {/* Previous / Next Slider Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous Category"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-muted transition-all hover:bg-subtle hover:text-ink disabled:opacity-30 disabled:pointer-events-none shadow-2xs active:scale-90"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next Category"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-muted transition-all hover:bg-subtle hover:text-ink disabled:opacity-30 disabled:pointer-events-none shadow-2xs active:scale-90"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 1-Row Slider: Starts at index 0, Smooth Touch Scroll on Mobile ── */}
      <div
        ref={sliderRef}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2.5 px-1 scroll-pl-1 overscroll-x-contain"
        style={{ scrollbarWidth: 'none' }}
      >
        {(categories.length > 0
          ? categories
          : Object.keys(CATEGORY_THEMES).map((slug) => ({
              slug,
              name: slug.toUpperCase(),
              fullName: CATEGORY_THEMES[slug].defaultSubtitle,
            }))
        ).map((cat) => {
          const theme = CATEGORY_THEMES[cat.slug] || CATEGORY_THEMES.other
          const Icon = theme.icon
          return (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`group relative flex h-[200px] sm:h-[215px] w-[170px] sm:w-[185px] md:w-[calc((100%-4*12px)/5)] shrink-0 snap-start flex-col justify-between rounded-2xl border ${theme.border} ${theme.gradient} p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${theme.glow}`}
            >
              {/* Top Row: Category Icon */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-110 ${theme.iconBg}`}
                >
                  <Icon size={22} />
                </div>
              </div>

              {/* Middle Row: Category Name + Info Subtitle */}
              <div className="min-w-0 mt-2">
                <h3 className="truncate text-sm sm:text-base font-black tracking-tight text-white transition-colors group-hover:text-white">
                  {cat.name}
                </h3>
                <p className="line-clamp-2 text-xs font-medium text-white/90 mt-1 leading-snug min-h-[2rem]">
                  {cat.fullName || theme.defaultSubtitle}
                </p>
              </div>

              {/* Bottom Row: Frosted Glass Explore Now Button */}
              <div
                className="mt-3 flex items-center justify-between rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-bold text-white shadow-xs backdrop-blur-md transition-all duration-200 group-hover:bg-white/25 group-hover:border-white/35"
              >
                <span>Explore Now</span>
                <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
