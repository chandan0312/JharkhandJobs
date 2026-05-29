import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import SearchBar from '../components/ui/SearchBar';
import JobCard from '../components/ui/JobCard';
import { Briefcase, Building, Bell, FileText, BookOpen, Users, TrendingUp, HelpCircle } from 'lucide-react';

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [recentJobs, setRecentJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [stats, setStats] = useState({
    jobs: 0,
    govtJobs: 0,
    blogs: 0,
    users: 0,
  });

  // Animated counters
  useEffect(() => {
    const targets = { jobs: 15842, govtJobs: 3265, blogs: 520, users: 10000 };
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setStats({
        jobs: Math.floor(targets.jobs * progress),
        govtJobs: Math.floor(targets.govtJobs * progress),
        blogs: Math.floor(targets.blogs * progress),
        users: Math.floor(targets.users * progress),
      });

      if (frame === totalFrames) {
        clearInterval(interval);
        setStats(targets);
      }
    }, frameRate);

    return () => clearInterval(interval);
  }, []);

  // Fetch recent jobs
  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await api.get('/jobs');
        if (response.data.success) {
          setRecentJobs(response.data.jobs.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error.message);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleSearch = ({ search, location, category }) => {
    let queryParams = [];
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (location && location !== 'All Locations') queryParams.push(`location=${encodeURIComponent(location)}`);
    
    // Set category query based on search input or active tabs
    let finalCat = category;
    if (category === 'All Categories') {
      if (activeTab === 'Private') finalCat = 'Private Jobs';
      if (activeTab === 'Govt') finalCat = 'Govt Jobs';
    }
    if (finalCat && finalCat !== 'All Categories') queryParams.push(`category=${encodeURIComponent(finalCat)}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    navigate(`/jobs${queryString}`);
  };

  const handleCategoryCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="page-content animate-fade-in">
      
      {/* 1. Hero Section */}
      <header 
        style={{
          position: 'relative',
          padding: '160px 0 120px',
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.35)), url(/assets/images/hero-homepage.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '650px', marginBottom: '40px' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              {t('home.heroTitle')}<br />
              {t('home.heroSubtitle').split(' ').slice(0, 2).join(' ')} <span style={{ color: '#86EFAC' }}>{t('home.heroSubtitle').split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="animate-slide-up delay-1" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>
              {t('home.heroDesc')}
            </p>

            {/* Pill Tabs */}
            <div className="animate-slide-up delay-2" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button 
                onClick={() => setActiveTab('All')} 
                className={`btn btn-sm ${activeTab === 'All' ? 'btn-primary' : 'btn-ghost'}`} 
                style={{ color: activeTab === 'All' ? 'white' : 'white', borderColor: 'white', backgroundColor: activeTab === 'All' ? '#1B8C0A' : 'transparent' }}
              >
                {t('home.allJobs')}
              </button>
              <button 
                onClick={() => setActiveTab('Private')} 
                className={`btn btn-sm ${activeTab === 'Private' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ color: activeTab === 'Private' ? 'white' : 'white', borderColor: 'white', backgroundColor: activeTab === 'Private' ? '#1B8C0A' : 'transparent' }}
              >
                {t('home.privateJobs')}
              </button>
              <button 
                onClick={() => setActiveTab('Govt')} 
                className={`btn btn-sm ${activeTab === 'Govt' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ color: activeTab === 'Govt' ? 'white' : 'white', borderColor: 'white', backgroundColor: activeTab === 'Govt' ? '#1B8C0A' : 'transparent' }}
              >
                {t('home.govtJobs')}
              </button>
            </div>

            {/* Reusable Search Bar */}
            <div className="animate-slide-up delay-3" style={{ width: '100%' }}>
              <SearchBar onSearch={handleSearch} initialCategory={activeTab === 'Private' ? 'Private Jobs' : activeTab === 'Govt' ? 'Govt Jobs' : 'All Categories'} />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Categories Row */}
      <section style={{ backgroundColor: 'white', padding: '60px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <div className="section-header">
            <h2>{t('home.exploreOpportunities')}</h2>
            <p>{t('home.findBestJobs')}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            
            {/* Category 1: Private Jobs (Blue Theme) */}
            <div onClick={() => handleCategoryCardClick('/jobs?category=Private%20Jobs')} className="card text-center" style={{ cursor: 'pointer', padding: '24px 16px', borderTop: '4px solid #2563EB' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Briefcase size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#1A1A2E' }}>Private Jobs</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>Explore Corporate Roles</p>
            </div>

            {/* Category 2: Govt Jobs (Green Theme) */}
            <div onClick={() => handleCategoryCardClick('/govt-jobs')} className="card text-center" style={{ cursor: 'pointer', padding: '24px 16px', borderTop: '4px solid #16A34A' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Building size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#1A1A2E' }}>Govt Jobs</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>Sarkari Naukri Portal</p>
            </div>

            {/* Category 3: Latest Alerts (Orange Theme) */}
            <div onClick={() => handleCategoryCardClick('/exams?category=Admit%20Card')} className="card text-center" style={{ cursor: 'pointer', padding: '24px 16px', borderTop: '4px solid #EA580C' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Bell size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#1A1A2E' }}>Latest Alerts</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>Exam Updates & Releases</p>
            </div>

            {/* Category 4: Exam Results (Red Theme) */}
            <div onClick={() => handleCategoryCardClick('/exams?category=Results')} className="card text-center" style={{ cursor: 'pointer', padding: '24px 16px', borderTop: '4px solid #DC2626' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#1A1A2E' }}>Exam Results</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>Check Your Marks</p>
            </div>

            {/* Category 5: Career Guide (Purple Theme) */}
            <div onClick={() => handleCategoryCardClick('/blog')} className="card text-center" style={{ cursor: 'pointer', padding: '24px 16px', borderTop: '4px solid #7C3AED' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <BookOpen size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#1A1A2E' }}>Career Guide</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>Read Expert Tips</p>
            </div>

            {/* Category 6: Practice Quiz (Teal Theme) */}
            <div onClick={() => handleCategoryCardClick('/quiz')} className="card text-center" style={{ cursor: 'pointer', padding: '24px 16px', borderTop: '4px solid #0D9488' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#CCFBF1', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <HelpCircle size={22} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#1A1A2E' }}>Practice Quiz</h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>Test Your Knowledge</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Stats Strip */}
      <section style={{ backgroundColor: '#E8F5E3', padding: '30px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'center' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Briefcase size={36} style={{ color: '#1B8C0A' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#157008' }}>{stats.jobs.toLocaleString()}+</h4>
                <p style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Live Private Jobs</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Building size={36} style={{ color: '#1B8C0A' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#157008' }}>{stats.govtJobs.toLocaleString()}+</h4>
                <p style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Govt Vacancies</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <TrendingUp size={36} style={{ color: '#1B8C0A' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#157008' }}>{stats.blogs.toLocaleString()}+</h4>
                <p style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Blog Posts This Week</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Users size={36} style={{ color: '#1B8C0A' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#157008' }}>{stats.users.toLocaleString()}+</h4>
                <p style={{ fontSize: '12px', color: '#374151', fontWeight: '500' }}>Registered Candidates</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Recent Jobs Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E' }}>Recently Added Jobs</h2>
            <Link to="/jobs" style={{ fontSize: '14px', fontWeight: '600', color: '#1B8C0A', textDecoration: 'none' }} className="btn btn-secondary btn-sm">
              View All Jobs
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px 0' }}>No job listings available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Recruiting CTA Card */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container animate-scale-in">
          <div style={{
            background: 'linear-gradient(135deg, #1B8C0A 0%, #0F5C06 100%)',
            borderRadius: '16px',
            color: 'white',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 10px 20px rgba(27, 140, 10, 0.25)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Are you hiring recruiters or companies?</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 24px' }}>
              Publish your vacancies on Jharkhand's fastest growing career portal and connect with qualified local talent in minutes.
            </p>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ color: '#1B8C0A', backgroundColor: 'white', border: 'none' }}>
              Post a Job Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
