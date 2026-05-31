import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Briefcase, Calendar, Award, ChevronRight, AlertCircle, CheckCircle, 
  ArrowUpRight, HelpCircle, Star, Send, TrendingUp, Bell, FileText, 
  Bookmark, Clock, Search, BookOpen, Clipboard, Compass, Monitor, Sparkles
} from 'lucide-react';

// Pure React Circular Progress Ring Component for high-fidelity rendering
const ProgressRing = ({ percentage, color = '#10B981' }) => {
  const radius = 18;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: `${radius * 2}px`, height: `${radius * 2}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#E2E8F0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '9px', fontWeight: '800', color: '#0F172A' }}>{percentage}%</span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.data.success) {
          setRecentJobs(res.data.jobs.slice(0, 3));
        }
      } catch (err) {
        console.error('Jobs fetch error:', err.message);
      }
    };
    fetchRecentJobs();
  }, []);

  // Standard fallback jobs to guarantee high-fidelity presentation
  const defaultJobs = [
    {
      title: 'JSSC CGL 2024',
      company: 'Jharkhand Staff Selection Commission',
      location: 'Ranchi',
      date: 'Apply by 31 May 2024',
      time: '2 hours ago',
      color: '#E8F5E3',
      iconColor: '#1B8C0A',
      initial: 'J'
    },
    {
      title: 'Railway ALP Recruitment 2024',
      company: 'Indian Railways',
      location: 'All India',
      date: 'Apply by 15 Jun 2024',
      time: '4 hours ago',
      color: '#FEF2F2',
      iconColor: '#EF4444',
      initial: 'R'
    },
    {
      title: 'SBI PO Recruitment 2024',
      company: 'State Bank of India',
      location: 'All India',
      date: 'Apply by 20 May 2024',
      time: '6 hours ago',
      color: '#EFF6FF',
      iconColor: '#2563EB',
      initial: 'S'
    }
  ];

  const jobsToDisplay = recentJobs.length >= 3 ? recentJobs.map((j, idx) => ({
    title: j.title,
    company: j.company,
    location: j.location || 'All India',
    date: `Apply by ${j.lastDate ? new Date(j.lastDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '31 May 2024'}`,
    time: idx === 0 ? '2 hours ago' : idx === 1 ? '4 hours ago' : '6 hours ago',
    color: idx === 0 ? '#E8F5E3' : idx === 1 ? '#FEF2F2' : '#EFF6FF',
    iconColor: idx === 0 ? '#1B8C0A' : idx === 1 ? '#EF4444' : '#2563EB',
    initial: j.companyInitial || j.company.charAt(0)
  })) : defaultJobs;

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
        .dash-grid-2 {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr 0.8fr;
          gap: 24px;
          width: 100%;
        }
        .dash-grid-3 {
          display: grid;
          grid-template-columns: 1.1fr 1fr 0.9fr;
          gap: 24px;
          width: 100%;
        }
        @media (max-width: 1200px) {
          .dash-grid-1 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .dash-grid-2 {
            grid-template-columns: 1.2fr 1fr !important;
          }
          .dash-grid-3 {
            grid-template-columns: 1.2fr 1fr !important;
          }
          .stack-col {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 768px) {
          .dash-grid-1 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dash-grid-2 {
            grid-template-columns: 1fr !important;
          }
          .dash-grid-3 {
            grid-template-columns: 1fr !important;
          }
          .stack-col {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 480px) {
          .dash-grid-1 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* ==================== WELCOME HERO BANNER & TICKER ==================== */}
      {/* 1. Welcome Card Banner with Custom Gradient, Clear Statue (No cards, reduced size) */}
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
        {/* Overlay details for visual depth */}
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          
          {/* Top: Welcome Pill & Let's build badge */}
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

          {/* Middle Text: Headings and Description */}
          <div style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)', maxWidth: '58%' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
              Good Afternoon,<br />
              <span style={{ color: '#22C55E', position: 'relative', display: 'inline-block' }}>
                Aspirant!
                {/* Custom tapered handdrawn yellow line */}
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
          </div>
        </div>
      </div>

      {/* Bottom Row under welcome card: Updates Ticker on left & Action buttons on right */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '20px', 
        flexWrap: 'wrap',
        marginTop: '-8px' 
      }}>
        {/* Updates ticker (white pill bar) */}
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
          minWidth: '320px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span role="img" aria-label="announcement" style={{ fontSize: '15px' }}>📢</span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#10B981' }}>Latest Update:</span>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#1F2937', marginLeft: '6px' }}>
              JSSC CGL 2024 Result Declared | JPSC Assistant Engineer Notification Out
            </span>
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
              transition: 'all 0.2s ease'
            }}
          >
            View All Updates →
          </button>
        </div>

        {/* Right quick actions buttons */}
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
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>1,248</span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              ▲ +16% <span style={{ color: '#94A3B8', fontWeight: '500' }}>this week</span>
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
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>8</span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              ▲ +2 <span style={{ color: '#94A3B8', fontWeight: '500' }}>new this week</span>
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
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>25</span>
            <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              New alerts today
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
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>18</span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              ▲ +5 <span style={{ color: '#94A3B8', fontWeight: '500' }}>new updates</span>
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

      {/* ==================== ROW 2: MAIN MIDDLE GRID ==================== */}
      <div className="dash-grid-2">
        {/* Column 1: Latest Job Alerts */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} style={{ color: '#1B8C0A' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Latest Job Alerts</h3>
            </div>
            <Link to="/jobs" style={{ fontSize: '12px', fontWeight: '700', color: '#1B8C0A', textDecoration: 'none' }}>View All</Link>
          </div>

          {/* Job Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobsToDisplay.map((job, idx) => (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px',
                border: '1px solid #F1F5F9', borderRadius: '10px', backgroundColor: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '8px', backgroundColor: job.color || '#E8F5E3',
                    color: job.iconColor || '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '800', fontSize: '14px'
                  }}>
                    {job.initial || 'J'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '850', color: '#0F172A', margin: 0 }}>{job.title}</h4>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>{job.company}</span>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '750', marginTop: '2px' }}>{job.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#334155', fontWeight: '700' }}>{job.location}</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '500' }}>{job.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Notification Opportunity Banner */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.12)',
            borderRadius: '12px', padding: '14px 20px', marginTop: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} style={{ color: '#10B981' }} />
              </div>
              <p style={{ fontSize: '11.5px', color: '#065F46', margin: 0, fontWeight: '500', lineHeight: '1.4' }}>
                <strong>Don't miss any opportunity!</strong><br />
                Enable notifications and get instant alerts for jobs, exams and results.
              </p>
            </div>
            <button 
              onClick={() => alert('Notifications enabled successfully!')}
              style={{
                backgroundColor: '#0F764E', color: '#FFFFFF', border: 'none', padding: '8px 16px',
                borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F764E'}
            >
              Enable Alerts
            </button>
          </div>
        </div>

        {/* Column 2: Upcoming Exams */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: '#1B8C0A' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Upcoming Exams</h3>
            </div>
            <Link to="/exams" style={{ fontSize: '12px', fontWeight: '700', color: '#1B8C0A', textDecoration: 'none' }}>View All</Link>
          </div>

          {/* Exam Calendar Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'JSSC CGL 2024', sub: 'Prelims Exam', day: '31', month: 'May 2024', left: '25 Days Left' },
              { title: 'JPSC Civil Services', sub: 'Prelims Exam', day: '15', month: 'Jun 2024', left: '40 Days Left' },
              { title: 'SSC CGL 2024', sub: 'Tier 1 Exam', day: '03', month: 'Jul 2024', left: '58 Days Left' },
              { title: 'IBPS PO 2024', sub: 'Prelims Exam', day: '20', month: 'Jul 2024', left: '75 Days Left' }
            ].map((ex, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px',
                border: '1px solid #F1F5F9', borderRadius: '10px', backgroundColor: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Calendar Block Icon */}
                  <div style={{
                    width: '44px', height: '46px', borderRadius: '8px', border: '1px solid #E2E8F0',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'center'
                  }}>
                    <div style={{ height: '14px', backgroundColor: '#E2E8F0', color: '#475569', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      DATE
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
                      <span style={{ fontSize: '13px', fontWeight: '850', color: '#0F172A', lineHeight: '1.1' }}>{ex.day}</span>
                      <span style={{ fontSize: '7px', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>{ex.month.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '12.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{ex.title}</h4>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>{ex.sub}</span>
                  </div>
                </div>

                <span style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '10.5px', fontWeight: '750',
                  backgroundColor: '#E8F5E3', color: '#1B8C0A'
                }}>
                  {ex.left}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/exams')}
            style={{
              width: '100%', padding: '10px', border: '1.5px solid #10B981', color: '#10B981',
              borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              backgroundColor: 'transparent', transition: 'all 0.2s ease', marginTop: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#10B981';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#10B981';
            }}
          >
            View All Exams
          </button>
        </div>

        {/* Column 3: Stacked Right Panels */}
        <div className="stack-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Recent Notifications */}
          <div style={{
            backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
            display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} style={{ color: '#1B8C0A' }} />
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Recent Notifications</h3>
              </div>
              <Link to="/exams" style={{ fontSize: '12px', fontWeight: '700', color: '#1B8C0A', textDecoration: 'none' }}>View All</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'JSSC CGL 2024 Result Declared', sub: 'Click to check your result now', iconBg: '#FFF7ED', iconColor: '#EA580C', dotColor: '#10B981', time: '2h ago' },
                { title: 'New Job Alert: 256 New Jobs', sub: 'Check the latest job opportunities', iconBg: '#EFF6FF', iconColor: '#2563EB', dotColor: '#2563EB', time: '4h ago' },
                { title: 'Admit Card Released', sub: 'JPSC Assistant Engineer Admit Card', iconBg: '#F3E8FF', iconColor: '#7C3AED', dotColor: '#10B981', time: '6h ago' },
                { title: 'New Article Published', sub: 'How to Prepare for JSSC CGL 2024', iconBg: '#FFF7ED', iconColor: '#EA580C', dotColor: '#D97706', time: '1d ago' }
              ].map((n, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: n.iconBg, color: n.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bell size={14} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>{n.title}</span>
                      <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '500', marginTop: '1px' }}>{n.sub}</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    {n.time}
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: n.dotColor }} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Continue Your Preparation */}
          <div style={{
            backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
            display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: '#1B8C0A' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Continue Your Preparation</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { title: 'JSSC CGL Mock Test 5', sub: 'Continue Test', percent: 65, color: '#10B981' },
                { title: 'General Knowledge Quiz', sub: '10 Questions Remaining', percent: 40, color: '#EA580C' },
                { title: 'Current Affairs - May 2024', sub: 'Read Article', percent: 30, color: '#EF4444' }
              ].map((prep, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={15} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>{prep.title}</span>
                      <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>{prep.sub}</span>
                    </div>
                  </div>

                  <ProgressRing percentage={prep.percent} color={prep.color} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ==================== ROW 3: BOTTOM ACCESS & PROGRESS GRID ==================== */}
      <div className="dash-grid-3">
        {/* Column 1: Quick Access (8 Buttons in 2x4 grid) */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clipboard size={18} style={{ color: '#1B8C0A' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Quick Access</h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            textAlign: 'center'
          }}>
            {[
              { label: 'Admit Cards', color: '#E8F5E3', iconColor: '#1B8C0A', icon: <FileText size={18} />, path: '/exams' },
              { label: 'Results', color: '#EFF6FF', iconColor: '#2563EB', icon: <Award size={18} />, path: '/exams' },
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

        {/* Column 2: Your Progress */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: '#1B8C0A' }} />
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Your Progress</h3>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1B8C0A', cursor: 'pointer' }}>View Details</span>
          </div>

          {/* Progress Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Profile Completeness */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: '#334155' }}>
                <span>Profile Completeness</span>
                <span>85%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#10B981', borderRadius: '10px' }} />
              </div>
            </div>

            {/* Daily Goal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: '#334155' }}>
                <span>Daily Goal</span>
                <span>40%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', backgroundColor: '#10B981', borderRadius: '10px' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>2/5 tasks completed</span>
            </div>

            {/* Weekly Goal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: '#334155' }}>
                <span>Weekly Goal</span>
                <span>30%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', backgroundColor: '#10B981', borderRadius: '10px' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>3/10 tasks completed</span>
            </div>
          </div>
        </div>

        {/* Column 3: Premium Deep-Green Welcome Rohit Banner Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0C402B 0%, #062E1E 100%)',
          borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 8px 30px rgba(6,46,30,0.15)', border: '1px solid rgba(16,185,129,0.15)'
        }}>
          {/* Text block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 2, maxWidth: '60%' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '850', color: '#FFFFFF', margin: 0 }}>Keep Going, Rohit!</h3>
            <p style={{ fontSize: '12px', color: '#A7F3D0', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>
              Success is the sum of small efforts, repeated day in and day out.
            </p>
            <button 
              onClick={() => navigate('/jobs')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: '#FFFFFF', color: '#0C402B', border: 'none',
                padding: '9px 18px', borderRadius: '30px', fontSize: '11px', fontWeight: '800',
                cursor: 'pointer', marginTop: '6px', width: 'fit-content', transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E6F4EA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <span>Explore Opportunities</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Student Illustration Character */}
          <div style={{ zIndex: 1, flexShrink: 0, marginRight: '-8px' }}>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
              alt="Rohit Profile" 
              style={{ 
                width: '74px', height: '94px', objectFit: 'cover', borderRadius: '12px',
                border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                transform: 'rotate(2deg)'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
