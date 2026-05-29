import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Building, Briefcase, Star, Search } from 'lucide-react';

const Companies = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Fetch featured list
        const resAll = await api.get('/companies');
        if (resAll.data.success) {
          setCompanies(resAll.data.companies.filter(c => !c.recentlyAdded));
          setRecentCompanies(resAll.data.companies.filter(c => c.recentlyAdded));
        }
      } catch (err) {
        console.error('Error fetching companies:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleTabSelect = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    try {
      const query = tab === 'All' ? '' : `?industry=${encodeURIComponent(tab)}`;
      const res = await api.get(`/companies${query}`);
      if (res.data.success) {
        setCompanies(res.data.companies.filter(c => !c.recentlyAdded));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const query = search ? `/companies?industry=${encodeURIComponent(search)}` : '/companies';
      const res = await api.get(query);
      if (res.data.success) {
        setCompanies(res.data.companies.filter(c => !c.recentlyAdded && c.name.toLowerCase().includes(search.toLowerCase())));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (companyName) => {
    navigate(`/jobs?search=${encodeURIComponent(companyName)}`);
  };

  const tabs = ['All', 'IT', 'Manufacturing', 'Healthcare', 'Consulting', 'Infrastructure'];

  return (
    <div className="page-content animate-fade-in">
      {/* Hero Section */}
      <header 
        style={{
          position: 'relative',
          padding: '160px 0 120px',
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.35)), url(/assets/images/hero-companies.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '44px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              {t('companies.title')}
            </h1>
            <p className="animate-slide-up delay-1" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>
              {t('companies.desc')}
            </p>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '40px' }}>
        
        {/* Header Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in">
          <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            {t('companies.subDesc')}
          </p>

          {/* Quick industry search */}
          <form onSubmit={handleCompanySearch} style={{ display: 'flex', maxWidth: '400px', margin: '24px auto 0', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px' }}>
              <Search size={16} style={{ color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder={t('companies.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', padding: '10px', width: '100%', fontSize: '13px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 16px' }}>
              {t('companies.searchBtn')}
            </button>
          </form>
        </div>

        {/* Filter Industry Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }} className="animate-slide-up">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabSelect(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                borderRadius: '20px',
                fontSize: '13px',
                padding: '6px 16px',
                backgroundColor: activeTab === tab ? '#1B8C0A' : 'white',
                color: activeTab === tab ? 'white' : '#4B5563',
                border: activeTab === tab ? 'none' : '1.5px solid #D1D5DB'
              }}
            >
              {tab === 'All' ? t('companies.allIndustries') : tab}
            </button>
          ))}
        </div>

        {/* Main Grid: Featured Companies (10 Grid layout) */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0', flexDirection: 'column' }}>
            <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>{t('companies.loadingHirers')}</p>
          </div>
        ) : companies.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '64px' }} className="animate-scale-in">
            {companies.map((comp) => (
              <div 
                key={comp._id} 
                onClick={() => handleCompanyClick(comp.name)}
                className="card text-center" 
                style={{ cursor: 'pointer', padding: '28px 16px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '180px' }}
              >
                
                {/* CSS Brand Custom Logo Avatar */}
                <div style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: comp.companyColor || '#1B8C0A',
                  marginBottom: '16px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  border: `2px dashed ${comp.companyColor || '#1B8C0A'}40`,
                  padding: '6px 14px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {comp.name === 'Deloitte' ? (
                    <span>Deloitte<span style={{ color: '#86EFAC' }}>.</span></span>
                  ) : comp.name === 'Birlasoft' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Birlasoft <Star size={14} fill={comp.companyColor} />
                    </span>
                  ) : (
                    <span>{comp.name}</span>
                  )}
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>{comp.name}</h3>
                <span className="badge badge-primary" style={{ backgroundColor: '#E8F5E3', color: '#1B8C0A', fontSize: '11px', marginTop: '6px' }}>
                  {comp.jobCount} {t('companies.jobsOpen')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px 0' }}>{t('companies.noCompanies')}</p>
        )}

        {/* Recently Added Section */}
        {recentCompanies.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <div style={{ borderBottom: '2px solid #E5E7EB', paddingBottom: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A2E' }}>{t('companies.recentCompanies')}</h2>
              <span style={{ fontSize: '12px', color: '#1B8C0A', fontWeight: '600' }}>{t('companies.activeUpdates')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {recentCompanies.map((comp) => (
                <div 
                  key={comp._id} 
                  onClick={() => handleCompanyClick(comp.name)}
                  className="card card-sm text-center" 
                  style={{ cursor: 'pointer', padding: '20px 16px', backgroundColor: 'white', hover: { transform: 'translateY(-2px)' } }}
                >
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: comp.companyColor || '#6B7280',
                    marginBottom: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {comp.name}
                  </div>
                  <span style={{ fontSize: '12px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={12} /> {comp.jobCount} {t('companies.vacancies')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Companies;
