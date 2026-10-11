import { useState, useEffect, useMemo } from 'react'
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Mail,
  User,
  Calendar,
  Lightbulb,
  Bug,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchFeedbacks, updateFeedbackStatus, deleteFeedback } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'

const TYPE_ICONS = {
  suggestion: { icon: Lightbulb, color: '#f59e0b', label: 'Suggestion' },
  feedback: { icon: Sparkles, color: '#6d70f0', label: 'Feedback' },
  bug_report: { icon: Bug, color: '#ef4444', label: 'Bug Report' },
  feature_request: { icon: MessageSquare, color: '#10b981', label: 'Feature Request' },
  other: { icon: HelpCircle, color: '#06b6d4', label: 'Other' },
}

export default function AdminFeedback() {
  const { token } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadFeedbacks = async () => {
    if (!token) {
      setError('Your session has expired. Please sign in again.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await fetchFeedbacks(token, { limit: 100 })
      setFeedbacks(data.feedbacks || [])
    } catch (err) {
      setFeedbacks([])
      setError(
        err.status === 403
          ? 'Your account does not have permission to view feedback submissions.'
          : err.message || 'Could not load feedback submissions.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedbacks()
  }, [token])

  const handleStatusChange = async (id, newStatus) => {
    setError('')
    try {
      await updateFeedbackStatus(token, id, newStatus)
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb))
      )
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback((prev) => ({ ...prev, status: newStatus }))
      }
      setToast(`Marked as ${newStatus}`)
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setError(`Failed to update status: ${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback permanently?')) return
    setDeletingId(id)
    setError('')
    try {
      await deleteFeedback(token, id)
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id))
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(null)
      }
      setToast('Feedback removed.')
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setError(`Delete failed: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchSearch =
        !search.trim() ||
        fb.name?.toLowerCase().includes(search.toLowerCase()) ||
        fb.email?.toLowerCase().includes(search.toLowerCase()) ||
        fb.subject?.toLowerCase().includes(search.toLowerCase()) ||
        fb.message?.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || fb.status === statusFilter
      const matchType = typeFilter === 'all' || fb.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [feedbacks, search, statusFilter, typeFilter])

  const counts = useMemo(() => {
    return {
      total: feedbacks.length,
      new: feedbacks.filter((f) => f.status === 'new').length,
      reviewed: feedbacks.filter((f) => f.status === 'reviewed').length,
      resolved: feedbacks.filter((f) => f.status === 'resolved').length,
    }
  }, [feedbacks])

  return (
    <div className="space-y-6 animate-fade-in">
      <SEOHead title="User Feedback & Suggestions | Job Alert X Admin" />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink">
            Job Alert X — User Feedback &amp; Suggestions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Review recommendations, bug reports, and student suggestions submitted on Job Alert X.
          </p>
        </div>

        <button
          type="button"
          onClick={loadFeedbacks}
          className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2 text-xs font-bold text-ink-soft shadow-xs hover:bg-subtle hover:text-ink transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Submissions
        </button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-600 dark:text-emerald-300 animate-fade-in shadow-xs">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-300 animate-fade-in shadow-xs">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-ink-muted font-medium">Total Feedback</p>
          <p className="mt-1 text-2xl font-black text-ink">{counts.total}</p>
        </div>
        <div className="card p-4 border-orange-500/30 bg-orange-500/5">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">New Submissions</p>
          <p className="mt-1 text-2xl font-black text-orange-600 dark:text-orange-300">{counts.new}</p>
        </div>
        <div className="card p-4 border-indigo-500/30 bg-indigo-500/5">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Reviewed</p>
          <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-300">{counts.reviewed}</p>
        </div>
        <div className="card p-4 border-emerald-500/30 bg-emerald-500/5">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Resolved</p>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-300">{counts.resolved}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback by name, email, subject..."
              className="w-full rounded-xl border border-hairline bg-page py-2.5 pl-10 pr-4 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-hairline bg-surface py-2.5 px-3 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="new">New ({counts.new})</option>
              <option value="reviewed">Reviewed ({counts.reviewed})</option>
              <option value="resolved">Resolved ({counts.resolved})</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-hairline bg-surface py-2.5 px-3 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Categories</option>
              <option value="suggestion">Suggestions</option>
              <option value="feedback">General Feedback</option>
              <option value="bug_report">Bug Reports</option>
              <option value="feature_request">Feature Requests</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Table / List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-subtle/50 text-[11.5px] font-bold uppercase tracking-wider text-ink-muted">
                <th className="py-3.5 pl-5 pr-3">User &amp; Contact</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Subject &amp; Snippet</th>
                <th className="px-4 py-3.5">Rating</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-ink-muted">
                    No feedback found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((fb) => {
                  const typeMeta = TYPE_ICONS[fb.type] || TYPE_ICONS.other
                  const TypeIcon = typeMeta.icon
                  return (
                    <tr key={fb.id} className="group transition-colors hover:bg-subtle/50">
                      {/* Name & Email */}
                      <td className="py-4 pl-5 pr-3 max-w-[220px]">
                        <p className="truncate font-bold text-ink">{fb.name || 'Anonymous'}</p>
                        <p className="truncate text-[11px] text-ink-muted">{fb.email || 'No email provided'}</p>
                      </td>

                      {/* Type Pill */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold border border-hairline shadow-xs"
                          style={{
                            backgroundColor: `${typeMeta.color}15`,
                            color: typeMeta.color,
                          }}
                        >
                          <TypeIcon size={13} />
                          {typeMeta.label}
                        </span>
                      </td>

                      {/* Subject & snippet */}
                      <td className="px-4 py-4 max-w-[280px]">
                        <p className="truncate font-semibold text-ink group-hover:text-brand-600 transition-colors">
                          {fb.subject || 'No Subject'}
                        </p>
                        <p className="truncate text-[11px] text-ink-muted">{fb.message}</p>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {fb.rating ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                            <Star size={13} fill="currentColor" />
                            {fb.rating}
                          </span>
                        ) : (
                          <span className="text-ink-faint">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={fb.status}
                          onChange={(e) => handleStatusChange(fb.id, e.target.value)}
                          className="rounded-lg border border-hairline bg-surface px-2.5 py-1 text-[11px] font-bold text-ink focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xs"
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedFeedback(fb)}
                            className="rounded-lg p-1.5 text-ink-muted hover:bg-subtle hover:text-ink transition-colors"
                            title="Inspect message"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(fb.id)}
                            disabled={deletingId === fb.id}
                            className="rounded-lg p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                            title="Delete submission"
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
      </div>

      {/* Modal: Feedback Detail View */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedFeedback(null)}
        >
          <div
            className="card relative w-full max-w-lg p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-hairline pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
                  Feedback Submission
                </span>
                <h3 className="mt-1 text-lg font-black text-ink">{selectedFeedback.subject || 'Untitled'}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-subtle hover:text-ink transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-ink-soft">
                <User size={14} className="text-brand-500" />
                <span className="font-semibold">{selectedFeedback.name || 'Anonymous User'}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-soft">
                <Mail size={14} className="text-brand-500" />
                <span>{selectedFeedback.email || 'No email provided'}</span>
              </div>
              {selectedFeedback.createdAt && (
                <div className="flex items-center gap-2 text-ink-muted">
                  <Calendar size={14} />
                  <span>{new Date(selectedFeedback.createdAt).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-hairline bg-subtle/50 p-4">
              <p className="text-xs font-semibold text-ink-muted mb-1">Message Content:</p>
              <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">{selectedFeedback.message}</p>
            </div>

            <div className="flex items-center justify-between border-t border-hairline pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-ink-muted">Status:</span>
                <select
                  value={selectedFeedback.status}
                  onChange={(e) => handleStatusChange(selectedFeedback.id, e.target.value)}
                  className="rounded-lg border border-hairline bg-surface px-2.5 py-1 text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="btn-primary-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
