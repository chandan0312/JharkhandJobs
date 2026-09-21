// ---------------------------------------------------------------------------
// AdminArticles — Article & Career Blog Management Dashboard
// ---------------------------------------------------------------------------

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  BookOpen,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileEdit,
  Check,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchAdminArticles, deleteArticle, updateArticle } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import { CATEGORY_BADGES, ARTICLE_CATEGORIES } from '../data/articleCategories.js'

export default function AdminArticles() {
  const { token } = useAuth()
  const [articles, setArticles] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetchAdminArticles(token, {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        q: search.trim() || undefined,
        limit: 100,
      })
      if (res) {
        setArticles(res.articles || [])
        if (res.stats) setStats(res.stats)
      }
    } catch (err) {
      console.error('Failed to load articles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedCategory, selectedStatus, search])

  // Handle delete
  const handleDelete = async (article) => {
    if (!window.confirm(`Are you sure you want to delete the article: "${article.title}"?`)) {
      return
    }
    setDeletingId(article.id)
    try {
      await deleteArticle(token, article.id)
      setArticles((prev) => prev.filter((a) => a.id !== article.id))
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        published: article.status === 'published' ? Math.max(0, prev.published - 1) : prev.published,
        drafts: article.status === 'draft' ? Math.max(0, prev.drafts - 1) : prev.drafts,
      }))
      showToast('Article deleted successfully.')
    } catch (err) {
      alert(err.message || 'Failed to delete article.')
    } finally {
      setDeletingId(null)
    }
  }

  // Handle status quick toggle (published <-> draft)
  const handleToggleStatus = async (article) => {
    const nextStatus = article.status === 'published' ? 'draft' : 'published'
    try {
      await updateArticle(token, article.id, { status: nextStatus })
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, status: nextStatus } : a))
      )
      setStats((prev) => ({
        ...prev,
        published: nextStatus === 'published' ? prev.published + 1 : prev.published - 1,
        drafts: nextStatus === 'draft' ? prev.drafts + 1 : prev.drafts - 1,
      }))
      showToast(`Article status updated to ${nextStatus}.`)
    } catch (err) {
      alert(err.message || 'Failed to update article status.')
    }
  }

  // Pagination
  const totalPages = Math.ceil(articles.length / limit) || 1
  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * limit
    return articles.slice(start, start + limit)
  }, [articles, page, limit])

  return (
    <div className="space-y-6 animate-fade-in">
      <SEOHead title="Manage Articles | Admin Job Alert X" />

      {/* Header and New Article CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink">
            Manage Articles &amp; Guides
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Create, edit, format with rich blocks, and publish career guides and exam walkthroughs.
          </p>
        </div>

        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-brand-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-teal-600/30 hover:brightness-110 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Write New Article
        </Link>
      </div>

      {/* Toast message */}
      {toast && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-300 animate-fade-in shadow-2xs">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Total Articles</span>
          <p className="text-2xl font-black text-ink">{stats.total || articles.length}</p>
        </div>
        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Published Live</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.published || 0}</p>
        </div>
        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Drafts</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.drafts || 0}</p>
        </div>
        <div className="card p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Total Views</span>
          <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{Number(stats.totalViews || 0).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search articles by title, author, or keywords…"
            className="w-full rounded-xl border border-hairline bg-page py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-hairline bg-surface py-2 px-3 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="how-to-apply">How to Apply</option>
            <option value="how-to-download">How to Download</option>
            <option value="strategy">Strategy &amp; Tips</option>
            <option value="syllabus">Syllabus</option>
            <option value="result">Result &amp; Cut-off</option>
            <option value="documentation">Documentation</option>
            <option value="job-guide">Job Guide</option>
            <option value="general">General</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-hairline bg-surface py-2 px-3 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen size={32} className="mx-auto text-ink-faint" />
            <p className="text-sm font-bold text-ink">No articles found</p>
            <p className="text-xs text-ink-muted">
              {search || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try changing your search terms or filter selection.'
                : 'Click "Write New Article" above to create your first guide.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-hairline bg-subtle/50 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {paginatedArticles.map((article) => {
                  const catBadge = CATEGORY_BADGES[article.category] || CATEGORY_BADGES.general
                  const isPublished = article.status === 'published'

                  return (
                    <tr key={article.id} className="hover:bg-subtle/40 transition-colors">
                      {/* Title and cover thumbnail */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          {article.coverImage ? (
                            <img
                              src={article.coverImage}
                              alt=""
                              className="h-10 w-14 rounded-lg object-cover bg-subtle shrink-0 border border-hairline"
                            />
                          ) : (
                            <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-subtle border border-hairline text-ink-faint">
                              <BookOpen size={16} />
                            </div>
                          )}
                          <div className="truncate">
                            <Link
                              to={`/admin/articles/${article.id}`}
                              className="font-bold text-ink hover:text-brand-600 transition-colors truncate block"
                            >
                              {article.title}
                            </Link>
                            <span className="text-[11px] text-ink-faint font-mono">
                              /{article.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-bold ${catBadge.bg}`}>
                          {catBadge.label}
                        </span>
                        {article.featured && (
                          <span className="ml-1.5 text-[10.5px] font-bold text-orange-500">
                            ★
                          </span>
                        )}
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4 whitespace-nowrap text-ink-muted">
                        {article.author}
                      </td>

                      {/* Status quick toggle */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(article)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold transition-transform active:scale-95 ${
                            isPublished
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                          }`}
                          title="Click to toggle status"
                        >
                          {isPublished ? <Check size={11} /> : <Clock size={11} />}
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-4 text-center font-semibold text-ink-soft whitespace-nowrap">
                        {article.views || 0}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPublished && (
                            <Link
                              to={`/article/${article.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-hairline bg-surface text-ink-muted hover:text-brand-600 hover:bg-subtle transition-colors shadow-2xs"
                              title="View Live Article"
                            >
                              <ExternalLink size={13} />
                            </Link>
                          )}

                          <Link
                            to={`/admin/articles/${article.id}`}
                            className="p-1.5 rounded-lg border border-hairline bg-surface text-ink-muted hover:text-brand-600 hover:bg-subtle transition-colors shadow-2xs"
                            title="Edit Article"
                          >
                            <Pencil size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(article)}
                            disabled={deletingId === article.id}
                            className="p-1.5 rounded-lg border border-hairline bg-surface text-red-500 hover:bg-red-500/10 transition-colors shadow-2xs disabled:opacity-50"
                            title="Delete Article"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-hairline p-4 text-xs">
            <span className="text-ink-muted">
              Showing page {page} of {totalPages} ({articles.length} articles)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-hairline bg-surface px-2.5 py-1 font-semibold text-ink hover:bg-subtle disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-hairline bg-surface px-2.5 py-1 font-semibold text-ink hover:bg-subtle disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
