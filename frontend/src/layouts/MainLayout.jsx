import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Expand sidebar by default on desktop so text labels are persistent (Issue 13)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile drawer + smoothly reset scroll whenever the route changes
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-page text-ink antialiased selection:bg-brand-500 selection:text-white">
      {/* Fixed Full-Width Top Header Bar */}
      <Header onMenuClick={() => setMenuOpen((o) => !o)} />

      {/* Collapsible Left Navigation Menu (Below Header) */}
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area — dynamically adjusting padding */}
      <div
        className="layout-transition flex min-h-screen flex-col pt-[72px]"
        style={{ paddingLeft: '' }}
      >
        {/* Dynamic left padding for desktop sidebar with hardware acceleration */}
        <style>{`
          @media (min-width: 1024px) {
            .layout-transition {
              padding-left: ${sidebarCollapsed ? '72px' : '260px'};
            }
          }
        `}</style>
        
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
