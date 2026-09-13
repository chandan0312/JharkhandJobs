// ---------------------------------------------------------------------------
// server/scripts/generate-sitemaps.js
// Generates static XML sitemaps directly from the database into client/public/
// so that static hosting (Hostinger / Apache / Vite dist) serves real XML files
// to Google Search Console without falling back to index.html (SPA).
// ---------------------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Job, sequelize } from '../src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../../client/public');
const BASE_URL = 'https://jobalertx.com';

const KINDS = [
  { kind: 'job', file: 'sitemap-jobs.xml', changefreq: 'weekly', priority: '0.90' },
  { kind: 'admit-card', file: 'sitemap-admit-cards.xml', changefreq: 'daily', priority: '0.85' },
  { kind: 'result', file: 'sitemap-results.xml', changefreq: 'daily', priority: '0.85' },
  { kind: 'answer-key', file: 'sitemap-answer-keys.xml', changefreq: 'weekly', priority: '0.80' },
  { kind: 'syllabus', file: 'sitemap-syllabus.xml', changefreq: 'monthly', priority: '0.80' },
];

function urlEntry(loc, lastmod, changefreq = 'weekly', priority = '0.80') {
  const mod = lastmod instanceof Date
    ? lastmod.toISOString().split('T')[0]
    : (typeof lastmod === 'string' ? lastmod.split('T')[0] : new Date().toISOString().split('T')[0]);
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${mod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function buildSitemap(urlEntries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    '</urlset>',
  ].join('\n');
}

async function run() {
  console.log('[sitemaps] Starting static sitemap generation from MariaDB...');
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];

  for (const item of KINDS) {
    try {
      const posts = await Job.findAll({
        where: { kind: item.kind },
        attributes: ['id', 'updatedAt', 'createdAt'],
        order: [['updatedAt', 'DESC']],
      });

      const entries = posts.map((p) =>
        urlEntry(
          `${BASE_URL}/job/${encodeURIComponent(p.id)}`,
          p.updatedAt || p.createdAt,
          item.changefreq,
          item.priority
        )
      );

      const xml = buildSitemap(entries);
      const dest = path.join(PUBLIC_DIR, item.file);
      fs.writeFileSync(dest, xml + '\n', 'utf-8');
      console.log(`[sitemaps] Wrote ${item.file} with ${posts.length} entries (${xml.length} bytes)`);
    } catch (err) {
      console.error(`[sitemaps] Error generating ${item.file}:`, err.message);
    }
  }

  // Update lastmod in sitemap.xml
  const sitemapIndexPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (fs.existsSync(sitemapIndexPath)) {
    let indexXml = fs.readFileSync(sitemapIndexPath, 'utf-8');
    indexXml = indexXml.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    fs.writeFileSync(sitemapIndexPath, indexXml, 'utf-8');
    console.log(`[sitemaps] Updated dates in ${sitemapIndexPath}`);
  }

  await sequelize.close();
  console.log('[sitemaps] Complete!');
  process.exit(0);
}

run().catch((err) => {
  console.error('[sitemaps] Fatal error:', err);
  process.exit(1);
});
