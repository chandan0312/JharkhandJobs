import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Filter,
  Pencil,
  Trash2,
  ExternalLink,
  Briefcase,
  Ticket,
  Award,
  FileText,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Flame,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchJobs, deleteJob, updateJob, getCategories } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'

// Static kind labels (mirrors server /api/kinds)
const KIND_LABELS = {
  job: 'Latest Jobs',
  'admit-card': 'Admit Cards',
  result: 'Results',
  'answer-key': 'Answer Keys',
  syllabus: 'Syllabus',
}

const KIND_ICON = {
  job: Briefcase,
  'admit-card': Ticket,
  result: Award,
  'answer-key': FileText,
  syllabus: Layers,
}

export default function AdminPosts() {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedKind, setSelectedKind] = useState('all')
  const [selectedCat, setSelectedCat] = useState('all')
  const [displayFilter, setDisplayFilter] = useState('all') // 'all' | 'trending' | 'ticker'
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [limit, setLimit] = useState(15)

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = await fetchJobs({ limit: 1000 })
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load posts:', err)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
    // Fetch categories for filter dropdown
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => {})
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return
    setDeletingId(id)
    try {
      if (token) {
        await deleteJob(token, id)
      }
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setToast('Post deleted successfully.')
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Error'))
    } finally {
      setDeletingId(null)
    }
  }

  // Quick toggle Trending (Featured)
  const handleToggleFeatured = async (post) => {
    const nextVal = !post.featured
    setUpdatingId(post.id)
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, featured: nextVal } : p))
    )
    try {
      if (token) {
        await updateJob(token, post.id, { featured: nextVal })
      }
      setToast(nextVal ? `🔥 "${post.title}" is now Trending (Carousel)` : `Removed "${post.title}" from Trending`)
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      // Rollback on error
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, featured: !nextVal } : p))
      )
      alert('Failed to update trending status: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  // Quick toggle Header Moving Ticker
  const handleToggleTicker = async (post) => {
    const nextVal = !post.inTicker
    setUpdatingId(post.id)
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, inTicker: nextVal } : p))
    )
    try {
      if (token) {
        await updateJob(token, post.id, { inTicker: nextVal })
      }
      setToast(nextVal ? `⚡ "${post.title}" added to Header Moving Ticker` : `Removed "${post.title}" from Header Ticker`)
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      // Rollback on error
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, inTicker: !nextVal } : p))
      )
      alert('Failed to update ticker status: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  // Filtering
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        (p.org && p.org.toLowerCase().includes(search.toLowerCase()))
      const matchKind = selectedKind === 'all' || p.kind === selectedKind
      const matchCat = selectedCat === 'all' || p.category === selectedCat
      const matchDisplay =
        displayFilter === 'all' ||
        (displayFilter === 'trending' && Boolean(p.featured)) ||
        (displayFilter === 'ticker' && Boolean(p.inTicker))

      return matchSearch && matchKind && matchCat && matchDisplay
    })
  }, [posts, search, selectedKind, selectedCat, displayFilter])

  const totalPages = Math.ceil(filtered.length / limit) || 1
  const paginated = filtered.slice((page - 1) * limit, page * limit)

  // Counts for quick display tabs
  const trendingCount = useMemo(() => posts.filter((p) => p.featured).length, [posts])
  const tickerCount = useMemo(() => posts.filter((p) => p.inTicker).length, [posts])
  const kindCounts = useMemo(() => {
    const counts = { all: posts.length }
    for (const p of posts) {
      counts[p.kind] = (counts[p.kind] || 0) + 1
    }
    return counts
  }, [posts])

  return (
    <div className="space-y-6 animate-fade-in">
      <SEOHead title="Manage Posts | Job Alert X Admin" />

      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">Job Alert X — Manage Notifications</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Control live notifications, manage what appears in <strong>Trending Carousel</strong> and the <strong>Header Moving Ticker</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadPosts}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-xs font-bold text-ink-soft shadow-xs transition-colors hover:bg-subtle hover:text-ink"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:brightness-110 active:scale-95"
          >
            <Plus size={16} />
            Create Notification
          </Link>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-600 dark:text-emerald-300 animate-fade-in shadow-xs">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Quick Filter Display Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline pb-2.5">
        <button
          type="button"
          onClick={() => { setSelectedKind('all'); setDisplayFilter('all'); setPage(1) }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
            selectedKind === 'all' && displayFilter === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'border border-hairline bg-surface text-ink-soft hover:bg-subtle hover:text-ink'
          }`}
        >
          <span>All Posts</span>
          <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${selectedKind === 'all' && displayFilter === 'all' ? 'bg-white/20 text-white' : 'bg-subtle text-ink-muted'}`}>
            {posts.length}
          </span>
        </button>

        {Object.entries(KIND_LABELS).map(([k, label]) => {
          const Icon = KIND_ICON[k] || Briefcase
          const isActive = selectedKind === k && displayFilter === 'all'
          return (
            <button
              key={k}
              type="button"
              onClick={() => { setSelectedKind(k); setDisplayFilter('all'); setPage(1) }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-hairline bg-surface text-ink-soft hover:bg-subtle hover:text-ink'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-white' : 'text-ink-faint'} />
              <span>{label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-subtle text-ink-muted'}`}>
                {kindCounts[k] || 0}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => { setDisplayFilter('trending'); setSelectedKind('all'); setPage(1) }}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
            displayFilter === 'trending'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/20'
              : 'border border-hairline bg-surface text-ink-soft hover:bg-orange-500/5 hover:text-orange-600'
          }`}
        >
          <Flame size={13} className={displayFilter === 'trending' ? 'text-white' : 'text-orange-500'} />
          <span>🔥 Trending</span>
          <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${displayFilter === 'trending' ? 'bg-white/20 text-white' : 'bg-orange-500/10 text-orange-600 dark:text-orange-300'}`}>
            {trendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setDisplayFilter('ticker'); setSelectedKind('all'); setPage(1) }}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
            displayFilter === 'ticker'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm shadow-cyan-600/20'
              : 'border border-hairline bg-surface text-ink-soft hover:bg-cyan-500/5 hover:text-cyan-600'
          }`}
        >
          <Zap size={13} className={displayFilter === 'ticker' ? 'text-white' : 'text-cyan-500'} />
          <span>⚡ Ticker</span>
          <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${displayFilter === 'ticker' ? 'bg-white/20 text-white' : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300'}`}>
            {tickerCount}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search query */}
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by title, organisation..."
              className="w-full rounded-xl border border-hairline bg-page py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-ink-faint transition-all focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Classification / Kind */}
          <div>
            <select
              value={selectedKind}
              onChange={(e) => {
                setSelectedKind(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-xl border border-hairline bg-surface py-2.5 px-3 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Classifications</option>
              {Object.entries(KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-xl border border-hairline bg-surface py-2.5 px-3 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.fullName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-subtle/50 text-[11.5px] font-bold uppercase tracking-wider text-ink-muted">
                <th className="py-3.5 pl-5 pr-3">Notification / Department</th>
                <th className="px-3 py-3.5">Category</th>
                <th className="px-3 py-3.5">Type</th>
                <th className="px-3 py-3.5 text-center">Trending Carousel</th>
                <th className="px-3 py-3.5 text-center">Header Ticker</th>
                <th className="px-3 py-3.5">Vacancies</th>
                <th className="px-3 py-3.5">Posted On</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-ink-muted">
                    No posts matched your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((post) => {
                  const Icon = KIND_ICON[post.kind] || FileText
                  return (
                    <tr key={post.id} className="group transition-colors hover:bg-subtle/50">
                      {/* Title & Org */}
                      <td className="py-4 pl-5 pr-3 max-w-[300px]">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-ink-soft group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-600/20 dark:group-hover:text-brand-300 transition-colors">
                            <Icon size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-ink group-hover:text-brand-600 transition-colors">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <p className="truncate text-[11px] text-ink-muted">{post.org}</p>
                              {post.notificationPdfUrl && (
                                <span className="inline-flex items-center rounded bg-red-500/10 px-1.5 py-0.5 text-[9.5px] font-extrabold text-red-600 dark:text-red-400">
                                  PDF
                                </span>
                              )}
                              {post.applyUrl && (
                                <span className="inline-flex items-center rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                  Link
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-hairline bg-surface px-2.5 py-1 text-[11px] font-bold uppercase text-ink-soft shadow-xs">
                          {post.category}
                        </span>
                      </td>

                      {/* Kind / Type */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
                          {KIND_LABELS[post.kind] || post.kind}
                        </span>
                      </td>

                      {/* 1-Click Toggle: Trending Carousel */}
                      <td className="px-3 py-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(post)}
                          disabled={updatingId === post.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold transition-all ${
                            post.featured
                              ? 'bg-orange-500 text-white shadow-xs hover:bg-orange-600'
                              : 'border border-hairline bg-surface text-ink-faint hover:border-orange-400 hover:text-orange-500'
                          }`}
                          title="Click to toggle Trending on Home Carousel"
                        >
                          <Flame size={13} className={post.featured ? 'text-white' : 'text-ink-faint'} />
                          {post.featured ? 'Trending' : 'Off'}
                        </button>
                      </td>

                      {/* 1-Click Toggle: Moving Header Ticker */}
                      <td className="px-3 py-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleTicker(post)}
                          disabled={updatingId === post.id}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold transition-all ${
                            post.inTicker
                              ? 'bg-cyan-600 text-white shadow-xs hover:bg-cyan-700'
                              : 'border border-hairline bg-surface text-ink-faint hover:border-cyan-400 hover:text-cyan-500'
                          }`}
                          title="Click to toggle Moving Header Ticker"
                        >
                          <Zap size={13} className={post.inTicker ? 'text-white' : 'text-ink-faint'} />
                          {post.inTicker ? 'In Ticker' : 'Off'}
                        </button>
                      </td>

                      {/* Vacancies */}
                      <td className="px-3 py-4 whitespace-nowrap font-bold text-ink tabular-nums">
                        {post.vacancies ? post.vacancies.toLocaleString('en-IN') : '—'}
                      </td>

                      {/* Posted On */}
                      <td className="px-3 py-4 whitespace-nowrap text-ink-muted">
                        {post.postedOn || post.postedAt || 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/job/${post.id}`}
                            target="_blank"
                            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
                            title="View post live"
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <Link
                            to={`/admin/posts/${post.id}`}
                            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-600/20 dark:hover:text-brand-300"
                            title="Edit notification"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deletingId === post.id}
                            className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 disabled:opacity-50"
                            title="Delete notification"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-hairline bg-subtle/20 px-5 py-4 sm:flex-row text-xs text-ink-muted">
          <div className="flex flex-wrap items-center gap-3">
            <p>
              Showing <span className="font-semibold text-ink">{filtered.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
              <span className="font-semibold text-ink">{Math.min(page * limit, filtered.length)}</span> of{' '}
              <span className="font-semibold text-ink">{filtered.length}</span> results
            </p>
            <div className="flex items-center gap-1.5 pl-3 border-l border-hairline">
              <span>Per page:</span>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="rounded-lg border border-hairline bg-surface px-2 py-0.5 text-xs font-semibold text-ink focus:outline-none focus:border-brand-500"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-semibold text-ink-soft transition-colors hover:bg-subtle disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <span className="px-2 font-bold text-ink">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-surface px-3 py-1.5 font-semibold text-ink-soft transition-colors hover:bg-subtle disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
