// ---------------------------------------------------------------------------
// AdminLayout — dedicated layout for admin pages with design tokens
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
  X,
  SunMedium,
  MoonStar,
  BarChart2,
  BookOpen,
  PenSquare,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Header from '../components/Header.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, color: '#0066f5' },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2, color: '#06b6d4' },
  { to: '/admin/posts', label: 'Manage Posts', icon: FileText, color: '#f59e0b' },
  { to: '/admin/posts/new', label: 'Create Post', icon: PlusCircle, color: '#10b981' },
  { to: '/admin/articles', label: 'Manage Articles', icon: BookOpen, color: '#8b5cf6' },
  { to: '/admin/articles/new', label: 'Write Article', icon: PenSquare, color: '#ec4899' },
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
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
          isActive
            ? 'font-bold shadow-sm'
            : 'hover:opacity-90',
        ].join(' ')
      }
      style={({ isActive }) => ({
        background: isActive ? 'var(--accent-soft)' : 'transparent',
        color: isActive ? 'var(--accent)' : 'var(--text-2)',
        borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
      })}
    >
      {({ isActive }) => (
        <>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all"
            style={{
              background: isActive ? 'var(--accent)' : 'var(--surface-2)',
              color: isActive ? 'var(--on-accent)' : item.color,
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </span>
          <span className="truncate">{item.label}</span>
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
      } else if (parts[1] === 'articles') {
        items.push({ label: 'Articles', to: '/admin/articles' })
        if (parts[2] === 'new') items.push({ label: 'Write', to: null })
        else if (parts[2]) items.push({ label: 'Edit', to: null })
      } else if (parts[1] === 'feedback') {
        items.push({ label: 'Feedback & Suggestions', to: null })
      } else if (parts[1] === 'analytics') {
        items.push({ label: 'Analytics', to: null })
      }
    }
    return items
  })()

  return (
    <div
      className="min-h-screen transition-colors duration-150"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Top header — identical 64px site header with live ticker & tools */}
      <Header onMenuClick={() => setMobileOpen((o) => !o)} />

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'var(--overlay)' }}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Admin Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 z-30 flex w-[260px] flex-col transition-all duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          top: 'var(--header-height, 64px)',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Mobile close */}
        <div
          className="flex items-center justify-between px-4 py-3 lg:hidden"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Jharkhand Admin
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="btn-icon"
            aria-label="Close admin menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Admin profile badge */}
        <div
          className="px-4 py-3.5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--brand-dark), var(--brand-primary))',
                border: '1px solid rgba(255,251,8,0.3)',
              }}
            >
              <Shield size={18} style={{ color: '#FFFB08' }} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text)' }}>
                {user?.name || 'Administrator'}
              </p>
              <span
                className="inline-block rounded-badge px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(249,115,22,0.12)',
                  color: '#f97316',
                }}
              >
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          <p
            className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Control Center
          </p>
          <div className="space-y-0.5">
            {ADMIN_NAV.map((item) => (
              <AdminNavItem key={item.to} item={item} onClick={() => setMobileOpen(false)} />
            ))}
          </div>
        </nav>

        {/* Theme toggle in sidebar */}
        <div
          className="p-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-row px-3 py-2 text-[13px] font-medium transition-colors"
            style={{ color: 'var(--text-2)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-2)'
            }}
          >
            <div className="flex items-center gap-2.5">
              {isDark ? (
                <MoonStar size={16} style={{ color: 'var(--accent)' }} />
              ) : (
                <SunMedium size={16} style={{ color: '#f59e0b' }} />
              )}
              <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <span
              className="rounded-badge px-1.5 py-0.5 text-[10px] font-bold uppercase"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>

        {/* Footer actions */}
        <div
          className="p-2 space-y-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-row px-3 py-2 text-[13px] font-medium transition-colors"
            style={{ color: 'var(--text-2)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-2)'
            }}
          >
            <SarkariEmblem size={18} />
            <span>View Live Site</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-row px-3 py-2 text-[13px] font-medium transition-colors"
            style={{ color: 'var(--danger)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--danger-bg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Content area */}
      <div
        className="transition-all duration-200 lg:pl-[260px]"
        style={{
          paddingTop: 'var(--header-height, 64px)',
        }}
      >
        {/* Breadcrumb bar */}
        <div
          className="px-4 py-2.5 sm:px-6"
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-1.5 text-[12px]">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />}
                {crumb.to && i < crumbs.length - 1 ? (
                  <Link
                    to={crumb.to}
                    className="font-medium transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    {crumb.label}
                  </span>
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
