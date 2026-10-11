import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  Banknote,
  TrainFront,
  Scale,
  ShieldCheck,
  Siren,
  GraduationCap,
  Building2,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { getCategories } from '../services/api.js'

/* ── Per-category branding ─────────────────────────────────────── */
const CATEGORY_THEMES = {
  jpsc: {
    icon: Landmark,
    color: '#0066f5',   /* brand blue */
    label: 'JPSC',
    sub: 'Civil Services, CDPO & Engg',
  },
  jssc: {
    icon: Scale,
    color: '#0e9384',   /* teal */
    label: 'JSSC',
    sub: 'CGL, Excise & Teacher Exams',
  },
  'other-jharkhand': {
    icon: MapPin,
    color: '#6941c6',   /* violet */
    label: 'Other Jharkhand',
    sub: 'High Court, Police, Health & Depts',
  },
  'rojgar-mela': {
    icon: Landmark,
    color: '#dc6803',   /* amber */
    label: 'Rojgar Mela',
    sub: 'District Camps & Spot Hiring',
  },
  'private-job': {
    icon: Building2,
    color: '#099250',   /* green */
    label: 'Private Jobs',
    sub: 'Tata Steel, Jindal & Corporates',
  },
  private: {
    icon: Building2,
    color: '#099250',
    label: 'Private Jobs',
    sub: 'Tata Steel, Jindal & Corporates',
  },
  'central-job': {
    icon: GraduationCap,
    color: '#c11574',   /* pink */
    label: 'Central Jobs',
    sub: 'SSC, Railway, Banking & UPSC',
  },
  others: {
    icon: GraduationCap,
    color: '#3e4784',
    label: 'Other Jobs',
    sub: 'Various Government Openings',
  },
  other: {
    icon: GraduationCap,
    color: '#3e4784',
    label: 'Other Jobs',
    sub: 'Various Government Openings',
  },
  _default: {
    icon: ShieldCheck,
    color: '#0066f5',
    label: 'Jobs',
    sub: 'Government & Private Openings',
  },
}

export default function JobCategoryCards() {
  const sliderRef = useRef(null)
  const [categories,     setCategories]     = useState([])
  const [canScrollLeft,  setCanScrollLeft]  = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setCategories(data)
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
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (dir) => {
    if (!sliderRef.current) return
    const w = sliderRef.current.clientWidth
    sliderRef.current.scrollBy({ left: dir === 'left' ? -w * 0.8 : w * 0.8, behavior: 'smooth' })
  }

  /* Build display list — use real data from API or fall back to themes */
  const displayList = categories.length > 0
    ? categories
    : Object.entries(CATEGORY_THEMES)
        .filter(([slug]) => !['_default', 'private', 'others', 'other'].includes(slug))
        .map(([slug, theme]) => ({
          slug,
          name: theme.label,
          fullName: theme.sub,
        }))

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="section-title" style={{ color: 'var(--text)' }}>
          Browse by Category
        </h2>

        {/* Scroll controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
            className="btn-icon"
            style={{ width: 30, height: 30 }}
          >
            <ChevronLeft size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll categories right"
            className="btn-icon"
            style={{ width: 30, height: 30 }}
          >
            <ChevronRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Horizontally scrollable card row */}
      <div
        ref={sliderRef}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        style={{ scrollbarWidth: 'none' }}
      >
        {displayList.map((cat) => {
          const theme = CATEGORY_THEMES[cat.slug] || CATEGORY_THEMES._default
          const Icon  = theme.icon
          const color = theme.color

          return (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative flex h-[200px] w-[170px] sm:w-[185px] shrink-0 snap-start flex-col justify-between rounded-card p-5 transition-all duration-200"
              style={{
                background: 'var(--surface)',
                border: `1px solid color-mix(in srgb, ${color} 40%, var(--border))`,
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid color-mix(in srgb, ${color} 75%, var(--border))`
                e.currentTarget.style.boxShadow = `0 8px 24px color-mix(in srgb, ${color} 20%, transparent)`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `1px solid color-mix(in srgb, ${color} 40%, var(--border))`
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* 10% tint header */}
              <div
                className="absolute inset-0 rounded-card pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `color-mix(in srgb, ${color} 6%, transparent)` }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                {/* 38px icon tile */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-btn transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `color-mix(in srgb, ${color} 15%, var(--surface-2))`,
                    color: color,
                    border: `1px solid color-mix(in srgb, ${color} 30%, var(--border))`,
                  }}
                >
                  <Icon size={20} aria-hidden="true" />
                </div>

                {/* Name & subtitle */}
                <div className="mt-3">
                  <h3
                    className="truncate text-[14px] font-bold leading-snug"
                    style={{ color: 'var(--text)' }}
                  >
                    {cat.name}
                  </h3>
                  <p
                    className="mt-1 text-[12px] leading-snug line-clamp-2 min-h-[2rem]"
                    style={{ color: 'var(--text-2)' }}
                  >
                    {cat.fullName || theme.sub}
                  </p>
                </div>
              </div>

              {/* Bottom stats tint + action */}
              <div
                className="relative z-10 flex items-center justify-between rounded-row px-3 py-2 text-[12px] font-semibold transition-all duration-200"
                style={{
                  background: `color-mix(in srgb, ${color} 10%, var(--surface-2))`,
                  border: `1px solid color-mix(in srgb, ${color} 20%, var(--border))`,
                  color: color,
                }}
              >
                <span>Explore</span>
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
