import { Link } from 'react-router-dom';
import { MessageSquare, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        
        {/* Footer Top Grid */}
        <div className="footer-grid">
          
          {/* Column 1: Info and Brand */}
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <img src="/assets/images/logo.png" alt="Jharkhand Jobs" className="footer-logo-img" />
              <div className="logo-text">
                <span className="logo-title">Jharkhand Jobs</span>
                <span className="logo-subtitle">Apna Jharkhand, Apna Career</span>
              </div>
            </Link>
            <p className="footer-desc">
              {t('footer.description')}
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageSquare size={18} /></a>
            </div>
          </div>

          {/* Column 2: Job Seekers Links */}
          <div className="footer-col">
            <h4>{t('footer.forJobSeekers')}</h4>
            <ul>
              <li><Link to="/jobs">{t('footer.browseJobs')}</Link></li>
              <li><Link to="/govt-jobs">{t('footer.browseGovtJobs')}</Link></li>
              <li><Link to="/exams">{t('footer.examSyllabus')}</Link></li>
              <li><Link to="/quiz">{t('footer.practiceQuizzes')}</Link></li>
              <li><Link to="/companies">{t('footer.topCompanies')}</Link></li>
              <li><Link to="/blog">{t('footer.careerGuides')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Govt Exam Portals */}
          <div className="footer-col">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><Link to="/exams?category=Admit Card">{t('footer.downloadAdmitCard')}</Link></li>
              <li><Link to="/exams?category=Results">{t('footer.examResults')}</Link></li>
              <li><Link to="/exams?category=Answer Key">{t('footer.answerKeys')}</Link></li>
              <li><Link to="/exams?category=Exam Calendar">{t('footer.examCalendar')}</Link></li>
              <li><a href="https://jssc.nic.in" target="_blank" rel="noreferrer">{t('footer.officialJSSC')}</a></li>
            </ul>
          </div>

          {/* Column 4: Support & Legal */}
          <div className="footer-col">
            <h4>{t('footer.supportContact')}</h4>
            <ul>
              <li><Link to="/login">{t('footer.userDashboard')}</Link></li>
              <li><Link to="/blog">{t('footer.careerCounseling')}</Link></li>
              <li><Link to="/about">{t('footer.aboutJharkhandJobs')}</Link></li>
              <li><Link to="/terms">{t('footer.termsConditions')}</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Jharkhand Jobs (Apna Jharkhand, Apna Career). All Rights Reserved.</p>
          <button 
            onClick={scrollToTop} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: 'rgba(255,255,255,0.5)', 
              fontSize: '12px', 
              cursor: 'pointer',
              border: 'none',
              background: 'none'
            }}
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
