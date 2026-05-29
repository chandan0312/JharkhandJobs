import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Shield, Building, Award, ArrowRight, Calendar, Bookmark, FileText } from 'lucide-react';

const GovtJobs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch govt job notifications (Upcoming Exams category)
  useEffect(() => {
    const fetchGovtNotifications = async () => {
      try {
        const response = await api.get('/exams?category=Upcoming%20Exams');
        if (response.data.success) {
          setNotifications(response.data.exams);
        }
      } catch (error) {
        console.error('Error fetching govt exams:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGovtNotifications();
  }, []);

  const handleOrgClick = (orgName) => {
    navigate(`/exams?org=${orgName}`);
  };

  const handleQuickLinkClick = (category) => {
    navigate(`/exams?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="page-content animate-fade-in">
      
      {/* 1. Hero Banner */}
      <header 
        style={{
          position: 'relative',
          padding: '160px 0 120px',
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.35)), url(/assets/images/hero-govt-jobs.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '650px', position: 'relative', zIndex: 5 }}>
            <h1 className="animate-slide-up" style={{ fontSize: '44px', fontWeight: '800', marginBottom: '8px' }}>
              {t('govtJobs.title')}
            </h1>
            <p className="animate-slide-up delay-1" style={{ fontSize: '20px', fontFamily: 'cursive, Georgia, serif', fontStyle: 'italic', color: '#bbf7d0', marginBottom: '16px' }}>
              {t('govtJobs.subtitle')}
            </p>
            <p className="animate-slide-up delay-2" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)' }}>
              {t('govtJobs.desc')}
            </p>
          </div>
        </div>
        
        {/* Subtle decorative crest/building shape */}
        <div style={{
          position: 'absolute',
          right: '10%',
          bottom: '-20px',
          opacity: 0.15,
          color: 'white',
          pointerEvents: 'none'
        }}>
          <Building size={280} />
        </div>
      </header>

      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* 2. Top Organization Selection Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          
          <div onClick={() => handleOrgClick('JSSC')} className="card text-center animate-scale-in" style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>JSSC</h3>
            <p style={{ fontSize: '11px', color: '#6B7280' }}>Staff Selection Commission</p>
          </div>

          <div onClick={() => handleOrgClick('JPSC')} className="card text-center animate-scale-in delay-1" style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>JPSC</h3>
            <p style={{ fontSize: '11px', color: '#6B7280' }}>Public Service Commission</p>
          </div>

          <div onClick={() => handleOrgClick('Railway')} className="card text-center animate-scale-in delay-2" style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Building size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>Railway</h3>
            <p style={{ fontSize: '11px', color: '#6B7280' }}>Indian Railways Alerts</p>
          </div>

          <div onClick={() => navigate('/exams')} className="card text-center animate-scale-in delay-3" style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ArrowRight size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>{t('govtJobs.morePortals')}</h3>
            <p style={{ fontSize: '11px', color: '#6B7280' }}>{t('govtJobs.morePortalsDesc')}</p>
          </div>

        </div>

        {/* 3. Main Column Layout */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '60px' }}>
          
          {/* Left Column: Notifications List */}
          <main style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A2E', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #E5E7EB' }}>
              {t('govtJobs.latestNotif')}
            </h2>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', flexDirection: 'column' }}>
                <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '14px' }}>{t('govtJobs.connecting')}</p>
              </div>
            ) : notifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notifications.map((notif) => (
                  <Link 
                    key={notif._id} 
                    to={`/exams/${notif._id}`} 
                    className="card card-sm" 
                    style={{ 
                      backgroundColor: 'white', 
                      position: 'relative', 
                      overflow: 'hidden', 
                      display: 'block', 
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {notif.isNew && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#DC2626',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderBottomLeftRadius: '4px'
                      }}>
                        NEW
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                          {notif.orgShort}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>{notif.title}</h3>
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>{notif.organization} • <strong style={{ color: '#1B8C0A' }}>{notif.posts}</strong></p>
                        </div>
                      </div>
 
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
                        <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <Calendar size={13} /> {t('govtJobs.lastDate')}: {notif.lastDate}
                        </span>
                        
                        <span 
                          className="btn btn-primary btn-sm" 
                          style={{ fontSize: '11px', padding: '4px 12px' }}
                        >
                          {t('govtJobs.viewDetails')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px 0' }}>No active government job notifications listed.</p>
            )}
          </main>

          {/* Right Column: Sidebar Quick Links */}
          <aside className="card" style={{ flex: '1 1 250px', maxWidth: '320px', padding: '24px', backgroundColor: 'white' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
              {t('govtJobs.quickLinks')}
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li>
                <button onClick={() => handleQuickLinkClick('Upcoming Exams')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Calendar size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('govtJobs.upcomingExams')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickLinkClick('Admit Card')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Bookmark size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('govtJobs.admitCard')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickLinkClick('Results')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <FileText size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('govtJobs.results')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickLinkClick('Syllabus')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <FileText size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('govtJobs.syllabus')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickLinkClick('Exam Calendar')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Calendar size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('govtJobs.examCalendar')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleQuickLinkClick('Previous Papers')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <FileText size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('govtJobs.previousPapers')}</span>
                </button>
              </li>
            </ul>
          </aside>

        </div>

      </div>
    </div>
  );
};

export default GovtJobs;
