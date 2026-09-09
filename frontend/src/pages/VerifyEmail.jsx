import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        setVerifying(false);
        setSuccess(false);
        setMessage('Missing or invalid email verification token.');
        return;
      }

      try {
        const res = await verifyEmail(token);
        setSuccess(true);
        setMessage(res.message || 'Email address verified successfully!');
      } catch (err) {
        setSuccess(false);
        setMessage(err.message || 'Email verification failed or token has expired.');
      } finally {
        setVerifying(false);
      }
    };

    handleVerify();
  }, [token]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Inter', sans-serif"
    }}>
      <meta name="robots" content="noindex, nofollow" />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        border: '1px solid #E2E8F0',
        padding: '40px 32px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {verifying ? (
          <div>
            <Loader2 size={48} style={{ color: '#1B8C0A', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', margin: '0 0 8px' }}>
              Verifying Your Email...
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
              Please wait while we confirm your email address.
            </p>
          </div>
        ) : success ? (
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px' }}>
              Email Verified! 🎉
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 24px', lineHeight: '1.5' }}>
              {message}
            </p>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#1B8C0A',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <XCircle size={32} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px' }}>
              Verification Failed
            </h2>
            <p style={{ fontSize: '14px', color: '#B91C1C', margin: '0 0 24px', lineHeight: '1.5' }}>
              {message}
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              Return to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
