import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { 
  Briefcase, 
  Building2, 
  Award, 
  Calendar, 
  Bell, 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  Bookmark,
  ChevronDown,
  BookOpen,
  Video,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';

const Jobs = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Primary database states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('All'); // 'All', 'Govt', 'Private', 'Apprenticeship'
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [qualificationFilter, setQualificationFilter] = useState('All Qualifications');
  const [sort, setSort] = useState('Latest First');
  const [quickFilter, setQuickFilter] = useState('All'); // 'Today', '3Days', '7Days', '30Days', 'EndingSoon', 'ApplyOnline'

  // Micro-interaction Bookmark State
  const [bookmarkedJobs, setBookmarkedJobs] = useState({});

  // Fetch initial parameters from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchParam = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || 'All Categories';
    const locationParam = searchParams.get('location') || 'All Locations';
    
    setSearch(searchParam);
    if (categoryParam !== 'All Categories') {
      setSelectedTab(categoryParam === 'Govt Jobs' ? 'Govt' : 'Private');
    }
    if (locationParam !== 'All Locations') {
      setLocationFilter(locationParam);
    }
    
    fetchJobs();
  }, [location.search]);

  // Load all jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all active jobs from backend API
      const response = await api.get('/jobs');
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Keep mock fallback if connection fails
  const mockJobsFallback = [
    {
      _id: 'mock-job-1-id',
      title: 'JSSC CGL Recruitment 2024',
      company: 'Jharkhand Staff Selection Commission (JSSC)',
      companyInitial: 'JSSC',
      companyColor: '#1B8C0A',
      location: 'Ranchi, Jharkhand',
      type: 'Full Time',
      salary: { min: 35400, max: 112400, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: 'Graduation',
      badgeText: 'New',
      category: 'Govt Jobs',
      industry: 'Public Service',
      description: 'Online application invited for JSSC CGL Combined Graduate Level examination for administrative posts.',
      postedDate: new Date('2026-05-26'),
      lastDate: new Date('2026-06-04')
    },
    {
      _id: 'mock-job-2-id',
      title: 'JPSC Civil Services Exam 2024',
      company: 'Jharkhand Public Service Commission (JPSC)',
      companyInitial: 'JPSC',
      companyColor: '#005691',
      location: 'Ranchi, Jharkhand',
      type: 'Full Time',
      salary: { min: 56100, max: 177500, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: 'Graduation',
      badgeText: 'Featured',
      category: 'Govt Jobs',
      industry: 'Public Service',
      description: 'State civil services exams for administrative, police, and finance service cadres of Jharkhand.',
      postedDate: new Date('2026-05-25'),
      lastDate: new Date('2026-06-24')
    },
    {
      _id: 'mock-job-3-id',
      title: 'RRB NTPC Graduate Vacancy 2024',
      company: 'Indian Railways',
      companyInitial: 'RRB',
      companyColor: '#DC2626',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 35400, max: 112400, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: 'Graduation',
      badgeText: 'Popular',
      category: 'Govt Jobs',
      industry: 'Transportation',
      description: 'Non-Technical Popular Categories recruitment for Station Master, Goods Guard, and Commercial Clerks.',
      postedDate: new Date('2026-05-24'),
      lastDate: new Date('2026-06-12')
    },
    {
      _id: 'mock-job-4-id',
      title: 'IBPS Clerk Recruitment 2024',
      company: 'IBPS',
      companyInitial: 'IBPS',
      companyColor: '#2563EB',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 19900, max: 63200, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: 'Graduation',
      badgeText: 'New',
      category: 'Govt Jobs',
      industry: 'Banking',
      description: 'Clerical cadre selection examination for public sector banks across India.',
      postedDate: new Date('2026-05-23'),
      lastDate: new Date('2026-06-11')
    },
    {
      _id: 'mock-job-5-id',
      title: 'Jharkhand Police Constable 2024',
      company: 'Jharkhand Police',
      companyInitial: 'JHP',
      companyColor: '#059669',
      location: 'Jharkhand',
      type: 'Full Time',
      salary: { min: 21700, max: 69100, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: '12th Pass',
      badgeText: 'Featured',
      category: 'Govt Jobs',
      industry: 'Security / Defense',
      description: 'District level police constable recruitment for law enforcement and patrolling forces.',
      postedDate: new Date('2026-05-22'),
      lastDate: new Date('2026-06-09')
    },
    {
      _id: 'mock-job-6-id',
      title: 'SBI PO Recruitment 2024',
      company: 'State Bank of India',
      companyInitial: 'SBI',
      companyColor: '#005691',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 48480, max: 85920, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: 'Graduation',
      badgeText: 'Popular',
      category: 'Govt Jobs',
      industry: 'Banking',
      description: 'Probationary Officers selection exam for managing financial credits, sales, and accounts.',
      postedDate: new Date('2026-05-21'),
      lastDate: new Date('2026-06-03')
    },
    {
      _id: 'mock-job-7-id',
      title: 'NTPC Junior Executive 2024',
      company: 'NTPC Limited',
      companyInitial: 'NTPC',
      companyColor: '#2563EB',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 40000, max: 140000, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: 'B.E/B.Tech',
      badgeText: 'New',
      category: 'Govt Jobs',
      industry: 'Engineering',
      description: 'Junior Executive roles in various disciplines of civil, mechanical, and electrical engineering.',
      postedDate: new Date('2026-05-20'),
      lastDate: new Date('2026-06-19')
    },
    {
      _id: 'mock-job-8-id',
      title: 'LIC AAO Recruitment 2024',
      company: 'Life Insurance Corporation of India',
      companyInitial: 'LIC',
      companyColor: '#D97706',
      location: 'All India',
      type: 'Full Time',
      salary: { min: 32795, max: 62315, currency: '₹', period: 'monthly' },
      experience: '0 - 2 Years',
      qualification: 'Graduation',
      badgeText: 'Featured',
      category: 'Govt Jobs',
      industry: 'Insurance',
      description: 'Assistant Administrative Officer cadre selection for insurance policy management and customer audits.',
      postedDate: new Date('2026-05-19'),
      lastDate: new Date('2026-06-07')
    },
    {
      _id: 'mock-job-9-id',
      title: 'Software Development Engineer',
      company: 'Tata Steel',
      companyInitial: 'TS',
      companyColor: '#005691',
      location: 'Jamshedpur',
      type: 'Full Time',
      salary: { min: 6, max: 12, currency: '₹', period: 'LPA' },
      experience: '1 - 3 Years',
      qualification: 'B.E/B.Tech',
      badgeText: 'Featured',
      category: 'Private Jobs',
      industry: 'IT / Software',
      description: 'Design and develop industrial ERP automation dashboards and system tools using React and Node.js.',
      postedDate: new Date('2026-05-28'),
      lastDate: new Date('2026-06-15')
    },
    {
      _id: 'mock-job-10-id',
      title: 'Graduate Engineer Trainee',
      company: 'Jindal Steel',
      companyInitial: 'JS',
      companyColor: '#0B72B9',
      location: 'Ranchi',
      type: 'Full Time',
      salary: { min: 5, max: 8, currency: '₹', period: 'LPA' },
      experience: '0 - 2 Years',
      qualification: 'B.E/B.Tech',
      badgeText: 'New',
      category: 'Private Jobs',
      industry: 'Manufacturing',
      description: 'Training programme for freshly graduated mechanical and metallurgical engineers in state-of-the-art steel plants.',
      postedDate: new Date('2026-05-29'),
      lastDate: new Date('2026-06-10')
    }
  ];

  const actualJobs = jobs && jobs.length > 0 ? jobs : mockJobsFallback;

  // Bookmark Toggle action
  const toggleBookmark = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedJobs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Helper: Days remaining countdown
  const getDaysLeftText = (lastDateString) => {
    if (!lastDateString) return null;
    const today = new Date('2026-05-30'); // System time standard
    const lastDate = new Date(lastDateString);
    const diffTime = lastDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', days: diffDays };
    if (diffDays === 0) return { text: 'Ending Today', days: 0 };
    if (diffDays === 1) return { text: '1 Day Left', days: 1 };
    return { text: `${diffDays} Days Left`, days: diffDays };
  };

  // Helper: Format Dates to DD MMM YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Dynamic filter lists compiled from database items
  const uniqueDepartments = ['All Departments', ...new Set(actualJobs.map(j => j.company.split(' (')[0]))];
  const uniqueLocations = ['All Locations', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Jharkhand', 'All India'];
  const uniqueQualifications = ['All Qualifications', '10th Pass', '12th Pass', 'Graduation', 'B.E/B.Tech'];

  // Apply filters locally on the fetched database jobs
  const getFilteredJobs = () => {
    return actualJobs.filter(job => {
      // 1. Tab selection filter (All, Govt, Private, Apprenticeship)
      if (selectedTab === 'Govt' && job.category !== 'Govt Jobs') return false;
      if (selectedTab === 'Private' && job.category !== 'Private Jobs') return false;
      if (selectedTab === 'Apprenticeship' && job.type !== 'Internship') return false;

      // 2. Search keyword filter
      if (search) {
        const s = search.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(s) ||
          job.company.toLowerCase().includes(s) ||
          (job.description && job.description.toLowerCase().includes(s)) ||
          (job.industry && job.industry.toLowerCase().includes(s));
        if (!matchesSearch) return false;
      }

      // 3. Category selector filter
      if (categoryFilter !== 'All Categories') {
        if (categoryFilter === 'Government Jobs' && job.category !== 'Govt Jobs') return false;
        if (categoryFilter === 'Private Jobs' && job.category !== 'Private Jobs') return false;
      }

      // 4. Department selector filter
      if (departmentFilter !== 'All Departments') {
        if (!job.company.toLowerCase().includes(departmentFilter.toLowerCase())) return false;
      }

      // 5. Location selector filter
      if (locationFilter !== 'All Locations') {
        if (!job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }

      // 6. Qualification selector filter
      if (qualificationFilter !== 'All Qualifications') {
        if (job.qualification !== qualificationFilter) return false;
      }

      // 7. Sidebar Quick Filter
      if (quickFilter !== 'All') {
        const today = new Date('2026-05-30');
        const posted = new Date(job.postedDate);
        const ageDiffTime = today - posted;
        const ageDiffDays = Math.floor(ageDiffTime / (1000 * 60 * 60 * 24));

        if (quickFilter === 'Today' && ageDiffDays > 0) return false;
        if (quickFilter === '3Days' && ageDiffDays > 3) return false;
        if (quickFilter === '7Days' && ageDiffDays > 7) return false;
        if (quickFilter === '30Days' && ageDiffDays > 30) return false;
        if (quickFilter === 'EndingSoon') {
          const countdown = getDaysLeftText(job.lastDate);
          if (!countdown || countdown.days < 0 || countdown.days > 5) return false;
        }
        if (quickFilter === 'ApplyOnline' && job.status !== 'active') return false;
      }

      return true;
    }).sort((a, b) => {
      // 8. Sorting
      if (sort === 'Oldest First') {
        return new Date(a.postedDate) - new Date(b.postedDate);
      }
      if (sort === 'Salary: High to Low') {
        return b.salary.max - a.salary.max;
      }
      if (sort === 'Ending Soonest') {
        if (!a.lastDate) return 1;
        if (!b.lastDate) return -1;
        return new Date(a.lastDate) - new Date(b.lastDate);
      }
      // Default: Latest First
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  };

  const filteredJobs = getFilteredJobs();

  // Dynamic statistics counts based on actual database contents
  const govtCount = actualJobs.filter(j => j.category === 'Govt Jobs').length;
  const privateCount = actualJobs.filter(j => j.category === 'Private Jobs').length;
  const todayPostedCount = actualJobs.filter(j => {
    const today = new Date('2026-05-30');
    const posted = new Date(j.postedDate);
    return Math.floor((today - posted) / (1000 * 60 * 60 * 24)) === 0;
  }).length;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedTab('All');
    setCategoryFilter('All Categories');
    setDepartmentFilter('All Departments');
    setLocationFilter('All Locations');
    setQualificationFilter('All Qualifications');
    setSort('Latest First');
    setQuickFilter('All');
    navigate('/jobs');
  };

  const handlePopularSearch = (term) => {
    setSearch(term);
  };

  return (
    <div className="page-content animate-fade-in" style={{ backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
      
      {/* 1. Sleek, Compact Header Area */}
      <section className="jobs-hero-wrapper" style={{ borderBottom: '1px solid #E2E8F0', padding: '32px 0 24px' }}>
        <div className="container">
          
          {/* Header Row: Title on Left, Stats on Right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
            
            {/* Title Block */}
            <div style={{ flex: '1 1 400px' }}>
              <span style={{ 
                color: '#16a34a', 
                background: '#eefdf4', 
                padding: '4px 12px', 
                borderRadius: '9999px', 
                fontSize: '12px', 
                fontWeight: '700',
                display: 'inline-block',
                marginBottom: '8px',
                border: '1px solid rgba(22, 163, 74, 0.12)'
              }}>
                #1 Job Portal of Jharkhand
              </span>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '800', 
                color: '#0F172A', 
                lineHeight: '1.2', 
                marginBottom: '4px',
                letterSpacing: '-0.5px'
              }}>
                Latest Government & <span style={{ color: '#16a34a' }}>Private Jobs in Jharkhand</span>
              </h1>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Find the right opportunity. Build your future.
              </p>
            </div>

            {/* Statistics Row Grid (Compact version) */}
            <div style={{ flex: '1 1 500px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              
              {/* Stat 1: Total Jobs */}
              <div className="stat-premium-card" onClick={() => { setSelectedTab('All'); setQuickFilter('All'); }} style={{ cursor: 'pointer', padding: '10px 14px', gap: '10px' }}>
                <div className="stat-icon-wrapper green" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <Briefcase size={16} />
                </div>
                <div className="stat-info">
                  <div className="stat-num" style={{ fontSize: '16px' }}>{actualJobs.length}</div>
                  <div className="stat-label" style={{ fontSize: '11px' }}>Total Jobs</div>
                </div>
              </div>

              {/* Stat 2: Govt Jobs */}
              <div className="stat-premium-card" onClick={() => { setSelectedTab('Govt'); setQuickFilter('All'); }} style={{ cursor: 'pointer', padding: '10px 14px', gap: '10px' }}>
                <div className="stat-icon-wrapper blue" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <Building2 size={16} />
                </div>
                <div className="stat-info">
                  <div className="stat-num" style={{ fontSize: '16px' }}>{govtCount}</div>
                  <div className="stat-label" style={{ fontSize: '11px' }}>Govt. Jobs</div>
                </div>
              </div>

              {/* Stat 3: Private Jobs */}
              <div className="stat-premium-card" onClick={() => { setSelectedTab('Private'); setQuickFilter('All'); }} style={{ cursor: 'pointer', padding: '10px 14px', gap: '10px' }}>
                <div className="stat-icon-wrapper purple" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <Award size={16} />
                </div>
                <div className="stat-info">
                  <div className="stat-num" style={{ fontSize: '16px' }}>{privateCount}</div>
                  <div className="stat-label" style={{ fontSize: '11px' }}>Private Jobs</div>
                </div>
              </div>

              {/* Stat 4: Posted Today */}
              <div className="stat-premium-card" onClick={() => { setQuickFilter('Today'); }} style={{ cursor: 'pointer', padding: '10px 14px', gap: '10px' }}>
                <div className="stat-icon-wrapper red" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
                  <Calendar size={16} />
                </div>
                <div className="stat-info">
                  <div className="stat-num" style={{ fontSize: '16px' }}>{todayPostedCount}</div>
                  <div className="stat-label" style={{ fontSize: '11px' }}>Posted Today</div>
                </div>
              </div>

            </div>

          </div>

          {/* Search bar area */}
          <div style={{ width: '100%' }}>
            <div className="search-bar animate-slide-up" style={{ 
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
              border: '1px solid rgba(27, 140, 10, 0.12)' 
            }}>
              
              {/* Search text input */}
              <div className="search-field" style={{ padding: '10px 16px' }}>
                <Search size={18} style={{ color: '#16a34a' }} />
                <input
                  type="text"
                  placeholder="Search by Job Title, Keywords, Company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ fontWeight: '500', fontSize: '14px' }}
                />
              </div>

              {/* Location Select */}
              <div className="search-field" style={{ padding: '10px 16px' }}>
                <MapPin size={18} style={{ color: '#16a34a' }} />
                <select 
                  value={locationFilter} 
                  onChange={(e) => setLocationFilter(e.target.value)}
                  style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}
                >
                  <option value="All Locations">All India</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Jamshedpur">Jamshedpur</option>
                  <option value="Dhanbad">Dhanbad</option>
                  <option value="Bokaro">Bokaro</option>
                  <option value="Jharkhand">Jharkhand State</option>
                </select>
              </div>

              {/* Action Search button */}
              <button 
                onClick={fetchJobs} 
                className="btn-search" 
                style={{ 
                  margin: '4px', 
                  borderRadius: '8px', 
                  padding: '10px 24px',
                  backgroundColor: '#16a34a',
                  fontWeight: '700',
                  fontSize: '14px'
                }}
              >
                Search Jobs
              </button>

            </div>

            {/* Popular Searches below search bar */}
            <div className="popular-tags-container" style={{ marginTop: '12px' }}>
              <span style={{ fontWeight: '600', color: '#64748B', fontSize: '12px' }}>Popular Searches:</span>
              {['JSSC', 'JPSC', 'Bank', 'Railway', 'Teaching', 'Police', 'IT Jobs'].map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => handlePopularSearch(tag)} 
                  className="popular-tag"
                  style={{ fontSize: '12px', padding: '3px 10px' }}
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. Latest Updates Horizontal Alert Ticker */}
      <div className="container" style={{ marginTop: '24px' }}>
        <div className="update-ticker-bar">
          <div className="update-ticker-content">
            <div className="ticker-bell-icon">
              <Bell size={16} className="phone-bell-glow" />
            </div>
            <span>
              <strong style={{ color: '#15803d' }}>Latest Update:</strong> JSSC CGL Recruitment 2024 Apply Online Last Date Extended
            </span>
            <span style={{ 
              backgroundColor: '#22c55e', 
              color: 'white', 
              fontSize: '10px', 
              fontWeight: '700', 
              padding: '2px 8px', 
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}>New</span>
          </div>
          <Link to="/exams" style={{ 
            color: '#16a34a', 
            fontWeight: '700', 
            fontSize: '13px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px' 
          }}>
            View All Alerts <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* 3. Main Dashboard Double Column layout */}
      <div className="container" style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN: Main List and Filter systems (75% width) */}
          <main style={{ flex: '1 1 760px', maxWidth: '100%' }}>
            
            {/* job type tabs */}
            <div className="premium-tabs-list">
              <button 
                onClick={() => { setSelectedTab('All'); }} 
                className={`premium-tab-item ${selectedTab === 'All' ? 'active' : ''}`}
              >
                All Jobs ({actualJobs.length})
              </button>
              <button 
                onClick={() => { setSelectedTab('Govt'); }} 
                className={`premium-tab-item ${selectedTab === 'Govt' ? 'active' : ''}`}
              >
                Government Jobs ({govtCount})
              </button>
              <button 
                onClick={() => { setSelectedTab('Private'); }} 
                className={`premium-tab-item ${selectedTab === 'Private' ? 'active' : ''}`}
              >
                Private Jobs ({privateCount})
              </button>
              <button 
                onClick={() => { setSelectedTab('Apprenticeship'); }} 
                className={`premium-tab-item ${selectedTab === 'Apprenticeship' ? 'active' : ''}`}
              >
                Apprenticeship (45)
              </button>
            </div>

            {/* Horizontal select dropdowns */}
            <div className="horizontal-filters-bar">
              
              {/* Category selector */}
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)} 
                className="filter-pill-select"
              >
                <option value="All Categories">All Categories</option>
                <option value="Government Jobs">Government Jobs</option>
                <option value="Private Jobs">Private Jobs</option>
              </select>

              {/* Department selector */}
              <select 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)} 
                className="filter-pill-select"
              >
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Location selector */}
              <select 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)} 
                className="filter-pill-select"
              >
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              {/* Qualification selector */}
              <select 
                value={qualificationFilter} 
                onChange={(e) => setQualificationFilter(e.target.value)} 
                className="filter-pill-select"
              >
                {uniqueQualifications.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>

              {/* Reset/More Filters button */}
              <button onClick={handleResetFilters} className="filter-pill-button">
                <RefreshCw size={14} /> Clear Filters
              </button>

              {/* Sort by select */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Sort by:</span>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)} 
                  className="filter-pill-select"
                  style={{ paddingRight: '28px', backgroundColor: '#F1F5F9', border: 'none' }}
                >
                  <option value="Latest First">Latest First</option>
                  <option value="Oldest First">Oldest First</option>
                  <option value="Salary: High to Low">Salary High to Low</option>
                  <option value="Ending Soonest">Ending Soonest</option>
                </select>
              </div>

            </div>

            {/* Tabular Job listings container */}
            <div className="jobs-tabular-container">
              
              {/* Table header */}
              <div className="jobs-table-header">
                <div>Job Title</div>
                <div>Department / Company</div>
                <div>Location</div>
                <div>Qualification</div>
                <div>Last Date</div>
                <div>Salary</div>
                <div className="posted-header">Posted On</div>
                <div style={{ textSelf: 'right' }}>Action</div>
              </div>

              {/* Table Body rows */}
              <div className="jobs-table-body">
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', flexDirection: 'column' }}>
                    <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #16a34a', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '16px', color: '#64748B', fontSize: '14px', fontWeight: '500' }}>Searching jobs...</p>
                  </div>
                ) : error ? (
                  <div className="text-center" style={{ padding: '60px', color: '#DC2626' }}>
                    <AlertCircle size={36} style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontWeight: '600' }}>{error}</p>
                  </div>
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const countdown = getDaysLeftText(job.lastDate);
                    const isBookmarked = !!bookmarkedJobs[job._id];
                    
                    return (
                      <div key={job._id} className="jobs-table-row animate-scale-in">
                        
                        {/* 1. Title Column */}
                        <div className="job-title-col">
                          <div 
                            className="job-comp-initial" 
                            style={{ backgroundColor: job.companyColor || '#16a34a' }}
                          >
                            {job.companyInitial || 'JO'}
                          </div>
                          <div className="job-title-text">
                            <h3 className="job-title-h3">
                              <Link to={`/jobs/${job._id}`} style={{ color: '#0F172A' }}>
                                {job.title}
                              </Link>
                              
                              {/* Dynamic badge tags */}
                              {job.badgeText && (
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  color: 'white',
                                  textTransform: 'uppercase',
                                  backgroundColor: job.badgeText === 'New' ? '#22c55e' 
                                                 : job.badgeText === 'Featured' ? '#3b82f6' 
                                                 : '#a855f7'
                                }}>
                                  {job.badgeText}
                                </span>
                              )}
                            </h3>
                            <span className="job-sub-desc">
                              {job.category === 'Govt Jobs' ? 'Government Recruitment' : 'Private Employment'}
                            </span>
                          </div>
                        </div>

                        {/* 2. Department Column */}
                        <div className="job-details-bold">
                          {job.company}
                        </div>

                        {/* 3. Location Column */}
                        <div className="job-details-light" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} style={{ color: '#94A3B8' }} />
                          {job.location}
                        </div>

                        {/* 4. Qualification Column */}
                        <div className="job-details-light">
                          <span style={{ 
                            background: '#f1f5f9', 
                            padding: '4px 10px', 
                            borderRadius: '6px', 
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#475569'
                          }}>
                            {job.qualification || 'Graduation'}
                          </span>
                        </div>

                        {/* 5. Last Date Countdown Column */}
                        <div className="job-date-container">
                          {countdown ? (
                            <>
                              <span className="job-date-red">{formatDate(job.lastDate)}</span>
                              <span className="job-days-left">{countdown.text}</span>
                            </>
                          ) : (
                            <span style={{ color: '#64748B' }}>N/A</span>
                          )}
                        </div>

                        {/* 6. Salary Column */}
                        <div className="job-details-bold" style={{ color: '#16a34a' }}>
                          {job.salary.period === 'monthly' ? (
                            <>₹{job.salary.min.toLocaleString('en-IN')} - ₹{job.salary.max.toLocaleString('en-IN')}</>
                          ) : (
                            <>₹{job.salary.min} - ₹{job.salary.max} LPA</>
                          )}
                        </div>

                        {/* 7. Posted date Column */}
                        <div className="job-details-light posted-cell">
                          {formatDate(job.postedDate)}
                        </div>

                        {/* 8. Action buttons Column */}
                        <div className="job-action-col">
                          <Link to={`/jobs/${job._id}`} className="btn-details-outline">
                            View Details
                          </Link>
                          
                          {/* Interactive bookmark toggle */}
                          <button 
                            onClick={(e) => toggleBookmark(job._id, e)} 
                            className={`bookmark-icon-btn ${isBookmarked ? 'active' : ''}`}
                          >
                            <Bookmark 
                              size={18} 
                              fill={isBookmarked ? '#16a34a' : 'transparent'} 
                              stroke={isBookmarked ? '#16a34a' : 'currentColor'} 
                            />
                          </button>
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="text-center" style={{ padding: '60px 40px', color: '#64748B' }}>
                    <AlertCircle size={36} style={{ margin: '0 auto 16px', color: '#94A3B8' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>No matches found</h3>
                    <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                      Try adjusting your keywords or clearing the filter pill selections.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Centered action button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <button className="btn btn-ghost" style={{ 
                borderRadius: '8px', 
                border: '1.5px solid #16a34a', 
                color: '#16a34a',
                padding: '12px 28px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                View All Jobs <ChevronRight size={16} />
              </button>
            </div>

          </main>

          {/* RIGHT COLUMN: Sidebar Widgets (25% width) */}
          <aside style={{ flex: '1 1 280px', maxWidth: '340px' }}>
            
            {/* Widget 1: Free Job Alerts Box */}
            <div className="free-alerts-widget">
              <div className="free-alerts-layout">
                <div className="free-alerts-text">
                  <h4>Get Free Job Alerts</h4>
                  <p>Receive latest job notifications directly on your mobile</p>
                </div>
                
                {/* Visual smartphone illustration */}
                <div className="free-alerts-phone-wrap">
                  <div className="phone-mockup-illust">
                    <Bell className="phone-bell-glow" />
                  </div>
                </div>

                <button className="btn btn-primary" style={{ 
                  backgroundColor: '#16a34a', 
                  width: '100%', 
                  borderRadius: '10px',
                  fontWeight: '700',
                  gap: '8px'
                }}>
                  <Bell size={16} /> Enable Alerts
                </button>
              </div>
            </div>

            {/* Widget 2: Quick Filters checklist */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>Quick Filters</h3>
                <button 
                  onClick={() => setQuickFilter('All')} 
                  style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                
                <div 
                  onClick={() => setQuickFilter(quickFilter === 'Today' ? 'All' : 'Today')} 
                  className={`quick-filter-item ${quickFilter === 'Today' ? 'active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={15} style={{ color: '#94A3B8' }} /> Today Jobs
                  </span>
                  <span className="quick-filter-count">28</span>
                </div>

                <div 
                  onClick={() => setQuickFilter(quickFilter === '3Days' ? 'All' : '3Days')} 
                  className={`quick-filter-item ${quickFilter === '3Days' ? 'active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} style={{ color: '#94A3B8' }} /> Last 3 Days
                  </span>
                  <span className="quick-filter-count">156</span>
                </div>

                <div 
                  onClick={() => setQuickFilter(quickFilter === '7Days' ? 'All' : '7Days')} 
                  className={`quick-filter-item ${quickFilter === '7Days' ? 'active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} style={{ color: '#94A3B8' }} /> Last 7 Days
                  </span>
                  <span className="quick-filter-count">312</span>
                </div>

                <div 
                  onClick={() => setQuickFilter(quickFilter === '30Days' ? 'All' : '30Days')} 
                  className={`quick-filter-item ${quickFilter === '30Days' ? 'active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} style={{ color: '#94A3B8' }} /> Last 30 Days
                  </span>
                  <span className="quick-filter-count">892</span>
                </div>

                <div 
                  onClick={() => setQuickFilter(quickFilter === 'EndingSoon' ? 'All' : 'EndingSoon')} 
                  className={`quick-filter-item red-ending ${quickFilter === 'EndingSoon' ? 'active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={15} style={{ color: '#EF4444' }} /> Ending Soon
                  </span>
                  <span className="quick-filter-count">98</span>
                </div>

                <div 
                  onClick={() => setQuickFilter(quickFilter === 'ApplyOnline' ? 'All' : 'ApplyOnline')} 
                  className={`quick-filter-item ${quickFilter === 'ApplyOnline' ? 'active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={15} style={{ color: '#94A3B8' }} /> Apply Online
                  </span>
                  <span className="quick-filter-count">784</span>
                </div>

              </div>
            </div>

            {/* Widget 3: Top Categories */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>Top Categories</h3>
                <button 
                  onClick={() => setCategoryFilter('All Categories')} 
                  style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}
                >
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                
                <div onClick={() => setCategoryFilter('Government Jobs')} className="category-sidebar-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={15} style={{ color: '#94A3B8' }} /> Banking
                  </span>
                  <span className="quick-filter-count">186</span>
                </div>

                <div className="category-sidebar-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={15} style={{ color: '#94A3B8' }} /> Teaching
                  </span>
                  <span className="quick-filter-count">142</span>
                </div>

                <div className="category-sidebar-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={15} style={{ color: '#94A3B8' }} /> Engineering
                  </span>
                  <span className="quick-filter-count">128</span>
                </div>

                <div onClick={() => setQualificationFilter('10th Pass')} className="category-sidebar-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={15} style={{ color: '#94A3B8' }} /> 10th Pass Jobs
                  </span>
                  <span className="quick-filter-count">98</span>
                </div>

                <div onClick={() => setQualificationFilter('12th Pass')} className="category-sidebar-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={15} style={{ color: '#94A3B8' }} /> 12th Pass Jobs
                  </span>
                  <span className="quick-filter-count">156</span>
                </div>

                <div className="category-sidebar-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={15} style={{ color: '#94A3B8' }} /> Police / Defence
                  </span>
                  <span className="quick-filter-count">86</span>
                </div>

                <div className="category-sidebar-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smartphone size={15} style={{ color: '#94A3B8' }} /> IT Jobs
                  </span>
                  <span className="quick-filter-count">118</span>
                </div>

                <div onClick={handleResetFilters} className="category-sidebar-item" style={{ borderTop: '1px solid #F1F5F9', marginTop: '6px', paddingTop: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                    <Filter size={15} style={{ color: '#16a34a' }} /> All Categories
                  </span>
                  <span className="quick-filter-count" style={{ backgroundColor: '#eefdf4', color: '#16a34a' }}>1,248</span>
                </div>

              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* 4. Bottom Trust Badges row ticker */}
      <div className="container" style={{ marginTop: '60px' }}>
        <div className="trust-badges-bar">
          
          {/* Badge 1: 100% Verified */}
          <div className="trust-badge-card">
            <div className="trust-badge-icon green">
              <ShieldCheck size={20} />
            </div>
            <div className="trust-badge-text">
              <div className="trust-badge-title">100% Verified Jobs</div>
              <div className="trust-badge-desc">Trusted & Authentic</div>
            </div>
          </div>

          {/* Badge 2: Daily Updates */}
          <div className="trust-badge-card">
            <div className="trust-badge-icon blue">
              <Clock size={20} />
            </div>
            <div className="trust-badge-text">
              <div className="trust-badge-title">Daily Updates</div>
              <div className="trust-badge-desc">New Jobs Every Day</div>
            </div>
          </div>

          {/* Badge 3: Instant Alerts */}
          <div className="trust-badge-card">
            <div className="trust-badge-icon purple">
              <Bell size={20} />
            </div>
            <div className="trust-badge-text">
              <div className="trust-badge-title">Instant Alerts</div>
              <div className="trust-badge-desc">Never Miss Any Job</div>
            </div>
          </div>

          {/* Badge 4: Exam Preparation */}
          <div className="trust-badge-card">
            <div className="trust-badge-icon orange">
              <BookOpen size={20} />
            </div>
            <div className="trust-badge-text">
              <div className="trust-badge-title">Exam Prep</div>
              <div className="trust-badge-desc">Study Material & Tests</div>
            </div>
          </div>

          {/* Badge 5: Expert Guidance */}
          <div className="trust-badge-card">
            <div className="trust-badge-icon teal">
              <Video size={20} />
            </div>
            <div className="trust-badge-text">
              <div className="trust-badge-title">Expert Guidance</div>
              <div className="trust-badge-desc">Career Tips & Advice</div>
            </div>
          </div>

          {/* Badge 6: Mobile Friendly */}
          <div className="trust-badge-card">
            <div className="trust-badge-icon pink">
              <Smartphone size={20} />
            </div>
            <div className="trust-badge-text">
              <div className="trust-badge-title">Mobile Friendly</div>
              <div className="trust-badge-desc">Access Anytime, Anywhere</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Jobs;
