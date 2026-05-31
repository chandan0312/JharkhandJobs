import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, MapPin, Search, Calendar, Award, BookOpen, SlidersHorizontal } from 'lucide-react';

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Primary states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('All'); // 'All', 'Govt', 'Private', 'Internship'
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [sort, setSort] = useState('Latest First');

  // Load jobs from API
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
        console.error(err);
        setError('Failed to fetch jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [location.search]);

  // Apply filters locally on the fetched database jobs
  const getFilteredJobs = () => {
    return jobs.filter(job => {
      // 1. Tab selection filter (All, Govt, Private)
      if (selectedTab === 'Govt' && job.category !== 'Govt Jobs') return false;
      if (selectedTab === 'Private' && job.category !== 'Private Jobs') return false;

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

      // 4. Location selector filter
      if (locationFilter !== 'All Locations') {
        if (!job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      // 5. Sorting
      if (sort === 'Oldest First') {
        return new Date(a.postedDate) - new Date(b.postedDate);
      }
      if (sort === 'Salary: High to Low') {
        return b.salary.max - a.salary.max;
      }
      // Default: Latest First
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  };

  const filteredJobs = getFilteredJobs();

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Latest Jobs</h2>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Total {filteredJobs.length} active jobs found</span>
        </div>
      </div>

      {/* Filter Systems grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', 
        marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9'
      }}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500', outline: 'none' }}>
          <option value="All Categories">All Categories</option>
          <option value="Government Jobs">Government Jobs</option>
          <option value="Private Jobs">Private Jobs</option>
        </select>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500', outline: 'none' }}>
          <option value="All Locations">All Locations</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Jamshedpur">Jamshedpur</option>
          <option value="Jharkhand">Jharkhand State</option>
          <option value="All India">All India</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500', outline: 'none' }}>
          <option value="Latest First">Latest First</option>
          <option value="Oldest First">Oldest First</option>
          <option value="Salary: High to Low">Salary High to Low</option>
        </select>
        <div style={{ display: 'flex', gap: '8px', flex: '1 1 200px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              placeholder="Search title, company..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '6px 12px 6px 30px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', outline: 'none' }}
            />
          </div>
          <button style={{ padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={14} style={{ color: '#64748B' }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
        {['All', 'Govt', 'Private'].map(t => (
          <button 
            key={t}
            onClick={() => setSelectedTab(t)}
            style={{
              padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer', border: 'none',
              backgroundColor: selectedTab === t ? '#E8F5E3' : 'transparent',
              color: selectedTab === t ? '#1B8C0A' : '#64748B'
            }}
          >
            {t === 'All' ? 'All Jobs' : t === 'Govt' ? 'Government Jobs' : 'Private Jobs'}
          </button>
        ))}
      </div>

      {/* Table rows list */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px' }}>Job Position</th>
              <th style={{ padding: '12px' }}>Company</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Last Date</th>
              <th style={{ padding: '12px' }}>Salary</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Searching active listings...</td>
              </tr>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((j) => (
                <tr key={j._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '700', color: '#0F172A', cursor: 'pointer' }} onClick={() => navigate(`/jobs/${j._id}`)}>{j.title}</div>
                    <span style={{ fontSize: '10px', color: '#EA580C', fontWeight: '600' }}>{j.category}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#475569', fontWeight: '500' }}>{j.company}</td>
                  <td style={{ padding: '12px', color: '#64748B' }}>{j.location}</td>
                  <td style={{ padding: '12px', color: '#EF4444', fontWeight: '600' }}>
                    {j.lastDate ? new Date(j.lastDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'N/A'}
                  </td>
                  <td style={{ padding: '12px', color: '#1B8C0A', fontWeight: '700' }}>
                    {j.salary ? `${j.salary.currency}${j.salary.min} - ${j.salary.max} ${j.salary.period}` : 'N/A'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: '700',
                      backgroundColor: j.status === 'active' ? '#ECFDF5' : '#F1F5F9',
                      color: j.status === 'active' ? '#059669' : '#64748B'
                    }}>{j.status === 'active' ? 'Active' : 'Closed'}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button 
                      onClick={() => navigate(`/jobs/${j._id}`)}
                      style={{ padding: '6px 14px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Apply Online
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No vacancies matching your selections.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Showing 1 to {filteredJobs.length} of {filteredJobs.length} results</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={{ width: '28px', height: '28px', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>1</button>
          <button style={{ width: '28px', height: '28px', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: 'white', color: '#334155', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>&gt;</button>
        </div>
      </div>

    </div>
  );
};

export default Jobs;
