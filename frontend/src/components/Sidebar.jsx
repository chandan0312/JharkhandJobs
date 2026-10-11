import { NavLink } from 'react-router-dom'
import {
  Home,
  Briefcase,
  ClipboardList,
  Ticket,
  Award,
  KeyRound,
  BookOpen,
  User,
  MessageSquarePlus,
  Settings,
  LogOut,
  X,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Building2,
  MapPin,
  GraduationCap,
  Newspaper,
} from 'lucide-react'

/* ── Navigation groups ───────────────────────────────────────────── */
const MENU = [
  { to: '/',                          label: 'Discover',             icon: Home,          end: true },
  { to: '/latest/job',                label: 'Latest Jobs',          icon: Briefcase      },
  { to: '/articles',                  label: 'Guides & Articles',    icon: Newspaper      },
  { to: '/category/jpsc',             label: 'JPSC',                 icon: ClipboardList  },
  { to: '/category/jssc',             label: 'JSSC',                 icon: Award          },
  { to: '/category/other-jharkhand',  label: 'Other Jharkhand',     icon: MapPin         },
  { to: '/rojgar-mela',              label: 'Rojgar Mela',          icon: Users          },
  { to: '/private-jobs',             label: 'Private Jobs',         icon: Building2      },
  { to: '/central-jobs',             label: 'Central Jobs',         icon: GraduationCap  },
]

const NOTIFICATIONS = [
  { to: '/latest/admit-card',  label: 'Admit Cards',   icon: Ticket  },
  { to: '/latest/result',      label: 'Results',       icon: Award   },
  { to: '/latest/answer-key',  label: 'Answer Keys',   icon: KeyRound },
  { to: '/latest/syllabus',    label: 'Syllabus',      icon: BookOpen },
]

const ACCOUNT = [
  { to: '/profile',   label: 'Profile',   icon: User              },
  { to: '/feedback',  label: 'Feedback',  icon: MessageSquarePlus },
  { to: '/settings',  label: 'Settings',  icon: Settings          },
  { to: '/logout',    label: 'Sign out',  icon: LogOut, danger: true },
]

/* ── Nav item ─────────────────────────────────────────────────────── */
function NavItem({ item, onNavigate, collapsed }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group relative flex items-center rounded-row transition-all duration-150',
          collapsed ? 'justify-center px-0 py-2.5 w-11 mx-auto' : 'gap-3 px-3 py-2',
          isActive
            ? 'font-semibold'
            : item.danger
            ? 'hover:opacity-90'
            : '',
        ].join(' ')
      }
      style={({ isActive }) => ({
        background: isActive ? 'var(--accent-soft)' : 'transparent',
        color: item.danger
          ? 'var(--danger)'
          : isActive
          ? 'var(--accent)'
          : 'var(--text-2)',
        borderLeft: isActive && !collapsed ? '2px solid var(--accent)' : '2px solid transparent',
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.classList.contains('font-semibold')) {
          e.currentTarget.style.background = item.danger
            ? 'var(--danger-bg)'
            : 'var(--surface-2)'
          e.currentTarget.style.color = item.danger ? 'var(--danger)' : 'var(--text)'
        }
      }}
      onMouseLeave={e => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
        e.currentTarget.style.background = isActive ? 'var(--accent-soft)' : 'transparent'
        e.currentTarget.style.color = item.danger
          ? 'var(--danger)'
          : isActive
          ? 'var(--accent)'
          : 'var(--text-2)'
      }}
    >
      {({ isActive }) => (
        <>
          {/* Icon tile */}
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn transition-all duration-150"
            style={{
              background: isActive
                ? 'var(--accent)'
                : 'var(--surface-2)',
              color: isActive ? 'var(--on-accent)' : item.danger ? 'var(--danger)' : 'var(--text-muted)',
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            <Icon size={14} aria-hidden="true" strokeWidth={isActive ? 2.5 : 2} />
          </span>

          {/* Label */}
          {!collapsed && (
            <span className="text-[13px] leading-none">{item.label}</span>
          )}

          {/* Tooltip when collapsed */}
          {collapsed && (
            <span className="sidebar-tooltip" role="tooltip">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  )
}

/* ── Section label ────────────────────────────────────────────────── */
function SectionLabel({ children, collapsed }) {
  if (collapsed) {
    return (
      <div
        className="mx-auto my-3 h-px w-7"
        style={{ background: 'var(--border)' }}
      />
    )
  }
  return (
    <p
      className="px-3 pb-1.5 pt-4 text-[10px] font-bold uppercase tracking-widest"
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </p>
  )
}

/* ── Sidebar ──────────────────────────────────────────────────────── */
export default function Sidebar({
  open = false,
  onClose = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
}) {
  const isCollapsed = collapsed && !open

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'var(--overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`sidebar-transition fixed bottom-0 left-0 z-30 flex flex-col lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          top: 'var(--header-height, 64px)',
          width: isCollapsed ? '72px' : '260px',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
        aria-label="Site navigation"
      >
        {/* Mobile close header */}
        <div
          className="flex items-center justify-between px-4 py-3 lg:hidden"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Navigation
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            aria-label="Close navigation"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable nav list */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden py-2 ${
            isCollapsed ? 'px-1' : 'px-2'
          }`}
          aria-label="Main navigation"
        >
          <SectionLabel collapsed={isCollapsed}>Jharkhand Jobs</SectionLabel>
          <div className="space-y-0.5">
            {MENU.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={isCollapsed}
              />
            ))}
          </div>

          <SectionLabel collapsed={isCollapsed}>Notifications</SectionLabel>
          <div className="space-y-0.5">
            {NOTIFICATIONS.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={isCollapsed}
              />
            ))}
          </div>

          <SectionLabel collapsed={isCollapsed}>Account</SectionLabel>
          <div className="space-y-0.5">
            {ACCOUNT.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={isCollapsed}
              />
            ))}
          </div>
        </nav>

        {/* Collapse toggle — desktop only */}
        <div
          className="hidden lg:block p-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex w-full items-center rounded-row px-2.5 py-2 text-[13px] font-medium transition-colors ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={collapsed}
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--surface-2)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            {isCollapsed
              ? <ChevronsRight size={16} aria-hidden="true" />
              : <ChevronsLeft  size={16} aria-hidden="true" />
            }
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
