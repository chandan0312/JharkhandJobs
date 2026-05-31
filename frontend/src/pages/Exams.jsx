import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Calendar, FileText, Award, CheckCircle } from 'lucide-react';

const Exams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Parse URL query parameter for preset category filters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const catParam = searchParams.get('category') || 'All';
    setSelectedCategory(catParam);
    fetchExams(catParam, search);
  }, [location.search]);

  const fetchExams = async (cat, queryStr) => {
    setLoading(true);
    try {
      let queryParams = [];
      if (cat && cat !== 'All') queryParams.push(`category=${encodeURIComponent(cat)}`);
      if (queryStr) queryParams.push(`search=${encodeURIComponent(queryStr)}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await api.get(`/exams${queryString}`);
      if (response.data.success) {
        setExams(response.data.exams);
      }
    } catch (error) {
      console.error('Error fetching exams:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExams(selectedCategory, search);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    navigate(`/exams?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Exam Alerts & Notices</h2>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Official competitive exams releases across Jharkhand</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'white', maxWidth: '300px', width: '100%' }}>
          <input 
            type="text" 
            placeholder="Search exam notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', padding: '8px 12px', fontSize: '12px', flex: 1 }}
          />
          <button type="submit" style={{ padding: '8px 14px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Search</button>
        </form>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
        {['All', 'Upcoming Exams', 'Admit Card', 'Results', 'Answer Key'].map(t => (
          <button 
            key={t}
            onClick={() => handleCategorySelect(t)}
            style={{
              padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer', border: 'none',
              backgroundColor: selectedCategory === t ? '#E8F5E3' : 'transparent',
              color: selectedCategory === t ? '#1B8C0A' : '#64748B'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading alerts...</div>
      ) : exams.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {exams.map(e => (
            <div key={e._id} style={{
              border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', backgroundColor: 'white',
              display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
            }}>
              {e.isNew && (
                <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#EF4444', color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>New</span>
              )}
              
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#1B8C0A', backgroundColor: '#E8F5E3', padding: '2px 8px', borderRadius: '4px', width: 'fit-content' }}>
                {e.orgShort} — {e.category}
              </span>
              
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', lineHeight: '1.4' }}>{e.title}</h3>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', flex: 1 }}>{e.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginTop: '4px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>Last Date</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444' }}>{e.lastDate || 'N/A'}</span>
                </div>
                <button 
                  onClick={() => alert(`Redirecting to portal for ${e.title}`)}
                  style={{ padding: '6px 14px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {e.status}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No active exam notices match your filter selections.</div>
      )}

    </div>
  );
};

export default Exams;
