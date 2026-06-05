import { useState } from 'react';
import { Mail, Phone, MapPin, Award, Send, Star, TrendingUp, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Select a subject',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || formData.message === '') {
      alert('Please fill out all required fields.');
      return;
    }
    
    try {
      setSubmitted(true);
      const response = await api.post('/admin/enquiries', formData);
      if (response.data.success) {
        setFormData({
          name: '',
          email: '',
          subject: 'Select a subject',
          message: ''
        });
        alert("Thank you! Your enquiry has been sent successfully. We will get back to you soon.");
      } else {
        alert(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setSubmitted(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subscribeEmail) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      const response = await api.post('/admin/subscribe', { email: subscribeEmail });
      if (response.data.success) {
        alert('Thank you for subscribing to our newsletter!');
        setSubscribeEmail('');
      } else {
        alert(response.data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* ==================== 1. PAGE HEADER HERO BORDER ==================== */}
      <div style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.9) 45%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0.1) 100%), url("/assets/images/jharkhand_hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: '70% 30%',
        borderRadius: '20px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '200px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ zIndex: 2, maxWidth: '60%' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '14px' }}>
            <span>Home</span>
            <span>&rsaquo;</span>
            <span style={{ color: '#0F172A' }}>Connect With Us</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0F172A', margin: 0, position: 'relative', display: 'inline-block' }}>
            Connect With Us
            {/* Handdrawn custom green brush stroke */}
            <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '130px', height: '8px' }} viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,5 Q50,9 100,3" stroke="#22C55E" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </h1>

          <p style={{ fontSize: '15px', color: '#475569', marginTop: '20px', lineHeight: '1.6', fontWeight: '500', maxWidth: '480px' }}>
            We're here to help! Reach out to us for any queries, suggestions or support.
          </p>
        </div>
      </div>

      {/* ==================== 2. MAIN 3-CARD CONTENT GRID ==================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* CARD 1: Get In Touch (Form) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 25px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Title Header */}
          <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Send size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>Get In Touch</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: '500' }}>Fill out the form and our team will get back to you soon.</p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px' }}>Your Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '14px' }}>👤</span>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%', padding: '11px 16px 11px 38px', fontSize: '13px',
                    border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF',
                    color: '#0F172A', boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '14px' }}>✉️</span>
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%', padding: '11px 16px 11px 38px', fontSize: '13px',
                    border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF',
                    color: '#0F172A', boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px' }}>Subject</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                style={{
                  width: '100%', padding: '11px 16px', fontSize: '13px',
                  border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF',
                  color: '#475569', boxSizing: 'border-box', outline: 'none'
                }}
              >
                <option>Select a subject</option>
                <option>General Inquiry</option>
                <option>Job Posting Support</option>
                <option>Aspirant Career Guidance</option>
                <option>Admit Card / Exam Help</option>
                <option>Technical Feedback</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px' }}>Your Message</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#94A3B8', fontSize: '14px' }}>💬</span>
                <textarea 
                  required
                  rows="4"
                  placeholder="Type your message here..." 
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px 12px 38px', fontSize: '13px',
                    border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#FFFFFF',
                    color: '#0F172A', boxSizing: 'border-box', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none',
                padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer', transition: 'background-color 0.2s ease', marginTop: '6px'
              }}
            >
              <Send size={14} />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* CARD 2: Contact Information */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 25px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Title Header */}
          <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>Contact Information</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: '500' }}>Choose the best way to reach us</p>
            </div>
          </div>

          {/* Info Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            
            {/* Email block */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
              borderRadius: '12px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Email Us</span>
                <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: '800', marginTop: '2px' }}>jharkhandjobs03@gmail.com</span>
              </div>
            </div>

            {/* Phone block */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
              borderRadius: '12px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Call Us</span>
                <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: '800', marginTop: '2px' }}>+91 87898 62771</span>
              </div>
            </div>

            {/* WhatsApp block */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
              borderRadius: '12px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '16px' }}>🟢</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>WhatsApp</span>
                <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: '800', marginTop: '2px' }}>+91 87898 62771</span>
              </div>
            </div>

            {/* Address block */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
              borderRadius: '12px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Office Address</span>
                <span style={{ fontSize: '12px', color: '#0F172A', fontWeight: '800', marginTop: '2px', lineHeight: '1.4' }}>
                  Jharkhand Jobs, Kutchery Road, Ranchi, Jharkhand - 834001
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 3: We're Active Here (Social Media) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 25px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Title Header */}
          <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '18px' }}>👥</span>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>We're Active Here</h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: '500' }}>Follow us on social media</p>
            </div>
          </div>

          {/* Social Row list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {[
              { label: 'Facebook', desc: '@jharkhandjobs.in', bg: '#EFF6FF', color: '#2563EB', icon: '👤', btn: 'Follow' },
              { label: 'Instagram', desc: '@jharkhandjobs03', bg: '#FDF2F8', color: '#DB2777', icon: '📸', btn: 'Follow' },
              { label: 'Telegram', desc: '@jharkhandjobs', bg: '#F0F9FF', color: '#0284C7', icon: '✈️', btn: 'Follow' },
              { label: 'YouTube', desc: '@jharkhandjobs', bg: '#FEF2F2', color: '#DC2626', icon: '📺', btn: 'Subscribe' },
              { label: 'Twitter / X', desc: '@jharkhand_jobs', bg: '#F8FAFC', color: '#0F172A', icon: '✖️', btn: 'Follow' }
            ].map((social, sidx) => (
              <div key={sidx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0',
                borderBottom: sidx < 4 ? '1px solid #F1F5F9' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: social.bg, color: social.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                    {social.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: '750' }}>{social.label}</span>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>{social.desc}</span>
                  </div>
                </div>
                <button style={{
                  padding: '5px 14px', border: '1px solid #10B981', borderRadius: '20px',
                  backgroundColor: 'transparent', color: '#10B981', fontSize: '11px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}>
                  {social.btn}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ==================== 3. DETAILED FOOTER CARD WIDGET ==================== */}
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr 0.9fr 0.9fr 1.3fr;
          gap: 0px;
          width: 100%;
          box-sizing: border-box;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 28px;
        }
        .footer-col-divider {
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          padding-left: 28px;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          .footer-col {
            padding-right: 0 !important;
          }
          .footer-col-divider {
            border-left: none !important;
            padding-left: 0 !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>

      <footer style={{
        backgroundColor: '#041c14',
        color: '#A3B3AB',
        borderRadius: '24px',
        padding: '48px 40px 24px',
        border: '1px solid rgba(16, 185, 129, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        boxSizing: 'border-box'
      }}>
        {/* Footer Top Grid */}
        <div className="footer-grid">
          {/* Col 1: Brand & Description */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/assets/images/logo.png" 
                alt="Jharkhand Jobs Logo" 
                style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'contain', backgroundColor: 'transparent' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px' }}>Jharkhand Jobs</span>
                <span style={{ fontSize: '10px', color: '#86EFAC', fontWeight: '600' }}>Apna Jharkhand, Apna Career</span>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: '#8DA297', lineHeight: '1.6', margin: 0 }}>
              Your trusted platform for Government Jobs, Private Jobs, Exams, Results, Admit Cards, and Career Guidance.
            </p>
            {/* Social Icons row */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {[
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ),
                  url: 'https://facebook.com'
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  ),
                  url: 'https://instagram.com/jharkhandjobs03'
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  ),
                  url: 'https://telegram.org'
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                    </svg>
                  ),
                  url: 'https://youtube.com'
                },
                {
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                    </svg>
                  ),
                  url: 'https://twitter.com'
                }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#A3B3AB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
                    e.currentTarget.style.borderColor = '#10B981';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#A3B3AB';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col footer-col-divider">
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              {['Home', 'Latest Jobs', 'Exams', 'Admit Cards', 'Results', 'Career Guide', 'Articles & Blogs'].map((lnk, lidx) => (
                <li 
                  key={lidx} 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease', color: '#A3B3AB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A3B3AB'}
                >
                  {lnk}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Important Links */}
          <div className="footer-col footer-col-divider">
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>Important Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              {['About Us', 'Privacy Policy', 'Terms & Conditions', 'Disclaimer', 'Sitemap', 'Contact Us', 'FAQ'].map((lnk, lidx) => (
                <li 
                  key={lidx} 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease', color: '#A3B3AB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A3B3AB'}
                >
                  {lnk}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Popular Categories */}
          <div className="footer-col footer-col-divider">
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>Popular Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              {['Government Jobs', 'Jharkhand Jobs', 'Banking Jobs', 'Railway Jobs', 'Teaching Jobs', 'Police Jobs', 'Defence Jobs'].map((lnk, lidx) => (
                <li 
                  key={lidx} 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease', color: '#A3B3AB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A3B3AB'}
                >
                  {lnk}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="footer-col footer-col-divider">
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>Newsletter</h4>
            <p style={{ fontSize: '12.5px', color: '#8DA297', lineHeight: '1.5', margin: 0 }}>
              Subscribe to get the latest job updates and exam notifications.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', fontSize: '13px',
                  backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: '#FFFFFF', boxSizing: 'border-box', outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
              <button 
                onClick={handleSubscribe}
                style={{
                  backgroundColor: '#0F764E', color: '#FFFFFF', border: 'none', padding: '11px',
                  borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F764E'}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '11px',
          color: '#6A8074'
        }}>
          <span>© 2024 Jharkhand Jobs. All Rights Reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#FFFFFF' }}>
            <span>Apna Jharkhand, Apna Career 💚</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Made with 💚 in Jharkhand, India 🇮🇳</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Contact;
