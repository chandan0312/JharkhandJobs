// ---------------------------------------------------------------------------
// ArticleDetails — Single Article & Career Guide Reader View
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Clock,
  Eye,
  Calendar,
  User,
  Share2,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Send,
  Twitter,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { getArticleBySlug } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import RichContentRenderer from '../components/RichContentRenderer.jsx'
import { CATEGORY_BADGES } from '../data/articleCategories.js'

export default function ArticleDetails() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'instant' })

    getArticleBySlug(slug)
      .then((res) => {
        if (!active) return
        if (res && res.article) {
          setData(res)
        } else if (res && res.title) {
          setData({ article: res, related: [] })
        } else {
          setError('Article not found.')
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load article.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`*${data?.article?.title}*\nRead this guide on Job Alert X:\n${window.location.href}`)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const shareOnTelegram = () => {
    const text = encodeURIComponent(data?.article?.title || '')
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank')
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(data?.article?.title || '')
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <span className="text-xs text-ink-muted">Loading article…</span>
      </div>
    )
  }

  if (error || !data?.article) {
    return (
      <div className="card p-12 text-center space-y-4 max-w-lg mx-auto my-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <BookOpen size={24} />
        </div>
        <h2 className="text-lg font-bold text-ink">{error || 'Article Not Found'}</h2>
        <p className="text-xs text-ink-muted">
          The requested article may have been moved or removed.
        </p>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110"
        >
          <ArrowLeft size={14} /> Back to All Articles
        </Link>
      </div>
    )
  }

  const { article, related = [] } = data
  const catBadge = CATEGORY_BADGES[article.category] || CATEGORY_BADGES.general

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.metaDescription,
    image: article.coverImage ? [article.coverImage] : undefined,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: article.author || 'Job Alert X Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jharkhand JobAlert X',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jharkhandjobalert.com/logo.png',
      },
    },
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      <SEOHead
        title={`${article.metaTitle || article.title} | Jharkhand JobAlert X`}
        description={article.metaDescription || article.excerpt}
        ogImage={article.coverImage}
        ogType="article"
        datePublished={article.created_at}
        dateModified={article.updated_at}
        jsonLd={jsonLd}
      />

      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-[12px] text-ink-muted flex-wrap">
        <Link to="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <ChevronRight size={13} className="text-ink-faint" />
        <Link to="/articles" className="hover:text-ink transition-colors">
          Articles &amp; Guides
        </Link>
        <ChevronRight size={13} className="text-ink-faint" />
        <Link to={`/articles?category=${article.category}`} className="hover:text-ink transition-colors">
          {catBadge.label}
        </Link>
        <ChevronRight size={13} className="text-ink-faint" />
        <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-xs">
          {article.title}
        </span>
      </nav>

      {/* Article Header Card */}
      <div className="card p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-bold ${catBadge.bg}`}>
              {catBadge.label}
            </span>
            {article.featured && (
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 text-[11px] font-bold">
                <Sparkles size={11} /> Spotlight
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {article.readTime || '5 min read'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Eye size={13} /> {article.views || 0} views
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-sm sm:text-base text-ink-soft leading-relaxed border-l-3 border-brand-500 pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Author & Date Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-hairline">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 font-extrabold text-sm shadow-xs">
              {article.author?.charAt(0) || 'J'}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-ink">{article.author}</p>
              <p className="text-[11px] text-ink-faint">{article.authorRole || 'Govt Exam Specialist'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-ink-muted mr-1 hidden sm:inline">Share:</span>
            <button
              onClick={shareOnWhatsApp}
              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle size={16} />
            </button>
            <button
              onClick={shareOnTelegram}
              className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
              title="Share on Telegram"
            >
              <Send size={16} />
            </button>
            <button
              onClick={shareOnTwitter}
              className="p-2 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300 hover:bg-slate-500/20 transition-colors"
              title="Share on X"
            >
              <Twitter size={16} />
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-hairline bg-surface text-xs font-semibold text-ink hover:bg-subtle transition-colors shadow-2xs"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-subtle aspect-[16/9] shadow-md">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content */}
      <div className="card p-6 sm:p-10">
        <RichContentRenderer content={article.content} className="prose-lg" />
      </div>

      {/* Tags Pill Row */}
      {Array.isArray(article.tags) && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-ink-muted">Related Topics:</span>
          {article.tags.map((tag, idx) => (
            <Link
              key={idx}
              to={`/articles?q=${encodeURIComponent(tag)}`}
              className="inline-flex items-center rounded-lg border border-hairline bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft hover:bg-subtle hover:text-ink transition-colors shadow-2xs"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Author Bio Box */}
      <div className="card p-5 sm:p-6 bg-subtle/30 border border-hairline flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-700 text-white font-black text-lg shadow-md">
          {article.author?.charAt(0) || 'J'}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-ink">Written by {article.author}</h4>
          <p className="text-xs text-ink-muted">
            {article.authorRole || 'Editorial specialist covering state and national examinations, official notices, recruitment trends, and verification procedures.'}
          </p>
        </div>
      </div>

      {/* Related Articles Section */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <BookOpen size={18} className="text-brand-500" />
              Related Career Guides &amp; Articles
            </h3>
            <Link
              to="/articles"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/article/${rel.slug}`}
                className="group card p-4 border border-hairline hover:shadow-md transition-all space-y-2 block"
              >
                {rel.coverImage && (
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-subtle mb-2">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${CATEGORY_BADGES[rel.category]?.bg || CATEGORY_BADGES.general.bg}`}>
                  {CATEGORY_BADGES[rel.category]?.label || rel.category}
                </span>
                <h4 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                  {rel.title}
                </h4>
                <div className="flex items-center gap-2 text-[10.5px] text-ink-faint">
                  <span>{rel.readTime || '5 min'}</span>
                  <span>•</span>
                  <span>{rel.author}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
