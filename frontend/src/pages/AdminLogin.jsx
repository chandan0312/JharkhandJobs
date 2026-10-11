// ---------------------------------------------------------------------------
// AdminLogin — premium dark-themed admin login page.
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'
import SEOHead from '../components/SEOHead.jsx'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 transition-colors duration-200 dark:bg-[#030f18]">
      <SEOHead title="Admin Login | Jharkhand JobAlert X" />
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial gradient orbs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-teal-500/15 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-navy-800/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] animate-fade-in">
        {/* Logo & Title */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="mb-5 transition-transform hover:scale-105">
            <SarkariEmblem size={56} />
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-ink dark:text-white">
            Jharkhand JobAlert X Admin
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted dark:text-slate-400">
            Sign in to manage Jharkhand JobAlert X Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-hairline bg-surface p-6 shadow-xl backdrop-blur-xl sm:p-8 dark:bg-[#061e2d] dark:border-teal-500/20">
          {/* Security badge */}
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-brand-600/20 bg-brand-600/5 px-3.5 py-2.5">
            <Shield size={16} className="shrink-0 text-brand-500 dark:text-brand-400" />
            <span className="text-[12px] font-medium text-brand-600 dark:text-brand-300">
              Protected area — authorized personnel only
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] font-medium text-red-500 dark:text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft dark:text-slate-400"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-slate-500"
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jobalertx.com"
                  autoComplete="email"
                  required
                  className="admin-input w-full pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft dark:text-slate-400"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-slate-500"
                />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="admin-input w-full pl-10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-teal-600 to-navy-900 border border-teal-400/30 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:brightness-110 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to main site */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-ink-muted hover:text-teal-400 dark:text-slate-400 dark:hover:text-teal-200 transition-colors"
          >
            ← Back to Jharkhand JobAlert X Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
