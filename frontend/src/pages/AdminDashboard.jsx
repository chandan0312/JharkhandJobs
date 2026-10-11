import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Briefcase,
  Ticket,
  Award,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  Pencil,
  Trash2,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchDashboard, deleteJob } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'

const KIND_LABELS = {
  job: 'Latest Jobs',
  'admit-card': 'Admit Cards',
  result: 'Results',
  'answer-key': 'Answer Keys',
  syllabus: 'Syllabus',
}

function StatCard({ icon: Icon, label, value, subtext, trend, color, bgGradient }) {
  return (
    <div className="card relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cardhover">
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md text-white"
          style={{ background: bgGradient || `linear-gradient(135deg, ${color}cc, ${color})` }}
        >
          <Icon size={22} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">{value}</h3>
        <p className="mt-1 text-[13px] font-bold text-ink-soft">{label}</p>
        {subtext && <p className="mt-0.5 text-[11.5px] text-ink-muted">{subtext}</p>}
      </div>
      {/* Decorative ambient color dot */}
      <div
        className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

export default function AdminDashboard() {
  const { token, user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      const res = await fetchDashboard(token)
      setData(res)
    } catch (err) {
      console.error('Failed to load admin dashboard:', err)
      setError(err.message || 'Could not load dashboard data. Please check your connection.')
      setData(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      await deleteJob(token, id)
      setToast('Post deleted successfully.')
      setTimeout(() => setToast(''), 3000)
      loadData(true)
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Server error'))
    }
  }

  // Derive dynamic stats from real data
  const chartData = useMemo(() => {
    const points = data?.postsPerDay || [
      { label: 'Mon', count: 0 },
      { label: 'Tue', count: 0 },
      { label: 'Wed', count: 0 },
      { label: 'Thu', count: 0 },
      { label: 'Fri', count: 0 },
      { label: 'Sat', count: 0 },
      { label: 'Sun', count: 0 },
    ]

    const counts = points.map((p) => p.count)
    const max = Math.max(...counts, 4) // minimum scale of 4 for nice rendering

    const width = 500
    const height = 150
    const paddingX = 40
    const paddingY = 25
    const graphW = width - paddingX * 2
    const graphH = height - paddingY * 2

    const coords = points.map((p, idx) => {
      const x = paddingX + (idx / (points.length - 1 || 1)) * graphW
      const y = height - paddingY - (p.count / max) * graphH
      return { x, y, count: p.count, label: p.label }
    })

    const pathD = coords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
    }, '')

    const first = coords[0] || { x: paddingX, y: height - paddingY }
    const last = coords[coords.length - 1] || { x: width - paddingX, y: height - paddingY }
    const areaD = `${pathD} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`

    // Find peak activity day
    let peak = { label: '—', count: 0 }
    for (const pt of points) {
      if (pt.count > peak.count) peak = pt
    }

    return { coords, pathD, areaD, points, max, peak }
  }, [data])

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOHead title="Admin Dashboard | Job Alert X" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-r from-[#061e2d] via-[#09324A] to-[#041622] p-6 shadow-xl text-white backdrop-blur-xl sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1 rounded-full border border-teal-400/30 bg-teal-500/20 px-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#AED0C9]">
                <Sparkles size={12} />
                Jharkhand JobAlert X Control Center
              </span>
              <span className="text-[12px] text-teal-200/80">• Live MySQL Database</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              Jharkhand JobAlert X — Admin Dashboard
            </h1>
            <p className="mt-1 text-[13.5px] text-teal-100/90">
              Welcome back, {user?.name || 'Administrator'}. Manage JPSC, JSSC, Rojgar Mela, and private job notifications across Jharkhand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : 'Sync Data'}
            </button>

            <Link
              to="/admin/posts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 via-teal-600 to-navy-900 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 border border-teal-400/30"
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Post
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gold-400/15 blur-[100px]" />
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-[13.5px] font-medium text-emerald-600 dark:text-emerald-300 animate-fade-in shadow-sm">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 text-[13.5px] font-medium text-amber-700 dark:text-amber-300 animate-fade-in">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Top 4 Key Metric Stat Cards — Powered by Real Database Totals */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total Published Posts"
          value={data?.total ?? 0}
          subtext={`${data?.recentCount ?? 0} posted this week`}
          trend={data?.recentCount ? `+${data.recentCount} new` : null}
          color="#6d70f0"
          bgGradient="linear-gradient(135deg, #4f46e5, #7c3aed)"
        />
        <StatCard
          icon={Eye}
          label="Total Post Views"
          value={(data?.totalViews ?? 0).toLocaleString('en-IN')}
          subtext="Cumulative post impressions"
          color="#06b6d4"
          bgGradient="linear-gradient(135deg, #0891b2, #06b6d4)"
        />
        <StatCard
          icon={Users}
          label="Registered Candidates"
          value={(data?.totalUsers ?? 0).toLocaleString('en-IN')}
          subtext="Active accounts in database"
          color="#10b981"
          bgGradient="linear-gradient(135deg, #059669, #10b981)"
        />
        <StatCard
          icon={MessageSquare}
          label="User Feedback"
          value={data?.feedbackStats?.total ?? 0}
          subtext={`${data?.feedbackStats?.new ?? 0} unread submissions`}
          color="#f97316"
          bgGradient="linear-gradient(135deg, #ea580c, #f97316)"
        />
      </div>

      {/* Analytics Breakdown & Visual Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Activity Trend Line/Area Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-4">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Activity size={18} className="text-orange-500" />
                7-Day Notification Publishing Velocity
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">Real-time daily post creation frequency from database</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Daily Posts
              </span>
            </div>
          </div>

          {/* SVG Sparkline Area Chart */}
          <div className="mt-6 w-full overflow-x-auto">
            <div className="min-w-[480px] px-2 py-4">
              <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#f97316" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="20" y1="60" x2="480" y2="60" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="20" y1="100" x2="480" y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />

                {/* Area Fill */}
                <path d={chartData.areaD} fill="url(#chartGradient)" />

                {/* Line Path */}
                <path d={chartData.pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3.5" strokeLinecap="round" />

                {/* Data Points */}
                {chartData.coords.map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="var(--bg-surface)"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      className="transition-all group-hover:r-6"
                    />
                    {/* Tooltip on hover */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fill="#f97316"
                      fontSize="10"
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {pt.count} posts
                    </text>
                    {/* X-axis label */}
                    <text
                      x={pt.x}
                      y="142"
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-ink-muted"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Quick Metrics Bar underneath chart */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-hairline pt-4 text-center">
            <div className="rounded-xl bg-subtle/50 p-2.5">
              <p className="text-[11px] text-ink-muted">Peak Activity Day</p>
              <p className="text-sm font-bold text-ink">
                {chartData.peak.count > 0 ? `${chartData.peak.label} (${chartData.peak.count} posts)` : 'No posts yet'}
              </p>
            </div>
            <div className="rounded-xl bg-subtle/50 p-2.5">
              <p className="text-[11px] text-ink-muted">Weekly Total Posts</p>
              <p className="text-sm font-bold text-ink">{data?.recentCount ?? 0} published</p>
            </div>
            <div className="rounded-xl bg-subtle/50 p-2.5">
              <p className="text-[11px] text-ink-muted">Database Status</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Connected</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Posts by Kind Distribution */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-ink flex items-center gap-2 border-b border-hairline pb-4">
              <Layers size={18} className="text-indigo-500" />
              Content by Classification
            </h2>

            <div className="mt-5 space-y-4">
              {[
                { kind: 'job', label: 'Latest Jobs', count: data?.byKind?.job ?? 0, icon: Briefcase, color: '#10b981' },
                { kind: 'admit-card', label: 'Admit Cards', count: data?.byKind?.['admit-card'] ?? 0, icon: Ticket, color: '#f43f5e' },
                { kind: 'result', label: 'Results', count: data?.byKind?.result ?? 0, icon: Award, color: '#f59e0b' },
                { kind: 'answer-key', label: 'Answer Keys', count: data?.byKind?.['answer-key'] ?? 0, icon: FileText, color: '#06b6d4' },
                { kind: 'syllabus', label: 'Syllabus', count: data?.byKind?.syllabus ?? 0, icon: Layers, color: '#ec4899' },
              ].map((item) => {
                const total = data?.total || 0
                const percent = total > 0 ? Math.round((item.count / total) * 100) : 0
                const Icon = item.icon
                return (
                  <div key={item.kind} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-ink-soft">
                        <Icon size={14} style={{ color: item.color }} />
                        {item.label}
                      </span>
                      <span className="text-ink-muted tabular-nums font-bold">
                        {item.count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-subtle">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-hairline">
            <Link
              to="/admin/posts"
              className="flex items-center justify-between text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
            >
              <span>Manage all postings</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Category Breakdown + Recent Posts Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Job Categories distribution */}
        <div className="card p-6">
          <h2 className="text-base font-bold text-ink flex items-center justify-between border-b border-hairline pb-4">
            <span className="flex items-center gap-2">
              <Globe size={18} className="text-cyan-500" />
              Category Coverage
            </span>
            <span className="text-xs text-ink-muted">Live Facets</span>
          </h2>

          <div className="mt-5 space-y-3">
            {data?.byCategory?.length ? (
              data.byCategory.map((cat) => (
                <div
                  key={cat.slug}
                  className="flex items-center justify-between rounded-xl border border-hairline bg-subtle/40 px-3.5 py-2.5 transition-colors hover:bg-subtle"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ backgroundColor: `${cat.color || '#5558e6'}22`, color: cat.color || '#5558e6' }}
                    >
                      {cat.name?.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="truncate">
                      <p className="truncate text-xs font-bold text-ink">{cat.name}</p>
                      <p className="truncate text-[10.5px] text-ink-muted">{cat.fullName || cat.name}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-surface border border-hairline px-2 py-1 text-[11px] font-bold text-ink-soft shadow-xs">
                    {cat.count || 0} posts
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-ink-muted">
                No category data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts Table with quick action controls */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <Clock size={18} className="text-orange-500" />
              Recent Notifications
            </h2>
            <Link
              to="/admin/posts"
              className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-subtle hover:text-ink transition-colors shadow-xs"
            >
              <span>Manage All ({data?.total || 0})</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-hairline bg-subtle/50 text-[11.5px] font-bold uppercase tracking-wider text-ink-muted">
                  <th className="py-3 pl-3">Notification Title</th>
                  <th className="py-3 px-3">Classification</th>
                  <th className="py-3 px-3">Views</th>
                  <th className="py-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {data?.recentPosts?.length ? (
                  data.recentPosts.slice(0, 6).map((post, idx) => {
                    const title = post.title || 'Untitled Notification'
                    const id = post.id || `post-${idx}`
                    const kind = post.kind || 'job'
                    const views = post.views || 0

                    return (
                      <tr key={id} className="group transition-colors hover:bg-subtle/50">
                        <td className="py-3.5 pl-3 max-w-[260px]">
                          <p className="truncate font-bold text-ink group-hover:text-brand-600 transition-colors">
                            {title}
                          </p>
                          <p className="truncate text-[11px] text-ink-muted">{post.org || 'Official Dept'}</p>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-md border border-hairline bg-surface px-2 py-0.5 text-[10.5px] font-bold text-ink-soft">
                            {KIND_LABELS[kind] || kind}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap font-semibold text-ink-soft tabular-nums">
                          {views.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 pr-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/job/${id}`}
                              target="_blank"
                              className="rounded-lg p-1.5 text-ink-muted hover:bg-subtle hover:text-ink transition-colors"
                              title="View on site"
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <Link
                              to={`/admin/posts/${id}`}
                              className="rounded-lg p-1.5 text-ink-muted hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-600/20 dark:hover:text-brand-300 transition-colors"
                              title="Edit notification"
                            >
                              <Pencil size={14} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(id, title)}
                              className="rounded-lg p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-ink-muted">
                      No recent notifications found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
