import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Sun,
  MoonStar,
  MessageSquarePlus,
  User,
  Flame,
  ArrowRight,
  BookOpen,
  Search,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getTickerJobs } from '../services/api.js'
import SarkariEmblem from './SarkariEmblem.jsx'

/* ── Helper: close when click outside ─────────────────────────────── */
function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ref, onOutside])
}

/* ── User Avatar Dropdown ──────────────────────────────────────────── */
function UserMenu({ user, isAuthenticated, isAdmin, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  useClickOutside(ref, () => setOpen(false))

  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/')
  }

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 rounded-pill px-3.5 text-[12px] font-semibold transition-all shrink-0"
        style={{
          height: 36,
          background: 'var(--accent)',
          color: 'var(--on-accent)',
        }}
      >
        <User size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-pill px-2.5 sm:px-3 text-[12px] font-semibold transition-all"
        style={{
          height: 36,
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: '1px solid var(--border-strong)',
        }}
      >
        {/* Avatar circle with initial */}
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          {initial}
        </span>
        <span className="hidden sm:inline max-w-[80px] truncate">
          {user?.name?.split(' ')[0] || 'Account'}
        </span>
        <ChevronDown size={13} aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="animate-fade-in absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-card shadow-lg z-50"
          role="menu"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {/* User info */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                {user?.name || 'User'}
              </p>
              <span
                className="rounded-badge px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{
                  background: isAdmin ? 'rgba(249,115,22,0.12)' : 'var(--accent-soft)',
                  color: isAdmin ? '#f97316' : 'var(--accent)',
                }}
              >
                {isAdmin ? 'Admin' : user?.role || 'Member'}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {user?.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="p-1">
            <Link
              to="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-row px-3 py-2 text-[13px] font-medium transition-colors"
              style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <User size={14} aria-hidden="true" />
              Your Profile
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-row px-3 py-2 text-[13px] font-medium transition-colors"
                style={{ color: '#f97316' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LayoutDashboard size={14} aria-hidden="true" />
                Admin Panel
              </Link>
            )}

            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-row px-3 py-2 text-[13px] font-medium transition-colors"
              style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Settings size={14} aria-hidden="true" />
              Settings
            </Link>
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }} className="p-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-row px-3 py-2 text-[13px] font-medium transition-colors"
              style={{ color: 'var(--danger)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={14} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Header ───────────────────────────────────────────────────── */
export default function Header({ onMenuClick = () => {} }) {
  const { isDark, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const [tickerItems, setTickerItems] = useState([])

  // Live job ticker
  useEffect(() => {
    let active = true
    getTickerJobs()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) setTickerItems(data)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  // Header is fixed 64px
  useEffect(() => {
    document.documentElement.style.setProperty('--header-height', '64px')
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-3 sm:px-5 gap-3 sm:gap-4 transition-colors"
      style={{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* ── LEFT: Menu toggle + Logo ─────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Menu / collapse button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="btn-icon"
          aria-label="Toggle navigation menu"
          title="Toggle sidebar"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        {/* Logo lockup */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
          aria-label="Jharkhand JobAlert X — home"
        >
          <SarkariEmblem size={40} />

          <div className="flex flex-col justify-center leading-none">
            {/* Wordmark */}
            <div className="flex items-baseline gap-1">
              <span
                className="text-[16px] sm:text-[18px] font-black tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                JobAlert
              </span>
              <span
                className="text-[18px] sm:text-[20px] font-black"
                style={{ color: '#FFFB08', textShadow: '0 0 10px rgba(255,251,8,.6)' }}
              >
                X
              </span>
            </div>
            {/* Gradient badge under wordmark */}
            <span
              className="mt-0.5 inline-block rounded-badge px-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em]"
              style={{
                background: 'linear-gradient(135deg, #FFFB08, #AED0C9)',
                color: '#09324A',
              }}
            >
              JHARKHAND
            </span>
          </div>
        </Link>
      </div>

      {/* ── CENTER: Live Job Ticker in top header ──────────────────── */}
      <div className="hidden md:flex flex-1 min-w-0 items-center mx-2 lg:mx-4 overflow-hidden rounded-pill border px-3 py-1.5"
        style={{
          background: 'var(--surface-2)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex shrink-0 items-center gap-1.5 pr-2.5 border-r"
          style={{ borderColor: 'var(--border)' }}
        >
          <Flame size={14} className="animate-pulse shrink-0" style={{ color: '#f97316' }} aria-hidden="true" />
          <span
            className="text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap"
            style={{ color: '#f97316' }}
          >
            Live Jobs
          </span>
        </div>

        <div className="flex min-w-0 overflow-hidden flex-1 pl-3">
          {tickerItems.length === 0 ? (
            <span className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
              Latest JPSC, JSSC, Rojgar Mela & Jharkhand recruitment updates 2026
            </span>
          ) : (
            <div className="animate-marquee hover:[animation-play-state:paused] flex items-center gap-6 motion-reduce:animate-none">
              {[...tickerItems, ...tickerItems].map((item, idx) => {
                const badge =
                  item.badge || item.orgShort || item.category?.toUpperCase() || 'NEW'
                const posts = item.vacancies
                  ? `${Number(item.vacancies).toLocaleString('en-IN')} Posts`
                  : 'Apply'
                return (
                  <Link
                    key={`tick-${idx}`}
                    to={`/job/${item.id}`}
                    className="group/item flex shrink-0 items-center gap-2 text-[12px] transition-colors whitespace-nowrap"
                    style={{ color: 'var(--text-2)' }}
                  >
                    <span
                      className="rounded-badge px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        background: 'var(--accent-soft)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-strong)',
                      }}
                    >
                      {badge}
                    </span>
                    <span className="font-medium group-hover/item:text-[var(--accent)] transition-colors">
                      {item.title}
                    </span>
                    <span
                      className="font-bold flex items-center gap-0.5 text-[11px]"
                      style={{ color: '#f97316' }}
                    >
                      [{posts}]
                      <ArrowRight
                        size={10}
                        aria-hidden="true"
                        className="transition-transform group-hover/item:translate-x-0.5"
                      />
                    </span>
                    <span style={{ color: 'var(--text-muted)', opacity: 0.5 }} aria-hidden="true">•</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Actions (Guides icon next to Search, then Feedback, Theme, User) ── */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        {/* Guides icon next to search */}
        <Link
          to="/articles"
          className="btn-icon"
          aria-label="Career Guides & Strategy"
          title="Guides & Strategy"
        >
          <BookOpen size={16} aria-hidden="true" />
        </Link>

        {/* Search shortcut */}
        <Link
          to="/search"
          className="btn-icon"
          aria-label="Search jobs"
          title="Search jobs"
        >
          <Search size={16} aria-hidden="true" />
        </Link>

        {/* Feedback */}
        <Link
          to="/feedback"
          className="btn-icon"
          aria-label="Send feedback"
          title="Feedback"
        >
          <MessageSquarePlus size={16} aria-hidden="true" />
        </Link>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-icon"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDark}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark
            ? <Sun size={16} aria-hidden="true" />
            : <MoonStar size={16} aria-hidden="true" />
          }
        </button>

        {/* User avatar / sign-in */}
        <UserMenu
          user={user}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          logout={logout}
        />
      </div>
    </header>
  )
}
