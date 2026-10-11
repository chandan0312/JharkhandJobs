// ---------------------------------------------------------------------------
// AuthContext — manages user authentication state across the app.
// ---------------------------------------------------------------------------
// Supports: email/password login, email/password registration, Google OAuth,
// and admin authentication. Stores JWT in localStorage and auto-validates
// on mount.
// ---------------------------------------------------------------------------

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  loginAdmin as loginApi,
  registerUser as registerApi,
  googleAuth as googleAuthApi,
  getMe,
} from '../services/api.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'sarkarifynx-token'

function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

function storeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!getStoredToken())

  // On mount, validate stored token
  useEffect(() => {
    const stored = getStoredToken()
    if (!stored) {
      setLoading(false)
      return
    }
    getMe(stored)
      .then((u) => {
        setUser(u)
        setToken(stored)
      })
      .catch(() => {
        // Token expired or invalid
        storeToken(null)
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  /** Helper to set auth state from an API response { token, user } */
  const setAuth = useCallback((data) => {
    storeToken(data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  /** Email/password login (works for both admin and regular users) */
  const login = useCallback(
    async (email, password) => {
      const data = await loginApi(email, password)
      setAuth(data)
      return data
    },
    [setAuth]
  )

  /** Register a new regular user account */
  const register = useCallback(
    async (name, email, password) => {
      const data = await registerApi(name, email, password)
      setAuth(data)
      return data
    },
    [setAuth]
  )

  /** Google OAuth login/signup */
  const googleLogin = useCallback(
    async (credential) => {
      const data = await googleAuthApi(credential)
      setAuth(data)
      return data
    },
    [setAuth]
  )

  const logout = useCallback(() => {
    storeToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin' || user?.role === 'editor'

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      googleLogin,
      logout,
      loading,
      isAuthenticated: !!token && !!user,
      isAdmin,
    }),
    [user, token, login, register, googleLogin, logout, loading, isAdmin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
