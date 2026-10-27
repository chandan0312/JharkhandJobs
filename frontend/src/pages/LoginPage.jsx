// LoginPage — Auth screen per design prompt spec
// Full screen, conic-gradient spinner on load, centred card with design tokens.

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'
import SEOHead from '../components/SEOHead.jsx'
import {
  GOOGLE_CLIENT_ID,
  loadGoogleIdentity,
  renderGoogleButton,
} from '../services/googleAuth.js'

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

/* ── Field wrapper ─────────────────────────────────────────────────── */
function Field({ id, label, children, action }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold"
          style={{ color: 'var(--text-2)' }}
        >
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function LoginPage() {
  const { login, googleLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email,          setEmail]          = useState('')
  const [password,       setPassword]       = useState('')
  const [showPassword,   setShowPassword]   = useState(false)
  const [error,          setError]          = useState('')
  const [loading,        setLoading]        = useState(false)
  const [googleLoading,  setGoogleLoading]  = useState(false)
  const [googleState,    setGoogleState]    = useState(GOOGLE_CLIENT_ID ? 'loading' : 'unconfigured')
  const googleBtnRef = useRef(null)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  // Google Identity Services
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
    [googleLogin, navigate, from],
  )

  const callbackRef = useRef(handleGoogleCallback)
  useEffect(() => { callbackRef.current = handleGoogleCallback }, [handleGoogleCallback])

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
      .catch(() => { if (!cancelled) setGoogleState('error') })
    return () => { cancelled = true }
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
    /* Full screen — white in light, #042656 in dark (per design prompt AUTH spec) */
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: 'var(--bg)' }}
    >
      <SEOHead title="Login" noIndex={true} />
      {/* Faint geometric grid */}
      <div className="footer-geo-pattern" style={{ opacity: 0.04 }} aria-hidden="true" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 h-80 w-80 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-15"
          style={{ background: '#6941c6' }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] animate-fade-in">

        {/* Logo + headings */}
        <div className="mb-8 flex flex-col items-center text-center gap-3">
          <Link to="/" className="transition-transform hover:scale-105" aria-label="Home">
            <SarkariEmblem size={56} />
          </Link>
          <div>
            <h1
              className="text-[26px] font-bold tracking-[-0.01em]"
              style={{ color: 'var(--text)' }}
            >
              Welcome back
            </h1>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Sign in to your{' '}
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                Jharkhand JobAlert X
              </span>{' '}
              account
            </p>
          </div>
        </div>

        {/* Auth card surface */}
        <div
          className="rounded-dialog p-6 sm:p-8"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Error alert */}
          {error && (
            <div
              className="mb-5 flex items-start gap-2.5 rounded-row px-4 py-3 text-[13px] font-medium"
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)',
              }}
              role="alert"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In */}
          {googleState !== 'unconfigured' && (
            <>
              <div className="w-full">
                <div ref={googleBtnRef} className="flex w-full justify-center overflow-hidden rounded-btn min-h-[44px]" />

                {googleState === 'loading' && (
                  <div
                    className="flex w-full items-center justify-center gap-2.5 rounded-btn px-5 py-3 text-[13px] font-medium"
                    style={{
                      background: 'var(--surface-2)',
                      color: 'var(--text-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <GoogleIcon size={18} />
                    <span>Loading Google Sign-In…</span>
                  </div>
                )}

                {googleState === 'error' && (
                  <div
                    className="flex items-start gap-2 rounded-row px-4 py-3 text-[12px] font-medium"
                    style={{
                      background: 'var(--warning-bg)',
                      color: 'var(--warning)',
                      border: '1px solid color-mix(in srgb, var(--warning) 25%, transparent)',
                    }}
                    role="alert"
                  >
                    <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>Google Sign-In could not load — please use email below.</span>
                  </div>
                )}

                {googleLoading && (
                  <div
                    className="mt-2 flex items-center justify-center gap-2 text-[12px] font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    <div
                      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent"
                      style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                    />
                    <span>Signing in with Google…</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                <span className="eyebrow">or sign in with email</span>
                <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              </div>
            </>
          )}

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Field id="login-email" label="Email address">
              <div className="relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                  aria-hidden="true"
                />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="input pl-9"
                  style={{ height: 40 }}
                />
              </div>
            </Field>

            {/* Password */}
            <Field
              id="login-password"
              label="Password"
              action={
                <button
                  type="button"
                  className="text-[12px] font-semibold transition-colors"
                  style={{ color: 'var(--accent)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent)' }}
                >
                  Forgot password?
                </button>
              }
            >
              <div className="relative">
                <Lock
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="input pl-9 pr-10"
                  style={{ height: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                </button>
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{ height: 44, fontSize: 14, marginTop: 8 }}
            >
              {loading ? (
                <>
                  <div
                    className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                    style={{ borderColor: 'var(--on-accent)', borderTopColor: 'transparent' }}
                  />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign-up link */}
        <p className="mt-6 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold transition-colors"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--accent)' }}
          >
            Create one free
          </Link>
        </p>

        {/* Trust indicator */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <ShieldCheck size={12} style={{ color: 'var(--success)' }} aria-hidden="true" />
          <span>Secure · 100% Free · Trusted by 1M+ students</span>
        </div>
      </div>
    </div>
  )
}
