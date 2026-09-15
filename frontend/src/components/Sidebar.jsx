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
} from 'lucide-react'

const MENU = [
  { to: '/', label: 'Discover', icon: Home, end: true, color: '#1B6F81' },
  { to: '/latest/job', label: 'Latest Jobs', icon: Briefcase, color: '#FFFB08' },
  { to: '/category/jpsc', label: 'JPSC', icon: ClipboardList, color: '#AED0C9' },
  { to: '/category/jssc', label: 'JSSC', icon: Award, color: '#4ade80' },
  { to: '/category/other-jharkhand', label: 'Other Jharkhand Job', icon: MapPin, color: '#38bdf8' },
  { to: '/category/rojgar-mela', label: 'Rojgar Mela', icon: Users, color: '#f97316' },
  { to: '/category/private-job', label: 'Private Job', icon: Building2, color: '#a78bfa' },
  { to: '/category/central-job', label: 'Central Job', icon: Briefcase, color: '#c084fc' },
]

const LATEST = [
  { to: '/latest/admit-card', label: 'Admit Cards', icon: Ticket, color: '#f43f5e' },
  { to: '/latest/result', label: 'Results', icon: Award, color: '#f59e0b' },
  { to: '/latest/answer-key', label: 'Answer Keys', icon: KeyRound, color: '#06b6d4' },
  { to: '/latest/syllabus', label: 'Syllabus', icon: BookOpen, color: '#ec4899' },
]

const ACCOUNT = [
  { to: '/profile', label: 'Profile', icon: User, color: '#60a5fa' },
  { to: '/feedback', label: 'Feedback', icon: MessageSquarePlus, color: '#FFFB08' },
  { to: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
  { to: '/logout', label: 'Logout', icon: LogOut, color: '#ef4444' },
]

function NavItem({ item, onNavigate, collapsed }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group relative flex items-center rounded-xl transition-all duration-200',
          collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
          isActive
            ? 'bg-gradient-to-r from-[#1B6F81]/40 to-[#09324A]/40 text-white font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-gradient-to-b before:from-[#FFFB08] before:to-[#AED0C9] before:shadow-[0_0_8px_#FFFB08]'
            : 'text-[#AED0C9] hover:bg-[#1B6F81]/10 hover:text-white',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Colorful icon on dark glass tile */}
          <span
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-br from-[#1B6F81] to-[#09324A] text-white shadow-md shadow-teal-500/30 ring-2 ring-[#AED0C9]/30'
                : 'bg-white/[0.05] border border-[#1B6F81]/20 group-hover:bg-[#1B6F81]/20'
            }`}
          >
            <Icon
              size={15}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ color: isActive ? '#FFFB08' : item.color }}
            />
          </span>

          {!collapsed && (
            <span className="text-[13px] font-semibold leading-none">{item.label}</span>
          )}

          {/* Tooltip when collapsed */}
          {collapsed && (
            <span className="sidebar-tooltip z-50">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  )
}

function SectionLabel({ children, collapsed }) {
  if (collapsed) return <div className="mx-auto my-2.5 h-px w-6 bg-[#1B6F81]/30" />
  return <p className="px-3 pb-1.5 pt-4 font-bold tracking-wider text-[11px] uppercase text-[#AED0C9]/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.30)]">{children}</p>
}

export default function Sidebar({
  open = false,
  onClose = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-[#09324A]/80 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Left Sidebar Menu (below the fixed top header) */}
      <aside
        className={`sidebar-transition fixed top-[72px] bottom-0 left-0 z-30 flex flex-col shadow-xl transition-all duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#1B6F81]/20 bg-[#061e2d]`}
        style={{ width: open ? '260px' : collapsed ? '72px' : '260px' }}
      >
        {/* Mobile close header */}
        <div className="flex items-center justify-between border-b border-[#1B6F81]/20 px-4 py-3 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AED0C9] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            Navigation
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors text-[#AED0C9] hover:bg-[#1B6F81]/20 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable nav list */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden py-2 ${
            collapsed && !open ? 'px-2' : 'px-3'
          }`}
        >
          <SectionLabel collapsed={collapsed && !open}>Jharkhand Jobs</SectionLabel>
          <div className="space-y-1">
            {MENU.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={collapsed && !open}
              />
            ))}
          </div>

          <SectionLabel collapsed={collapsed && !open}>Notifications</SectionLabel>
          <div className="space-y-1">
            {LATEST.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={collapsed && !open}
              />
            ))}
          </div>

          <SectionLabel collapsed={collapsed && !open}>Account</SectionLabel>
          <div className="space-y-1">
            {ACCOUNT.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={collapsed && !open}
              />
            ))}
          </div>
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden border-t border-[#1B6F81]/20 p-2.5 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex w-full items-center rounded-xl px-2.5 py-2 transition-colors text-[#AED0C9] hover:bg-[#1B6F81]/10 hover:text-white ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && (
              <span className="text-[13px] font-medium text-[#AED0C9] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Collapse Menu</span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
