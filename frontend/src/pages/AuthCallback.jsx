import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return;
    }

    const handleCallback = async () => {
      // 1. Parse Google credentials from the URL hash or query params
      const searchParams = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.substring(1));
      
      const credential = searchParams.get('credential') || hashParams.get('credential') || searchParams.get('id_token') || hashParams.get('id_token');

      if (credential) {
        try {
          const success = await loginWithGoogle({ credential });
          if (success) {
            // Context will update state and useEffect will handle redirect, or do it immediately here:
            return;
          }
        } catch (err) {
          console.error('Google callback authentication failed:', err.message);
        }
      }

      // If no credentials are found or login failed, fallback to standard login page
      navigate('/login');
    };

    handleCallback();
  }, [location, loginWithGoogle, user, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      color: 'white',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '40px',
      margin: '40px auto',
      maxWidth: '450px',
      border: '1.5px solid rgba(255, 255, 255, 0.08)',
      textAlign: 'center'
    }}>
      <Loader2 className="animate-spin" size={48} style={{ color: '#1B8C0A', marginBottom: '20px' }} />
      <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Authenticating with Google</h3>
      <p style={{ fontSize: '13px', color: '#94A3B8' }}>Please wait while we establish a secure session...</p>
    </div>
  );
};

export default AuthCallback;
