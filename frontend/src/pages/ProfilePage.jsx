// ---------------------------------------------------------------------------
// ProfilePage — Professional user profile dashboard for Jharkhand JobAlert X
// Shows logged-in user details, stats, account info, and quick links.
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Bookmark,
  Clock,
  Bell,
  Settings,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Star,
  ExternalLink,
  Phone,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

// ─── helpers ────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

// ─── sub-components ─────────────────────────────────────────────────────────

function AvatarBadge({ user, size = 96 }) {
  const initials = getInitials(user?.name || user?.email || 'U')
  const avatarUrl = user?.picture || user?.avatar || null

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name || 'Profile'}
          className="rounded-full object-cover ring-4 ring-teal-500/30"
          style={{ width: size, height: size }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 ring-4 ring-teal-500/30 font-extrabold text-white select-none"
          style={{ width: size, height: size, fontSize: size * 0.33 }}
        >
          {initials}
        </div>
      )}
      {/* Online dot */}
      <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#061e2d] bg-emerald-500" />
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color = 'text-teal-400' }) {
  return (
    <div className="card flex flex-col items-center gap-1 p-4 text-center">
      <Icon size={20} className={color} />
      <p className="text-xl font-extrabold text-ink">{value}</p>
      <p className="text-[11.5px] font-medium text-ink-muted">{label}</p>
    </div>
  )
}

function QuickLink({ icon: Icon, label, to, iconColor = 'text-teal-500' }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface px-4 py-3 transition-all hover:border-teal-500/40 hover:bg-teal-500/5"
    >
      <div className="flex items-center gap-3">
        <span className={`${iconColor} transition-transform group-hover:scale-110`}>
          <Icon size={18} />
        </span>
        <span className="text-[13.5px] font-semibold text-ink-soft group-hover:text-ink">
          {label}
        </span>
      </div>
      <ChevronRight size={15} className="text-ink-faint group-hover:text-teal-400 transition-colors" />
    </Link>
  )
}

