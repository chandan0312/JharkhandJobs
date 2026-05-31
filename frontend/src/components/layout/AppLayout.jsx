import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Briefcase, Calendar, FileText, Award, BookOpen, 
  Users, MessageSquare, HelpCircle, FolderOpen, Settings, TrendingUp, LogOut, 
  ChevronDown, ChevronRight, Bell, Mail, Search, Menu 
} from 'lucide-react';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [careerGuideExpanded, setCareerGuideExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unified global sidebar items list (Excluding the collapsible sub-menus)
  const sidebarItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Exams', path: '/exams', icon: Calendar },
    { name: 'Admit Cards', path: '/exams?category=Admit%20Card', icon: FileText },
    { name: 'Results', path: '/exams?category=Results', icon: Award }
  ];

  // Admin specific lists
  const adminItems = [
    { name: 'Admin Console', path: '/admin', icon: Settings },
    { name: 'Users List', path: '/admin', icon: Users },
    { name: 'Reports', path: '/admin', icon: TrendingUp }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          onClick={() => setSidebarCollapsed(true)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
      )}

      {/* ==================== LEFT SIDEBAR NAVIGATION ==================== */}
      <aside style={{
        width: sidebarCollapsed ? (isMobile ? '0px' : '76px') : '265px',
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1000,
        boxShadow: '4px 0 25px rgba(0,0,0,0.1)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        transform: isMobile && sidebarCollapsed ? 'translateX(-100%)' : 'translateX(0)'
      }}>
        {/* Brand Header */}
        <div 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{ 
            padding: '20px 0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            paddingLeft: sidebarCollapsed ? '0' : '24px',
            paddingRight: sidebarCollapsed ? '0' : '16px',
            gap: '12px', 
            borderBottom: '1px solid #1E293B',
            height: '70px',
            boxSizing: 'border-box',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/assets/images/logo.png" alt="Jharkhand Jobs Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', backgroundColor: 'transparent' }} />
            {!sidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px' }}>Jharkhand Jobs</span>
                <span style={{ fontSize: '10px', color: '#86EFAC', fontWeight: '600' }}>Apna Jharkhand, Apna Career</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </div>
          )}
        </div>

        {/* Dynamic profile section card (Aspirant or Logged-in user) */}
        <div style={{ padding: sidebarCollapsed ? '16px 0' : '24px 20px', textAlign: 'center', borderBottom: '1px solid #1E293B' }}>
          <div style={{ position: 'relative', width: '44px', height: '44px', margin: '0 auto' }}>
            <img src={user ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"} 
                 alt="Avatar" 
                 style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: user ? '3px solid #1B8C0A' : '3px solid #64748B', transition: 'all 0.25s ease' }} />
            <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', backgroundColor: user ? '#10B981' : '#94A3B8', border: '1.5px solid #0F172A', borderRadius: '50%' }} />
          </div>
          {!sidebarCollapsed && (
            <>
              <h4 style={{ color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '4px', marginTop: '12px' }}>
                {user ? user.name : 'Guest Aspirant'}
              </h4>
              
              {user ? (
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(27, 140, 10, 0.2)', color: '#86EFAC', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', textTransform: 'capitalize' }}>
                  {user.role}
                </span>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  style={{
                    fontSize: '10px', backgroundColor: '#1B8C0A', color: 'white', padding: '3px 12px',
                    borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-block', border: 'none'
                  }}
                >
                  Sign In
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation Items List */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: sidebarCollapsed ? '16px 6px' : '16px 12px' }}>
          {!sidebarCollapsed && <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', color: '#475569', paddingLeft: '16px', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Portal Navigation</span>}
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px', listStyle: 'none', padding: 0, margin: 0 }}>
            {sidebarItems.map((item, idx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={idx}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                      padding: sidebarCollapsed ? '12px 0' : '10px 16px', 
                      fontSize: '13px', 
                      fontWeight: active ? '600' : '500',
                      color: active ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: active ? '#1E293B' : 'transparent',
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s ease',
                      borderLeft: active ? '4px solid #1B8C0A' : '4px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                      <Icon size={18} style={{ color: active ? '#1B8C0A' : '#64748B' }} />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </div>
                  </Link>
                </li>
              );
            })}

            {/* Collapsible Career Guide for Aspirant */}
            <li>
              <button
                onClick={() => !sidebarCollapsed && setCareerGuideExpanded(!careerGuideExpanded)}
                style={{
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  padding: sidebarCollapsed ? '12px 0' : '10px 16px', 
                  fontSize: '13px', 
                  fontWeight: '500',
                  color: '#94A3B8', 
                  backgroundColor: 'transparent',
                  borderRadius: '8px', 
                  cursor: sidebarCollapsed ? 'default' : 'pointer', 
                  border: 'none', 
                  textAlign: 'left',
                  outline: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                  <FolderOpen size={18} style={{ color: '#64748B' }} />
                  {!sidebarCollapsed && <span>Career Guide</span>}
                </div>
                {!sidebarCollapsed && (
                  careerGuideExpanded ? <ChevronDown size={14} style={{ color: '#64748B' }} /> : <ChevronRight size={14} style={{ color: '#64748B' }} />
                )}
              </button>
              
              {!sidebarCollapsed && careerGuideExpanded && (
                <ul style={{ listStyle: 'none', paddingLeft: '28px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>
                    <Link
                      to="/blog?tab=discussions"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', 
                        fontWeight: location.search.includes('tab=discussions') ? '600' : '500',
                        color: location.search.includes('tab=discussions') ? '#FFFFFF' : '#94A3B8',
                        backgroundColor: location.search.includes('tab=discussions') ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease',
                        borderLeft: location.search.includes('tab=discussions') ? '3px solid #1B8C0A' : '3px solid transparent'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#64748B' }}>◇</span>
                      <span>Discussions</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog?tab=articles"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', 
                        fontWeight: location.search.includes('tab=articles') ? '600' : '500',
                        color: location.search.includes('tab=articles') ? '#FFFFFF' : '#94A3B8',
                        backgroundColor: location.search.includes('tab=articles') ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease',
                        borderLeft: location.search.includes('tab=articles') ? '3px solid #1B8C0A' : '3px solid transparent'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#64748B' }}>◇</span>
                      <span>Articles & Blogs</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Quizzes */}
            <li>
              <Link
                to="/quiz"
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '10px 16px', 
                  fontSize: '13px', 
                  fontWeight: isActive('/quiz') ? '600' : '500',
                  color: isActive('/quiz') ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive('/quiz') ? '#1E293B' : 'transparent',
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  borderLeft: isActive('/quiz') ? '4px solid #1B8C0A' : '4px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                  <HelpCircle size={18} style={{ color: isActive('/quiz') ? '#1B8C0A' : '#64748B' }} />
                  {!sidebarCollapsed && <span>Quizzes</span>}
                </div>
              </Link>
            </li>

            {/* Contacts / Enquiries */}
            <li>
              <Link
                to="/contact"
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '10px 16px', 
                  fontSize: '13px', 
                  fontWeight: isActive('/contact') ? '600' : '500',
                  color: isActive('/contact') ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive('/contact') ? '#1E293B' : 'transparent',
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  borderLeft: isActive('/contact') ? '4px solid #1B8C0A' : '4px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                  <Mail size={18} style={{ color: isActive('/contact') ? '#1B8C0A' : '#64748B' }} />
                  {!sidebarCollapsed && <span>Contacts / Enquiries</span>}
                </div>
              </Link>
            </li>

            {/* Admin specific lists */}
            {user && user.role === 'admin' && (
              <>
                {!sidebarCollapsed && <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', color: '#475569', paddingLeft: '16px', letterSpacing: '1px', display: 'block', marginTop: '16px', marginBottom: '8px' }}>Administration</span>}
                {adminItems.map((item, idx) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={idx}>
                      <Link
                        to={item.path}
                        style={{
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                          padding: sidebarCollapsed ? '12px 0' : '10px 16px', 
                          fontSize: '13px', 
                          fontWeight: active ? '600' : '500',
                          color: active ? '#FFFFFF' : '#94A3B8',
                          backgroundColor: active ? '#1E293B' : 'transparent',
                          borderRadius: '8px', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s ease',
                          borderLeft: active ? '4px solid #1B8C0A' : '4px solid transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                          <Icon size={18} style={{ color: active ? '#1B8C0A' : '#64748B' }} />
                          {!sidebarCollapsed && <span>{item.name}</span>}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </nav>

        {/* Sidebar Footer Sign Out (if logged in) */}
        {user && (
          <div style={{ padding: sidebarCollapsed ? '16px 8px' : '16px', borderTop: '1px solid #1E293B' }}>
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: sidebarCollapsed ? '0' : '8px',
                padding: '10px', 
                backgroundColor: '#1E293B', 
                color: '#EF4444', 
                borderRadius: '8px',
                fontSize: '13px', 
                fontWeight: '600', 
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <LogOut size={16} />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        )}
      </aside>

      {/* ==================== RIGHT VIEW CONTAINER ==================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Unified Top Header Bar */}
        <header style={{
          height: '70px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 900, boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          {/* Header Search & Sidebar Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '450px' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                marginRight: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Menu size={20} />
            </button>

            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                placeholder="Search jobs, exams...          ⌘K" 
                style={{
                  width: '100%', padding: '8px 16px 8px 36px', fontSize: '13px',
                  backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '20px',
                  color: '#334155', outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Messages */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Mail size={18} style={{ color: '#64748B' }} />
              <span style={{ 
                position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#EF4444', 
                color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 4px', borderRadius: '50%',
                lineHeight: 1
              }}>12</span>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={18} style={{ color: '#64748B' }} />
              <span style={{ 
                position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#EF4444', 
                color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 4px', borderRadius: '50%',
                lineHeight: 1
              }}>6</span>
            </div>

            {/* Profile Dropdown */}
            {user ? (
              <div 
                onClick={() => navigate('/admin')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderLeft: '1px solid #E2E8F0', paddingLeft: '20px' }}
              >
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
                     alt="Profile" 
                     style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', lineHeight: '1.2' }}>{user.name}</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{user.role}</span>
                </div>
                <ChevronDown size={14} style={{ color: '#64748B' }} />
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                style={{
                  padding: '6px 16px', border: '1.5px solid #1B8C0A', borderRadius: '20px', 
                  color: '#1B8C0A', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Scrollable View Render Area */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AppLayout;
