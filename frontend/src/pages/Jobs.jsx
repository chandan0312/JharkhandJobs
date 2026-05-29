import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import SearchBar from '../components/ui/SearchBar';
import JobCard from '../components/ui/JobCard';
import { Filter, RefreshCw, AlertCircle } from 'lucide-react';

const Jobs = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Search parameters state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('All Types');
  const [category, setCategory] = useState('All Categories');
  const [experience, setExperience] = useState('Any Experience');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [sort, setSort] = useState('newest');

  // Load initial filters from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchParam = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category') || 'All Categories';
    const locationParam = searchParams.get('location') || 'All Locations';
    
    setSearch(searchParam);
    setCategory(categoryParam);
    
    fetchJobs({
      search: searchParam,
      category: categoryParam,
      location: locationParam !== 'All Locations' ? locationParam : '',
      type: jobType !== 'All Types' ? jobType : '',
      experience: experience !== 'Any Experience' ? experience : '',
      minSalary,
      maxSalary,
      sort
    });
  }, [location.search]);

  // Fetch filtered jobs from API
  const fetchJobs = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      let queryParams = [];
      if (filters.search) queryParams.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.category && filters.category !== 'All Categories') queryParams.push(`category=${encodeURIComponent(filters.category)}`);
      if (filters.location) queryParams.push(`location=${encodeURIComponent(filters.location)}`);
      if (filters.type && filters.type !== 'All Types') queryParams.push(`type=${encodeURIComponent(filters.type)}`);
      if (filters.experience && filters.experience !== 'Any Experience') queryParams.push(`experience=${encodeURIComponent(filters.experience)}`);
      if (filters.minSalary) queryParams.push(`minSalary=${encodeURIComponent(filters.minSalary)}`);
      if (filters.maxSalary) queryParams.push(`maxSalary=${encodeURIComponent(filters.maxSalary)}`);
      if (filters.sort) queryParams.push(`sort=${encodeURIComponent(filters.sort)}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await api.get(`/jobs${queryString}`);
      
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

  const handleSearchBarSearch = ({ search: query, location: loc, category: cat }) => {
    setSearch(query);
    setCategory(cat);
    
    fetchJobs({
      search: query,
      category: cat,
      location: loc !== 'All Locations' ? loc : '',
      type: jobType !== 'All Types' ? jobType : '',
      experience: experience !== 'Any Experience' ? experience : '',
      minSalary,
      maxSalary,
      sort
    });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchJobs({
      search,
      category,
      type: jobType,
      experience,
      minSalary,
      maxSalary,
      sort
    });
  };

  const handleResetFilters = () => {
    setJobType('All Types');
    setCategory('All Categories');
    setExperience('Any Experience');
    setMinSalary('');
    setMaxSalary('');
    setSort('newest');
    setSearch('');
    
    // Clear URL parameters
    navigate('/jobs');
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Hero Section */}
      <header 
        style={{
          position: 'relative',
          padding: '120px 0 80px',
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.4)), url(/assets/images/hero-all-jobs.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '44px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              {t('jobs.title')}
            </h1>
            <p className="animate-slide-up delay-1" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>
              {t('jobs.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '40px' }}>
        
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>{t('jobs.breadcrumbHome')}</span>
          <span className="separator">&gt;</span>
          <span className="current">{t('jobs.breadcrumbAll')}</span>
        </div>

        {/* Header Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', marginBottom: '8px' }}>
            {t('jobs.headerTitle')}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>
            {t('jobs.headerDesc')}
          </p>
        </div>

        {/* Top Search Bar */}
        <div style={{ marginBottom: '40px' }}>
          <SearchBar 
            onSearch={handleSearchBarSearch} 
            initialQuery={search} 
            initialCategory={category} 
          />
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column: Filter Sidebar */}
          <aside className="card" style={{ flex: '1 1 280px', maxWidth: '320px', padding: '24px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} />
                {t('jobs.filters')}
              </h2>
              <button 
                onClick={handleResetFilters} 
                style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <RefreshCw size={12} /> {t('jobs.reset')}
              </button>
            </div>

            <form onSubmit={handleApplyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Filter 1: Job Type Radio */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '12px' }}>{t('jobs.jobType')}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['All Types', 'Full Time', 'Part Time', 'Contract', 'Internship'].map(typeOption => (
                    <label key={typeOption} className="checkbox-wrapper">
                      <input 
                        type="radio" 
                        name="jobType"
                        checked={jobType === typeOption} 
                        onChange={() => setJobType(typeOption)} 
                      />
                      <span>{typeOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 2: Category Select */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>{t('jobs.category')}</h4>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
                  <option value="All Categories">All Categories</option>
                  <option value="Private Jobs">Private Jobs</option>
                  <option value="Govt Jobs">Govt Jobs (Sarkari)</option>
                </select>
              </div>

              {/* Filter 3: Experience Level */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>{t('jobs.experience')}</h4>
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="form-select">
                  <option value="Any Experience">Any Experience</option>
                  <option value="0 - 2 Years">0 - 2 Years (Freshers)</option>
                  <option value="1 - 3 Years">1 - 3 Years</option>
                  <option value="2 - 5 Years">2 - 5 Years</option>
                  <option value="5+ Years">5+ Years (Senior)</option>
                </select>
              </div>

              {/* Filter 4: Salary Range */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>{t('jobs.salaryRange')}</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minSalary} 
                    onChange={(e) => setMinSalary(e.target.value)} 
                    className="form-input" 
                    style={{ padding: '8px 12px' }}
                  />
                  <span style={{ color: '#9CA3AF' }}>-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxSalary} 
                    onChange={(e) => setMaxSalary(e.target.value)} 
                    className="form-input" 
                    style={{ padding: '8px 12px' }}
                  />
                </div>
              </div>

              {/* Apply Filters Button */}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {t('jobs.applyFilters')}
              </button>

            </form>
          </aside>

          {/* Right Column: Listings */}
          <main style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                {t('jobs.showing')} <strong>{jobs.length}</strong> {t('jobs.opportunities')}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>{t('jobs.sortBy')}:</span>
                <select 
                  value={sort} 
                  onChange={(e) => {
                    setSort(e.target.value);
                    fetchJobs({
                      search,
                      category,
                      type: jobType,
                      experience,
                      minSalary,
                      maxSalary,
                      sort: e.target.value
                    });
                  }} 
                  className="form-select" 
                  style={{ padding: '6px 24px 6px 12px', fontSize: '13px', borderRadius: '6px', width: 'auto' }}
                >
                  <option value="newest">{t('jobs.newest')}</option>
                  <option value="oldest">{t('jobs.oldest')}</option>
                  <option value="salary-high">{t('jobs.salaryHigh')}</option>
                </select>
              </div>
            </div>

            {/* Display Loader, Error or Jobs Grid */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0', flexDirection: 'column' }}>
                <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>{t('jobs.searching')}</p>
              </div>
            ) : error ? (
              <div className="card text-center" style={{ padding: '40px', color: '#DC2626' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
                <p>{error}</p>
              </div>
            ) : jobs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="card text-center" style={{ padding: '60px 40px', color: '#6B7280' }}>
                <AlertCircle size={36} style={{ margin: '0 auto 16px', color: '#9CA3AF' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '8px' }}>{t('jobs.noMatches')}</h3>
                <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                  {t('jobs.noMatchesDesc')}
                </p>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};

export default Jobs;
