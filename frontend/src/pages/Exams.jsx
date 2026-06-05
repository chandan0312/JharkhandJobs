import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, Calendar, FileText, Award, CheckCircle, 
  ArrowUpRight, ChevronRight, Bell, ChevronLeft, Download, AlertCircle, Info, AlertTriangle
} from 'lucide-react';

const Exams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // State Management
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Results Subview Filters
  const [selectedOrg, setSelectedOrg] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  
  // Toast Alert State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Sync category and search query parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const catParam = searchParams.get('category') || 'All';
    const searchParam = searchParams.get('search') || '';
    setSelectedCategory(catParam);
    setSearch(searchParam);
    setCurrentPage(1);
    fetchExams(searchParam);
  }, [location.search]);

  // Fetch all exams from API, search criteria applied on backend if search string present
  const fetchExams = async (queryStr) => {
    setLoading(true);
    try {
      const response = await api.get('/exams' + (queryStr ? `?search=${encodeURIComponent(queryStr)}` : ''));
      if (response.data.success) {
        setExams(response.data.exams || []);
      }
    } catch (error) {
      console.error('Error fetching exams:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination page on filter updates
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedOrg, selectedYear]);

  // Page switcher pagination handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Form submit search handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/exams?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(search)}`);
  };

  // Tab navigation selection handler
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    navigate(`/exams?category=${encodeURIComponent(cat)}` + (search ? `&search=${encodeURIComponent(search)}` : ''));
  };

  // Toast notification activator
  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Format date helper
  const formatUpdateDate = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return String(dateVal);
    }
  };

  // Dynamic count aggregation
  const countUpcoming = exams.filter(e => e.category === 'Upcoming Exams').length;
  const countAdmitCards = exams.filter(e => e.category === 'Admit Card').length;
  const countResults = exams.filter(e => e.category === 'Results').length;
  const countAnswerKeys = exams.filter(e => e.category === 'Answer Key').length;

  // Filter items locally based on subview settings
  const getFilteredExams = () => {
    return exams.filter(e => {
      // 1. Category check
      if (selectedCategory !== 'All' && e.category !== selectedCategory) {
        return false;
      }
      
      // 2. Organization check (for Results subview filters)
      if (selectedCategory === 'Results' && selectedOrg !== 'All' && e.orgShort !== selectedOrg) {
        return false;
      }

      // 3. Year check (for Results subview filters)
      if (selectedCategory === 'Results' && selectedYear !== 'All') {
        if (!e.lastDate) return false;
        const match = e.lastDate.match(/\d{4}/);
        const year = match ? match[0] : '';
        if (year !== selectedYear) return false;
      }

      return true;
    });
  };

  const filteredList = getFilteredExams();

  // Dynamic dropdown filters content for Results tab
  const uniqueOrgs = ['All', ...new Set(exams.filter(e => e.category === 'Results').map(e => e.orgShort).filter(Boolean))];
  const uniqueYears = ['All', ...new Set(exams.filter(e => e.category === 'Results').map(e => {
    if (!e.lastDate) return null;
    const match = e.lastDate.match(/\d{4}/);
    return match ? match[0] : null;
  }).filter(Boolean))].sort((a, b) => b - a);

  // Pagination bounds logic
  const itemsPerPage = 5;
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedExams = filteredList.slice(startIndex, endIndex);

  return (
    <div className="exams-layout" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Toast Alert popup */}
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

      {/* CSS Rules */}
      <style>{`
        .exams-layout {
          font-family: 'Outfit', 'Inter', sans-serif;
          color: #0F172A;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 8px;
        }
        .stats-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01);
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -2px rgba(0,0,0,0.04);
          border-color: #CBD5E1;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        .updates-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
        }
        .side-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
        }
        .update-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          border-radius: 12px;
          transition: background-color 0.2s ease;
          cursor: pointer;
          border-bottom: 1px solid #F1F5F9;
        }
        .update-item:last-child {
          border-bottom: none;
        }
        .update-item:hover {
          background-color: #F8FAFC;
        }
        .table-container {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
        }
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .custom-table th {
          padding: 14px 16px;
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748B;
          border-bottom: 1px solid #E2E8F0;
          letter-spacing: 0.05em;
          background-color: #F8FAFC;
        }
        .custom-table td {
          padding: 16px;
          font-size: 13px;
          color: #334155;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }
        .custom-table tr:last-child td {
          border-bottom: none;
        }
        .custom-table tr:hover td {
          background-color: #F8FAFC;
        }
        .btn-view-details {
          padding: 8px 16px;
          border: 1.5px solid #1B8C0A;
          background: #FFFFFF;
          color: #1B8C0A;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-view-details:hover {
          background: #E8F5E3;
        }
        .btn-download {
          padding: 8px 16px;
          background: #1B8C0A;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-download:hover {
          background: #167a08;
        }
        .btn-coming-soon {
          padding: 8px 16px;
          background: #F1F5F9;
          color: #94A3B8;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: not-allowed;
          display: inline-flex;
          align-items: center;
        }
        .info-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #E8F5E3;
          border: 1px solid #C2E7B9;
          border-radius: 8px;
          color: #1B8C0A;
          font-size: 12.5px;
          font-weight: 600;
          margin-top: 20px;
        }
        .warning-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          border-radius: 8px;
          color: #EA580C;
          font-size: 12.5px;
          font-weight: 600;
          margin-top: 20px;
        }
        .filter-dropdown {
          padding: 8px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #4B5563;
          background-color: white;
          outline: none;
          cursor: pointer;
        }
        .filter-dropdown:focus {
          border-color: #1B8C0A;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ==================== TITLE HEADER BAR ==================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            {selectedCategory === 'All' ? 'Exam Alerts & Notices' : selectedCategory}
          </h2>
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
            {selectedCategory === 'All' && 'Official competitive exams releases across Jharkhand'}
            {selectedCategory === 'Upcoming Exams' && 'List of all upcoming competitive exams in Jharkhand'}
            {selectedCategory === 'Admit Card' && 'Download your admit cards for upcoming exams'}
            {selectedCategory === 'Results' && 'Check results of various competitive exams'}
            {selectedCategory === 'Answer Key' && 'Check and download answer keys'}
          </span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'white', maxWidth: '300px', width: '100%' }}>
          <input 
            type="text" 
            placeholder={
              selectedCategory === 'All' ? 'Search exam notices...' :
              selectedCategory === 'Upcoming Exams' ? 'Search exams...' :
              selectedCategory === 'Admit Card' ? 'Search admit cards...' :
              selectedCategory === 'Results' ? 'Search results...' : 'Search answer keys...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', padding: '8px 12px', fontSize: '12.5px', flex: 1 }}
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </div>

      {/* ==================== CATEGORY PILL TABS ==================== */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', width: '100%' }}>
        {['All', 'Upcoming Exams', 'Admit Card', 'Results', 'Answer Key'].map(t => (
          <button 
            key={t}
            onClick={() => handleCategorySelect(t)}
            style={{
              padding: '8px 16px', fontSize: '12.5px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer', border: 'none',
              backgroundColor: selectedCategory === t ? '#E8F5E3' : 'transparent',
              color: selectedCategory === t ? '#1B8C0A' : '#64748B',
              transition: 'all 0.2s ease'
            }}
          >
            {t === 'All' ? 'All' : t}
          </button>
        ))}
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center', color: '#94A3B8', fontSize: '14px', fontWeight: '500' }}>Loading notification details...</div>
      ) : (
        <>
          {/* ==================== VIEW 1: DASHBOARD VIEW (ALL TAB) ==================== */}
          {selectedCategory === 'All' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Stats Cards Row */}
              <div className="stats-grid">
                
                {/* 1. Upcoming Exams count card */}
                <div className="stats-card" onClick={() => handleCategorySelect('Upcoming Exams')}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{countUpcoming}</h3>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Upcoming Exams</span>
                  </div>
                </div>

                {/* 2. Admit Cards count card */}
                <div className="stats-card" onClick={() => handleCategorySelect('Admit Card')}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{countAdmitCards}</h3>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Admit Cards Out</span>
                  </div>
                </div>

                {/* 3. Results Declared count card */}
                <div className="stats-card" onClick={() => handleCategorySelect('Results')}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{countResults}</h3>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Results Declared</span>
                  </div>
                </div>

                {/* 4. Answer Keys count card */}
                <div className="stats-card" onClick={() => handleCategorySelect('Answer Key')}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFEDD5', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{countAnswerKeys}</h3>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Answer Keys Out</span>
                  </div>
                </div>

              </div>

              {/* Two Column Grid */}
              <div className="dashboard-grid">
                
                {/* Left side: Latest Updates */}
                <div className="updates-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Latest Updates</h3>
                    <span 
                      onClick={() => handleCategorySelect('Upcoming Exams')}
                      style={{ fontSize: '12px', fontWeight: '750', color: '#1B8C0A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                    >
                      View All
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {exams.length > 0 ? (
                      exams.slice(0, 5).map(e => {
                        // Resolve icons based on category
                        let icon = <Info size={16} />;
                        let color = '#3B82F6';
                        let bg = '#EFF6FF';
                        
                        if (e.category === 'Upcoming Exams') {
                          icon = <Calendar size={16} />;
                          color = '#1B8C0A';
                          bg = '#E8F5E3';
                        } else if (e.category === 'Admit Card') {
                          icon = <FileText size={16} />;
                          color = '#7C3AED';
                          bg = '#F3E8FF';
                        } else if (e.category === 'Results') {
                          icon = <Award size={16} />;
                          color = '#2563EB';
                          bg = '#EFF6FF';
                        } else if (e.category === 'Answer Key') {
                          icon = <CheckCircle size={16} />;
                          color = '#EA580C';
                          bg = '#FFEDD5';
                        }

                        return (
                          <div 
                            key={e._id} 
                            className="update-item"
                            onClick={() => navigate(`/exams/${e._id}`)}
                          >
                            <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                              <div style={{ 
                                width: '38px', height: '38px', borderRadius: '8px', 
                                backgroundColor: bg, color: color, display: 'flex', 
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                              }}>
                                {icon}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                                  {e.title}
                                </h4>
                                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: '1.5', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>
                                  {e.description || 'Check the details and notification for this update.'}
                                </p>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px', flexShrink: 0 }}>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>
                                {formatUpdateDate(e.updatedAt || e.createdAt)}
                              </span>
                              {e.isNew ? (
                                <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '9px', fontWeight: '750', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                  New
                                </span>
                              ) : (
                                <ChevronRight size={14} style={{ color: '#CBD5E1' }} />
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                        No alerts available.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Push notifications promo card */}
                <div className="side-card">
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '50%', 
                    backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <Bell size={28} className="animate-bounce" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '850', color: '#0F172A', margin: '0 0 8px 0' }}>Never Miss an Update!</h3>
                    <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: '1.6' }}>
                      Enable notifications to get instant alerts for exams, results, admit cards and more.
                    </p>
                  </div>
                  <button 
                    onClick={() => triggerToast(language === 'HI' ? 'पुश सूचनाएं सफलतापूर्वक सक्रिय हो गईं!' : 'Push notifications activated successfully!')}
                    style={{ 
                      width: '100%', padding: '12px', backgroundColor: '#1B8C0A', 
                      color: 'white', border: 'none', borderRadius: '8px', 
                      fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(27, 140, 10, 0.1)'
                    }}
                  >
                    Enable Notifications
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==================== VIEW 2: UPCOMING EXAMS TAB TABLE (SCREEN 2) ==================== */}
          {selectedCategory === 'Upcoming Exams' && (
            <div className="table-container animate-fade-in">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Exam Name</th>
                    <th>Conducting Body</th>
                    <th>Exam Date</th>
                    <th>Application Last Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExams.length > 0 ? (
                    paginatedExams.map(e => {
                      const isApplyNow = e.status && e.status.toLowerCase().includes('apply');
                      return (
                        <tr key={e._id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <strong style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>{e.title}</strong>
                              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>{e.description}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>{e.orgShort}</strong>
                              <span style={{ fontSize: '10px', color: '#64748B' }}>{e.organization}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: '600', color: '#334155' }}>{e.examDate || 'TBA'}</td>
                          <td style={{ fontWeight: '600', color: '#DC2626' }}>{e.lastDate || 'N/A'}</td>
                          <td>
                            <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '6px', 
                              color: isApplyNow ? '#16A34A' : '#2563EB', fontWeight: '750', fontSize: '12px' 
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isApplyNow ? '#16A34A' : '#2563EB' }} />
                              {e.status || 'Upcoming'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-view-details"
                              onClick={() => navigate(`/exams/${e._id}`)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No upcoming exams match this filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ==================== VIEW 3: ADMIT CARD TAB TABLE (SCREEN 4) ==================== */}
          {selectedCategory === 'Admit Card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="table-container animate-fade-in">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '42%' }}>Exam Name</th>
                      <th>Conducting Body</th>
                      <th>Exam Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedExams.length > 0 ? (
                      paginatedExams.map(e => {
                        const isAvailable = !!e.pdfUrl;
                        return (
                          <tr key={e._id}>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <strong style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>{e.title}</strong>
                                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>{e.description}</span>
                              </div>
                            </td>
                            <td>
                              <strong style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>{e.orgShort}</strong>
                            </td>
                            <td style={{ fontWeight: '600', color: '#334155' }}>{e.examDate || 'TBA'}</td>
                            <td>
                              <span style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                color: isAvailable ? '#16A34A' : '#EF4444', fontWeight: '750', fontSize: '12px' 
                              }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isAvailable ? '#16A34A' : '#EF4444' }} />
                                {isAvailable ? 'Available' : 'Not Released'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {isAvailable ? (
                                <a 
                                  href={e.pdfUrl.startsWith('http') ? e.pdfUrl : (api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost:5000') + e.pdfUrl}
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="btn-download"
                                  style={{ textDecoration: 'none' }}
                                >
                                  <Download size={13} />
                                  Download
                                </a>
                              ) : (
                                <button className="btn-coming-soon">
                                  Coming Soon
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No admit cards match this filter.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="info-banner">
                <Info size={16} />
                <span>Admit card will be available 7-10 days before the exam date.</span>
              </div>
            </div>
          )}

          {/* ==================== VIEW 4: RESULTS TAB TABLE (SCREEN 3) ==================== */}
          {selectedCategory === 'Results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Dropdown Filters Sub-Row */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                <select 
                  className="filter-dropdown"
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                >
                  <option value="All">All Exams</option>
                  {uniqueOrgs.filter(org => org !== 'All').map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
                
                <select 
                  className="filter-dropdown"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="All">All Years</option>
                  {uniqueYears.filter(y => y !== 'All').map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="table-container animate-fade-in">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '42%' }}>Exam Name</th>
                      <th>Conducting Body</th>
                      <th>Result Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedExams.length > 0 ? (
                      paginatedExams.map(e => (
                        <tr key={e._id}>
                          <td>
                            <strong style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>{e.title}</strong>
                          </td>
                          <td>
                            <strong style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>{e.orgShort}</strong>
                          </td>
                          <td style={{ fontWeight: '600', color: '#334155' }}>{e.lastDate || 'N/A'}</td>
                          <td>
                            <span style={{ 
                              fontSize: '11px', fontWeight: '700', color: '#059669', 
                              backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', 
                              padding: '4px 10px', borderRadius: '20px' 
                            }}>
                              Declared
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-view-details"
                              onClick={() => navigate(`/exams/${e._id}`)}
                            >
                              View Result
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No results match this filter selection.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== VIEW 5: ANSWER KEY TAB TABLE (SCREEN 5) ==================== */}
          {selectedCategory === 'Answer Key' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="table-container animate-fade-in">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '42%' }}>Exam Name</th>
                      <th>Conducting Body</th>
                      <th>Answer Key Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedExams.length > 0 ? (
                      paginatedExams.map(e => (
                        <tr key={e._id}>
                          <td>
                            <strong style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>{e.title}</strong>
                          </td>
                          <td>
                            <strong style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>{e.orgShort}</strong>
                          </td>
                          <td style={{ fontWeight: '600', color: '#334155' }}>{e.lastDate || 'N/A'}</td>
                          <td>
                            <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '6px', 
                              color: '#16A34A', fontWeight: '750', fontSize: '12px' 
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                              Available
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-view-details"
                              onClick={() => navigate(`/exams/${e._id}`)}
                            >
                              View / Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No answer keys match this filter selection.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="warning-banner">
                <AlertTriangle size={16} />
                <span>Raise objection within the given time period if you find any discrepancy in the answer key.</span>
              </div>
            </div>
          )}

          {/* ==================== GENERAL PAGINATION BAR (EXCEPT ALL TAB) ==================== */}
          {selectedCategory !== 'All' && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '500' }}>
                Showing {startIndex + 1} to {endIndex} of {totalItems} {selectedCategory === 'Upcoming Exams' ? 'exams' : selectedCategory === 'Admit Card' ? 'admit cards' : selectedCategory === 'Results' ? 'results' : 'answer keys'}
              </span>
              
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {/* Prev button */}
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0',
                    backgroundColor: 'white', color: activePage === 1 ? '#CBD5E1' : '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: activePage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '6px', border: 'none',
                      backgroundColor: activePage === p ? '#1B8C0A' : 'transparent',
                      color: activePage === p ? 'white' : '#64748B',
                      fontSize: '12.5px', fontWeight: '700', cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {p}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0',
                    backgroundColor: 'white', color: activePage === totalPages ? '#CBD5E1' : '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: activePage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Exams;
