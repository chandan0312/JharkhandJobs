import { useState } from 'react'
import {
  MessageSquarePlus,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lightbulb,
  Bug,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { submitFeedback } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import SEOHead from '../components/SEOHead.jsx'

const TYPES = [
  { id: 'suggestion', label: 'Suggestion & Idea', icon: Lightbulb, color: '#f59e0b', desc: 'Have an idea to improve the portal?' },
  { id: 'feedback', label: 'General Feedback', icon: Sparkles, color: '#6d70f0', desc: 'Share your overall experience with us' },
  { id: 'bug_report', label: 'Report an Issue', icon: Bug, color: '#ef4444', desc: 'Found a broken link or inaccuracy?' },
  { id: 'feature_request', label: 'Feature Request', icon: MessageSquarePlus, color: '#10b981', desc: 'Request new exam categories or tools' },
  { id: 'other', label: 'Other Inquiry', icon: HelpCircle, color: '#06b6d4', desc: 'General queries or student help' },
]

export default function FeedbackPage() {
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
      setSubject('')
      setMessage('')
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in py-4 sm:py-6">
      <SEOHead
        title="Feedback & Suggestions | Job Alert X"
        description="Share your feedback, ideas, suggestions, and feature requests directly with the Job Alert X portal administrators."
        noIndex={true}
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#0d1326] via-[#101833] to-[#151c3d] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
              <Sparkles size={13} />
              Community Driven
            </span>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight text-white">
              Feedback &amp; Suggestions
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
              Your voice shapes Job Alert X. Submit ideas, report exam notification issues, or suggest new features. Every submission is reviewed by our editorial team.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-slate-300">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Admin Monitored</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-[80px]" />
      </div>

      {/* Form Card */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#0d1326]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {success ? (
          <div className="py-12 text-center animate-fade-in space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-white">Feedback Received!</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Thank you for contributing to the Job Alert X community. Your feedback has been stored securely in our database and will be reviewed by the administrators.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-6 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                Send Another Suggestion
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Type selector */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Select Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TYPES.map((t) => {
                  const Icon = t.icon
                  const isSelected = type === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/15 text-white shadow-md shadow-orange-500/10'
                          : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Icon size={16} style={{ color: isSelected ? '#f97316' : t.color }} />
                        <span className="text-white">{t.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{t.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Name & Email */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Contact Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Subject & Message */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Your Feedback / Suggestion
              </label>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Subject Topic *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Please add direct download link for SSC CGL syllabus PDF"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your suggestions, improvements, or bug report description..."
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
              <div>
                <p className="text-xs font-bold text-white">Rate Your Experience</p>
                <p className="text-[11px] text-slate-500">How satisfied are you with Job Alert X?</p>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-600 transition-colors hover:text-amber-400 focus:outline-none"
                  >
                    <Star
                      size={20}
                      className={
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-xs font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Submit Feedback &amp; Suggestions
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
