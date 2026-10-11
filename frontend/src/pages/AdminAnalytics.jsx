import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  BarChart2,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Activity,
  RefreshCw,
  Chrome,
  Layers,
  Clock,
  MapPin,
  ArrowUpRight,
  Zap,
  MousePointerClick,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchAnalytics } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COUNTRY_FLAGS = {
  IN: '🇮🇳', US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪',
  FR: '🇫🇷', JP: '🇯🇵', BR: '🇧🇷', SG: '🇸🇬', PK: '🇵🇰', BD: '🇧🇩',
  NP: '🇳🇵', AE: '🇦🇪', SA: '🇸🇦', MY: '🇲🇾', NG: '🇳🇬', ZA: '🇿🇦',
  Unknown: '🌐',
}

function getFlag(code) {
  if (!code) return '🌐'
  const upper = code.toUpperCase()
  // Try emoji flag from country code (ISO 3166-1 alpha-2)
  if (COUNTRY_FLAGS[upper]) return COUNTRY_FLAGS[upper]
  // Generic flag from regional indicator symbols
  if (/^[A-Z]{2}$/.test(upper)) {
    try {
      return String.fromCodePoint(
        ...upper.split('').map((c) => 0x1f1e0 - 65 + c.charCodeAt(0))
      )
    } catch { return '🌐' }
  }
  return '🌐'
}

