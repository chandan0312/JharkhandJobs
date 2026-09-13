import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, Calendar, Award, AlertCircle, CheckCircle, 
  ArrowUpRight, HelpCircle, Star, Send, TrendingUp, Bell, FileText, 
  Bookmark, Clock, Search, BookOpen, Clipboard, Compass, Monitor, Sparkles
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeSearch, setHomeSearch] = useState('');

  const formatJobTitle = (title) => {
    if (!title) return '';
    let cleanTitle = title.split('(')[0].trim();
    if (cleanTitle.length > 32) {
      cleanTitle = cleanTitle.slice(0, 29) + '...';
    }
    return cleanTitle;
  };

  const formatLastDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) {
        return String(dateVal);
      }
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch (e) {
      return String(dateVal);
    }
  };

  const handleHomeSearchSubmit = (e) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(homeSearch.trim())}`);
      setHomeSearch('');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('[Home] Fetching jobs and exams...');
        const [jobsRes, examsRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/exams')
        ]);
        console.log('[Home] Jobs response success:', jobsRes.data?.success, 'Count:', jobsRes.data?.jobs?.length);
        console.log('[Home] Exams response success:', examsRes.data?.success, 'Count:', examsRes.data?.exams?.length);
        if (jobsRes.data && jobsRes.data.success) {
          setAllJobs(jobsRes.data.jobs || []);
        }
        if (examsRes.data && examsRes.data.success) {
          setAllExams(examsRes.data.exams || []);
        }
      } catch (err) {
        console.error('[Home] Fetch data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute Job Alerts: Sort newest first (by updatedAt, falling back to postedDate), take top 10
  const latestJobs = [...allJobs]
    .sort((a, b) => new Date(b.updatedAt || b.postedDate || b.createdAt || 0) - new Date(a.updatedAt || a.postedDate || a.createdAt || 0))
    .slice(0, 10);

  // Compute Admit Cards: category === 'Admit Card', take top 10 sorted newest first
  const admitCards = allExams
    .filter(e => e.category === 'Admit Card')
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      if (dateA || dateB) return dateB - dateA;
      const numA = parseInt(a._id.replace(/\D/g, '')) || 0;
      const numB = parseInt(b._id.replace(/\D/g, '')) || 0;
      return numB - numA;
    })
    .slice(0, 10);

  // Compute Results: category === 'Results', take top 10 sorted newest first
  const examResults = allExams
    .filter(e => e.category === 'Results')
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      if (dateA || dateB) return dateB - dateA;
      const numA = parseInt(a._id.replace(/\D/g, '')) || 0;
      const numB = parseInt(b._id.replace(/\D/g, '')) || 0;
      return numB - numA;
    })
    .slice(0, 10);

  // Compute dynamic announcement text from latest jobs and exams
  const announcementText = (() => {
    const parts = [];
    
    // Get top 4 latest jobs
    const topJobs = [...allJobs]
      .sort((a, b) => new Date(b.updatedAt || b.postedDate || 0) - new Date(a.updatedAt || a.postedDate || 0))
      .slice(0, 4);
    topJobs.forEach(j => {
      parts.push(`${j.companyInitial || 'Job'}: ${formatJobTitle(j.title)}`);
    });

    // Get top 4 latest exams
    const topExams = [...allExams]
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 4);
    topExams.forEach(e => {
      parts.push(`${e.orgShort || 'Exam'}: ${e.title.split('(')[0].trim()}`);
    });

    if (parts.length > 0) {
      return parts.join('   |   📢   ');
    }
    return 'JSSC CGL 2024 Result Declared   |   📢   JPSC Assistant Engineer Notification Out   |   📢   Welcome to Jharkhand Jobs!';
  })();



  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
        <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px', fontFamily: 'sans-serif' }}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', boxSizing: 'border-box', width: '100%' }}>
      {/* CSS Responsive Rules */}
      <style>{`
        .dash-grid-1 {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          width: 100%;
        }
        .dash-grid-three-cols {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr 0.8fr;
          gap: 24px;
          width: 100%;
        }
        .quick-access-row {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 1200px) {
          .dash-grid-1 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .dash-grid-three-cols {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
          .quick-access-row {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .dash-grid-1 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dash-grid-three-cols {
            grid-template-columns: 1fr !important;
          }
          .quick-access-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .dash-grid-1 {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes marquee {
          0% { transform: translate3d(20%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          align-items: center;
          flex: 1;
          margin: 0 16px;
        }
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ==================== WELCOME HERO BANNER & TICKER ==================== */}
      <div style={{
        backgroundImage: 'linear-gradient(to right, rgba(9, 35, 23, 0.98) 0%, rgba(9, 35, 23, 0.88) 35%, rgba(9, 35, 23, 0.4) 65%, rgba(9, 35, 23, 0.05) 100%), url("/assets/images/jharkhand_hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: '65% 35%',
        backgroundRepeat: 'no-repeat',
        borderRadius: '24px', 
        color: 'white', 
        padding: '32px 40px', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        minHeight: '240px',
        position: 'relative', 
        overflow: 'hidden', 
        boxShadow: '0 12px 35px rgba(27,140,10,0.12)',
        border: '1px solid rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'rgba(16, 185, 129, 0.18)', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '5px 12px', 
              borderRadius: '30px', 
              fontSize: '12px', 
              fontWeight: '700',
              color: '#A7F3D0',
              backdropFilter: 'blur(4px)'
            }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={9} style={{ color: '#FFFFFF', fill: '#FFFFFF' }} />
              </div>
              <span>Welcome Back, Aspirant! 👋</span>
            </div>

            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: 'rgba(255, 255, 255, 0.06)', 
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '5px 12px', 
              borderRadius: '30px', 
              fontSize: '11px', 
              fontWeight: '600',
              color: '#E6F4EA',
              backdropFilter: 'blur(4px)'
            }}>
              <TrendingUp size={12} style={{ color: '#10B981' }} />
              <span>Let's build your future</span>
            </div>
          </div>

          <div style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)', maxWidth: '58%' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
              Good Afternoon,<br />
              <span style={{ color: '#22C55E', position: 'relative', display: 'inline-block' }}>
                {user ? user.name.split(' ')[0] : 'Aspirant'}!
                <svg style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%', height: '6px' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,9 100,3" stroke="#FBBF24" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p style={{ fontSize: '14px', color: '#E6F4EA', lineHeight: '1.4', margin: '8px 0 0 0', fontWeight: '500' }}>
              Here's what's happening today on 
              <span style={{ 
                fontFamily: '"Caveat", "Brush Script MT", cursive', 
                fontSize: '20px', 
                color: '#FBBF24', 
                fontWeight: '700', 
                marginLeft: '6px',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)' 
              }}>
                Jharkhand Jobs.
              </span>
            </p>

            <form onSubmit={handleHomeSearchSubmit} style={{ display: 'flex', gap: '10px', marginTop: '20px', maxWidth: '520px', width: '100%' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#A7F3D0' }} />
                <input 
                  type="text" 
                  placeholder="Search exams, vacancies, keywords..." 
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    fontSize: '13px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    border: '1.5px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '30px',
                    color: 'white',
                    outline: 'none',
                    fontWeight: '500',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button 
                type="submit"
                style={{
                  backgroundColor: '#22C55E',
                  color: 'white',
                  border: 'none',
                  padding: '0 24px',
                  borderRadius: '30px',
                  fontSize: '12.5px',
                  fontWeight: '750',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16A34A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '20px', 
        flexWrap: 'wrap',
        marginTop: '-8px' 
      }}>
        <div style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: '30px',
          padding: '8px 10px 8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0',
          minWidth: '320px',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflow: 'hidden' }}>
            <span role="img" aria-label="announcement" style={{ fontSize: '15px', flexShrink: 0 }}>📢</span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#10B981', flexShrink: 0 }}>Latest Update:</span>
            <div className="marquee-container">
              <span className="marquee-content" style={{ fontSize: '12.5px', fontWeight: '700', color: '#1F2937', cursor: 'pointer' }} onClick={() => navigate('/exams')}>
                {announcementText}
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/exams')}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            View All Updates →
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/jobs')}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '30px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={14} style={{ color: '#10B981' }} />
            <span>Search Jobs</span>
          </button>
        </div>
      </div>

      {/* ==================== ROW 1: TOP METRICS CARDS (6 CARDS) ==================== */}
      <div className="dash-grid-1">
        {/* Card 1: Total Jobs */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={16} />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Total Jobs</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{allJobs.length}</span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              ▲ Active <span style={{ color: '#94A3B8', fontWeight: '500' }}>listings</span>
            </span>
          </div>
        </div>

        {/* Card 2: Applications */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clipboard size={16} />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Applications</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>12</span>
            <span style={{ fontSize: '10px', color: '#D97706', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#D97706' }} />
              2 In review
            </span>
          </div>
        </div>

        {/* Card 3: Saved Jobs */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={16} />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Saved Jobs</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{user?.savedJobs?.length || 0}</span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              ▲ bookmarked <span style={{ color: '#94A3B8', fontWeight: '500' }}>listings</span>
            </span>
          </div>
        </div>

        {/* Card 4: Job Alerts */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Job Alerts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{allExams.length}</span>
            <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              Active notifications
            </span>
          </div>
        </div>

        {/* Card 5: Exam Updates */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FDF2F8', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Exam Updates</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{allExams.filter(e => e.isNew).length}</span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              ▲ New <span style={{ color: '#94A3B8', fontWeight: '500' }}>releases</span>
            </span>
          </div>
        </div>

        {/* Card 6: Your Rank */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={16} />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Your Rank</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>#245</span>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
              Top 12% of users
            </span>
          </div>
        </div>
      </div>

      {/* ==================== ROW 2: MAIN THREE COLUMNS GRID ==================== */}
      <div className="dash-grid-three-cols">
        
        {/* Column 1: Latest Job Alerts */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} style={{ color: '#1B8C0A' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: '850', color: '#0F172A', margin: 0 }}>Latest Job Alerts</h3>
            </div>
            <Link to="/jobs" style={{ fontSize: '11.5px', fontWeight: '700', color: '#1B8C0A', textDecoration: 'none' }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {latestJobs.map((job) => (
              <div 
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px',
                  border: '1px solid #F1F5F9', borderRadius: '10px', backgroundColor: '#F8FAFC', cursor: 'pointer',
                  transition: 'border-color 0.2s ease', gap: '16px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1B8C0A'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F1F5F9'}
              >
                {/* Left: Last Day in Calendar Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, minWidth: '95px' }}>
                  <Calendar size={15} style={{ color: '#EF4444', flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '800', whiteSpace: 'nowrap' }}>
                    {formatLastDate(job.lastDate)}
                  </span>
                </div>

                {/* Middle: Job Name / Company */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1, minWidth: 0 }}>
                  <h4 style={{ 
                    fontSize: '12.5px', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: '1.2',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {formatJobTitle(job.title)}
                  </h4>
                  <span style={{ 
                    fontSize: '10.5px', color: '#64748B', fontWeight: '500',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {job.company}
                  </span>
                </div>

                {/* Right: Posts count */}
                <div style={{ 
                  backgroundColor: '#E8F5E3', color: '#1B8C0A', padding: '4px 8px', borderRadius: '6px', 
                  fontSize: '10px', fontWeight: '800', flexShrink: 0, textAlign: 'center', whiteSpace: 'nowrap' 
                }}>
                  {(job.vacancies || 45).toLocaleString()} Posts
                </div>
              </div>
            ))}
            {latestJobs.length === 0 && (
              <p style={{ fontSize: '12.5px', color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No job alerts available.</p>
            )}
          </div>
        </div>

        {/* Column 2: Admit Cards */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: '#2563EB' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: '850', color: '#0F172A', margin: 0 }}>Admit Cards</h3>
            </div>
            <Link to="/exams?category=Admit%20Card" style={{ fontSize: '11.5px', fontWeight: '700', color: '#2563EB', textDecoration: 'none' }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {admitCards.map((exam) => (
              <div 
                key={exam._id}
                onClick={() => navigate(`/exams/${exam._id}`)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px',
                  border: '1px solid #F1F5F9', borderRadius: '10px', backgroundColor: '#F8FAFC', cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563EB'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F1F5F9'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', 
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '800', flexShrink: 0
                  }}>
                    <FileText size={16} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1 }}>
                    <h4 style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: '1.2' }}>{formatJobTitle(exam.title)}</h4>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '500' }}>{exam.organization}</span>
                  </div>
                </div>
              </div>
            ))}
            {admitCards.length === 0 && (
              <p style={{ fontSize: '12.5px', color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No admit cards available.</p>
            )}
          </div>
        </div>

        {/* Column 3: Results */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#EA580C' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: '850', color: '#0F172A', margin: 0 }}>Results</h3>
            </div>
            <Link to="/exams?category=Results" style={{ fontSize: '11.5px', fontWeight: '700', color: '#EA580C', textDecoration: 'none' }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {examResults.map((exam) => (
              <div 
                key={exam._id}
                onClick={() => navigate(`/exams/${exam._id}`)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px',
                  border: '1px solid #F1F5F9', borderRadius: '10px', backgroundColor: '#F8FAFC', cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#EA580C'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F1F5F9'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', 
                    backgroundColor: '#FFF7ED',
                    color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '800', flexShrink: 0
                  }}>
                    <Award size={16} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1 }}>
                    <h4 style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', margin: 0, lineHeight: '1.2' }}>{formatJobTitle(exam.title)}</h4>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '500' }}>{exam.organization}</span>
                  </div>
                </div>
              </div>
            ))}
            {examResults.length === 0 && (
              <p style={{ fontSize: '12.5px', color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No results available.</p>
            )}
          </div>
        </div>

      </div>

      {/* ==================== FOOTER: QUICK ACCESS LINKS ==================== */}
      <div style={{
        backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
        display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        width: '100%', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clipboard size={18} style={{ color: '#1B8C0A' }} />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Quick Access Links</h3>
        </div>

        <div className="quick-access-row">
          {[
            { label: 'Admit Cards', color: '#E8F5E3', iconColor: '#1B8C0A', icon: <FileText size={18} />, path: '/exams?category=Admit%20Card' },
            { label: 'Results', color: '#EFF6FF', iconColor: '#2563EB', icon: <Award size={18} />, path: '/exams?category=Results' },
            { label: 'Current Affairs', color: '#FFF7ED', iconColor: '#EA580C', icon: <Sparkles size={18} />, path: '/blog' },
            { label: 'Syllabus', color: '#F3E8FF', iconColor: '#7C3AED', icon: <Clipboard size={18} />, path: '/blog' },
            { label: 'Mock Tests', color: '#FFF1F2', iconColor: '#F43F5E', icon: <HelpCircle size={18} />, path: '/quiz' },
            { label: 'Previous Papers', color: '#E0F2FE', iconColor: '#0369A1', icon: <BookOpen size={18} />, path: '/blog' },
            { label: 'Study Material', color: '#E0F2FE', iconColor: '#0284C7', icon: <FileText size={18} />, path: '/blog' },
            { label: 'Career Guide', color: '#E6F4EA', iconColor: '#10B981', icon: <Monitor size={18} />, path: '/blog' }
          ].map((btn, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(btn.path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '12px 6px', border: '1px solid #F1F5F9', borderRadius: '10px',
                backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = btn.iconColor;
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#F1F5F9';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', backgroundColor: btn.color,
                color: btn.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {btn.icon}
              </div>
              <span style={{ fontSize: '10.5px', color: '#334155', fontWeight: '750', lineHeight: '1.2' }}>{btn.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
