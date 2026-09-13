import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Sun,
  MoonStar,
  MessageSquarePlus,
  User,
  Flame,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getTickerJobs } from '../services/api.js'
import SarkariEmblem from './SarkariEmblem.jsx'


function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ref, onOutside])
}

export default function Header({ onMenuClick = () => {} }) {
  const { isDark, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const [userOpen, setUserOpen] = useState(false)
  const [tickerItems, setTickerItems] = useState([])
  const userRef = useRef(null)

  useClickOutside(userRef, () => setUserOpen(false))

  // Live job ticker items fetched directly from DB
  useEffect(() => {
    let active = true
    getTickerJobs()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setTickerItems(data)
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] px-2 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 bg-[#09324A]/95 backdrop-blur-md">
      {/* Main Top Header Container */}
      <div className="relative mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-3 rounded-2xl px-3 sm:px-4 transition-all duration-300 bg-[#061e2d] border border-teal-500/20 shadow-[0_0_20px_rgba(27,111,129,0.15)] backdrop-blur-2xl">
        
        {/* === LEFT: BRAND LOGO + TITLE === */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-1.5 transition-colors lg:hidden text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo & Jharkhand / JobAlert X Branding */}
          <Link
            to="/"
            className="group/brand flex items-center gap-2.5 sm:gap-3 pr-2 transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Jharkhand JobAlert X Home"
          >
            <SarkariEmblem size={44} />

            <div className="flex flex-col justify-center">
              {/* Top Line: Jharkhand */}
              <span className="text-[13px] sm:text-[15px] font-extrabold tracking-wider text-[#AED0C9] uppercase leading-none">
                Jharkhand
              </span>
              {/* Bottom Line: JobAlert X */}
              <div className="mt-1 flex items-baseline text-lg sm:text-xl font-black tracking-tight leading-none">
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">
                  JobAlert
                </span>
                <span className="ml-1 text-[#FFFB08] drop-shadow-[0_0_10px_rgba(255,251,8,0.75)]">
                  X
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* === CENTER: SLIDER BOX WITH SLIDING TEXT & FIRE SYMBOL === */}
        <div className="hidden min-w-0 flex-1 items-center md:flex px-3 lg:px-6">
          <div className="relative flex h-11 w-full items-center overflow-hidden rounded-full bg-[#09324A] border border-teal-500/20 shadow-inner pl-1.5 pr-4">
            
            {/* Left Brand Badge */}
            <div className="relative z-10 flex shrink-0 items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-[#1B6F81] via-[#AED0C9] to-[#FFFB08] text-[#09324A] shadow-md shadow-teal-500/30">
              <Flame size={17} className="animate-pulse text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" aria-hidden="true" />
            </div>

            {/* Left Edge Gradient Fade */}
            <div className="pointer-events-none absolute left-10 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-[#0d1326] to-transparent" />

            {/* Right-to-Left Continuous Moving Ticker Track */}
            <div className="flex overflow-hidden w-full cursor-pointer select-none">
              <div className="animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none flex items-center gap-6 py-1">
                {tickerItems.map((item, idx) => {
                  const badge = item.badge || item.orgShort || item.org || item.category?.toUpperCase() || 'LIVE'
                  const highlight = item.highlight || item.tagline || (item.vacancies ? `${Number(item.vacancies).toLocaleString('en-IN')} Posts` : 'Apply Now')
                  return (
                    <Link
                      key={`t1-${item.id || idx}`}
                      to={`/job/${item.id}`}
                      className="group/item flex shrink-0 items-center gap-2 text-xs transition-colors text-[#AED0C9] hover:text-[#FFFB08]"
                    >
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold bg-[#1B6F81]/30 text-[#FFFB08] border border-[#1B6F81]/50">
                        {badge}
                      </span>
                      <span className="font-semibold text-[#AED0C9] group-hover/item:text-[#FFFB08] group-hover/item:underline underline-offset-2">
                        {item.title}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#FFFB08] group-hover/item:text-yellow-300">
                        [{highlight}]
                        <ArrowRight size={12} className="transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="mx-2 text-teal-700" aria-hidden="true">•</span>
                    </Link>
                  )
                })}
                {/* Loop 2 (for continuous smooth scroll) */}
                {tickerItems.map((item, idx) => {
                  const badge = item.badge || item.orgShort || item.org || item.category?.toUpperCase() || 'LIVE'
                  const highlight = item.highlight || item.tagline || (item.vacancies ? `${Number(item.vacancies).toLocaleString('en-IN')} Posts` : 'Apply Now')
                  return (
                    <Link
                      key={`t2-${item.id || idx}`}
                      to={`/job/${item.id}`}
                      className="group/item flex shrink-0 items-center gap-2 text-xs transition-colors text-[#AED0C9] hover:text-[#FFFB08]"
                    >
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold bg-[#1B6F81]/30 text-[#FFFB08] border border-[#1B6F81]/50">
                        {badge}
                      </span>
                      <span className="font-semibold text-[#AED0C9] group-hover/item:text-[#FFFB08] group-hover/item:underline underline-offset-2">
                        {item.title}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#FFFB08] group-hover/item:text-yellow-300">
                        [{highlight}]
                        <ArrowRight size={12} className="transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="mx-2 text-teal-700" aria-hidden="true">•</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT: ACTIONS + THEME TOGGLE + USER PILL === */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Quick Feedback Button */}
          <Link
            to="/feedback"
            className="group flex items-center gap-1.5 rounded-full px-3 py-2 transition-all shadow-sm bg-[#09324A] text-[#AED0C9] border border-teal-500/20 hover:border-[#FFFB08]/40 hover:text-[#FFFB08]"
            title="Send Feedback or Suggestion"
          >
            <MessageSquarePlus size={17} className="transition-colors text-[#FFFB08] group-hover:text-yellow-300" />
            <span className="hidden text-xs font-bold lg:inline">Feedback</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all shadow-sm bg-[#09324A] text-[#AED0C9] border border-teal-500/20 hover:border-[#FFFB08]/40 hover:text-[#FFFB08]"
            aria-label="Toggle theme"
          >
            {isDark ? <MoonStar size={17} className="text-[#AED0C9]" /> : <Sun size={17} className="text-[#FFFB08]" />}
          </button>

          {/* Login / Profile Gradient Pill Button */}
          <div ref={userRef} className="relative">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setUserOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B6F81] to-[#09324A] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-teal-600/30 hover:shadow-teal-500/40 hover:brightness-110 transition-all border border-teal-400/20"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <User size={15} className="text-[#AED0C9]" />
                )}
                <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFFB08] to-[#AED0C9] px-3.5 py-2 text-xs font-bold text-[#09324A] shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:brightness-110 transition-all"
              >
                <User size={15} className="text-[#09324A]" />
                <span>Sign In</span>
              </Link>
            )}

            {userOpen && isAuthenticated && (
              <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0d1326] p-2 shadow-2xl backdrop-blur-xl animate-fade-in z-50 text-white">
                <div className="px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-white truncate">{user?.name || 'User'}</p>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-orange-400">
                      {user?.role || 'Member'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="my-1 h-px bg-white/10" />
                <Link
                  to="/profile"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Your Profile
                </Link>
                <Link
                  to="/bookmarked"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Bookmarked Jobs
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold text-orange-400 hover:bg-orange-500/20 transition-colors"
                  >
                    <span>Admin Control Panel</span>
                    <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]" />
                  </Link>
                )}
                <div className="my-1 h-px bg-white/10" />
                <button
                  type="button"
                  onClick={() => {
                    setUserOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}