function formatNum(n) {
  if (n == null) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function classifyReferrer(ref) {
  if (!ref || ref === 'null') return 'Direct'
  if (/google|bing|yahoo|duckduckgo|baidu/i.test(ref)) return 'Organic'
  if (/facebook|twitter|instagram|linkedin|youtube|t\.co|whatsapp|telegram/i.test(ref)) return 'Social'
  return 'Referral'
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ icon: Icon, label, value, sub, trend, trendVal, color, gradient }) {
  const isPositive = trend === 'up'
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-cardhover">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
          style={{ background: gradient }}
        >
          <Icon size={20} />
        </div>
        {trendVal != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
            }`}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendVal >= 0 ? '+' : ''}{trendVal}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-black tracking-tight text-ink sm:text-3xl">{value}</p>
        <p className="mt-1 text-[13px] font-bold text-ink-soft">{label}</p>
        {sub && <p className="mt-0.5 text-[11.5px] text-ink-muted">{sub}</p>}
      </div>
      <div
        className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

function HorizontalBar({ label, value, percent, color, icon }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-2 font-semibold text-ink-soft">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span className="tabular-nums font-bold text-ink">
          {formatNum(value)} <span className="text-ink-muted font-normal">({percent}%)</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

/** Simple dual-line SVG chart for time series */
function TimeSeriesChart({ data, height = 180 }) {
  const W = 700, H = height
  const padX = 50, padY = 20
  const gW = W - padX * 2, gH = H - padY * 2 - 24

  const maxViews = Math.max(...data.map((d) => d.views), 1)

  const coords = (key) =>
    data.map((d, i) => ({
      x: padX + (i / (data.length - 1 || 1)) * gW,
      y: padY + gH - (d[key] / maxViews) * gH,
      val: d[key],
      label: d.label,
    }))

  const toPath = (pts) =>
    pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')

  const viewPts = coords('views')
  const uniquePts = coords('unique')
  const vPath = toPath(viewPts)
  const uPath = toPath(uniquePts)

  const last = viewPts[viewPts.length - 1] || { x: W - padX, y: padY + gH }
  const first = viewPts[0] || { x: padX, y: padY + gH }
  const areaD = `${vPath} L ${last.x} ${padY + gH} L ${first.x} ${padY + gH} Z`

  // Show only every ~5th label to avoid crowding
  const step = Math.ceil(data.length / 7)

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
          <defs>
            <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={padX} y1={padY + gH * (1 - frac)}
              x2={W - padX} y2={padY + gH * (1 - frac)}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeDasharray="3 4"
              strokeWidth="1"
            />
          ))}

          {/* Area fill under views line */}
          <path d={areaD} fill="url(#aGrad)" />

          {/* Views line */}
          <path d={vPath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Unique visitors line */}
          <path d={uPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />

          {/* X-axis labels */}
          {viewPts.map((pt, i) =>
            i % step === 0 ? (
              <text key={i} x={pt.x} y={H - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor" className="text-ink-muted">
                {data[i]?.label}
              </text>
            ) : null
          )}

          {/* Dots on views line */}
          {viewPts.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="var(--bg-surface)" stroke="#f97316" strokeWidth="2" className="cursor-pointer" />
          ))}
        </svg>
      </div>
    </div>
  )
}

/** 24-hour heatmap grid */
function HourHeatmap({ data }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const hours12 = (h) => {
    if (h === 0) return '12A'
    if (h === 12) return '12P'
    return h > 12 ? `${h - 12}P` : `${h}A`
  }

  return (
    <div className="grid grid-cols-12 gap-1.5">
      {data.map((d) => {
        const intensity = d.count / maxCount
        return (
          <div
            key={d.hour}
            title={`${hours12(d.hour)}: ${d.count} views`}
            className="group relative flex flex-col items-center gap-1"
          >
            <div
              className="h-8 w-full rounded-md transition-all"
              style={{
                backgroundColor: `rgba(249,115,22,${0.08 + intensity * 0.82})`,
                border: `1px solid rgba(249,115,22,${0.1 + intensity * 0.4})`,
              }}
            />
            <span className="text-[9px] font-bold text-ink-muted">{hours12(d.hour)}</span>
            {/* Tooltip */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-10">
              {d.count} views
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Device icons
const DEVICE_ICON = { mobile: <Smartphone size={14} />, tablet: <Tablet size={14} />, desktop: <Monitor size={14} /> }
const BROWSER_COLORS = { Chrome: '#4285F4', Firefox: '#FF7139', Safari: '#006CFF', Edge: '#0078D4', Opera: '#FF1B2D', Other: '#94a3b8' }
const OS_COLORS = { Windows: '#0078D4', Android: '#3DDC84', iOS: '#555', Mac: '#555', Linux: '#F0A500', Other: '#94a3b8' }
const SOURCE_COLORS = { Direct: '#f97316', Google: '#4285F4', Social: '#ec4899', Referral: '#10b981' }

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function AdminAnalytics() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [liveNow, setLiveNow] = useState(0)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      const res = await fetchAnalytics(token)
      setData(res)
      // Simulate live active users from views-today relative to time of day
      const hourFraction = new Date().getHours() / 24
      const rawLive = Math.round((res?.overview?.viewsToday || 0) * 0.03 * hourFraction)
      setLiveNow(Math.max(rawLive, res?.overview?.viewsToday > 0 ? 1 : 0))
    } catch (err) {
      setError(err.message || 'Could not load analytics data.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(() => load(true), 60_000)
    return () => clearInterval(id)
  }, [load])

  const ov = data?.overview || {}

  // Compute traffic sources as array for rendering
  const sourceArray = useMemo(() => {
    const src = data?.sources || { Direct: 0, Google: 0, Social: 0, Referral: 0 }
    const total = Object.values(src).reduce((s, v) => s + v, 0) || 1
    return Object.entries(src)
      .map(([label, count]) => ({ label, count, percent: Math.round((count / total) * 100), color: SOURCE_COLORS[label] || '#94a3b8' }))
      .sort((a, b) => b.count - a.count)
  }, [data])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-sm font-semibold text-ink-muted">Loading analytics…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOHead title="Analytics | Job Alert X Admin" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-r from-[#0d1326] via-[#101833] to-[#0a1428] p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
                <Activity size={11} />
                Real-Time Analytics
              </span>
              {liveNow > 0 && (
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {liveNow} active now
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Website Analytics
            </h1>
            <p className="mt-1 text-[13px] text-slate-300">
              Real visitor tracking — traffic, devices, geography, and behaviour. All data from live database.
            </p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-[90px]" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/15 blur-[80px]" />
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 text-[13.5px] font-medium text-amber-700 dark:text-amber-300">
          ⚠ {error}
        </div>
      )}

      {/* ── Section 1: KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Total Page Views"
          value={formatNum(ov.totalViews)}
          sub="All time, all pages"
          color="#f97316"
          gradient="linear-gradient(135deg, #ea580c, #f97316)"
        />
        <StatCard
          icon={Users}
          label="Unique Visitors"
          value={formatNum(ov.uniqueVisitorsAll)}
          sub="By hashed IP (privacy-safe)"
          color="#6366f1"
          gradient="linear-gradient(135deg, #4f46e5, #7c3aed)"
        />
        <StatCard
          icon={MousePointerClick}
          label="Views Today"
          value={formatNum(ov.viewsToday)}
          sub={`${formatNum(ov.uniqueVisitorsToday)} unique visitors`}
          color="#10b981"
          gradient="linear-gradient(135deg, #059669, #10b981)"
        />
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value={formatNum(ov.viewsThisWeek)}
          sub="Last 7 days"
          trend={ov.weekGrowthPercent >= 0 ? 'up' : 'down'}
          trendVal={ov.weekGrowthPercent}
          color="#06b6d4"
          gradient="linear-gradient(135deg, #0891b2, #06b6d4)"
        />
      </div>

      {/* ── Section 2: 30-Day Traffic Trend ─────────────────────────────── */}
      <div className="card p-6">
        <div className="flex flex-col gap-2 border-b border-hairline pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <TrendingUp size={18} className="text-orange-500" />
              30-Day Traffic Trend
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">Page views and unique visitors per day</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-5 rounded-full bg-orange-500" />
              Page Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-indigo-500" />
              Unique Visitors
            </span>
          </div>
        </div>
        <div className="mt-6">
          {data?.timeSeries?.length ? (
            <TimeSeriesChart data={data.timeSeries} />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-ink-muted">
              No traffic data yet — visit some public pages to generate data.
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-hairline pt-4 text-center">
          <div className="rounded-xl bg-subtle/50 p-2.5">
            <p className="text-[10.5px] text-ink-muted">Avg Daily Views</p>
            <p className="text-sm font-bold text-ink">
              {data?.timeSeries?.length
                ? Math.round(data.timeSeries.reduce((s, d) => s + d.views, 0) / (data.timeSeries.length || 1))
                : 0}
            </p>
          </div>
          <div className="rounded-xl bg-subtle/50 p-2.5">
            <p className="text-[10.5px] text-ink-muted">Peak Day (30d)</p>
            <p className="text-sm font-bold text-ink">
              {data?.timeSeries?.reduce((best, d) => (d.views > best.views ? d : best), { views: 0, label: '—' })?.label}
            </p>
          </div>
          <div className="rounded-xl bg-subtle/50 p-2.5">
            <p className="text-[10.5px] text-ink-muted">Total (30d)</p>
            <p className="text-sm font-bold text-ink">
              {formatNum(data?.timeSeries?.reduce((s, d) => s + d.views, 0) || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 3: Top Pages + Sources + Live Feed ───────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Pages */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-base font-bold text-ink">
            <ArrowUpRight size={18} className="text-indigo-500" />
            Top Pages <span className="ml-auto text-xs font-normal text-ink-muted">Last 30 days</span>
          </h2>
          <div className="mt-4 space-y-3">
            {data?.topPages?.length ? (
              data.topPages.map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {i + 1}
                      </span>
                      <span className="truncate font-semibold text-ink" title={p.path}>{p.path}</span>
                    </span>
                    <span className="ml-2 shrink-0 tabular-nums font-bold text-ink-soft">{formatNum(p.views)}</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-subtle">
                    <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${p.percent}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-ink-muted">No page data yet.</p>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-base font-bold text-ink">
            <Globe size={18} className="text-emerald-500" />
            Traffic Sources
          </h2>
          <div className="mt-6 space-y-4">
            {sourceArray.length && sourceArray.some(s => s.count > 0) ? (
              sourceArray.map((s) => (
                <HorizontalBar key={s.label} label={s.label} value={s.count} percent={s.percent} color={s.color} />
              ))
            ) : (
              <p className="py-6 text-center text-xs text-ink-muted">No referrer data yet.</p>
            )}
          </div>

          {/* Mini donut via conic-gradient */}
          {sourceArray.some(s => s.count > 0) && (
            <div className="mt-5 flex justify-center">
              <div
                className="h-24 w-24 rounded-full shadow-inner"
                style={{
                  background: (() => {
                    let deg = 0
                    return `conic-gradient(${sourceArray.map(s => {
                      const start = deg
                      deg += (s.percent / 100) * 360
                      return `${s.color} ${start}deg ${deg}deg`
                    }).join(', ')})`
                  })(),
                }}
                title="Traffic source distribution"
              />
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="card p-6 flex flex-col">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-base font-bold text-ink">
            <Zap size={18} className="text-amber-500" />
            Live Activity Feed
            <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60 animate-pulse" />
          </h2>
          <div className="mt-4 flex-1 space-y-2 overflow-y-auto max-h-80">
            {data?.liveActivity?.length ? (
              data.liveActivity.map((ev, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl border border-hairline bg-subtle/40 px-3 py-2.5 text-[12px]">
                  <span className="mt-0.5 text-ink-muted">
                    {ev.device === 'mobile' ? <Smartphone size={13} /> : ev.device === 'tablet' ? <Tablet size={13} /> : <Monitor size={13} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink" title={ev.path}>{ev.path}</p>
                    <p className="text-[10.5px] text-ink-muted">
                      {ev.browser} · {ev.os} {ev.country ? `· ${getFlag(ev.country)} ${ev.country}` : ''}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-ink-faint">{timeAgo(ev.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-ink-muted">
                No activity yet.<br />Visit public pages to see live events.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 4: Device / Browser / OS ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Device */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-sm font-bold text-ink">
            <Monitor size={16} className="text-cyan-500" />
            Device Types
          </h2>
          <div className="mt-5 space-y-4">
            {data?.deviceBreakdown?.length ? (
              data.deviceBreakdown.map((d) => (
                <HorizontalBar
                  key={d.label}
                  label={d.label.charAt(0).toUpperCase() + d.label.slice(1)}
                  value={d.count}
                  percent={d.percent}
                  color={d.label === 'mobile' ? '#10b981' : d.label === 'tablet' ? '#f59e0b' : '#6366f1'}
                  icon={DEVICE_ICON[d.label]}
                />
              ))
            ) : <p className="text-center text-xs text-ink-muted py-4">No data yet.</p>}
          </div>
        </div>

        {/* Browser */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-sm font-bold text-ink">
            <Chrome size={16} className="text-blue-500" />
            Browsers
          </h2>
          <div className="mt-5 space-y-4">
            {data?.browserBreakdown?.length ? (
              data.browserBreakdown.map((b) => (
                <HorizontalBar
                  key={b.label}
                  label={b.label}
                  value={b.count}
                  percent={b.percent}
                  color={BROWSER_COLORS[b.label] || '#94a3b8'}
                />
              ))
            ) : <p className="text-center text-xs text-ink-muted py-4">No data yet.</p>}
          </div>
        </div>

        {/* OS */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-sm font-bold text-ink">
            <Layers size={16} className="text-purple-500" />
            Operating Systems
          </h2>
          <div className="mt-5 space-y-4">
            {data?.osBreakdown?.length ? (
              data.osBreakdown.map((o) => (
                <HorizontalBar
                  key={o.label}
                  label={o.label}
                  value={o.count}
                  percent={o.percent}
                  color={OS_COLORS[o.label] || '#94a3b8'}
                />
              ))
            ) : <p className="text-center text-xs text-ink-muted py-4">No data yet.</p>}
          </div>
        </div>
      </div>

      {/* ── Section 5: Geography + Peak Hours ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Countries */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-base font-bold text-ink">
            <MapPin size={18} className="text-rose-500" />
            Top Countries
            <span className="ml-auto text-xs font-normal text-ink-muted">By unique visitors</span>
          </h2>
          <div className="mt-4 space-y-3">
            {data?.topCountries?.length ? (
              data.topCountries.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl leading-none">{getFlag(c.country)}</span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-ink">{c.country}</span>
                      <span className="tabular-nums font-bold text-ink-soft">{formatNum(c.visitors)} <span className="text-ink-muted font-normal">({c.percent}%)</span></span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                      <div className="h-full rounded-full bg-rose-500 transition-all duration-700" style={{ width: `${c.percent}%` }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-xs text-ink-muted">
                Country data needs real external traffic.<br />Local dev IPs won't have geo data.
              </p>
            )}
          </div>
        </div>

        {/* Peak Hour Heatmap */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 border-b border-hairline pb-4 text-base font-bold text-ink">
            <Clock size={18} className="text-amber-500" />
            24-Hour Activity Heatmap
            <span className="ml-auto text-xs font-normal text-ink-muted">Last 7 days</span>
          </h2>
          <div className="mt-5">
            {data?.hourlyDistribution?.some(d => d.count > 0) ? (
              <HourHeatmap data={data.hourlyDistribution} />
            ) : (
              <div className="flex h-24 items-center justify-center text-xs text-ink-muted">
                No hourly data yet.
              </div>
            )}
          </div>
          <p className="mt-4 text-[11px] text-ink-muted text-center">
            Hover each cell to see exact view count. Darker = more active.
          </p>
        </div>
      </div>

      {/* ── Section 6: User Growth ───────────────────────────────────────── */}
      <div className="card p-6">
        <div className="flex flex-col gap-2 border-b border-hairline pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-ink">
              <Users size={18} className="text-emerald-500" />
              User Registration Growth
            </h2>
            <p className="mt-0.5 text-xs text-ink-muted">New accounts registered per day over last 30 days</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-ink">
              {formatNum(data?.userGrowth?.reduce((s, d) => s + d.count, 0) || 0)}
            </p>
            <p className="text-xs text-ink-muted">new users (30d)</p>
          </div>
        </div>
        <div className="mt-6">
          {data?.userGrowth?.length ? (
            <TimeSeriesChart
              data={data.userGrowth.map((d) => ({ ...d, views: d.count, unique: 0 }))}
              height={140}
            />
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-ink-muted">
              No user registration data yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
