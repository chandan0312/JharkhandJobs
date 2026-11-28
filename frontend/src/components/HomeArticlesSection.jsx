// ---------------------------------------------------------------------------
// HomeArticlesSection — Creative Article Showcase for the Homepage
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  ArrowRight,
  Clock,
  Eye,
  FileText,
  Download,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import { getArticles } from '../services/api.js'
import { CATEGORY_BADGES } from '../data/articleCategories.js'
import { Skeleton } from './Skeleton.jsx'

export default function HomeArticlesSection() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getArticles({ limit: 6 })
      .then((res) => {
        if (!active) return
        const list = Array.isArray(res) ? res : (res?.articles || [])
        setArticles(
          list.map((a) => ({
            ...a,
            id: a.id || a.slug,
            readTime: typeof a.readTime === 'number' ? `${a.readTime} min read` : (a.readTime || '5 min read'),
          }))
        )
      })
      .catch(() => {
        if (active) setArticles([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (!loading && articles.length === 0) return null

  return (
    <section className="space-y-4 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-ink">
                Career Articles &amp; Guides
              </h2>
              <span className="hidden sm:inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10.5px] font-bold text-orange-600 dark:text-orange-400">
                Verified Expert Advice
              </span>
            </div>
            <p className="text-[11.5px] text-ink-muted">
              JPSC &amp; JSSC application walkthroughs, admit card downloads, syllabus &amp; exam preparation
            </p>
          </div>
        </div>

        <Link
          to="/articles"
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline shrink-0"
        >
          <span>View All Articles</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Quick Category Jump Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        <Link
          to="/articles?category=how-to-apply"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-bold text-ink-soft hover:bg-subtle hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
        >
          <FileText size={13} className="text-emerald-500 dark:text-emerald-400" />
          <span>How to Apply</span>
        </Link>
        <Link
          to="/articles?category=how-to-download"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-bold text-ink-soft hover:bg-subtle hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
        >
          <Download size={13} className="text-blue-500 dark:text-blue-400" />
          <span>Admit Card Guides</span>
        </Link>
        <Link
          to="/articles?category=documentation"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-bold text-ink-soft hover:bg-subtle hover:text-sky-600 dark:hover:text-sky-400 transition-colors shadow-sm"
        >
          <ShieldCheck size={13} className="text-sky-500 dark:text-sky-400" />
          <span>Doc Verification</span>
        </Link>
        <Link
          to="/articles?category=syllabus"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-bold text-ink-soft hover:bg-subtle hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-sm"
        >
          <BookOpen size={13} className="text-rose-500 dark:text-rose-400" />
          <span>Syllabus Breakdown</span>
        </Link>
        <Link
          to="/articles?category=strategy"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-bold text-ink-soft hover:bg-subtle hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-sm"
        >
          <GraduationCap size={13} className="text-amber-500 dark:text-amber-400" />
          <span>Exam Strategy</span>
        </Link>
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <Skeleton.Article key={n} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => {
            const badge = CATEGORY_BADGES[article.category] || CATEGORY_BADGES.general

            return (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-4 shadow-sm hover:border-orange-500/40 hover:shadow-cardhover hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Cover Image thumbnail */}
                {article.coverImage && (
                  <Link to={`/article/${article.slug}`} className="relative aspect-[16/9] w-full overflow-hidden rounded-xl mb-3 block bg-subtle">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      width="600"
                      height="338"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold border backdrop-blur-md ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                  </Link>
                )}

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    {!article.coverImage && (
                      <div className="mb-2">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-ink-muted mb-1.5">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-orange-500" />
                        {article.readTime}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">{article.author}</span>
                    </div>

                    <h3 className="text-xs sm:text-[13px] font-bold text-ink group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/article/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="mt-1.5 text-[11.5px] text-ink-muted line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between text-[11px]">
                    <span className="text-ink-faint flex items-center gap-1">
                      <Eye size={12} />
                      {Number(article.views || 0).toLocaleString('en-IN')} views
                    </span>
                    <Link
                      to={`/article/${article.slug}`}
                      className="font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Guide</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
