import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Briefcase, MapPin, Clock, Trash2, ArrowRight, Bookmark, AlertCircle, CheckCircle } from 'lucide-react';

const SavedJobs = () => {
  const { user, setUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/jobs');
        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err.message);
        setError(t('savedJobs.failedLoad'));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on user.savedJobs array
  const savedJobList = jobs.filter(job => 
    user && user.savedJobs && (user.savedJobs.includes(job._id) || user.savedJobs.includes(job.id))
  );

  const handleRemove = async (jobId, e) => {
    e.preventDefault(); // Prevent navigating to job details
    e.stopPropagation();

    try {
      const res = await api.delete(`/auth/save-job/${jobId}`);
      if (res.data.success) {
        setUser(res.data.user);
        setToastMessage(t('savedJobs.removedSuccess'));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error('Error removing job:', err.message);
      setToastMessage(language === 'HI' ? 'सहेजी गई नौकरी हटाने में विफल' : 'Failed to remove saved job');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getDaysAgo = (dateString) => {
    const today = new Date();
    const posted = new Date(dateString);
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (language === 'HI') {
      if (diffDays <= 1) return 'आज';
      if (diffDays === 2) return '1 दिन पहले';
      return `${diffDays - 1} दिन पहले`;
    } else {
      if (diffDays <= 1) return 'today';
      if (diffDays === 2) return '1 day ago';
      return `${diffDays - 1} days ago`;
    }
  };

  return (
    <div className="page-content animate-fade-in" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh', paddingBottom: '60px' }}>
      
      {/* Toast alert */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          backgroundColor: '#1E293B',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '500',
          animation: 'scaleIn 0.25s ease-out forwards',
          borderLeft: '4px solid #1B8C0A'
        }}>
          <CheckCircle size={16} style={{ color: '#86EFAC' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <header 
        style={{
          position: 'relative',
          padding: '24px 0 36px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '32px'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '850', color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.025em' }}>
              {t('savedJobs.title')}
            </h1>
            <p style={{ fontSize: '15px', color: '#64748B', margin: 0, lineHeight: '1.6' }}>
              {t('savedJobs.desc')}
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0', flexDirection: 'column' }}>
            <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '16px', color: '#64748B', fontSize: '14.5px' }}>{t('savedJobs.loading')}</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>{error}</h3>
          </div>
        ) : savedJobList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
            {savedJobList.map((job) => (
              <div 
                key={job._id || job.id}
                onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                className="card"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                  {/* Company Initials Avatar */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '10px',
                    backgroundColor: job.companyColor || '#0F172A',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {job.companyInitial || 'CO'}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: '#0F172A', marginBottom: '6px', lineHeight: '1.3' }}>
                      {job.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>
                      {job.company}
                    </p>

                    {/* Metadata Badges */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} style={{ color: '#94A3B8' }} />
                        <span>{job.location}</span>
                      </span>

                      <span style={{ fontSize: '12px', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} style={{ color: '#94A3B8' }} />
                        <span>{getDaysAgo(job.postedDate)}</span>
                      </span>

                      <span style={{
                        fontSize: '11px',
                        color: '#1B8C0A',
                        backgroundColor: '#E8F5E3',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: '700'
                      }}>
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
                  {/* Remove Button */}
                  <button 
                    onClick={(e) => handleRemove(job._id || job.id, e)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      border: '1.5px solid #FCA5A5',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF2F2';
                      e.currentTarget.style.borderColor = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = '#FCA5A5';
                    }}
                  >
                    <Trash2 size={15} />
                    <span>{t('savedJobs.removeBtn')}</span>
                  </button>

                  {/* View Details Icon Link */}
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    backgroundColor: '#F1F5F9', 
                    color: '#64748B', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B8C0A';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.color = '#64748B';
                  }}
                  >
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Bookmark size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '850', color: '#0F172A', marginBottom: '8px' }}>
              {t('savedJobs.noSaved')}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px', lineHeight: '1.6' }}>
              {t('savedJobs.noSavedDesc')}
            </p>
            <Link 
              to="/jobs" 
              className="btn btn-primary"
              style={{
                padding: '10px 28px',
                fontWeight: '700',
                backgroundColor: '#1B8C0A',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(27, 140, 10, 0.15)'
              }}
            >
              <span>{t('savedJobs.browseJobs')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default SavedJobs;