function InfoRow({ icon: Icon, label, value, iconColor = 'text-teal-500' }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-hairline last:border-0">
      <Icon size={16} className={`mt-0.5 shrink-0 ${iconColor}`} />
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">{label}</p>
        <p className="text-[13.5px] font-semibold text-ink break-all">{value}</p>
      </div>
    </div>
  )
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // If not logged in, redirect to login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center animate-fade-in px-4">
        <SarkariEmblem size={64} />
        <div>
          <h1 className="text-2xl font-black text-ink mb-2">You're not logged in</h1>
          <p className="text-ink-soft text-[14px] mb-5">
            Please sign in to view your Jharkhand JobAlert X profile.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-2.5 text-[13.5px] font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:brightness-110"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl border border-hairline bg-surface px-6 py-2.5 text-[13.5px] font-semibold text-ink-soft hover:text-ink hover:border-teal-500/40 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  const roleBadge =
    user?.role === 'admin'
      ? { label: 'Admin', color: 'bg-red-500/15 text-red-400 border-red-500/30' }
      : user?.role === 'editor'
      ? { label: 'Editor', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }
      : { label: 'Member', color: 'bg-teal-500/15 text-teal-400 border-teal-500/30' }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <SEOHead
        title={`My Profile — ${user?.name || 'Account'} | Jharkhand JobAlert X`}
        description="Manage your Jharkhand JobAlert X account, view saved jobs, and update your profile."
        canonical="https://jharkhand.jobalertx.com/profile"
        noIndex
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-ink-muted">My Profile</span>
      </nav>

      {/* ── Hero Card ─────────────────────────────────────────────────────── */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <AvatarBadge user={user} size={96} />

          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Name + Role */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-[22px] font-black text-ink leading-tight truncate">
                {user?.name || 'Job Aspirant'}
              </h1>
              <span
                className={`inline-flex items-center gap-1 self-center sm:self-auto rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${roleBadge.color}`}
              >
                <Shield size={10} />
                {roleBadge.label}
              </span>
            </div>

            {/* Email */}
            <p className="flex items-center justify-center sm:justify-start gap-1.5 text-[13px] text-ink-soft mb-3">
              <Mail size={13} className="text-teal-500" />
              {user?.email || 'Not available'}
            </p>

            {/* Location badge */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[12px] text-ink-faint mb-4">
              <MapPin size={12} className="text-orange-400" />
              <span>Jharkhand, India</span>
              <span className="mx-1 text-ink-faint">·</span>
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="text-emerald-400 font-semibold">Active Member</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {(user?.role === 'admin' || user?.role === 'editor') && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-[12.5px] font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-110 transition-all"
                >
                  <Settings size={13} />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-[12.5px] font-bold text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Bookmark}   label="Saved Jobs"      value="0"      color="text-orange-400" />
        <StatCard icon={Clock}      label="Recently Viewed" value="0"     color="text-cyan-400"   />
        <StatCard icon={Bell}       label="Job Alerts"      value="Active" color="text-emerald-400"/>
        <StatCard icon={Star}       label="Member Since"    value={
          user?.createdAt
            ? new Date(user.createdAt).getFullYear()
            : new Date().getFullYear()
        } color="text-amber-400" />
      </div>

      {/* ── Account Details ───────────────────────────────────────────────── */}
      <section className="card p-5 sm:p-6 space-y-1">
        <h2 className="text-[15px] font-bold text-ink mb-3 flex items-center gap-2">
          <User size={16} className="text-teal-500" />
          Account Information
        </h2>
        <InfoRow icon={User}      label="Full Name"     value={user?.name || 'Not set'}     iconColor="text-teal-500" />
        <InfoRow icon={Mail}      label="Email Address" value={user?.email || 'Not set'}   iconColor="text-orange-400" />
        <InfoRow icon={Shield}    label="Account Role"   value={user?.role || 'member'}     iconColor="text-purple-400" />
        <InfoRow icon={Calendar}  label="Joined On"      value={formatDate(user?.createdAt)} iconColor="text-cyan-400" />
        {user?.phone && (
          <InfoRow icon={Phone}   label="Phone"          value={user.phone}                 iconColor="text-green-400" />
        )}
      </section>

      {/* ── Quick Links ───────────────────────────────────────────────────── */}
      <section className="card p-5 sm:p-6 space-y-2">
        <h2 className="text-[15px] font-bold text-ink mb-3 flex items-center gap-2">
          <ExternalLink size={16} className="text-teal-500" />
          Quick Access
        </h2>
        <QuickLink icon={Bookmark} label="Saved Jobs"           to="/bookmarked" iconColor="text-orange-400" />
        <QuickLink icon={Clock}    label="Recently Viewed"      to="/recent"     iconColor="text-cyan-400"   />
        <QuickLink icon={Bell}     label="Feedback & Alerts"    to="/feedback"   iconColor="text-emerald-400"/>
        <QuickLink icon={Settings} label="Account Settings"     to="/settings"   iconColor="text-slate-400"  />
      </section>

      {/* ── Jharkhand JobAlert X Info ─────────────────────────────────────── */}
      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <SarkariEmblem size={36} />
          <div>
            <h2 className="text-[15px] font-bold text-ink">Jharkhand JobAlert X</h2>
            <p className="text-[11.5px] text-ink-muted">Jharkhand's #1 Free Government Job Portal</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-ink-soft">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>Free for all Jharkhand aspirants</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>JPSC, JSSC & Sarkari Naukri alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>Verified from official sources only</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>Daily updates across 24 districts</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="mailto:jobalerx365@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3.5 py-2 text-[12px] font-semibold text-ink-soft hover:text-ink hover:border-teal-500/40 transition-all"
          >
            <Mail size={13} className="text-teal-500" />
            jobalerx365@gmail.com
          </a>
          <a
            href="tel:+918789862771"
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3.5 py-2 text-[12px] font-semibold text-ink-soft hover:text-ink hover:border-teal-500/40 transition-all"
          >
            <Phone size={13} className="text-orange-400" />
            +91 8789862771
          </a>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3.5 py-2 text-[12px] font-semibold text-ink-soft hover:text-ink hover:border-teal-500/40 transition-all"
          >
            <ExternalLink size={13} className="text-cyan-400" />
            About Us
          </Link>
        </div>
      </section>

      {/* ── Logout Confirm Modal ──────────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#061e2d] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 border border-red-500/30">
                <LogOut size={22} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-center text-[17px] font-extrabold text-white mb-1.5">
              Sign Out?
            </h3>
            <p className="text-center text-[13px] text-slate-400 mb-5">
              You will be signed out of your <strong className="text-teal-400">Jharkhand JobAlert X</strong> account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-[13px] font-semibold text-slate-300 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-[13px] font-bold text-white hover:bg-red-600 transition-all"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
