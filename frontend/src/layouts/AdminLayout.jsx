// ---------------------------------------------------------------------------
// AdminLayout — dedicated layout for admin pages with sidebar navigation.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X,
  SunMedium,
  MoonStar,
  BarChart2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, color: '#6d70f0' },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2, color: '#06b6d4' },
  { to: '/admin/posts', label: 'Manage Posts', icon: FileText, color: '#f59e0b' },
  { to: '/admin/posts/new', label: 'Create Post', icon: PlusCircle, color: '#10b981' },
  { to: '/admin/feedback', label: 'Feedback & Suggestions', icon: MessageSquare, color: '#f43f5e' },
]

function AdminNavItem({ item, onClick }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
          isActive
            ? 'bg-gradient-to-r from-brand-500/25 to-brand-500/5 text-teal-200 font-bold border-l-2 border-[#AED0C9] shadow-sm'
            : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
              isActive
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                : 'bg-white/[0.05] border border-white/[0.06]'
            }`}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ color: isActive ? '#fff' : item.color }}
            />
          </span>
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // Build breadcrumb segments
  const crumbs = (() => {
    const parts = pathname.replace(/\/$/, '').split('/').filter(Boolean)
    const items = [{ label: 'Admin', to: '/admin' }]
    if (parts.length > 1) {
      if (parts[1] === 'posts') {
        items.push({ label: 'Posts', to: '/admin/posts' })
        if (parts[2] === 'new') items.push({ label: 'Create', to: null })
        else if (parts[2]) items.push({ label: 'Edit', to: null })
      } else if (parts[1] === 'feedback') {
        items.push({ label: 'Feedback & Suggestions', to: null })
      }
    }
    return items
  })()

  return (
    <div className="min-h-screen bg-page text-ink antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200 dark:bg-[#050814] dark:text-white">
      {/* Top header — reuse the site header */}
      <Header onMenuClick={() => setMobileOpen((o) => !o)} />

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Admin Sidebar (Always Dark) */}
      <aside
        className={`fixed top-[72px] bottom-0 left-0 z-30 flex w-[260px] flex-col border-r border-teal-500/20 bg-[#061e2d] shadow-xl transition-colors duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between border-b border-teal-500/20 px-4 py-3 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Jharkhand JobAlert X</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close admin menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Admin badge */}
        <div className="border-b border-teal-500/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-navy-950 border border-teal-400/30 shadow-lg shadow-brand-500/25">
              <Shield size={18} className="text-[#FFFB08]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-teal-300/80">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-400/70">
            Jharkhand Admin Portal
          </p>
          <div className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <AdminNavItem key={item.to} item={item} onClick={() => setMobileOpen(false)} />
            ))}
          </div>
        </nav>

        {/* Theme toggle */}
        <div className="border-t border-teal-500/20 p-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/[0.07]"
            aria-pressed={!isDark}
          >
            {isDark ? (
              <MoonStar size={18} className="flex-shrink-0 text-teal-300" />
            ) : (
              <SunMedium size={18} className="flex-shrink-0 text-[#FFFB08]" />
            )}
            <span className="text-[13px] font-medium text-slate-300">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span
              className={`ml-auto inline-flex h-5 w-10 items-center rounded-full p-0.5 transition-colors ${
                isDark ? 'bg-navy-700' : 'bg-brand-500'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isDark ? 'translate-x-0' : 'translate-x-5'
                }`}
              />
            </span>
          </button>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/[0.08] p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <SarkariEmblem size={20} />
            <span>View Website</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <LogOut size={16} />
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content area */}
      <div className="transition-all duration-300 pt-[72px] lg:pl-[260px]">
        {/* Breadcrumb bar */}
        <div className="border-b border-hairline bg-surface/80 px-4 py-3 backdrop-blur sm:px-6 dark:border-white/[0.06] dark:bg-[#080d1e]/80">
          <div className="flex items-center gap-1.5 text-[12px]">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-ink-faint dark:text-slate-600" />}
                {crumb.to && i < crumbs.length - 1 ? (
                  <Link to={crumb.to} className="font-medium text-ink-muted hover:text-brand-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-ink dark:text-slate-300">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Page content */}
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
