import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })
  const { pathname } = useLocation()

  // Close the mobile drawer + reset scroll on route change
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('sidebar_collapsed', String(next))
      } catch {}
      return next
    })
  }

  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      handleToggleCollapse()
    } else {
      setMenuOpen((o) => !o)
    }
  }

  const sidebarWidth = sidebarCollapsed ? 72 : 260

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Fixed top header (auto height — includes ticker) */}
      <Header onMenuClick={handleMenuClick} />

      {/* Left sidebar */}
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main content — offset for header + sidebar */}
      <div
        className="layout-transition flex min-h-screen flex-col"
        style={{
          paddingTop: 'var(--header-height, 64px)',
        }}
      >
        {/* Responsive desktop sidebar offset */}
        <style>{`
          @media (min-width: 1024px) {
            .layout-transition {
              padding-left: ${sidebarWidth}px !important;
            }
          }
        `}</style>

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-3 py-5 sm:px-5 sm:py-6 lg:px-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
