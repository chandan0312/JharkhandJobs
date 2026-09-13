// ---------------------------------------------------------------------------
// ProtectedRoute — guards admin pages behind JWT authentication + admin role.
// ---------------------------------------------------------------------------
// A valid token is not sufficient: every registered visitor holds one. Pages
// wrapped here also require an `admin`/`editor` role unless `adminOnly` is
// explicitly turned off. The server enforces the same rule — this only keeps
// the UI honest.
// ---------------------------------------------------------------------------

import { Navigate, useLocation, Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, adminOnly = true }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1c]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Verifying access…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Signed in, but not staff. Bouncing to the login screen would be confusing
  // (they *are* logged in), so explain the refusal instead.
  if (adminOnly && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1c] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0d1326] p-8 text-center shadow-2xl">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <ShieldAlert size={26} />
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Admin access required
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-slate-400">
            This area is limited to SarkariFynx staff accounts. Your account does not have
            administrator permissions.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110"
          >
            <ArrowLeft size={16} />
            Back to SarkariFynx
          </Link>
        </div>
      </div>
    )
  }

  return children
}
