// ---------------------------------------------------------------------------
// Analytics controller — aggregated website analytics for admin dashboard.
// ---------------------------------------------------------------------------

import { PageView, User } from '../models/index.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { Op, fn, col, literal } from 'sequelize'
import { env } from '../config/env.js'

const seq = () => PageView.sequelize

/** Dialect-aware date trunc to day: returns a Sequelize fn node. */
function fnDate(colName) {
  if (env.db.dialect === 'sqlite') {
    return literal(`strftime('%Y-%m-%d', \`${colName}\`)`)
  }
  return fn('DATE', col(colName))
}

/** Dialect-aware hour extraction. */
function fnHour(colName) {
  if (env.db.dialect === 'sqlite') {
    return literal(`CAST(strftime('%H', \`${colName}\`) AS INTEGER)`)
  }
  return fn('HOUR', col(colName))
}

/**
 * Helper: build an array of {date, label} for the last N days.
 */
function lastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    days.push({ date: dateStr, label })
  }
  return days
}

/**
 * GET /api/admin/analytics
 *
 * Returns a single JSON object with all analytics data needed by the
 * AdminAnalytics dashboard page.
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const s = seq()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // ── 1. Overview Totals ──────────────────────────────────────────────────
  const [totalViews, viewsToday, uniqueVisitorsAll, uniqueVisitorsToday] = await Promise.all([
    PageView.count(),
    PageView.count({ where: { createdAt: { [Op.gte]: todayStart } } }),
    PageView.count({ distinct: true, col: 'ipHash' }),
    PageView.count({
      distinct: true,
      col: 'ipHash',
      where: { createdAt: { [Op.gte]: todayStart } },
    }),
  ])

  // ── 2. 30-Day Time Series (views + unique visitors per day) ─────────────
  const [dailyViews, dailyUnique] = await Promise.all([
    PageView.findAll({
      attributes: [
        [fnDate('createdAt'), 'day'],
        [fn('COUNT', col('id')), 'views'],
      ],
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      group: [fnDate('createdAt')],
      raw: true,
    }),
    PageView.findAll({
      attributes: [
        [fnDate('createdAt'), 'day'],
        [fn('COUNT', fn('DISTINCT', col('ipHash'))), 'unique'],
      ],
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      group: [fnDate('createdAt')],
      raw: true,
    }),
  ])

  const days30 = lastNDays(30)
  const viewsByDay = Object.fromEntries(dailyViews.map((r) => [String(r.day), Number(r.views)]))
  const uniqueByDay = Object.fromEntries(dailyUnique.map((r) => [String(r.day), Number(r.unique)]))

  const timeSeries = days30.map(({ date, label }) => ({
    date,
    label,
    views: viewsByDay[date] || 0,
    unique: uniqueByDay[date] || 0,
  }))

  // ── 3. Top Pages ─────────────────────────────────────────────────────────
  const topPagesRaw = await PageView.findAll({
    attributes: ['path', [fn('COUNT', col('id')), 'views']],
    where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
    group: ['path'],
    order: [[literal('views'), 'DESC']],
    limit: 10,
    raw: true,
  })
  const totalViews30 = topPagesRaw.reduce((s, r) => s + Number(r.views), 0) || 1
  const topPages = topPagesRaw.map((r) => ({
    path: r.path,
    views: Number(r.views),
    percent: Math.round((Number(r.views) / totalViews30) * 100),
  }))

  // ── 4. Traffic Sources (referrer breakdown) ──────────────────────────────
  const referrerRows = await PageView.findAll({
    attributes: ['referrer', [fn('COUNT', col('id')), 'count']],
    where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
    group: ['referrer'],
    raw: true,
  })

  const sources = { Direct: 0, Google: 0, Social: 0, Referral: 0 }
  for (const row of referrerRows) {
    const ref = (row.referrer || '').toLowerCase()
    const count = Number(row.count)
    if (!ref || ref === 'null' || ref === '') sources.Direct += count
    else if (/google|bing|yahoo|duckduckgo|baidu/i.test(ref)) sources.Google += count
    else if (/facebook|twitter|instagram|linkedin|youtube|t\.co|whatsapp|telegram/i.test(ref))
      sources.Social += count
    else sources.Referral += count
  }

  // ── 5. Device / Browser / OS Breakdown ──────────────────────────────────
  const [deviceRows, browserRows, osRows] = await Promise.all([
    PageView.findAll({
      attributes: ['device', [fn('COUNT', col('id')), 'count']],
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      group: ['device'],
      raw: true,
    }),
    PageView.findAll({
      attributes: ['browser', [fn('COUNT', col('id')), 'count']],
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      group: ['browser'],
      raw: true,
    }),
    PageView.findAll({
      attributes: ['os', [fn('COUNT', col('id')), 'count']],
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      group: ['os'],
      raw: true,
    }),
  ])

  const toBreakdown = (rows, key) => {
    const total = rows.reduce((s, r) => s + Number(r.count), 0) || 1
    return rows
      .map((r) => ({ label: r[key] || 'Unknown', count: Number(r.count), percent: Math.round((Number(r.count) / total) * 100) }))
      .sort((a, b) => b.count - a.count)
  }

  const deviceBreakdown = toBreakdown(deviceRows, 'device')
  const browserBreakdown = toBreakdown(browserRows, 'browser')
  const osBreakdown = toBreakdown(osRows, 'os')

  // ── 6. Top Countries ─────────────────────────────────────────────────────
  const countryRows = await PageView.findAll({
    attributes: ['country', [fn('COUNT', fn('DISTINCT', col('ipHash'))), 'visitors']],
    where: {
      createdAt: { [Op.gte]: thirtyDaysAgo },
      country: { [Op.not]: null },
    },
    group: ['country'],
    order: [[literal('visitors'), 'DESC']],
    limit: 10,
    raw: true,
  })
  const totalCountryVisitors = countryRows.reduce((s, r) => s + Number(r.visitors), 0) || 1
  const topCountries = countryRows.map((r) => ({
    country: r.country || 'Unknown',
    visitors: Number(r.visitors),
    percent: Math.round((Number(r.visitors) / totalCountryVisitors) * 100),
  }))

  // ── 7. 24-Hour Peak Heatmap ──────────────────────────────────────────────
  const hourRows = await PageView.findAll({
    attributes: [
      [fnHour('createdAt'), 'hour'],
      [fn('COUNT', col('id')), 'count'],
    ],
    where: { createdAt: { [Op.gte]: sevenDaysAgo } },
    group: [fnHour('createdAt')],
    raw: true,
  })
  const hourMap = Object.fromEntries(hourRows.map((r) => [Number(r.hour), Number(r.count)]))
  const hourlyDistribution = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: hourMap[h] || 0,
  }))

  // ── 8. Live Activity Feed (last 20 page views) ───────────────────────────
  const liveActivity = await PageView.findAll({
    attributes: ['path', 'device', 'browser', 'os', 'country', 'referrer', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 20,
    raw: true,
  })

  // ── 9. User Growth (last 30 days) ────────────────────────────────────────
  const userGrowthRaw = await User.findAll({
    attributes: [
      [fnDate('createdAt'), 'day'],
      [fn('COUNT', col('id')), 'count'],
    ],
    where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
    group: [fnDate('createdAt')],
    raw: true,
  })
  const userByDay = Object.fromEntries(userGrowthRaw.map((r) => [String(r.day), Number(r.count)]))
  const userGrowth = days30.map(({ date, label }) => ({
    date,
    label,
    count: userByDay[date] || 0,
  }))

  // ── 10. Weekly comparison ─────────────────────────────────────────────────
  const prevWeekStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const [viewsThisWeek, viewsLastWeek] = await Promise.all([
    PageView.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } }),
    PageView.count({
      where: { createdAt: { [Op.gte]: prevWeekStart, [Op.lt]: sevenDaysAgo } },
    }),
  ])
  const weekGrowthPercent =
    viewsLastWeek > 0
      ? Math.round(((viewsThisWeek - viewsLastWeek) / viewsLastWeek) * 100)
      : viewsThisWeek > 0
      ? 100
      : 0

  res.json({
    overview: {
      totalViews,
      viewsToday,
      uniqueVisitorsAll,
      uniqueVisitorsToday,
      viewsThisWeek,
      weekGrowthPercent,
    },
    timeSeries,
    topPages,
    sources,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    topCountries,
    hourlyDistribution,
    liveActivity,
    userGrowth,
  })
})

export default { getAnalytics }
