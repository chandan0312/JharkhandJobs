import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Search, Calendar, ChevronRight, BookOpen, Shield, HelpCircle, Award, CreditCard, Clock, FileText, Bookmark } from 'lucide-react';

const Exams = () => {
  const { t } = useLanguage();
  const location = useLocation();

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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExams(selectedCategory, search);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    fetchExams(cat, search);
  };

  const categories = [
    { name: 'JSSC Exams', icon: Shield, color: '#1B8C0A' },
    { name: 'JPSC Exams', icon: Award, color: '#2563EB' },
    { name: 'Jharkhand Police', icon: Shield, color: '#1E3A8A' },
    { name: 'Teaching Exams', icon: BookOpen, color: '#7C3AED' },
    { name: 'Banking Exams', icon: CreditCard, color: '#EA580C' },
    { name: 'Railway Exams', icon: HelpCircle, color: '#EF4444' },
    { name: 'CTET / TET', icon: FileText, color: '#0D9488' },
    { name: 'Other Exams', icon: Clock, color: '#4B5563' }
  ];

  return (
    <div className="page-content animate-fade-in">
      {/* Hero Section */}
      <header 
        style={{
          position: 'relative',
          padding: '160px 0 120px',
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.35)), url(/assets/images/hero-exams.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '44px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              {t('exams.title')}
            </h1>
            <p className="animate-slide-up delay-1" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
              {t('exams.subtitle')}
            </p>
            <p className="animate-slide-up delay-2" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>
              {t('exams.desc')}
            </p>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '40px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in">
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1B8C0A', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('exams.portal')}</span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1A1A2E', marginTop: '6px', marginBottom: '12px' }}>
            {t('exams.taiyariHeader')}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px' }}>
            {t('exams.taiyariDesc')}
          </p>

          {/* Exam Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px' }}>
              <Search size={18} style={{ color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder={t('exams.searchPlaceholder')}
                value={search}
                onChange={handleSearchChange}
                style={{ border: 'none', outline: 'none', padding: '12px', width: '100%', fontSize: '14px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 24px' }}>
              {t('exams.searchBtn')}
            </button>
          </form>
        </div>

        {/* Categories Grid (8 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '56px' }}>
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div 
                key={index} 
                onClick={() => fetchExams('All', cat.name)}
                className="card card-sm animate-scale-in" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'white' }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E', marginBottom: '2px' }}>{cat.name}</h3>
                  <span style={{ fontSize: '11px', color: '#1B8C0A', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                    {t('exams.viewExams')} <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout Below */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '60px' }}>
          
          {/* Left Column: Exam Updates List */}
          <main style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>
                {t('exams.latestUpdates')} ({selectedCategory})
              </h2>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All', 'Admit Card', 'Results', 'Answer Key', 'Syllabus'].map((catOpt) => (
                  <button 
                    key={catOpt} 
                    onClick={() => handleCategorySelect(catOpt)}
                    className="btn btn-sm" 
                    style={{
                      fontSize: '11px', 
                      padding: '4px 10px', 
                      border: selectedCategory === catOpt ? 'none' : '1px solid #D1D5DB',
                      backgroundColor: selectedCategory === catOpt ? '#1B8C0A' : 'transparent',
                      color: selectedCategory === catOpt ? 'white' : '#4B5563'
                    }}
                  >
                    {catOpt}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', flexDirection: 'column' }}>
                <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '14px' }}>{t('exams.syncing')}</p>
              </div>
            ) : exams.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {exams.map((exam) => (
                  <Link 
                    key={exam._id} 
                    to={`/exams/${exam._id}`}
                    className="card card-sm" 
                    style={{ 
                      backgroundColor: 'white',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{
                          fontSize: '10px', 
                          fontWeight: '700', 
                          backgroundColor: exam.category === 'Results' ? '#FEF2F2' : exam.category === 'Admit Card' ? '#EFF6FF' : '#F0FDF4',
                          color: exam.category === 'Results' ? '#DC2626' : exam.category === 'Admit Card' ? '#2563EB' : '#1B8C0A',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginBottom: '6px'
                        }}>
                          {exam.category}
                        </span>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>{exam.title}</h3>
                        <p style={{ fontSize: '12px', color: '#6B7280' }}>{exam.description}</p>
                      </div>
                      
                      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <span className="badge badge-primary" style={{ backgroundColor: '#E8F5E3', color: '#1B8C0A', textTransform: 'uppercase' }}>
                          {exam.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card text-center" style={{ padding: '40px', color: '#6B7280' }}>
                <p>{t('exams.noAnnouncements')}</p>
              </div>
            )}
          </main>

          {/* Right Column: Quick Links Sidebar */}
          <aside className="card" style={{ flex: '1 1 250px', maxWidth: '320px', padding: '24px', backgroundColor: 'white' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
              {t('exams.resources')}
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li>
                <button onClick={() => handleCategorySelect('Admit Card')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Bookmark size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('exams.admitCardRelease')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategorySelect('Results')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <FileText size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('exams.resultsDecl')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategorySelect('Answer Key')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Calendar size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('exams.answerKeys')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategorySelect('Syllabus')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <BookOpen size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('exams.downloadSyllabus')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategorySelect('Exam Calendar')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Calendar size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('exams.annualCalendar')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleCategorySelect('Previous Papers')} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <FileText size={16} style={{ color: '#1B8C0A' }} />
                  <span>{t('exams.prevPapers')}</span>
                </button>
              </li>
            </ul>
          </aside>

        </div>

      </div>
    </div>
  );
};

export default Exams;
