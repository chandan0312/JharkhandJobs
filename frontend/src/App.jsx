import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import usePageViewTracker from './hooks/usePageViewTracker.js'

// Keep Home eager for instant first-paint on initial landing
import Home from './pages/Home.jsx'

// Lazy-loaded Public Pages (loaded on-demand to keep initial bundle tiny)
const JobDetails    = lazy(() => import('./pages/JobDetails.jsx'))
const CategoryPage  = lazy(() => import('./pages/CategoryPage.jsx'))
const ExamsPage     = lazy(() => import('./pages/ExamsPage.jsx'))
const SearchPage    = lazy(() => import('./pages/SearchPage.jsx'))
const LoginPage     = lazy(() => import('./pages/LoginPage.jsx'))
const SignUpPage    = lazy(() => import('./pages/SignUpPage.jsx'))
const FeedbackPage  = lazy(() => import('./pages/FeedbackPage.jsx'))
const Placeholder   = lazy(() => import('./pages/Placeholder.jsx'))

// Trust & Legal pages (new standalone pages replacing /exams stubs)
const AboutPage      = lazy(() => import('./pages/AboutPage.jsx'))
const ContactPage    = lazy(() => import('./pages/ContactPage.jsx'))
const PrivacyPage    = lazy(() => import('./pages/PrivacyPage.jsx'))
const TermsPage      = lazy(() => import('./pages/TermsPage.jsx'))
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage.jsx'))

// Lazy-loaded Admin Pages (isolated from public users)
const AdminLogin     = lazy(() => import('./pages/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))
const AdminPosts     = lazy(() => import('./pages/AdminPosts.jsx'))
const AdminPostForm  = lazy(() => import('./pages/AdminPostForm.jsx'))
const AdminFeedback  = lazy(() => import('./pages/AdminFeedback.jsx'))
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics.jsx'))

/** Sleek, low-overhead fallback loader for route transitions */
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 animate-fade-in">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
      <span className="text-[12px] font-semibold text-ink-muted">Loading Jharkhand JobAlert X…</span>
    </div>
  )
}

/** Inner component that uses router hooks (must be inside BrowserRouter) */
function AppRoutes() {
  usePageViewTracker()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Auth Routes (noindex applied inside each page via SEOHead) */}
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/signup"       element={<SignUpPage />} />
        <Route path="/admin/login"  element={<AdminLogin />} />

        {/* Protected Admin Routes (Dedicated Admin Layout) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="posts"        element={<AdminPosts />} />
          <Route path="posts/new"    element={<AdminPostForm />} />
          <Route path="posts/:id"    element={<AdminPostForm />} />
          <Route path="feedback"     element={<AdminFeedback />} />
          <Route path="analytics"    element={<AdminAnalytics />} />
        </Route>

        {/* Main User Portal Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* Content detail pages */}
          <Route path="job/:id"           element={<JobDetails />} />

          {/* Jharkhand-specific routes */}
          <Route path="rojgar-mela"       element={<CategoryPage defaultSlug="rojgar-mela" />} />
          <Route path="private-jobs"      element={<CategoryPage defaultSlug="private" />} />
          <Route path="category/:slug"    element={<CategoryPage />} />
          <Route path="latest/:kind"      element={<CategoryPage />} />
          <Route path="exams"             element={<ExamsPage />} />

          {/* Search — noindex handled inside SearchPage via SEOHead noIndex prop */}
          <Route path="search"            element={<SearchPage />} />

          {/* Trust & Legal pages */}
          <Route path="about"             element={<AboutPage />} />
          <Route path="contact"           element={<ContactPage />} />
          <Route path="privacy"           element={<PrivacyPage />} />
          <Route path="terms"             element={<TermsPage />} />
          <Route path="disclaimer"        element={<DisclaimerPage />} />

          {/* Feedback — noindex (form page, not a search landing page) */}
          <Route path="feedback"          element={<FeedbackPage />} />

          {/* Redirect /notifications → /feedback */}
          <Route path="notifications"     element={<Navigate to="/feedback" replace />} />

          {/* User secondary destinations (noindex — personal/auth pages) */}
          <Route path="recent"            element={<Placeholder />} />
          <Route path="bookmarked"        element={<Placeholder />} />
          <Route path="saved"             element={<Placeholder />} />
          <Route path="profile"           element={<Placeholder />} />
          <Route path="settings"          element={<Placeholder />} />
          <Route path="logout"            element={<Placeholder />} />

          {/* 404 Catch-all */}
          <Route path="*"                 element={<Placeholder />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
