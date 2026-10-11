// ---------------------------------------------------------------------------
// Admin controller — aggregated dashboard data for the admin panel.
// ---------------------------------------------------------------------------

import { Job, Category, User, Feedback, JOB_KINDS } from '../models/index.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { Op } from 'sequelize'

/**
 * GET /api/admin/dashboard
 *
 * Returns:
 *   - total posts, total views
 *   - per-kind breakdown
 *   - per-category breakdown (with name + color from the Category table)
 *   - recent 10 posts ordered by createdAt DESC
 *   - total registered users
 *   - posts created in the last 7 days
 *   - total feedback count & new feedback count
 */
export const dashboard = asyncHandler(async (req, res) => {
  const seq = Job.sequelize

  // 1. Per-kind counts
  const kindRows = await Job.findAll({
    attributes: ['kind', [seq.fn('COUNT', seq.col('id')), 'count']],
    group: ['kind'],
    raw: true,
  })
  const byKind = Object.fromEntries(JOB_KINDS.map((k) => [k, 0]))
  let total = 0
  for (const row of kindRows) {
    const count = Number(row.count) || 0
    byKind[row.kind] = count
    total += count
  }

  // 2. Total views across all posts
  const viewsResult = await Job.findOne({
    attributes: [[seq.fn('SUM', seq.col('views')), 'totalViews']],
    raw: true,
  })
  const totalViews = Number(viewsResult?.totalViews) || 0

  // 3. Per-category counts with category info
  const catRows = await Job.findAll({
    attributes: ['category', [seq.fn('COUNT', seq.col('id')), 'count']],
    group: ['category'],
    raw: true,
  })
  const categories = await Category.findAll({ raw: true })
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]))
  const byCategory = catRows.map((row) => {
    const cat = catMap[row.category]
    return {
      slug: row.category,
      name: cat?.name || row.category,
      fullName: cat?.fullName || row.category,
      color: cat?.color || '#5558e6',
      count: Number(row.count) || 0,
    }
  }).sort((a, b) => b.count - a.count)

  // 4. Recent posts (latest 10)
  const recentPosts = await Job.findAll({
    attributes: [
      'id',
      'title',
      ['company', 'org'],
      ['type', 'kind'],
      'category',
      'views',
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
    ],
    order: [['updated_at', 'DESC'], ['created_at', 'DESC']],
    limit: 10,
    raw: true,
  })

  // 5. Posts created in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentCount = await Job.count({
    where: { created_at: { [Op.gte]: sevenDaysAgo } },
  })

  // 6. Total users
  const totalUsers = await User.count()

  // 7. Posts per day (last 7 days) for the chart
  const dailyRows = await Job.findAll({
    attributes: [
      [seq.fn('DATE', seq.col('created_at')), 'day'],
      [seq.fn('COUNT', seq.col('id')), 'count'],
    ],
    where: { created_at: { [Op.gte]: sevenDaysAgo } },
    group: [seq.fn('DATE', seq.col('created_at'))],
    order: [[seq.fn('DATE', seq.col('created_at')), 'ASC']],
    raw: true,
  })

  // Fill all 7 days (even if 0 posts)
  const postsPerDay = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dayStr = d.toISOString().split('T')[0]
    const match = dailyRows.find((r) => String(r.day) === dayStr)
    postsPerDay.push({
      date: dayStr,
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      count: match ? Number(match.count) : 0,
    })
  }

  // 8. Feedback stats
  let feedbackStats = { total: 0, new: 0 }
  try {
    const fbTotal = await Feedback.count()
    const fbNew = await Feedback.count({ where: { status: 'new' } })
    feedbackStats = { total: fbTotal, new: fbNew }
  } catch {
    /* fallback if table is initializing */
  }

  res.json({
    total,
    totalViews,
    totalUsers,
    recentCount,
    byKind,
    byCategory,
    recentPosts,
    postsPerDay,
    feedbackStats,
  })
})

export default { dashboard }
