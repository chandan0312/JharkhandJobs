import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Briefcase, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Monitor scrolling to apply background shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        
        {/* Logo Section */}
        <Link to="/" className="nav-logo">
          <img src="/assets/images/logo.png" alt="Jharkhand Jobs" className="nav-logo-img" />
          <div className="logo-text">
            <span className="logo-title"><span style={{color: '#001F3F'}}>Jharkhand</span> <span style={{color: '#22C55E'}}>Jobs</span></span>
            <span className="logo-subtitle">Apna Jharkhand, Apna Career</span>
          </div>
        </Link>

        {/* Desktop Menu Tabs */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              {t('nav.home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {t('nav.jobs')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/govt-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {t('nav.govtJobs')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/exams" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {t('nav.exams')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/quiz" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
              {t('nav.quiz')}
              <span style={{ 
                position: 'absolute', 
                top: '-2px', 
                right: '4px', 
                backgroundColor: '#EF4444', 
                color: 'white', 
                fontSize: '8px', 
                fontWeight: '900', 
                padding: '1px 4px', 
                borderRadius: '4px', 
                textTransform: 'uppercase',
                lineHeight: '1',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)'
              }}>
                {t('nav.new')}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/companies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {t('nav.companies')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {t('nav.careerGuide')}
            </NavLink>
          </li>
          {user && user.role === 'admin' && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: '#157008', fontWeight: 'bold' }}>
                {t('nav.adminPanel')}
              </NavLink>
            </li>
          )}
          
          {/* Mobile Login / User Options inside Mobile Nav */}
          {isOpen && (
            <li style={{ marginTop: '20px', width: '100%' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '14px', color: '#374151', padding: '0 14px' }}>Hi, <strong>{user.name}</strong></p>
                  <button onClick={handleLogout} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    <LogOut size={16} /> {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm" style={{ width: '100%', display: 'flex' }}>
                  {t('nav.loginRegister')}
                </Link>
              )}
            </li>
          )}
        </ul>

        {/* Action Elements */}
        <div className="nav-actions">
          {/* English / Hindi Toggle */}
          <div className="lang-toggle">
            <span className={`lang-option ${language === 'EN' ? 'active' : ''}`} onClick={() => setLanguage('EN')}>EN</span>
            <span className="lang-divider">|</span>
            <span className={`lang-option ${language === 'HI' ? 'active' : ''}`} onClick={() => setLanguage('HI')}>हिं</span>
          </div>

          {/* User Auth Section */}
          {!isOpen && (
            user ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="btn btn-secondary btn-sm btn-login" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserIcon size={14} />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                
                {/* User Dropdown Menu */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    width: '180px',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '6px'
                  }}>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: '#374151', borderRadius: '4px', hover: { backgroundColor: '#F3F4F6' } }}>
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', color: '#DC2626', borderRadius: '4px', textAlign: 'left', width: '100%', cursor: 'pointer' }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm btn-login">
                Login / Register
              </Link>
            )
          )}

          {/* Mobile Hamburguer Toggle */}
          <button className="nav-hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} style={{ color: '#1A1A2E' }} /> : <Menu size={24} style={{ color: '#1A1A2E' }} />}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
