import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Briefcase, Calendar, FileText, Award, BookOpen, 
  Users, MessageSquare, HelpCircle, FolderOpen, Settings, TrendingUp, LogOut, 
  ChevronDown, ChevronRight, Bell, Mail, Search, Menu, Bookmark 
} from 'lucide-react';
import UserAvatar from '../UserAvatar';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [careerGuideExpanded, setCareerGuideExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    const query = globalSearch.trim();
    if (query) {
      if (location.pathname.startsWith('/exams')) {
        navigate(`/exams?search=${encodeURIComponent(query)}`);
      } else {
        navigate(`/jobs?search=${encodeURIComponent(query)}`);
      }
      setGlobalSearch('');
    }
  };


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

  if (user) {
    sidebarItems.push({ name: 'Saved Jobs', path: '/saved-jobs', icon: Bookmark });
  }

  // Admin specific lists
  const adminItems = [
    { name: 'Admin Console', path: '/admin', icon: Settings },
    { name: 'Users List', path: '/admin', icon: Users },
    { name: 'Reports', path: '/admin', icon: TrendingUp }
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      const [pathName, queryString] = path.split('?');
      if (location.pathname !== pathName) return false;
      
      const pathParams = new URLSearchParams(queryString);
      const locParams = new URLSearchParams(location.search);
      
      for (const [key, val] of pathParams.entries()) {
        if (decodeURIComponent(locParams.get(key) || '') !== decodeURIComponent(val)) {
          return false;
        }
      }
      return true;
    }
    
    if (path === '/exams') {
      const locParams = new URLSearchParams(location.search);
      const category = locParams.get('category');
      if (category && category !== 'All') {
        return false;
      }
      return location.pathname.startsWith('/exams');
    }

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
                      to="/discussions"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', 
                        fontWeight: location.pathname === '/discussions' ? '600' : '500',
                        color: location.pathname === '/discussions' ? '#FFFFFF' : '#94A3B8',
                        backgroundColor: location.pathname === '/discussions' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease',
                        borderLeft: location.pathname === '/discussions' ? '3px solid #1B8C0A' : '3px solid transparent'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#64748B' }}>◇</span>
                      <span>Discussions</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', 
                        fontWeight: location.pathname === '/blog' ? '600' : '500',
                        color: location.pathname === '/blog' ? '#FFFFFF' : '#94A3B8',
                        backgroundColor: location.pathname === '/blog' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease',
                        borderLeft: location.pathname === '/blog' ? '3px solid #1B8C0A' : '3px solid transparent'
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

            <form onSubmit={handleGlobalSearchSubmit} style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                placeholder="Search jobs, companies... (Press Enter)" 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                style={{
                  width: '100%', padding: '8px 16px 8px 36px', fontSize: '13px',
                  backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '20px',
                  color: '#334155', outline: 'none'
                }}
              />
            </form>
          </div>

          {/* Controls / User Account Pill */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <div 
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/profile')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  cursor: 'pointer', 
                  padding: '5px 16px 5px 6px',
                  borderRadius: '30px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ position: 'relative', display: 'flex' }}>
                  <UserAvatar user={user} size={34} />
                  <span style={{ 
                    position: 'absolute', 
                    bottom: '0px', 
                    right: '0px', 
                    width: '9px', 
                    height: '9px', 
                    backgroundColor: '#10B981', 
                    border: '1.5px solid #FFFFFF', 
                    borderRadius: '50%' 
                  }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ 
                    fontSize: '12.5px', 
                    fontWeight: '700', 
                    color: '#0F172A', 
                    lineHeight: '1.2' 
                  }}>
                    {user.name}
                  </span>
                  <span style={{ 
                    fontSize: '9.5px', 
                    fontWeight: '750', 
                    textTransform: 'uppercase',
                    color: user.role === 'admin' ? '#15803D' : '#64748B',
                    letterSpacing: '0.5px'
                  }}>
                    {user.role === 'admin' ? '🛡️ Administrator' : '🎓 Candidate'}
                  </span>
                </div>
                <ChevronDown size={13} style={{ color: '#64748B', marginLeft: '2px' }} />
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                style={{
                  padding: '8px 20px', 
                  border: '1px solid #1B8C0A', 
                  borderRadius: '30px', 
                  color: '#1B8C0A', 
                  fontSize: '12.5px', 
                  fontWeight: '750', 
                  cursor: 'pointer',
                  backgroundColor: 'rgba(27, 140, 10, 0.04)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(27, 140, 10, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1B8C0A';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(27, 140, 10, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(27, 140, 10, 0.04)';
                  e.currentTarget.style.color = '#1B8C0A';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(27, 140, 10, 0.08)';
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
