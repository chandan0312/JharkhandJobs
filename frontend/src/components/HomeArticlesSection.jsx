// ---------------------------------------------------------------------------
// HomeArticlesSection — Homepage showcase for career guides and articles
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Clock, Sparkles } from 'lucide-react'
import { getArticles } from '../services/api.js'
import { CATEGORY_BADGES } from '../data/articleCategories.js'

export default function HomeArticlesSection() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getArticles({ limit: 3 })
      .then((res) => {
        if (!active) return
        const list = res?.articles || (Array.isArray(res) ? res : [])
        setArticles(list)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <BookOpen size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-ink">
              Career Guides &amp; Exam Strategy
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 text-[10px] font-bold">
              <Sparkles size={10} /> Expert Advice
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">
            Step-by-step application walkthroughs, document verification checklists, and subject-wise study plans.
          </p>
        </div>

        <Link
          to="/articles"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
        >
          View All Guides <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 space-y-3 animate-pulse">
              <div className="aspect-[16/10] bg-subtle rounded-xl" />
              <div className="h-4 bg-subtle rounded w-3/4" />
              <div className="h-3 bg-subtle rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((article) => {
            const catBadge = CATEGORY_BADGES[article.category] || CATEGORY_BADGES.general
            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl border border-hairline bg-surface overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div>
                  {article.coverImage && (
                    <Link to={`/article/${article.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-subtle">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-bold backdrop-blur-md ${catBadge.bg}`}>
                          {catBadge.label}
                        </span>
                      </div>
                    </Link>
                  )}

                  <div className="p-4 space-y-2">
                    {!article.coverImage && (
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${catBadge.bg}`}>
                        {catBadge.label}
                      </span>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-ink-faint">
                      <Clock size={11} />
                      <span>{article.readTime || '5 min read'}</span>
                    </div>

                    <Link to={`/article/${article.slug}`}>
                      <h3 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-hairline flex items-center justify-between text-xs">
                  <span className="text-[11px] text-ink-muted truncate max-w-[140px] font-medium">
                    {article.author}
                  </span>
                  <Link
                    to={`/article/${article.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform"
                  >
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
