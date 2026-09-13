import { useState } from 'react'
import {
  X,
  MessageSquarePlus,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lightbulb,
  Bug,
  HelpCircle,
} from 'lucide-react'
import { submitFeedback } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const TYPES = [
  { id: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: '#f59e0b' },
  { id: 'feedback', label: 'General Feedback', icon: Sparkles, color: '#6d70f0' },
  { id: 'bug_report', label: 'Report a Problem', icon: Bug, color: '#ef4444' },
  { id: 'feature_request', label: 'New Feature', icon: MessageSquarePlus, color: '#10b981' },
  { id: 'other', label: 'Other Inquiry', icon: HelpCircle, color: '#06b6d4' },
]

export default function FeedbackModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [type, setType] = useState('suggestion')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await submitFeedback({
        name: name.trim(),
        email: email.trim(),
        type,
        subject: subject.trim(),
        message: message.trim(),
        rating,
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setSubject('')
        setMessage('')
        onClose()
      }, 2400)
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#050814]/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[540px] overflow-hidden rounded-3xl border border-hairline bg-surface shadow-2xl backdrop-blur-2xl animate-fade-in transition-colors duration-200 dark:border-white/[0.1] dark:bg-[#0d1326]">
        {/* Header Banner */}
        <div className="relative border-b border-hairline bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 px-6 py-5 dark:border-white/[0.08] dark:from-[#101833] dark:to-[#172044]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
                <MessageSquarePlus size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink dark:text-white">Feedback &amp; Suggestions</h3>
                <p className="text-xs text-ink-muted dark:text-slate-400">Help us make Job Alert X better for all students</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-ink-muted hover:bg-subtle hover:text-ink dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center animate-fade-in space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-bold text-ink dark:text-white">Thank You for Your Feedback!</h4>
              <p className="text-xs text-ink-muted dark:text-slate-400 max-w-sm mx-auto">
                Your suggestion has been recorded and sent directly to our administration team for review.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-500 dark:text-red-300">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              {/* Feedback Type Selection */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-ink-soft dark:text-slate-300">Category</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TYPES.map((t) => {
                    const Icon = t.icon
                    const isSelected = type === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/15 text-orange-600 dark:text-white shadow-sm'
                            : 'border-hairline bg-page text-ink-muted hover:bg-subtle hover:text-ink dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-slate-200'
                        }`}
                      >
                        <Icon size={14} style={{ color: isSelected ? '#f97316' : t.color }} />
                        <span className="truncate">{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-soft dark:text-slate-300">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-hairline bg-page px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:border-orange-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-soft dark:text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full rounded-xl border border-hairline bg-page px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:border-orange-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft dark:text-slate-300">Subject / Topic *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your feedback"
                  className="w-full rounded-xl border border-hairline bg-page px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:border-orange-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft dark:text-slate-300">Message / Suggestions *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details, link errors, or exam category recommendations..."
                  className="w-full rounded-xl border border-hairline bg-page px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-faint focus:border-orange-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft dark:text-slate-300">Portal Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-slate-300 dark:text-slate-600 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={20}
                        className={
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-hairline dark:text-slate-700'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-ink-muted dark:text-slate-400">
                    {rating === 5 ? 'Excellent ⭐' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-ink-muted hover:bg-subtle hover:text-ink dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? (
                    <span>Submitting…</span>
                  ) : (
                    <>
                      <span>Submit Feedback</span>
                      <Send size={13} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
