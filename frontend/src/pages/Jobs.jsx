import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, SlidersHorizontal } from 'lucide-react';

const formatDateDDMMYYYY = (dateVal) => {
  if (!dateVal) return 'N/A';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      // If it's a string like "22-07-2026" or "Ongoing"
      return String(dateVal);
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    return String(dateVal);
  }
};

const getRecruitmentBoard = (job) => {
  if (job.companyInitial && job.companyInitial.trim()) {
    return job.companyInitial;
  }
  if (!job.company) return 'N/A';
  // If company name has parentheses e.g. "Jharkhand Staff Selection Commission (JSSC)", extract JSSC
  const match = job.company.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1];
  }
  if (job.company.length > 12) {
    const words = job.company.split(' ');
    if (words.length > 1) {
      return words.map(w => w[0]).join('').toUpperCase();
    }
  }
  return job.company;
};

const formatVacancies = (vacancies) => {
  if (!vacancies && vacancies !== 0) return 'N/A';
  const num = Number(vacancies);
  if (isNaN(num)) return String(vacancies);
  return num.toLocaleString('en-IN');
};

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Primary states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('All'); 
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
  }, []);

  // Synchronize search parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchVal = searchParams.get('search') || '';
    setSearch(searchVal);
  }, [location.search]);

  // Apply filters locally on jobs
  const getFilteredJobs = () => {
    return jobs.filter(job => {
      // 1. Tab selection filter
      if (selectedTab !== 'All') {
        if (String(job.category).toLowerCase() !== selectedTab.toLowerCase()) return false;
      }

      // 2. Search keyword filter
      if (search) {
        const s = search.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(s) ||
          job.company.toLowerCase().includes(s) ||
          (job.companyInitial && job.companyInitial.toLowerCase().includes(s)) ||
          (job.qualification && job.qualification.toLowerCase().includes(s)) ||
          (job.description && job.description.toLowerCase().includes(s)) ||
          (job.industry && job.industry.toLowerCase().includes(s));
        if (!matchesSearch) return false;
      }

      // 3. Category selector filter
      if (categoryFilter !== 'All Categories') {
        if (String(job.category).toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }

      // 4. Location selector filter
      if (locationFilter !== 'All Locations') {
        if (!job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === 'Oldest First') {
        return new Date(a.postedDate) - new Date(b.postedDate);
      }
      if (sort === 'Salary: High to Low') {
        return (b.salary?.max || 0) - (a.salary?.max || 0);
      }
      return new Date(b.updatedAt || b.postedDate || 0) - new Date(a.updatedAt || a.postedDate || 0);
    });
  };

  const filteredJobs = getFilteredJobs();

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>Latest Job Postings</h2>
          <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>Showing {filteredJobs.length} active notifications</span>
        </div>
      </div>

      {/* Filter Systems Controls */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', 
        marginBottom: '20px', backgroundColor: '#F9FAFB', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E5E7EB'
      }}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500', outline: 'none', color: '#374151' }}>
          <option value="All Categories">All Categories</option>
          <option value="Jharkhand">Jharkhand State Job</option>
          <option value="Railway">Railway Job</option>
          <option value="SSC">SSC Job</option>
          <option value="Defence">Defence Job</option>
          <option value="Bank">Banking Job</option>
          <option value="Private">Private Job</option>
          <option value="Other">Other Job</option>
        </select>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500', outline: 'none', color: '#374151' }}>
          <option value="All Locations">All Locations</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Jamshedpur">Jamshedpur</option>
          <option value="Jharkhand">Jharkhand State</option>
          <option value="All India">All India</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500', outline: 'none', color: '#374151' }}>
          <option value="Latest First">Latest First</option>
          <option value="Oldest First">Oldest First</option>
          <option value="Salary: High to Low">Salary High to Low</option>
        </select>
        <div style={{ display: 'flex', gap: '8px', flex: '1 1 200px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              placeholder="Search title, board, qualification..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: '13px', border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: 'white', outline: 'none', color: '#111827' }}
            />
          </div>
          <button style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={16} style={{ color: '#4B5563' }} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
        {[
          { val: 'All', label: 'All Jobs' },
          { val: 'Jharkhand', label: 'Jharkhand State Job' },
          { val: 'Railway', label: 'Railway Job' },
          { val: 'SSC', label: 'SSC Job' },
          { val: 'Defence', label: 'Defence Job' },
          { val: 'Bank', label: 'Banking Job' },
          { val: 'Private', label: 'Private Job' },
          { val: 'Other', label: 'Other Job' }
        ].map(t => (
          <button 
            key={t.val}
            onClick={() => setSelectedTab(t.val)}
            style={{
              padding: '6px 14px', fontSize: '13px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer', border: 'none',
              backgroundColor: selectedTab === t.val ? '#15803D' : '#F3F4F6',
              color: selectedTab === t.val ? '#FFFFFF' : '#4B5563',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Structured Job Posts Table matching User Format */}
      <div style={{ overflowX: 'auto', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F3F4F6', color: '#111827', fontWeight: '700', fontSize: '13px' }}>
              <th style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', width: '110px' }}>Posted On</th>
              <th style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', width: '130px' }}>Recruitment Board</th>
              <th style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB' }}>Exam / Post Name</th>
              <th style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', width: '100px', textAlign: 'center' }}>Vacancies</th>
              <th style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', width: '160px' }}>Qualification</th>
              <th style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', width: '110px', textAlign: 'center' }}>Last Date</th>
              <th style={{ padding: '12px 14px', borderBottom: '1px solid #E5E7EB', width: '120px', textAlign: 'center' }}>View Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#6B7280', fontWeight: '500' }}>Loading job notifications...</td>
              </tr>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((j) => (
                <tr key={j._id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
                  {/* Posted On */}
                  <td style={{ padding: '12px 14px', borderRight: '1px solid #E5E7EB', color: '#111827', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                    {formatDateDDMMYYYY(j.postedDate || j.createdAt)}
                  </td>
                  
                  {/* Recruitment Board */}
                  <td style={{ padding: '12px 14px', borderRight: '1px solid #E5E7EB', color: '#111827', fontWeight: '600', verticalAlign: 'middle' }}>
                    {getRecruitmentBoard(j)}
                  </td>

                  {/* Exam / Post Name */}
                  <td style={{ padding: '12px 14px', borderRight: '1px solid #E5E7EB', color: '#111827', fontWeight: '500', lineHeight: '1.4', verticalAlign: 'middle' }}>
                    <span 
                      onClick={() => navigate(`/jobs/${j._id}`)}
                      style={{ cursor: 'pointer', color: '#111827', textDecoration: 'none' }}
                      title={j.title}
                    >
                      {j.title}
                    </span>
                  </td>

                  {/* Vacancies */}
                  <td style={{ padding: '12px 14px', borderRight: '1px solid #E5E7EB', color: '#111827', textAlign: 'center', fontWeight: '500', verticalAlign: 'middle' }}>
                    {formatVacancies(j.vacancies)}
                  </td>

                  {/* Qualification */}
                  <td style={{ padding: '12px 14px', borderRight: '1px solid #E5E7EB', color: '#111827', verticalAlign: 'middle' }}>
                    {j.qualification || '12th Pass, Graduation'}
                  </td>

                  {/* Last Date */}
                  <td style={{ padding: '12px 14px', borderRight: '1px solid #E5E7EB', color: '#111827', textAlign: 'center', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                    {formatDateDDMMYYYY(j.lastDate)}
                  </td>

                  {/* View Details Action Button */}
                  <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <button 
                      onClick={() => navigate(`/jobs/${j._id}`)}
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#15803D', 
                        color: '#FFFFFF', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#6B7280', fontWeight: '500' }}>No active job listings found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '12px' }}>
        <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>Showing 1 to {filteredJobs.length} of {filteredJobs.length} results</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', backgroundColor: '#15803D', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>1</button>
          <button style={{ width: '32px', height: '32px', border: '1px solid #D1D5DB', borderRadius: '4px', backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>&gt;</button>
        </div>
      </div>

    </div>
  );
};

export default Jobs;
