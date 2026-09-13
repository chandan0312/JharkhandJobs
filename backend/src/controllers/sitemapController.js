// ---------------------------------------------------------------------------
// sitemapController.js — Dynamic XML sitemap generation from the database.
// ---------------------------------------------------------------------------
// Generates one sitemap per content type (jobs, admit-cards, results,
// answer-keys, syllabus) using actual `updatedAt` timestamps from the DB
// so Googlebot knows which pages were recently modified.
//
// The static sitemap-core.xml (served from client/public) covers the
// homepage, category pages, kind-index pages, and trust pages.
// This file covers the long tail of individual post pages.
// ---------------------------------------------------------------------------

import { Job } from '../models/index.js'
import { Op } from 'sequelize'

const BASE_URL = 'https://jobalertx.com'

/** Build an XML <url> block. */
function urlEntry(loc, lastmod, changefreq = 'weekly', priority = '0.80') {
  const mod = lastmod instanceof Date
    ? lastmod.toISOString().split('T')[0]
    : (typeof lastmod === 'string' ? lastmod.split('T')[0] : new Date().toISOString().split('T')[0])
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${mod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

/** Wrap url entries in a urlset envelope. */
function buildSitemap(urlEntries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    '</urlset>',
  ].join('\n')
}

/**
 * Generic handler: fetch all posts of a given `kind`, return sitemap XML.
 * Cache-Control: 1 hour public cache so Googlebot gets fresh data regularly
 * but we don't hammer the DB on every request.
 */
async function generateKindSitemap(res, kind, changefreq, priority) {
  try {
    const posts = await Job.findAll({
      where: { kind },
      attributes: ['id', 'updated_at', 'created_at'],
      order: [['updated_at', 'DESC']],
    })

    const entries = posts.map((p) =>
      urlEntry(
        `${BASE_URL}/job/${encodeURIComponent(p.id)}`,
        p.updated_at || p.created_at,
        changefreq,
        priority
      )
    )

    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Sitemap-Count': String(entries.length),
    })
    res.send(buildSitemap(entries))
  } catch (err) {
    console.error(`[sitemap] error generating kind=${kind} sitemap:`, err.message)
    res.status(500).set('Content-Type', 'text/plain').send('Sitemap generation error')
  }
}

// Individual handlers mounted on specific routes in app.js

/** GET /sitemap-jobs.xml */
export async function jobsSitemap(req, res) {
  await generateKindSitemap(res, 'job', 'weekly', '0.90')
}

/** GET /sitemap-admit-cards.xml */
export async function admitCardsSitemap(req, res) {
  await generateKindSitemap(res, 'admit-card', 'daily', '0.85')
}

/** GET /sitemap-results.xml */
export async function resultsSitemap(req, res) {
  await generateKindSitemap(res, 'result', 'daily', '0.85')
}

/** GET /sitemap-answer-keys.xml */
export async function answerKeysSitemap(req, res) {
  await generateKindSitemap(res, 'answer-key', 'weekly', '0.80')
}

/** GET /sitemap-syllabus.xml */
export async function syllabusSitemap(req, res) {
  await generateKindSitemap(res, 'syllabus', 'monthly', '0.80')
}
