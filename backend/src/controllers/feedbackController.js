// ---------------------------------------------------------------------------
// Feedback controller — public submission + admin viewing & management.
// ---------------------------------------------------------------------------

import { Feedback, FEEDBACK_TYPES, FEEDBACK_STATUSES } from '../models/index.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { badRequest, notFoundError } from '../middleware/error.js'
import { Op } from 'sequelize'

/**
 * POST /api/feedback (Public)
 * Submits user suggestion / feedback.
 */
export const submit = asyncHandler(async (req, res) => {
  const { name, email, type, subject, message, rating } = req.body ?? {}

  if (!String(name || '').trim()) throw badRequest('`name` is required')
  if (!String(email || '').trim()) throw badRequest('`email` is required')
  if (!String(subject || '').trim()) throw badRequest('`subject` is required')
  if (!String(message || '').trim()) throw badRequest('`message` is required')

  const validRating = rating !== undefined ? Math.min(Math.max(Number(rating) || 5, 1), 5) : 5
  const validType = FEEDBACK_TYPES.includes(type) ? type : 'suggestion'

  const record = await Feedback.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    type: validType,
    subject: String(subject).trim(),
    message: String(message).trim(),
    rating: validRating,
    status: 'new',
  })

  res.status(201).json({
    ok: true,
    message: 'Thank you! Your feedback/suggestion has been submitted successfully.',
    feedback: record,
  })
})

/**
 * GET /api/feedback (Admin only)
 * Lists all feedback with optional filters by status, type, or search term.
 */
export const list = asyncHandler(async (req, res) => {
  const { status, type, q, limit = 50, offset = 0 } = req.query

  const where = {}
  if (status && status !== 'all') {
    if (!FEEDBACK_STATUSES.includes(status)) throw badRequest(`Invalid status "${status}"`)
    where.status = status
  }

  if (type && type !== 'all') {
    if (!FEEDBACK_TYPES.includes(type)) throw badRequest(`Invalid type "${type}"`)
    where.type = type
  }

  if (q && String(q).trim()) {
    const term = `%${String(q).trim()}%`
    where[Op.or] = [
      { name: { [Op.like]: term } },
      { email: { [Op.like]: term } },
      { subject: { [Op.like]: term } },
      { message: { [Op.like]: term } },
    ]
  }

  const { count, rows } = await Feedback.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: Math.min(Number(limit) || 50, 100),
    offset: Number(offset) || 0,
  })

  res.json({
    total: count,
    feedbacks: rows,
  })
})

/**
 * PATCH /api/feedback/:id/status (Admin only)
 * Updates feedback status (new -> reviewed -> resolved).
 */
export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body ?? {}
  if (!FEEDBACK_STATUSES.includes(status)) {
    throw badRequest(`Invalid status "${status}". Allowed: ${FEEDBACK_STATUSES.join(', ')}`)
  }

  const feedback = await Feedback.findByPk(req.params.id)
  if (!feedback) throw notFoundError(`No feedback found with ID ${req.params.id}`)

  feedback.status = status
  await feedback.save()

  res.json({ ok: true, feedback })
})

/**
 * DELETE /api/feedback/:id (Admin only)
 */
export const remove = asyncHandler(async (req, res) => {
  const deleted = await Feedback.destroy({ where: { id: req.params.id } })
  if (!deleted) throw notFoundError(`No feedback found with ID ${req.params.id}`)
  res.status(204).end()
})

/**
 * GET /api/feedback/stats (Admin only)
 */
export const stats = asyncHandler(async (req, res) => {
  const total = await Feedback.count()
  const newCount = await Feedback.count({ where: { status: 'new' } })
  const reviewedCount = await Feedback.count({ where: { status: 'reviewed' } })
  const resolvedCount = await Feedback.count({ where: { status: 'resolved' } })

  res.json({
    total,
    new: newCount,
    reviewed: reviewedCount,
    resolved: resolvedCount,
  })
})

export default { submit, list, updateStatus, remove, stats }
