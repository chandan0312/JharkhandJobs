import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Lock, Mail, User, Phone, AlertCircle, Eye, EyeOff, 
  ShieldCheck, Briefcase, Bell, BookOpen, Star 
} from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Redirect to correct panel on successful login
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
          // Redirect handled by useEffect
        }
      } else {
        // Enforce strong password requirements
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(password)) {
          throw new Error('Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&).');
        }

        const success = await register(name, email, password, phone);
        if (success) {
          // Redirect handled by useEffect
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    setSubmitting(true);
    setError(null);
    try {
      const success = await loginWithGoogle({ credential: response.credential });
      if (success) {
        // Redirect handled by useEffect
      }
    } catch (err) {
      setError(err.message || 'Google Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize official Google Identity Services button
  useEffect(() => {
    /* global google */
    const initGsi = () => {
      if (typeof google !== 'undefined') {
        try {
          google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '976260447025-u5a4ki77guc06to3f0avpt4nfjphg25j.apps.googleusercontent.com',
            callback: handleGoogleCredentialResponse,
          });

          const buttonElement = document.getElementById('google-signin-button');
          if (buttonElement) {
            google.accounts.id.renderButton(
              buttonElement,
              { 
                theme: 'outline', 
                size: 'large', 
                width: 396,
                text: 'continue_with',
                shape: 'rectangular'
              }
            );
            setGoogleInitialized(true);
          }
        } catch (err) {
          console.error('Failed to initialize Google Sign-In:', err);
        }
      }
    };

    if (activeTab === 'login') {
      if (typeof google !== 'undefined') {
        initGsi();
      } else {
        const timer = setTimeout(() => {
          initGsi();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, googleInitialized]);

  return (
    <div className="login-page-container">
      {/* Dynamic Inject Responsive CSS Styles */}
      <style>{`
        .login-page-container {
          display: flex;
          min-height: 100vh;
          background-color: #F8FAFC;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          width: 100%;
        }
        .login-sidebar {
          width: 42%;
          min-width: 420px;
          background: linear-gradient(180deg, #092015 0%, #051A10 100%);
          color: white;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .login-form-container {
          flex: 1;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          min-height: 100vh;
          overflow-y: auto;
        }
        .login-input:focus {
          border-color: #1B8C0A !important;
          box-shadow: 0 0 0 3px rgba(27, 140, 10, 0.1) !important;
        }
        @media (max-width: 992px) {
          .login-sidebar {
            display: none !important;
          }
          .login-form-container {
            padding: 32px 16px !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* ==================== LEFT TRIBAL WARRIOR PANEL ==================== */}
      <aside className="login-sidebar">
        {/* Top: Branding Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '8px', backgroundColor: '#0A2D1E', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/assets/images/logo.png" alt="Jharkhand Jobs Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px', lineHeight: '1.2' }}>Jharkhand Jobs</span>
            <span style={{ fontSize: '10px', color: '#86EFAC', fontWeight: '600' }}>Apna Jharkhand, Apna Career</span>
          </div>
        </div>

        {/* Center Descriptions & Statues */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {/* Welcome Text */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '850', color: '#FFFFFF', margin: '0 0 8px 0', lineHeight: '1.2', letterSpacing: '-0.5px' }}>
              Welcome Back!<br />
              <span style={{ color: '#22C55E' }}>Login to Your Account</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#A7F3D0', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
              Access thousands of jobs, exams, study materials and career resources.
            </p>
          </div>

          {/* Features highlight */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '16px 0' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Briefcase size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: '750', color: '#FFFFFF' }}>Latest Job Updates</span>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: '500' }}>Get instant notifications for new opportunities</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: '750', color: '#FFFFFF' }}>Exam & Result Alerts</span>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: '500' }}>Stay updated with all exam and result information</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: '750', color: '#FFFFFF' }}>Study & Preparation</span>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: '500' }}>Access study materials, mock tests and career guidance</span>
              </div>
            </div>
          </div>

          {/* Majestic Statue Illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0', alignItems: 'center' }}>
            <img 
              src="/assets/images/birsa_munda_statue.png" 
              alt="Birsa Munda Statue" 
              style={{ 
                width: '100%', 
                maxHeight: '280px', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.45))'
              }} 
            />
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 20px', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px',
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#E2E8F0' }}>Trusted by 8,000+ Aspirants</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', marginRight: '-4px' }}>
              {['A', 'B', 'C', 'D'].map((nameChar, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    border: '2.5px solid #051A10', 
                    backgroundColor: idx % 2 === 0 ? '#10B981' : '#2563EB',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    fontWeight: '900',
                    marginLeft: idx > 0 ? '-8px' : '0',
                    zIndex: 4 - idx
                  }}
                >
                  {nameChar}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={12} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#FFFFFF' }}>4.8/5</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================== RIGHT SECURE FORM PANEL ==================== */}
      <section className="login-form-container">
        {/* Top: Secure floating pill */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', pointerEvents: 'none' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            backgroundColor: '#ECFDF5', 
            border: '1px solid #D1FAE5', 
            padding: '6px 14px', 
            borderRadius: '8px'
          }}>
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <span style={{ fontSize: '11px', fontWeight: '750', color: '#065F46' }}>Secure</span>
            <span style={{ fontSize: '10.5px', color: '#047857', fontWeight: '500' }}>| 100% Safe & Secure</span>
          </div>
        </div>

        {/* Center: Core Authentication Card */}
        <div className="animate-scale-in" style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)',
          boxSizing: 'border-box',
          margin: '24px 0'
        }}>
          {/* Internal Tab Slider Switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <button 
              type="button" 
              onClick={() => { setActiveTab('login'); setError(null); }}
              style={{
                flex: 1, padding: '12px 0', border: 'none', background: 'none',
                borderBottom: activeTab === 'login' ? '2.5px solid #1B8C0A' : '2.5px solid transparent',
                color: activeTab === 'login' ? '#1B8C0A' : '#64748B',
                fontWeight: '750', fontSize: '13.5px', cursor: 'pointer',
                outline: 'none', transition: 'all 0.2s ease'
              }}
            >
              Login
            </button>
            <button 
              type="button" 
              onClick={() => { setActiveTab('register'); setError(null); }}
              style={{
                flex: 1, padding: '12px 0', border: 'none', background: 'none',
                borderBottom: activeTab === 'register' ? '2.5px solid #1B8C0A' : '2.5px solid transparent',
                color: activeTab === 'register' ? '#1B8C0A' : '#64748B',
                fontWeight: '750', fontSize: '13.5px', cursor: 'pointer',
                outline: 'none', transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Form Headers */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
              {activeTab === 'login' ? 'Login to your account' : 'Register your account'}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: '500' }}>
              {activeTab === 'login' ? 'Welcome back! Please enter your details.' : 'Join thousands of Jharkhand aspirants today.'}
            </p>
          </div>

          {/* Auth Alert Messages */}
          {(error || authError) && (
            <div style={{ 
              backgroundColor: '#FEF2F2', 
              borderLeft: '4px solid #EF4444', 
              color: '#991B1B', 
              padding: '12px', 
              fontSize: '12.5px', 
              borderRadius: '6px', 
              marginBottom: '20px', 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
              <span>{error || authError}</span>
            </div>
          )}

          {/* Inputs Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {activeTab === 'register' && (
              <>
                {/* Full Name Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Full Name</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rohan Kumar" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px 10px 36px', fontSize: '13px',
                        border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none',
                        transition: 'all 0.2s ease', backgroundColor: 'white', color: '#0F172A',
                        boxSizing: 'border-box'
                      }}
                      className="login-input"
                    />
                  </div>
                </div>

                {/* Mobile Number Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Mobile Number</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Phone size={15} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 9123456789" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px 10px 36px', fontSize: '13px',
                        border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none',
                        transition: 'all 0.2s ease', backgroundColor: 'white', color: '#0F172A',
                        boxSizing: 'border-box'
                      }}
                      className="login-input"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px 10px 36px', fontSize: '13px',
                    border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none',
                    transition: 'all 0.2s ease', backgroundColor: 'white', color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                  className="login-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder={activeTab === 'login' ? "Enter your password" : "Min 8 chars, 1 uppercase, 1 symbol"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 36px 10px 36px', fontSize: '13px',
                    border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none',
                    transition: 'all 0.2s ease', backgroundColor: 'white', color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                  className="login-input"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Checkbox & Forgot Password link */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 8px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#1B8C0A', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: '600' }}>Remember me</span>
              </label>
              {activeTab === 'login' && (
                <a href="#forgot" style={{ fontSize: '12.5px', color: '#1B8C0A', fontWeight: '750', textDecoration: 'none' }}>Forgot Password?</a>
              )}
            </div>

            {/* Submit Button with Dynamic Lift */}
            <button 
              type="submit" 
              disabled={submitting}
              style={{ 
                width: '100%', 
                padding: '12px 0', 
                fontSize: '14.5px', 
                marginTop: '4px', 
                cursor: 'pointer', 
                backgroundColor: '#1B8C0A', 
                border: 'none', 
                color: 'white', 
                fontWeight: '700', 
                borderRadius: '8px', 
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(27, 140, 10, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#157008';
                e.currentTarget.style.transform = 'translateY(-0.5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1B8C0A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{submitting ? 'Authenticating...' : activeTab === 'login' ? 'Login' : 'Create Account'}</span>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>→</span>
            </button>

            {activeTab === 'login' && (
              <>
                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '750', textTransform: 'uppercase', letterSpacing: '0.5px' }}>or continue with</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                </div>

                {/* Google Sign-In Container */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                  <div id="google-signin-button" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
                </div>
              </>
            )}

          </form>

          {/* Under Card Form Tab Swapper link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '500' }}>
              {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => { setActiveTab(activeTab === 'login' ? 'register' : 'login'); setError(null); }}
                style={{ border: 'none', background: 'none', color: '#1B8C0A', fontWeight: '750', cursor: 'pointer', fontSize: '12.5px', padding: 0 }}
              >
                {activeTab === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </span>
          </div>

        </div>

        {/* Bottom Trust Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          width: '100%', 
          marginTop: 'auto',
          flexWrap: 'wrap',
          borderTop: '1px solid #E2E8F0',
          paddingTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <ShieldCheck size={14} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10.5px', fontWeight: '750', color: '#0F172A', lineHeight: '1.2' }}>Secure</span>
              <span style={{ fontSize: '9px', color: '#64748B', fontWeight: '550' }}>Your data is safe</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <ShieldCheck size={14} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10.5px', fontWeight: '750', color: '#0F172A', lineHeight: '1.2' }}>Fast</span>
              <span style={{ fontSize: '9px', color: '#64748B', fontWeight: '550' }}>Quick access</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <ShieldCheck size={14} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10.5px', fontWeight: '750', color: '#0F172A', lineHeight: '1.2' }}>Reliable</span>
              <span style={{ fontSize: '9px', color: '#64748B', fontWeight: '550' }}>Trusted platform</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
