// ---------------------------------------------------------------------------
// SignUpPage — dark-themed user registration with email/password + Google.
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'
import {
  GOOGLE_CLIENT_ID,
  loadGoogleIdentity,
  renderGoogleButton,
} from '../services/googleAuth.js'

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

const FEATURES = [
  { icon: Zap, text: 'Instant job alerts & notifications', color: '#f59e0b' },
  { icon: Shield, text: 'Save & bookmark favorite jobs', color: '#6d70f0' },
  { icon: Sparkles, text: 'Personalized exam recommendations', color: '#10b981' },
]

export default function SignUpPage() {
  const { register, googleLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  // 'unconfigured' | 'loading' | 'ready' | 'error'
  const [googleState, setGoogleState] = useState(GOOGLE_CLIENT_ID ? 'loading' : 'unconfigured')
  const googleBtnRef = useRef(null)

  // Password strength
  const pwStrength = (() => {
    if (!password) return { level: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' }
    if (score === 2) return { level: 2, label: 'Fair', color: '#f59e0b' }
    if (score === 3) return { level: 3, label: 'Good', color: '#10b981' }
    return { level: 4, label: 'Strong', color: '#22c55e' }
  })()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  // Google callback
  const handleGoogleCallback = useCallback(
    async (response) => {
      if (!response?.credential) return
      setGoogleLoading(true)
      setError('')
      try {
        await googleLogin(response.credential)
        navigate('/', { replace: true })
      } catch (err) {
        setError(err.message || 'Google sign-up failed.')
      } finally {
        setGoogleLoading(false)
      }
    },
    [googleLogin, navigate]
  )

  // Held in a ref so re-initialising GSI is never needed just because the
  // callback identity changed.
  const callbackRef = useRef(handleGoogleCallback)
  useEffect(() => {
    callbackRef.current = handleGoogleCallback
  }, [handleGoogleCallback])

  // Initialise Google Identity Services once and draw the official button.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    let cancelled = false
    loadGoogleIdentity()
      .then(() => {
        if (cancelled || !googleBtnRef.current) return
        renderGoogleButton(googleBtnRef.current, {
          onCredential: (res) => callbackRef.current(res),
          text: 'signup_with',
        })
        setGoogleState('ready')
      })
      .catch(() => {
        if (!cancelled) setGoogleState('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 py-12 transition-colors duration-200 dark:bg-[#050814]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/8 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-600/8 blur-[140px]" />
        <div className="absolute top-2/3 left-1/3 h-64 w-64 rounded-full bg-orange-500/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[480px] animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="mb-4 transition-transform hover:scale-105">
            <SarkariEmblem size={52} />
          </Link>
          <h1 className="text-[26px] font-black tracking-tight text-ink dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-muted dark:text-slate-400">
            Join India's largest government jobs community
          </p>
        </div>

        {/* Features strip */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-ink-faint dark:text-slate-500">
              <f.icon size={13} style={{ color: f.color }} />
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-hairline bg-surface p-6 shadow-xl backdrop-blur-xl sm:p-8 dark:bg-[#0d1326]/80 dark:border-white/[0.08]">
          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] font-medium text-red-500 dark:text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-Up */}
          {googleState !== 'unconfigured' && (
            <>
              <div className="w-full">
                <div
                  ref={googleBtnRef}
                  className="flex w-full justify-center overflow-hidden rounded-xl [color-scheme:light]"
                />

                {googleState === 'loading' && (
                  <div className="flex w-full items-center justify-center gap-3 rounded-xl border border-hairline bg-subtle px-5 py-3 text-[14px] font-semibold text-ink-muted dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-slate-500">
                    <GoogleIcon size={20} />
                    Loading Google Sign-In…
                  </div>
                )}

                {googleState === 'error' && (
                  <div className="flex w-full items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[12.5px] font-medium text-amber-600 dark:text-amber-300">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>
                      Google Sign-Up could not load — it may be blocked by an extension or your
                      network. Please create your account with an email below.
                    </span>
                  </div>
                )}

                {googleLoading && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-[12.5px] font-medium text-ink-muted dark:text-slate-400">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                    Creating your account with Google…
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-hairline dark:bg-white/[0.08]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint dark:text-slate-600">
                  or sign up with email
                </span>
                <div className="h-px flex-1 bg-hairline dark:bg-white/[0.08]" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft dark:text-slate-400">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-slate-500" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ravi Kumar"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-hairline bg-page py-3 pl-10 pr-4 text-[14px] text-ink placeholder:text-ink-faint transition-all focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-slate-500" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-hairline bg-page py-3 pl-10 pr-4 text-[14px] text-ink placeholder:text-ink-faint transition-all focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-slate-500" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-hairline bg-page py-3 pl-10 pr-11 text-[14px] text-ink placeholder:text-ink-faint transition-all focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-white/[0.06]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            bar <= pwStrength.level ? pwStrength.color : 'rgba(128,128,128,0.2)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: pwStrength.color }}>
                    {pwStrength.label}
                    {pwStrength.level < 3 && (
                      <span className="text-ink-faint dark:text-slate-600"> — Use uppercase, numbers & symbols</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <p className="text-[11.5px] leading-relaxed text-ink-faint dark:text-slate-600">
              By creating an account, you agree to our{' '}
              <Link to="/exams" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">Terms of Service</Link>{' '}
              and{' '}
              <Link to="/exams" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40 hover:brightness-110 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[13.5px] text-ink-muted dark:text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-6 space-y-2">
          {['Access 2,000+ government job listings', 'Get instant notification alerts', 'Track your applications & exams'].map(
            (text, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] text-ink-muted dark:text-slate-600">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <span>{text}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
