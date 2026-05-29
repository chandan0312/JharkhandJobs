import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, Mail, User, Phone, CheckSquare, AlertCircle, X, ChevronRight, UserCheck } from 'lucide-react';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, login, register, loginWithGoogle, error: authError } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Simulated Google Sign-In Modal States
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);

  // If already logged in, redirect to correct dashboard/home
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (activeTab === 'login') {
        const success = await login(email, password);
        if (success) {
          // Auth Context state will trigger redirect via useEffect above
        }
      } else {
        const success = await register(name, email, password, phone);
        if (success) {
          // Auth Context state will trigger redirect via useEffect above
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Google Login Select profile triggers
  const handleGoogleSignInSelected = async (googleUserEmail, googleUserName) => {
    setGoogleModalOpen(false);
    setSubmitting(true);
    setError(null);
    try {
      const mockGooglePayload = {
        googleId: 'mock-google-id-' + Math.floor(Math.random() * 1e9),
        email: googleUserEmail,
        name: googleUserName,
      };
      
      const success = await loginWithGoogle(mockGooglePayload);
      if (success) {
        // Redirection handled in useEffect
      }
    } catch (err) {
      setError(err.message || 'Google Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    const resolvedName = customGoogleName || customGoogleEmail.split('@')[0];
    handleGoogleSignInSelected(customGoogleEmail, resolvedName);
  };

  const testGoogleAccounts = [
    {
      name: 'Rohan Kumar',
      email: 'rohan.google@gmail.com',
      initials: 'RK',
      bgColor: '#4F46E5', // Indigo
      roleText: 'Candidate Profile (User)'
    },
    {
      name: 'Ananya Sharma',
      email: 'ananya.google@gmail.com',
      initials: 'AS',
      bgColor: '#EC4899', // Pink
      roleText: 'Candidate Profile (User)'
    },
    {
      name: 'Jharkhand Jobs Admin',
      email: 'admin.google@jharkhandjobs.com',
      initials: 'AD',
      bgColor: '#10B981', // Emerald
      roleText: 'Administrator Access (Admin)'
    }
  ];

  return (
    <div className="page-content" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '40px 16px', position: 'relative' }}>
      
      <div className="card animate-scale-in" style={{ maxWidth: '450px', width: '100%', padding: '36px', backgroundColor: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        
        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', padding: '12px 0', border: 'none', background: 'none', borderBottom: activeTab === 'login' ? '2.5px solid #1B8C0A' : 'none', color: activeTab === 'login' ? '#1B8C0A' : '#6B7280', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
          >
            {t('login.login')}
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', padding: '12px 0', border: 'none', background: 'none', borderBottom: activeTab === 'register' ? '2.5px solid #1B8C0A' : 'none', color: activeTab === 'register' ? '#1B8C0A' : '#6B7280', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
          >
            {t('login.register')}
          </button>
        </div>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1A2E' }}>
            {activeTab === 'login' ? t('login.welcomeBack') : t('login.createAccount')}
          </h2>
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            {activeTab === 'login' ? t('login.signInSubtitle') : t('login.registerSubtitle')}
          </p>
        </div>

        {/* Displays alert messages */}
        {(error || authError) && (
          <div style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #DC2626', color: '#DC2626', padding: '12px', fontSize: '13px', borderRadius: '4px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={16} />
            <span>{error || authError}</span>
          </div>
        )}

        {/* Input Forms */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {activeTab === 'register' && (
            <>
              {/* Full Name */}
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '6px' }}>{t('login.fullName')}</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', color: '#9CA3AF' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '6px' }}>{t('login.phone')}</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', color: '#9CA3AF' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 91234 56789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '13.5px' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '6px' }}>{t('login.email')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', color: '#9CA3AF' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '13.5px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '6px' }}>{t('login.password')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', color: '#9CA3AF' }} />
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', border: '1.5px solid #D1D5DB', outline: 'none', fontSize: '13.5px' }}
              />
            </div>
          </div>

          {/* Remember Me Checkbox */}
          {activeTab === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#1B8C0A' }}
                />
                <span style={{ fontSize: '13px', color: '#4B5563' }}>{t('login.rememberMe')}</span>
              </label>
              <a href="#forgot" style={{ fontSize: '13px', color: '#1B8C0A', fontWeight: '600', textDecoration: 'none' }}>{t('login.forgotPassword')}</a>
            </div>
          )}

          {/* Submit Action Button */}
          <button 
            type="submit" 
            disabled={submitting}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px 0', fontSize: '15px', marginTop: '8px', cursor: 'pointer', backgroundColor: '#1B8C0A', border: 'none', color: 'white', fontWeight: '700', borderRadius: '8px', transition: 'background-color 0.2s' }}
          >
            {submitting ? t('login.authenticating') : activeTab === 'login' ? t('login.signInBtn') : t('login.createAccountBtn')}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
            <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' }}>{t('login.or')}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
          </div>

          {/* Social Google Login button */}
          <button 
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="btn btn-ghost" 
            style={{ width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', border: '1.5px solid #D1D5DB', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontWeight: '600' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>{t('login.continueGoogle')}</span>
          </button>

        </form>

      </div>

      {/* ==================== SOCIAL GOOGLE ACCOUNT SELECTOR MODAL OVERLAY ==================== */}
      {googleModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          
          <div 
            className="animate-scale-in"
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '400px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #E5E7EB',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => { setGoogleModalOpen(false); setShowCustomGoogleForm(false); }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#9CA3AF',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={18} />
            </button>

            {/* Header Branding */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              {/* Google Colored Logo */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ margin: '0 auto 12px' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1F2937', letterSpacing: '-0.2px' }}>Sign in with Google</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>to continue to Jharkhand Jobs</p>
            </div>

            {!showCustomGoogleForm ? (
              <>
                {/* Account list selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {testGoogleAccounts.map((account, index) => (
                    <div 
                      key={index}
                      onClick={() => handleGoogleSignInSelected(account.email, account.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: '1.5px solid #F3F4F6',
                        backgroundColor: '#FCFDFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = account.bgColor;
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.boxShadow = `0 6px 15px ${account.bgColor}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = '#F3F4F6';
                        e.currentTarget.style.backgroundColor = '#FCFDFF';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Circular Initials Avatar */}
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: account.bgColor,
                          color: 'white',
                          fontWeight: '800',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 3px 6px ${account.bgColor}30`
                        }}>
                          {account.initials}
                        </div>
                        <div>
                          <strong style={{ fontSize: '13.5px', color: '#1F2937', display: 'block' }}>{account.name}</strong>
                          <span style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginTop: '1px' }}>{account.email}</span>
                          <span style={{ fontSize: '9.5px', color: account.bgColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginTop: '2px' }}>{account.roleText}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
                    </div>
                  ))}
                </div>

                {/* Switch to Custom button */}
                <button 
                  type="button"
                  onClick={() => setShowCustomGoogleForm(true)}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    borderRadius: '10px',
                    border: '1.5px dashed #D1D5DB',
                    backgroundColor: 'transparent',
                    color: '#4B5563',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1B8C0A';
                    e.currentTarget.style.color = '#1B8C0A';
                    e.currentTarget.style.backgroundColor = '#F0FDF4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.color = '#4B5563';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ➕ Use another Google account
                </button>
              </>
            ) : (
              /* Custom dynamic Google account form */
              <form onSubmit={handleCustomGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Google Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Priyesh Oraon"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1.5px solid #D1D5DB', padding: '0 12px', outline: 'none', fontSize: '13.5px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Google Email Address</label>
                  <input 
                    type="email"
                    required
                    placeholder="priyesh.google@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1.5px solid #D1D5DB', padding: '0 12px', outline: 'none', fontSize: '13.5px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleForm(false)}
                    style={{ flex: 1, height: '42px', borderRadius: '8px', border: '1.5px solid #D1D5DB', backgroundColor: 'white', color: '#4B5563', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer' }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, height: '42px', borderRadius: '8px', border: 'none', backgroundColor: '#4285F4', color: 'white', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(66, 133, 244, 0.3)' }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Google Footer */}
            <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
              <p style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: '1.4' }}>
                To continue, Google will share your name, email address, language preference, and profile picture with Jharkhand Jobs.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Login;
