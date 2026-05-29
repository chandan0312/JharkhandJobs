import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  Calendar, 
  Globe, 
  Share2, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Check, 
  Copy,
  BookOpen,
  Award,
  Shield,
  FileText
} from 'lucide-react';

const ExamDetails = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Custom Toast Popup States
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Fetch exam details by ID
  useEffect(() => {
    const fetchExamDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/exams/${id}`);
        if (response.data.success) {
          setExam(response.data.exam);
        } else {
          setError(language === 'HI' ? 'परीक्षा विवरण प्राप्त नहीं किया जा सका।' : 'Exam details could not be retrieved.');
        }
      } catch (err) {
        console.error(err);
        setError(language === 'HI' ? 'सरकारी अधिसूचना नहीं मिली या विवरण लोड करने में विफल।' : 'Government notification not found or failed to load details.');
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [id]);

  // Clipboard Copier for Sharing Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage(language === 'HI' ? 'अधिसूचना लिंक सफलतापूर्वक क्लिपबोर्ड पर कॉपी हो गया!' : 'Notification link copied to clipboard successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Toggle Save Alert
  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setToastMessage(nextSaved ? (language === 'HI' ? 'अलर्ट बुकमार्क में सहेज लिया गया!' : 'Alert saved to bookmarks!') : (language === 'HI' ? 'बुकमार्क से अलर्ट हटा दिया गया।' : 'Alert removed from bookmarks.'));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Format dynamic post age
  const getDaysAgo = (dateString) => {
    if (!dateString) return language === 'HI' ? 'हाल ही में' : 'recently';
    const today = new Date();
    const posted = new Date(dateString);
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (language === 'HI') {
      if (diffDays <= 1) return 'आज';
      if (diffDays === 2) return '1 दिन पहले';
      return `${diffDays - 1} दिन पहले`;
    } else {
      if (diffDays <= 1) return 'today';
      if (diffDays === 2) return '1 day ago';
      return `${diffDays - 1} days ago`;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }} className="page-content">
        <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>{t('examDetails.connectingPublic')}</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="container page-content text-center" style={{ padding: '80px 0' }}>
        <AlertCircle size={40} style={{ color: '#DC2626', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A1A2E' }}>{t('examDetails.failedLoad')}</h2>
        <p style={{ color: '#6B7280', margin: '8px 0 24px' }}>{error || (language === 'HI' ? 'वह सरकारी अलर्ट मौजूद नहीं है जिसे आप ढूंढ रहे हैं।' : 'The government alert you are looking for does not exist.')}</p>
        <Link to="/govt-jobs" className="btn btn-primary">{t('examDetails.backGovt')}</Link>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in" style={{ backgroundColor: '#F8F9FA', paddingBottom: '80px', minHeight: '100vh' }}>
      
      {/* Toast popup */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          backgroundColor: '#1E293B',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
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

      <div className="container">
        
        {/* Breadcrumb matches mockup look */}
        <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', padding: '24px 0 16px' }}>
          <Link to="/" style={{ color: '#9CA3AF' }}>{t('jobs.breadcrumbHome')}</Link>
          <span style={{ color: '#D1D5DB' }}>&gt;</span>
          <Link to="/govt-jobs" style={{ color: '#9CA3AF' }}>{t('govtJobs.title')}</Link>
          <span style={{ color: '#D1D5DB' }}>&gt;</span>
          <span style={{ color: '#374151', fontWeight: '500' }}>{t('examDetails.breadcrumbDetails')}</span>
        </div>

        {/* 1. Government Job Header Card - High fidelity similar to mockup */}
        <div className="card" style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #E5E7EB', 
          padding: '32px', 
          marginBottom: '30px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            {/* Issuing organization initials circle bubble */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#1B8C0A', // Dark green for standard government body
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '28px',
              boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              {exam.orgShort || 'JS'}
            </div>

            {/* Info details column */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h1 style={{ 
                fontSize: '26px', 
                fontWeight: '800', 
                color: '#111827', 
                marginBottom: '6px',
                letterSpacing: '-0.02em',
                lineHeight: '1.2'
              }}>
                {exam.title}
              </h1>
              
              <p style={{ 
                fontSize: '16px', 
                color: '#4B5563', 
                fontWeight: '600', 
                marginBottom: '16px' 
              }}>
                {exam.organization}
              </p>
              
              {/* Metadata Sub-Row */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Location */}
                <span style={{ fontSize: '13px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: '#9CA3AF' }} /> 
                  <span style={{ fontWeight: '500' }}>{language === 'HI' ? 'झारखंड, भारत' : 'Jharkhand, India'}</span>
                </span>
                
                {/* Published Date */}
                <span style={{ fontSize: '13px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} style={{ color: '#9CA3AF' }} /> 
                  <span>{t('examDetails.published')} {getDaysAgo(exam.createdAt)}</span>
                </span>

                {/* Posts badge */}
                {exam.posts && (
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#1B8C0A', 
                    backgroundColor: '#E8F5E3',
                    border: '1px solid #C2E7B9',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Briefcase size={13} />
                    {exam.posts}
                  </span>
                )}
                
                {/* Status indicator */}
                <span style={{ 
                  fontSize: '12px', 
                  color: exam.category === 'Results' ? '#DC2626' : '#2563EB', 
                  backgroundColor: exam.category === 'Results' ? '#FEF2F2' : '#EFF6FF',
                  border: exam.category === 'Results' ? '1px solid #FCA5A5' : '1px solid #BFDBFE',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontWeight: '600'
                }}>
                  {exam.category}
                </span>

                {/* Red Last date alert */}
                {exam.lastDate && exam.lastDate !== 'N/A' && (
                  <span style={{ 
                    fontSize: '13px', 
                    color: '#DC2626', 
                    fontWeight: '700',
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    <Calendar size={14} />
                    {t('govtJobs.lastDate')}: {exam.lastDate}
                  </span>
                )}
              </div>

              {/* CTAs matching mockup look */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <a 
                  href="https://jssc.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="btn" 
                  style={{ 
                    padding: '12px 32px', 
                    fontSize: '15px',
                    fontWeight: '700',
                    backgroundColor: '#1B8C0A',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(27, 140, 10, 0.15)',
                    textDecoration: 'none'
                  }}
                >
                  {t('examDetails.applyOnline')}
                </a>
                <button 
                  onClick={handleToggleSave}
                  className="btn" 
                  style={{ 
                    padding: '12px 28px', 
                    fontSize: '15px',
                    fontWeight: '600',
                    backgroundColor: 'white',
                    color: isSaved ? '#1B8C0A' : '#374151',
                    border: isSaved ? '1.5px solid #1B8C0A' : '1.5px solid #D1D5DB',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {isSaved ? <Check size={16} /> : null}
                  {isSaved ? t('examDetails.bookmarked') : t('examDetails.saveNotif')}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* 2. Main Two Column Layout */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column: Information Tabs */}
          <main style={{ flex: '1 1 600px', minWidth: '320px' }}>
            
            {/* Interactive Tab row - Prominent green bottom indicator */}
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid #E5E7EB', 
              marginBottom: '20px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              {[
                { id: 'overview', label: t('examDetails.tabOverview') },
                { id: 'organization', label: t('examDetails.tabOrg') },
                { id: 'eligibility', label: t('examDetails.tabEligibility') },
                { id: 'syllabus', label: t('examDetails.tabSyllabus') }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    color: activeTab === tab.id ? '#1B8C0A' : '#6B7280',
                    borderBottom: activeTab === tab.id ? '3px solid #1B8C0A' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '-1px'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content card */}
            <div className="card" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '36px', border: '1px solid #E5E7EB' }}>
              
              {/* Tab: Exam Overview */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <p style={{ 
                    color: '#4B5563', 
                    lineHeight: '1.8', 
                    marginBottom: '28px', 
                    fontSize: '15px',
                    whiteSpace: 'pre-line' 
                  }}>
                    {exam.description || 'Important public recruitment notification from the state government board. Applications are invited under the combined executive civil or subordinate services branches of Jharkhand state.'}
                  </p>
                  
                  <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '28px' }}>
                    <h3 style={{ 
                       fontSize: '18px', 
                       fontWeight: '800', 
                       color: '#111827', 
                       marginBottom: '20px'
                    }}>
                      {t('examDetails.guidelines')}
                    </h3>
                    <ul style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '14px', 
                      paddingLeft: '20px', 
                      listStyleType: 'disc' 
                    }}>
                      {language === 'HI' ? (
                        <>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>ऑनलाइन फॉर्म भरने से पहले आधिकारिक पीडीएफ अधिसूचना विज्ञापन को ध्यान से पढ़ें।</li>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>सुनिश्चित करें कि आपके पास झारखंड के वैध अधिवास स्थिति प्रमाण पत्र और स्थानीय भाषा दक्षता है।</li>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>फॉर्म अस्वीकृति को रोकने के लिए निर्दिष्ट कैलेंडर समय सीमा से पहले सभी पंजीकरण शुल्क और विवरण जमा करें।</li>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>प्रवेश पत्र या पाठ्यक्रम संशोधन के बारे में अपडेट के लिए नियमित रूप से गतिशील पोर्टल विवरण देखें।</li>
                        </>
                      ) : (
                        <>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>Read the official PDF notification advertisement carefully before filing the online form.</li>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>Ensure you possess valid domicile status certificates and local language proficiencies of Jharkhand.</li>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>Submit all registration fees and details before the specified calendar deadline to prevent forms rejection.</li>
                          <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>Check dynamic portal details regularly for updates regarding admit cards or syllabus revisions.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab: About Organization */}
              {activeTab === 'about' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>
                    {language === 'HI' ? `${exam.organization} के बारे में` : `About ${exam.organization}`}
                  </h3>
                  <p style={{ color: '#4B5563', lineHeight: '1.8', fontSize: '15px' }}>
                    {language === 'HI' ? (
                      <>
                        <strong>{exam.organization} ({exam.orgShort})</strong> झारखंड सरकार द्वारा स्थापित प्रमुख वैधानिक आयोग है। यह प्रशासनिक, नगरपालिका, पुलिस, तकनीकी और अधीनस्थ सेवा पदों के लिए योग्य कर्मियों की भर्ती के लिए मानक प्रतियोगी परीक्षाओं, साक्षात्कारों और चयन प्रक्रियाओं को आयोजित करता है।
                      </>
                    ) : (
                      <>
                        The <strong>{exam.organization} ({exam.orgShort})</strong> is the premier statutory commission established by the Government of Jharkhand. It carries out standard competitive examinations, interviews, and selection processes to recruit qualified personnel for administrative, municipal, police, technical, and subordinate services posts.
                      </>
                    )}
                  </p>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginTop: '16px', 
                    backgroundColor: '#F9FAFB', 
                    padding: '24px', 
                    borderRadius: '8px',
                    border: '1px solid #F3F4F6'
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>{t('examDetails.recruitmentBody')}</span>
                      <strong style={{ fontSize: '15px', color: '#374151' }}>{exam.organization}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>{t('examDetails.stateAuthority')}</span>
                      <strong style={{ fontSize: '15px', color: '#374151' }}>{language === 'HI' ? 'झारखंड राज्य सरकार' : 'Jharkhand State Govt'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Eligibility & Vacancies */}
              {activeTab === 'eligibility' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>
                    {t('examDetails.eligibilityVacancies')}
                  </h3>
                  <p style={{ color: '#4B5563', fontSize: '14.5px', marginBottom: '24px' }}>
                    {language === 'HI' ? 'आवंटित रिक्तियां:' : 'Vacancies allocated:'} <strong style={{ color: '#1B8C0A' }}>{exam.posts || (language === 'HI' ? 'अनेक रिक्त पद' : 'Multiple Vacant Posts')}</strong>
                  </p>

                  <ul style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '14px', 
                    paddingLeft: '20px', 
                    listStyleType: 'disc' 
                  }}>
                    {language === 'HI' ? (
                      <>
                        <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                          <strong>अधिवास आवश्यकताएं:</strong> आरक्षण लाभ प्राप्त करने के लिए उम्मीदवारों को झारखंड राज्य का स्थायी निवासी या निवासी होना चाहिए।
                        </li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                          <strong>शैक्षणिक योग्यता:</strong> किसी यूजीसी-मान्यता प्राप्त विश्वविद्यालय से न्यूनतम स्नातक डिग्री या समकक्ष स्नातक प्रमाणपत्र। तकनीकी धाराओं के लिए संबंधित डिप्लोमा की आवश्यकता हो सकती है।
                        </li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                          <strong>आयु मानदंड:</strong> न्यूनतम आयु सीमा 21 वर्ष और अधिकतम सीमा 35 वर्ष है (ओबीसी, एससी, एसटी और महिला श्रेणियों के लिए 3-5 वर्ष तक की छूट लागू है)।
                        </li>
                      </>
                    ) : (
                      <>
                        <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                          <strong>Domicile Requirements:</strong> Candidates must be permanent residents or residents of Jharkhand state to avail reservation benefits.
                        </li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                          <strong>Educational Qualification:</strong> Minimum of a Bachelor's degree or equivalent graduation certificate from a UGC-recognized university. Technical streams may require respective diplomas.
                        </li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                          <strong>Age Criteria:</strong> Minimum age limit is 21 years and maximum limit is 35 years (relaxation up to 3-5 years applies for OBC, SC, ST, and Female categories).
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {/* Tab: Syllabus & Details */}
              {activeTab === 'syllabus' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '20px' }}>
                    {t('examDetails.schemeSyllabus')}
                  </h3>
                  
                  {language === 'HI' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>पेपर 1: भाषा योग्यता</h4>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                          इसमें हिंदी और अंग्रेजी के प्रश्न शामिल हैं जो समझ, व्याकरण और व्याकरण संरचनाओं का परीक्षण करते हैं। योग्यता अंक: 30%।
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>पेपर 2: स्थानीय और क्षेत्रीय भाषा</h4>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                          स्थानीय रूप से मान्यता प्राप्त भाषाओं (जैसे खोरठा, संथाली, कुड़ुख, मुंडारी, उर्दू) में दक्षता का परीक्षण करने वाले बहुविकल्पीय प्रश्न। स्कोर को अंतिम योग्यता सूची में जोड़ा जाएगा।
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>पेपर 3: सामान्य अध्ययन और झारखंड जीके</h4>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                          इसमें सामान्य विज्ञान, गणित, मानसिक योग्यता, कंप्यूटर अनुप्रयोग और झारखंड के इतिहास, भूगोल, अर्थव्यवस्था और संस्कृति पर केंद्रित एक विशेष खंड शामिल है।
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Paper 1: Language Ability</h4>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                          Consists of questions in Hindi and English testing reading comprehension, grammar, and grammar structures. Qualifying marks: 30%.
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Paper 2: Local & Regional Language</h4>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                          Multiple-choice questions testing proficiency in locally recognized languages (e.g. Khortha, Santhali, Kurukh, Mundari, Urdu). Score added to final merit list.
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Paper 3: General Studies & Jharkhand GK</h4>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                          Encompasses General Science, Mathematics, Mental Aptitude, Computer Applications, and a specialized segment focused on the history, geography, economy, and culture of Jharkhand.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </main>

          {/* Right Column: Sidebar Summary & Sharing */}
          <aside style={{ flex: '1 1 300px', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Sidebar 1: Notification Summary (Mockup Fidelity) */}
            <div className="card" style={{ 
              backgroundColor: 'white', 
              padding: '28px', 
              borderRadius: '12px', 
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '800', 
                color: '#111827', 
                marginBottom: '24px', 
                borderBottom: '1px solid #F3F4F6', 
                paddingBottom: '12px'
              }}>
                {t('examDetails.overviewTitle')}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Issuing Body */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('examDetails.issuingBody')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#374151', fontWeight: '700' }}>
                    {exam.orgShort} ({exam.organization})
                  </strong>
                </div>

                {/* Vacancies */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('examDetails.vacancies')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#1B8C0A', fontWeight: '700' }}>
                    {exam.posts || (language === 'HI' ? 'अनेक पद' : 'Multiple Posts')}
                  </strong>
                </div>

                {/* Category */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('jobs.category')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#374151', fontWeight: '700' }}>
                    {exam.category}
                  </strong>
                </div>

                {/* Status */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('examDetails.status')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#2563EB', fontWeight: '700' }}>
                    {exam.status || (language === 'HI' ? 'सक्रिय' : 'Active')}
                  </strong>
                </div>

                {/* Last Date */}
                {exam.lastDate && (
                  <div>
                    <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                      {t('examDetails.lastDateApply')}
                    </span>
                    <strong style={{ fontSize: '15px', color: '#DC2626', fontWeight: '700' }}>
                      {exam.lastDate}
                    </strong>
                  </div>
                )}

              </div>
            </div>

            {/* Sidebar 2: Share Section */}
            <div className="card text-center" style={{ 
              backgroundColor: 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
            }}>
              <h4 style={{ 
                fontSize: '15px', 
                fontWeight: '700', 
                color: '#111827', 
                marginBottom: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px'
              }}>
                <Share2 size={16} style={{ color: '#1B8C0A' }} /> {t('examDetails.shareNotif')}
              </h4>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                {/* Whatsapp */}
                <a 
                  href={`https://api.whatsapp.com/send?text=Check%20out%20this%20govt%20recruitment:%20${encodeURIComponent(exam.title)}%20-%20${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.59 2.016 14.11 1.01 11.99 1.01c-5.444 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L2.457 21.65l6.19-1.496zm9.382-7.013c-.27-.135-1.597-.788-1.846-.878-.25-.09-.432-.135-.613.135-.18.27-.7.878-.858 1.058-.158.18-.316.202-.586.067-.27-.135-1.14-.42-2.172-1.341-.803-.715-1.346-1.6-1.503-1.87-.158-.27-.017-.417.118-.552.122-.122.27-.315.405-.473.135-.158.18-.27.27-.45.09-.18.045-.338-.022-.473-.068-.135-.613-1.478-.84-2.023-.22-.53-.443-.46-.613-.468-.158-.008-.338-.01-.518-.01a1.002 1.002 0 0 0-.723.338c-.25.27-.95.928-.95 2.261 0 1.333.977 2.62 1.113 2.8.136.18 1.92 2.92 4.654 4.1c.65.28 1.157.447 1.554.573.654.208 1.25.178 1.72.108.524-.078 1.597-.653 1.822-1.283.226-.63.226-1.17.158-1.283-.068-.112-.248-.18-.518-.315z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#1877F2', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 2px 8px rgba(24, 119, 242, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Linkedin */}
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#0A66C2', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 2px 8px rgba(10, 102, 194, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* Twitter */}
                <a 
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20govt%20job%20notification!&url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#1DA1F2', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 2px 8px rgba(29, 161, 242, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>

                {/* Copy Link Button */}
                <button 
                  onClick={handleCopyLink}
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#E5E7EB', 
                    color: '#4B5563', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.backgroundColor = '#D1D5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1.0)';
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                  title={t('examDetails.copyNotifLink')}
                  aria-label={t('examDetails.copyNotifLink')}
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
};

export default ExamDetails;
