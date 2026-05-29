import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Globe, 
  Share2, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Check, 
  Copy 
} from 'lucide-react';

const JobDetails = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  
  // Apply Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Custom Toast/Interactive State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  // Fetch single job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/jobs/${id}`);
        if (response.data.success) {
          setJob(response.data.job);
        }
      } catch (err) {
        console.error(err);
        setError(t('jobDetails.notFoundErr'));
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = ['.pdf', '.doc', '.docx'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowed.includes(ext)) {
        setSubmitError(t('jobDetails.invalidTypeErr'));
        setResume(null);
        setResumeName('');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError(t('jobDetails.fileTooLargeErr'));
        setResume(null);
        setResumeName('');
        return;
      }
      setSubmitError(null);
      setResume(file);
      setResumeName(file.name);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setModalOpen(false);
      navigate('/login');
      return;
    }
    if (!resume) {
      setSubmitError(t('jobDetails.selectResumeErr'));
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    // Form data for multipart upload
    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);

    try {
      const res = await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess(true);
        // Reset form
        setCoverLetter('');
        setResume(null);
        setResumeName('');
      }
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || t('jobDetails.failedSubmitErr'));
    } finally {
      setSubmitting(false);
    }
  };

  // Clipboard Copier for Sharing Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage(t('jobDetails.copiedSuccess'));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Save Job interaction
  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setToastMessage(nextSaved ? t('jobDetails.savedSuccess') : t('jobDetails.removedSuccess'));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper: Calculate days ago nicely
  const getDaysAgo = (dateString) => {
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
        <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>{t('jobDetails.loadingDetails')}</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container page-content text-center" style={{ padding: '80px 0' }}>
        <AlertCircle size={40} style={{ color: '#DC2626', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A1A2E' }}>{t('jobDetails.failedLoad')}</h2>
        <p style={{ color: '#6B7280', margin: '8px 0 24px' }}>{error || (language === 'HI' ? 'वह नौकरी मौजूद नहीं है जिसे आप ढूंढ रहे हैं।' : 'The job you are looking for does not exist.')}</p>
        <Link to="/jobs" className="btn btn-primary">{t('jobDetails.backAllJobs')}</Link>
      </div>
    );
  }

  return (
    <div className="page-content animate-fade-in" style={{ backgroundColor: '#F8F9FA', paddingBottom: '80px', minHeight: '100vh' }}>
      
      {/* Toast Notification Popup */}
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
        
        {/* Breadcrumb - Matches Mockup Exactly */}
        <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', padding: '24px 0 16px' }}>
          <Link to="/" style={{ color: '#9CA3AF' }}>{t('jobs.breadcrumbHome')}</Link>
          <span style={{ color: '#D1D5DB' }}>&gt;</span>
          <Link to="/jobs" style={{ color: '#9CA3AF' }}>{t('jobs.breadcrumbAll')}</Link>
          <span style={{ color: '#D1D5DB' }}>&gt;</span>
          <span style={{ color: '#374151', fontWeight: '500' }}>{t('jobDetails.breadcrumbDetails')}</span>
        </div>

        {/* 1. Job Header Card - High Fidelity Matches Mockup */}
        <div className="card" style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #E5E7EB', 
          padding: '32px', 
          marginBottom: '30px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            {/* Circular Company Initials Bubble */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: job.companyColor || '#073B4C',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '28px',
              boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              {job.companyInitial || 'TS'}
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
                {job.title}
              </h1>
              
              <p style={{ 
                fontSize: '16px', 
                color: '#4B5563', 
                fontWeight: '600', 
                marginBottom: '16px' 
              }}>
                {job.company}
              </p>
              
              {/* Metadata Sub-Row */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Location */}
                <span style={{ fontSize: '13px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: '#9CA3AF' }} /> 
                  <span style={{ fontWeight: '500' }}>{job.location}, Jharkhand</span>
                </span>
                
                {/* Post age */}
                <span style={{ fontSize: '13px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} style={{ color: '#9CA3AF' }} /> 
                  <span>{t('jobDetails.posted')} {getDaysAgo(job.postedDate)}</span>
                </span>
                
                {/* Job Type Green Outline Badge */}
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
                  {job.type}
                </span>

                {/* Salary Green Bold Text */}
                <span style={{ 
                  fontSize: '14px', 
                  color: '#1B8C0A', 
                  fontWeight: '700',
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px' 
                }}>
                  ₹{job.salary?.min} - {job.salary?.max} {job.salary?.period || 'LPA'}
                  <Globe size={14} style={{ color: '#86EFAC' }} />
                </span>
              </div>

              {/* CTAs Placed inside Card under details exactly like mockup */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="btn" 
                  style={{ 
                    padding: '12px 32px', 
                    fontSize: '15px',
                    fontWeight: '700',
                    backgroundColor: '#1B8C0A',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(27, 140, 10, 0.15)'
                  }}
                >
                  {t('jobDetails.applyNow')}
                </button>
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
                  {isSaved ? t('jobDetails.saved') : t('jobDetails.saveJob')}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* 2. Main Two Column Layout */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column: Interactive Tabs & Information */}
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
                { id: 'description', label: t('jobDetails.tabDesc') },
                { id: 'about', label: t('jobDetails.tabAbout') },
                { id: 'requirements', label: t('jobDetails.tabRequirements') },
                { id: 'reviews', label: t('jobDetails.tabReviews') }
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
              
              {/* Tab: Job Description */}
              {activeTab === 'description' && (
                <div className="animate-fade-in">
                  <p style={{ 
                    color: '#4B5563', 
                    lineHeight: '1.8', 
                    marginBottom: '32px', 
                    fontSize: '15px',
                    whiteSpace: 'pre-line' 
                  }}>
                    {job.description}
                  </p>
                  
                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '28px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '800', 
                        color: '#111827', 
                        marginBottom: '20px',
                        letterSpacing: '-0.01em'
                      }}>
                        {t('jobDetails.keyResponsibilities')}
                      </h3>
                      <ul style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '14px', 
                        paddingLeft: '20px', 
                        listStyleType: 'disc' 
                      }}>
                        {job.responsibilities.map((resp, i) => (
                          <li key={i} style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fallback to make sure Key Responsibilities exist for mockup similarity */}
                  {(!job.responsibilities || job.responsibilities.length === 0) && (
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '28px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '20px' }}>
                        {t('jobDetails.keyResponsibilities')}
                      </h3>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '20px', listStyleType: 'disc' }}>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Write clean, efficient and maintainable code</li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Collaborate with cross-functional teams</li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Troubleshoot and debug software issues</li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Participate in code reviews</li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Learn and adapt to new technologies</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: About Company */}
              {activeTab === 'about' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', letterSpacing: '-0.01em' }}>
                    {t('jobDetails.tabAbout')} {job.company}
                  </h3>
                  <p style={{ color: '#4B5563', lineHeight: '1.8', fontSize: '15px' }}>
                    {job.company} is a highly respected regional industry leader headquartered in Jharkhand. They focus strongly on professional development, work-life balance, and regional socioeconomic improvement. They specialize in the {job.industry || 'technology sector'} with multiple local support networks.
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
                      <span style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('jobDetails.industrySector')}</span>
                      <strong style={{ fontSize: '15px', fontWeight: '700', color: '#374151' }}>{job.industry || 'IT / Software'}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('jobDetails.localBranches')}</span>
                      <strong style={{ fontSize: '15px', fontWeight: '700', color: '#374151' }}>{job.location || 'Ranchi'}, Jharkhand</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Requirements */}
              {activeTab === 'requirements' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '20px', letterSpacing: '-0.01em' }}>
                    {t('jobDetails.tabRequirements')}
                  </h3>
                  <ul style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '14px', 
                    paddingLeft: '20px', 
                    listStyleType: 'disc' 
                  }}>
                    {job.requirements && job.requirements.length > 0 ? (
                      job.requirements.map((reqItem, i) => (
                        <li key={i} style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.6' }}>
                          {reqItem}
                        </li>
                      ))
                    ) : (
                      <>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Bachelor's degree in Computer Science or related field</li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>0-2 years of experience in software development</li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Good knowledge of HTML, CSS, JavaScript</li>
                        <li style={{ color: '#4B5563', fontSize: '14.5px' }}>Basic knowledge of React or any backend tech is a plus</li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              {/* Tab: Reviews */}
              {activeTab === 'reviews' && (
                <div className="animate-fade-in" style={{ textAlign: 'center', padding: '24px 0' }}>
                  <Globe size={48} style={{ color: '#9CA3AF', margin: '0 auto 16px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>{t('jobDetails.noReviews')}</h4>
                  <p style={{ color: '#6B7280', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px', lineHeight: '1.5' }}>
                    {t('jobDetails.noReviewsDesc')}
                  </p>
                  <button 
                    onClick={() => {
                      setToastMessage('Reviews system is currently in read-only mode.');
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }}
                    className="btn"
                    style={{ 
                      padding: '10px 24px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      backgroundColor: '#F3F4F6', 
                      color: '#4B5563', 
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    {t('jobDetails.writeReview')}
                  </button>
                </div>
              )}

            </div>
          </main>

          {/* Right Column: Sidebar */}
          <aside style={{ flex: '1 1 300px', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Sidebar 1: Job Overview Card - Clean label-on-top, value-on-bottom list (Mockup Fidelity) */}
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
                paddingBottom: '12px',
                letterSpacing: '-0.01em'
              }}>
                {t('jobDetails.overview')}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Job Type */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('jobs.jobType')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#374151', fontWeight: '700' }}>
                    {job.type}
                  </strong>
                </div>

                {/* Experience */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('jobs.experience')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#374151', fontWeight: '700' }}>
                    {job.experience || '0 - 2 Years'}
                  </strong>
                </div>

                {/* Salary */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('jobs.salaryRange')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#1B8C0A', fontWeight: '700' }}>
                    ₹{job.salary?.min} - {job.salary?.max} {job.salary?.period || 'LPA'}
                  </strong>
                </div>

                {/* Location */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('jobDetails.localBranches')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#374151', fontWeight: '700' }}>
                    {job.location}, Jharkhand
                  </strong>
                </div>

                {/* Industry */}
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                    {t('jobDetails.industrySector')}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#374151', fontWeight: '700' }}>
                    {job.industry || 'IT / Software'}
                  </strong>
                </div>

              </div>
            </div>

            {/* Sidebar 2: Share Section - Custom Styled Social Circles */}
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
                <Share2 size={16} style={{ color: '#1B8C0A' }} /> {t('jobDetails.shareJob')}
              </h4>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                {/* Whatsapp */}
                <a 
                  href={`https://api.whatsapp.com/send?text=Check%20out%20this%20job:%20${encodeURIComponent(job.title)}%20at%20${encodeURIComponent(job.company)}%20-%20${encodeURIComponent(window.location.href)}`} 
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
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20job%20opportunity%20at%20${encodeURIComponent(job.company)}!&url=${encodeURIComponent(window.location.href)}`} 
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
                  title="Copy job link"
                  aria-label="Copy job details link"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

          </aside>

        </div>

      </div>

      {/* 3. Apply Modal Form Overlay - Intact & Preserved functionality */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          
          <div className="card animate-scale-in" style={{ 
            backgroundColor: 'white', 
            maxWidth: '520px', 
            width: '100%', 
            padding: '32px', 
            position: 'relative', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: 'none',
            borderRadius: '16px'
          }}>
            
            <button 
              onClick={() => { setModalOpen(false); setSuccess(false); setSubmitError(null); }} 
              style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                cursor: 'pointer', 
                color: '#9CA3AF',
                padding: '4px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {success ? (
              <div className="text-center animate-fade-in" style={{ padding: '24px 0 12px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#E8F5E3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <CheckCircle size={36} style={{ color: '#1B8C0A' }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>{t('jobDetails.appSentTitle')}</h3>
                <p style={{ fontSize: '14.5px', color: '#6B7280', marginBottom: '28px', lineHeight: '1.6' }}>
                  {t('jobDetails.appSentDesc')}<strong>{email}</strong>{t('jobDetails.appSentDescSuffix')}
                </p>
                <button 
                  onClick={() => { setModalOpen(false); setSuccess(false); }} 
                  className="btn btn-primary"
                  style={{ 
                    padding: '10px 32px',
                    fontWeight: '700',
                    backgroundColor: '#1B8C0A',
                    borderRadius: '8px'
                  }}
                >
                  {t('jobDetails.gotItBtn')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>{t('jobDetails.applyTitle')}</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>
                  {job.title} <span style={{ color: '#D1D5DB' }}>•</span> {job.company}
                </p>

                {submitError && (
                  <div style={{ 
                    backgroundColor: '#FEF2F2', 
                    borderLeft: '4px solid #DC2626', 
                    color: '#DC2626', 
                    padding: '12px 16px', 
                    fontSize: '13px', 
                    borderRadius: '6px', 
                    marginBottom: '20px', 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center' 
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{submitError}</span>
                  </div>
                )}

                {!user && (
                  <div style={{ 
                    backgroundColor: '#EFF6FF', 
                    borderLeft: '4px solid #2563EB', 
                    color: '#2563EB', 
                    padding: '12px 16px', 
                    fontSize: '13.5px', 
                    borderRadius: '6px', 
                    marginBottom: '20px' 
                  }}>
                    <span>{t('jobDetails.notSignedIn')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  
                  {/* Name */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{t('jobDetails.fullNameLabel')}</label>
                    <input 
                      type="text" 
                      required 
                      disabled={!user}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-input" 
                      placeholder={t('jobDetails.fullNamePlaceholder')}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{t('jobDetails.emailLabel')}</label>
                    <input 
                      type="email" 
                      required 
                      disabled={!user}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input" 
                      placeholder={t('jobDetails.emailPlaceholder')}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{t('jobDetails.phoneLabel')}</label>
                    <input 
                      type="text" 
                      required 
                      disabled={!user}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input" 
                      placeholder={t('jobDetails.phonePlaceholder')}
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{t('jobDetails.resumeLabel')}</label>
                    <div style={{ position: 'relative', border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: '#F9FAFB' }}>
                      <input 
                        type="file" 
                        required 
                        disabled={!user}
                        onChange={handleFileChange}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer', width: '100%' }} 
                      />
                      <span style={{ fontSize: '13.5px', color: '#4B5563', display: 'block', fontWeight: '600' }}>
                        {resumeName ? `${t('jobDetails.resumeSelected')}${resumeName}` : t('jobDetails.resumePlaceholder')}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginTop: '4px' }}>{t('jobDetails.maxSizeLimit')}</span>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{t('jobDetails.coverLetterLabel')}</label>
                    <textarea 
                      rows="3" 
                      disabled={!user}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="form-input" 
                      placeholder={t('jobDetails.coverLetterPlaceholder')}
                      style={{ resize: 'none' }}
                    />
                  </div>

                </div>

                {/* Submission Button */}
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn" 
                  style={{ 
                    width: '100%', 
                    padding: '14px 0', 
                    fontSize: '15px',
                    fontWeight: '700',
                    backgroundColor: '#1B8C0A',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(27, 140, 10, 0.15)'
                  }}
                >
                  {submitting ? t('jobDetails.submittingBtn') : user ? t('jobDetails.submitBtn') : t('jobDetails.proceedSignInBtn')}
                </button>
              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default JobDetails;
