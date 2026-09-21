// ---------------------------------------------------------------------------
// Article controller — Public reading, search, category filter, plus Admin CRUD
// ---------------------------------------------------------------------------

import { Op } from 'sequelize'
import { Article, ARTICLE_CATEGORIES } from '../models/index.js'
import { slugify, uniqueSlug } from '../utils/slugify.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { badRequest, notFoundError } from '../middleware/error.js'

const DEFAULT_LIMIT = 12
const MAX_LIMIT = 100

/**
 * Public listing of published articles with optional category, search, tag, and featured filters.
 * GET /api/articles
 */
export const list = asyncHandler(async (req, res) => {
  const { category, q, tag, featured, limit: rawLimit, offset: rawOffset } = req.query

  const limit = Math.min(Math.max(1, Number.parseInt(rawLimit, 10) || DEFAULT_LIMIT), MAX_LIMIT)
  const offset = Math.max(0, Number.parseInt(rawOffset, 10) || 0)

  const where = {
    status: 'published',
  }

  if (category && category !== 'all' && category.trim()) {
    where.category = category.trim().toLowerCase()
  }

  if (featured === 'true' || featured === '1') {
    where.featured = true
  }

  if (q && q.trim()) {
    const term = `%${q.trim()}%`
    where[Op.or] = [
      { title: { [Op.like]: term } },
      { excerpt: { [Op.like]: term } },
      { author: { [Op.like]: term } },
    ]
  }

  const { rows: articles, count: total } = await Article.findAndCountAll({
    where,
    order: [
      ['featured', 'DESC'],
      ['created_at', 'DESC'],
    ],
    limit,
    offset,
  })

  // Tag filter in memory if specified and DB is JSON
  let filteredArticles = articles
  if (tag && tag.trim()) {
    const targetTag = tag.trim().toLowerCase()
    filteredArticles = articles.filter((art) => {
      if (!Array.isArray(art.tags)) return false
      return art.tags.some((t) => String(t).toLowerCase() === targetTag)
    })
  }

  res.json({
    articles: filteredArticles,
    total,
    limit,
    offset,
  })
})

/**
 * Public single article detail by slug or id, with automatic view increment and related items.
 * GET /api/articles/:slug
 */
export const bySlugOrId = asyncHandler(async (req, res) => {
  const identifier = req.params.slug

  const article = await Article.findOne({
    where: {
      [Op.or]: [{ slug: identifier }, { id: identifier }],
    },
  })

  if (!article) {
    throw notFoundError(`Article not found: "${identifier}"`)
  }

  // Atomically increment views for published articles
  if (article.status === 'published') {
    try {
      await article.increment('views', { by: 1 })
      article.views += 1
    } catch {
      /* ignore increment concurrency failure */
    }
  }

  // Find up to 4 related articles in same or general category
  const related = await Article.findAll({
    where: {
      status: 'published',
      id: { [Op.ne]: article.id },
      category: article.category,
    },
    limit: 4,
    order: [['created_at', 'DESC']],
    attributes: ['id', 'title', 'slug', 'category', 'coverImage', 'readTime', 'author', 'created_at'],
  })

  res.json({
    article,
    related,
  })
})

/**
 * Admin listing of all articles (including drafts) with metrics.
 * GET /api/articles/admin/all
 */
export const adminList = asyncHandler(async (req, res) => {
  const { category, status, q, limit: rawLimit, offset: rawOffset } = req.query

  const limit = Math.min(Math.max(1, Number.parseInt(rawLimit, 10) || 50), 200)
  const offset = Math.max(0, Number.parseInt(rawOffset, 10) || 0)

  const where = {}

  if (category && category !== 'all' && category.trim()) {
    where.category = category.trim().toLowerCase()
  }

  if (status && status !== 'all' && status.trim()) {
    where.status = status.trim().toLowerCase()
  }

  if (q && q.trim()) {
    const term = `%${q.trim()}%`
    where[Op.or] = [
      { title: { [Op.like]: term } },
      { slug: { [Op.like]: term } },
      { author: { [Op.like]: term } },
    ]
  }

  const { rows: articles, count: total } = await Article.findAndCountAll({
    where,
    order: [
      ['updated_at', 'DESC'],
      ['created_at', 'DESC'],
    ],
    limit,
    offset,
  })

  // Global metrics for admin overview
  const totalPublished = await Article.count({ where: { status: 'published' } })
  const totalDrafts = await Article.count({ where: { status: 'draft' } })
  const totalArticles = totalPublished + totalDrafts
  const totalViews = (await Article.sum('views')) || 0

  res.json({
    articles,
    total,
    limit,
    offset,
    stats: {
      total: totalArticles,
      published: totalPublished,
      drafts: totalDrafts,
      totalViews,
    },
  })
})

/**
 * Admin create article.
 * POST /api/articles
 */
export const create = asyncHandler(async (req, res) => {
  const body = req.body || {}

  if (!body.title || !body.title.trim()) {
    throw badRequest('Article title is required')
  }

  const baseSlug = body.slug && body.slug.trim() ? slugify(body.slug) : slugify(body.title)
  const slug = await uniqueSlug(Article, baseSlug)
  const id = `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

  const article = await Article.create({
    id,
    title: body.title.trim(),
    slug,
    category: body.category || 'general',
    excerpt: body.excerpt || '',
    content: body.content || '',
    coverImage: body.coverImage || '',
    author: body.author || 'Job Alert X Editorial Team',
    authorRole: body.authorRole || 'Govt Career & Exam Specialist',
    readTime: body.readTime || '5 min read',
    tags: Array.isArray(body.tags) ? body.tags : [],
    status: body.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(body.featured),
    views: 0,
    metaTitle: body.metaTitle || body.title.trim(),
    metaDescription: body.metaDescription || body.excerpt || '',
  })

  res.status(201).json(article)
})

/**
 * Admin update article.
 * PUT /api/articles/:id
 */
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params
  const body = req.body || {}

  const article = await Article.findOne({
    where: {
      [Op.or]: [{ id }, { slug: id }],
    },
  })

  if (!article) {
    throw notFoundError(`Article not found: "${id}"`)
  }

  // If slug changed, verify uniqueness
  let newSlug = article.slug
  if (body.slug && slugify(body.slug) !== article.slug) {
    newSlug = await uniqueSlug(Article, slugify(body.slug))
  }

  const fields = [
    'title',
    'category',
    'excerpt',
    'content',
    'coverImage',
    'author',
    'authorRole',
    'readTime',
    'tags',
    'status',
    'featured',
    'metaTitle',
    'metaDescription',
  ]

  fields.forEach((field) => {
    if (body[field] !== undefined) {
      article[field] = body[field]
    }
  })

  article.slug = newSlug
  await article.save()

  res.json(article)
})

/**
 * Admin delete article.
 * DELETE /api/articles/:id
 */
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params

  const article = await Article.findOne({
    where: {
      [Op.or]: [{ id }, { slug: id }],
    },
  })

  if (!article) {
    throw notFoundError(`Article not found: "${id}"`)
  }

  await article.destroy()
  res.json({ success: true, deletedId: id })
})
