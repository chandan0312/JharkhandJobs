// ---------------------------------------------------------------------------
// LoginPage — dark-themed user login with email/password + Continue with Google.
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react'
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

export default function LoginPage() {
  const { login, googleLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  // 'unconfigured' | 'loading' | 'ready' | 'error'
  const [googleState, setGoogleState] = useState(GOOGLE_CLIENT_ID ? 'loading' : 'unconfigured')
  const googleBtnRef = useRef(null)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  // Google Identity Services callback
  const handleGoogleCallback = useCallback(
    async (response) => {
      if (!response?.credential) return
      setGoogleLoading(true)
      setError('')
      try {
        await googleLogin(response.credential)
        navigate(from, { replace: true })
      } catch (err) {
        setError(err.message || 'Google sign-in failed. Please try again.')
      } finally {
        setGoogleLoading(false)
      }
    },
    [googleLogin, navigate, from]
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
          text: 'continue_with',
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 py-12 transition-colors duration-200 dark:bg-[#050814]">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[140px] dark:bg-orange-500/8" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px] dark:bg-purple-600/8" />
        <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-in">
        {/* Logo & Title */}
        <div className="mb-7 flex flex-col items-center text-center">
          <Link to="/" className="mb-3.5 transition-transform hover:scale-105" aria-label="Job Alert X Home">
            <SarkariEmblem size={56} />
          </Link>
          <h1 className="text-[26px] font-black tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-[13.5px] font-medium text-slate-500 dark:text-slate-400">
            Sign in to your <span className="font-bold text-orange-600 dark:text-orange-400">Job Alert X</span> account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-surface p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-8 dark:bg-[#080d1e]/90 dark:border-white/10 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[13px] font-semibold text-red-600 dark:text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In */}
          {googleState !== 'unconfigured' && (
            <>
              <div className="w-full">
                <div
                  ref={googleBtnRef}
                  className="flex w-full justify-center overflow-hidden rounded-xl min-h-[44px]"
                />

                {googleState === 'loading' && (
                  <div className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-[13.5px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
                    <GoogleIcon size={19} />
                    <span>Loading Google Sign-In…</span>
                  </div>
                )}

                {googleState === 'error' && (
                  <div className="flex w-full items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] font-medium text-amber-700 dark:text-amber-300">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>
                      Google Sign-In could not load — please sign in with your email below.
                    </span>
                  </div>
                )}

                {googleLoading && (
                  <div className="mt-2.5 flex items-center justify-center gap-2 text-[12.5px] font-medium text-orange-600 dark:text-orange-400">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                    <span>Signing you in with Google…</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  or sign in with email
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-4 text-[14px] font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/[0.07] dark:focus:border-orange-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-password" className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button type="button" className="text-[12px] font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-11 text-[14px] font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/[0.07] dark:focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[13.5px] font-medium text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500">
            <Sparkles size={12} className="text-amber-500" />
            <span>Trusted by 1M+ students</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500">
            <Lock size={12} className="text-emerald-500" />
            <span>256-bit secure encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}
