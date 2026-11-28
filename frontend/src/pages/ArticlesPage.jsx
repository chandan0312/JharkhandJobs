// ---------------------------------------------------------------------------
// ArticlesPage — Discovery hub for Jharkhand Govt Exam Guides & Strategy
// ---------------------------------------------------------------------------

import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BookOpen,
  Search,
  Clock,
  Eye,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react'
import { getArticles } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import { Skeleton } from '../components/Skeleton.jsx'
import { ARTICLE_CATEGORIES, CATEGORY_BADGES } from '../data/articleCategories.js'

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'all'
  const queryParam = searchParams.get('q') || ''

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [searchQuery, setSearchQuery] = useState(queryParam)

  useEffect(() => {
    setActiveCategory(categoryParam)
  }, [categoryParam])

  useEffect(() => {
    let active = true
    setLoading(true)

    const params = {}
    if (activeCategory && activeCategory !== 'all') params.category = activeCategory
    if (searchQuery.trim()) params.q = searchQuery.trim()

    getArticles(params)
      .then((res) => {
        if (!active) return
        const list = res?.articles || (Array.isArray(res) ? res : [])
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
  }, [activeCategory, searchQuery])

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId)
    const newParams = new URLSearchParams(searchParams)
    if (catId === 'all') {
      newParams.delete('category')
    } else {
      newParams.set('category', catId)
    }
    setSearchParams(newParams)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim())
    } else {
      newParams.delete('q')
    }
    setSearchParams(newParams)
  }

  const clearSearch = () => {
    setSearchQuery('')
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('q')
    setSearchParams(newParams)
  }

  // Hero Spotlight: First featured article or first article
  const featuredArticle = useMemo(() => {
    if (!articles || articles.length === 0) return null
    return articles.find((a) => a.featured) || articles[0]
  }, [articles])

  // Other articles in grid
  const regularArticles = useMemo(() => {
    if (!featuredArticle) return articles
    return articles.filter((a) => a.id !== featuredArticle.id)
  }, [articles, featuredArticle])

  const articleSchemas = useMemo(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Jharkhand Govt Job Articles, Exam Guides, Strategy & Download Instructions',
        url: 'https://jharkhand.jobalertx.com/articles',
        description:
          'Expert articles on how to apply online, admit card download steps, document verification checklist, exam strategy and syllabus breakdowns for JPSC, JSSC & Jharkhand exams.',
      },
    ]

    if (!loading && articles.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: articles.slice(0, 12).map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            headline: article.title,
            url: `https://jharkhand.jobalertx.com/article/${article.slug}`,
            image: article.coverImage || FALLBACK_COVER,
            datePublished: article.created_at || article.createdAt,
            author: {
              '@type': 'Person',
              name: article.author || 'Jharkhand JobAlert X Team',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Jharkhand JobAlert X',
              url: 'https://jharkhand.jobalertx.com/',
            },
            description: article.excerpt,
          },
        })),
      })
    }

    return schemas
  }, [loading, articles])

  const visibleGridArticles = !searchQuery && activeCategory === 'all' ? regularArticles : articles

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <SEOHead
        title="Career Guides, How-to-Apply & Exam Strategy | Jharkhand JobAlert X"
        description="Comprehensive career guides, step-by-step application walkthroughs, admit card downloading tips, syllabus patterns, and document verification checklists for JPSC, JSSC & Jharkhand Govt exams."
        keywords="Jharkhand job guide, how to apply JSSC, how to download admit card, JPSC strategy, syllabus breakdown, document verification checklist"
        canonical="https://jharkhand.jobalertx.com/articles"
        jsonLd={articleSchemas}
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-[#09324A] via-[#061e2d] to-[#041019] p-6 sm:p-10 text-white shadow-xl shadow-teal-950/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-300">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
            Official Career Insights &amp; Walkthroughs
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Articles &amp; Exam Preparation Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Step-by-step application guides, hall ticket download instructions, document verification checklists, and subject-wise study plans written by Jharkhand government recruitment experts.
          </p>
        </div>

        {/* Search Input in Hero */}
        <div className="relative z-10 mt-6 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, JPSC, JSSC, document checklists, strategies…"
              className="w-full rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md py-3 pl-11 pr-10 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-teal-400 focus:bg-white/15 focus:outline-none shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {ARTICLE_CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`inline-flex items-center gap-2 shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'border border-hairline bg-surface text-ink-soft hover:bg-subtle hover:text-ink'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : cat.color} />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Loading state */}
      {loading ? (
        <Skeleton.PageGrid count={6} />
      ) : articles.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <BookOpen size={28} />
          </div>
          <h3 className="text-base font-bold text-ink">No articles found</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            {searchQuery
              ? `No guides match your search "${searchQuery}". Try different keywords or clear the filter.`
              : 'There are no articles published in this category yet. Check back soon!'}
          </p>
          {(searchQuery || activeCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
                setSearchParams({})
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-surface border border-hairline px-4 py-2 text-xs font-semibold text-ink hover:bg-subtle shadow-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Hero Featured Article (Only if no custom search is active) */}
          {!searchQuery && activeCategory === 'all' && featuredArticle && (
            <div className="group relative overflow-hidden rounded-3xl border border-hairline bg-surface p-5 sm:p-8 shadow-md hover:border-orange-500/40 hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                <div className="lg:col-span-5 relative overflow-hidden rounded-2xl aspect-[16/10] bg-subtle">
                  <img
                    src={featuredArticle.coverImage || FALLBACK_COVER}
                    alt={featuredArticle.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md">
                      Featured Guide
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${CATEGORY_BADGES[featuredArticle.category]?.bg || CATEGORY_BADGES.general.bg}`}>
                      {CATEGORY_BADGES[featuredArticle.category]?.label || featuredArticle.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-muted">
                      <Clock size={12} className="text-orange-500" /> {featuredArticle.readTime || '5 min read'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-muted">
                      <Eye size={12} /> {Number(featuredArticle.views || 0).toLocaleString('en-IN')} views
                    </span>
                  </div>

                  <Link to={`/article/${featuredArticle.slug}`}>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-ink group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-ink-soft line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-hairline">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold text-xs">
                        {featuredArticle.author?.charAt(0) || 'J'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">{featuredArticle.author}</p>
                        <p className="text-[10px] text-ink-faint">{featuredArticle.authorRole}</p>
                      </div>
                    </div>

                    <Link
                      to={`/article/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition-all"
                    >
                      Read Guide <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleGridArticles.map((article) => {
              const badge = CATEGORY_BADGES[article.category] || CATEGORY_BADGES.general
              const created = article.created_at || article.createdAt
              return (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between rounded-2xl border border-hairline bg-surface overflow-hidden shadow-sm hover:border-orange-500/40 hover:shadow-cardhover transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    {/* Cover thumbnail */}
                    <Link to={`/article/${article.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-subtle">
                      <img
                        src={article.coverImage || FALLBACK_COVER}
                        alt={article.title}
                        width="600"
                        height="338"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10.5px] font-extrabold backdrop-blur-md ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10.5px] font-semibold text-slate-200">
                          <Clock size={12} />
                          {article.readTime}
                        </span>
                      </div>
                    </Link>

                    <div className="p-5 space-y-2.5">
                      <Link to={`/article/${article.slug}`}>
                        <h3 className="text-sm sm:text-[15px] font-bold text-ink group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {Array.isArray(article.tags) && article.tags.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {article.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-[10px] font-medium text-ink-muted bg-subtle rounded-md px-2 py-0.5"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer of card */}
                  <div className="p-5 pt-3 border-t border-hairline flex items-center justify-between text-[11.5px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-5 w-5 shrink-0 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-[10px]">
                        {article.author?.charAt(0) || 'J'}
                      </div>
                      <div className="truncate">
                        <p className="text-[11.5px] font-semibold text-ink truncate">{article.author}</p>
                        {created && (
                          <p className="text-[10px] text-ink-faint">
                            {new Date(created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-ink-faint text-[11px]">
                        <Eye size={12} />
                        {Number(article.views || 0).toLocaleString('en-IN')}
                      </span>
                      <Link
                        to={`/article/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-0.5 transition-transform"
                      >
                        Read <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
