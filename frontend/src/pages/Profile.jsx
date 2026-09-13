import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserAvatar, { ANIMALS } from '../components/UserAvatar';
import api from '../services/api';
import { 
  LogOut, User, Mail, Phone, Calendar, Star, ShieldCheck, 
  Award, Heart, Link as LinkIcon, Edit3, CheckCircle, 
  MapPin, Briefcase, Bell, X, AlertCircle 
} from 'lucide-react';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeSubTab, setActiveSubTab] = useState('basic'); // 'basic', 'password', 'notifications'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Profile data states initialized with standard fallbacks
  const p = user?.profileData || {};
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editDob, setEditDob] = useState(p.dob || '15 August 2000');
  const [editGender, setEditGender] = useState(p.gender || 'Male');
  const [editLocation, setEditLocation] = useState(p.location || 'Ranchi, Jharkhand, India');
  const [editCurrentStatus, setEditCurrentStatus] = useState(p.currentStatus || 'Actively Looking for Opportunities');
  const [editAboutMe, setEditAboutMe] = useState(p.aboutMe || 'I am a dedicated aspirant preparing for government jobs. My goal is to secure a good position and serve the state.');
  const [editQualification, setEditQualification] = useState(p.qualification || 'B.Tech (Mechanical Engineering)');
  const [editUniversity, setEditUniversity] = useState(p.university || 'BIT Mesra, Ranchi');
  const [editYearOfPassing, setEditYearOfPassing] = useState(p.yearOfPassing || '2023');
  const [editPrefJobTypes, setEditPrefJobTypes] = useState(p.prefJobTypes || 'Government Jobs');
  const [editPrefSectors, setEditPrefSectors] = useState(p.prefSectors || 'Engineering, Public Sector');
  const [editPrefLocations, setEditPrefLocations] = useState(p.prefLocations || 'Ranchi, Jamshedpur, Dhanbad');
  const [editWorkPreference, setEditWorkPreference] = useState(p.workPreference || 'Open to Relocation');
  const [editFacebook, setEditFacebook] = useState(p.facebook || 'https://facebook.com');
  const [editInstagram, setEditInstagram] = useState(p.instagram || 'https://instagram.com');
  const [editTelegram, setEditTelegram] = useState(p.telegram || 'https://t.me');
  const [editLinkedin, setEditLinkedin] = useState(p.linkedin || 'https://linkedin.com');
  const [editX, setEditX] = useState(p.x || 'https://x.com');

  // Sync edits if user updates/loads
  useEffect(() => {
    if (user) {
      const uData = user.profileData || {};
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditDob(uData.dob || '15 August 2000');
      setEditGender(uData.gender || 'Male');
      setEditLocation(uData.location || 'Ranchi, Jharkhand, India');
      setEditCurrentStatus(uData.currentStatus || 'Actively Looking for Opportunities');
      setEditAboutMe(uData.aboutMe || 'I am a dedicated aspirant preparing for government jobs. My goal is to secure a good position and serve the state.');
      setEditQualification(uData.qualification || 'B.Tech (Mechanical Engineering)');
      setEditUniversity(uData.university || 'BIT Mesra, Ranchi');
      setEditYearOfPassing(uData.yearOfPassing || '2023');
      setEditPrefJobTypes(uData.prefJobTypes || 'Government Jobs');
      setEditPrefSectors(uData.prefSectors || 'Engineering, Public Sector');
      setEditPrefLocations(uData.prefLocations || 'Ranchi, Jamshedpur, Dhanbad');
      setEditWorkPreference(uData.workPreference || 'Open to Relocation');
      setEditFacebook(uData.facebook || 'https://facebook.com');
      setEditInstagram(uData.instagram || 'https://instagram.com');
      setEditTelegram(uData.telegram || 'https://t.me');
      setEditLinkedin(uData.linkedin || 'https://linkedin.com');
      setEditX(uData.x || 'https://x.com');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  // Handle Save profile edits
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await api.put('/auth/profile', {
        name: editName,
        phone: editPhone,
        profileData: {
          dob: editDob,
          gender: editGender,
          location: editLocation,
          currentStatus: editCurrentStatus,
          aboutMe: editAboutMe,
          qualification: editQualification,
          university: editUniversity,
          yearOfPassing: editYearOfPassing,
          prefJobTypes: editPrefJobTypes,
          prefSectors: editPrefSectors,
          prefLocations: editPrefLocations,
          workPreference: editWorkPreference,
          facebook: editFacebook,
          instagram: editInstagram,
          telegram: editTelegram,
          linkedin: editLinkedin,
          x: editX
        }
      });
      if (response.data.success) {
        setUser(response.data.user);
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Profile data shorthand
  const profile = user.profileData || {};

  return (
    <div className="profile-dashboard-container" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Responsive Inline CSS rules */}
      <style>{`
        .profile-dashboard-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr;
          gap: 24px;
          margin-top: 24px;
        }
        .hero-banner-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%);
          border: 1px solid #D1FAE5;
          border-radius: 16px;
          padding: 28px 32px;
          flex-wrap: wrap;
          gap: 24px;
        }
        .metric-cards-container {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .metric-widget-card {
          background-color: white;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
          min-width: 140px;
        }
        .profile-info-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 13.5px;
        }
        .profile-info-row:last-child {
          border-bottom: none;
        }
        .social-circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        .social-circle-btn:hover {
          transform: translateY(-2px);
        }
        .profile-edit-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          backgroundColor: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
          box-sizing: border-box;
        }
        .profile-edit-modal-card {
          background-color: white;
          border-radius: 16px;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #E2E8F0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 992px) {
          .profile-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-banner-row {
            padding: 20px !important;
          }
        }
      `}</style>

      {/* ==================== 1. TITLE HEADER ROW ==================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={22} style={{ color: '#1B8C0A' }} />
            <h1 style={{ fontSize: '22px', fontWeight: '850', color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>My Profile</h1>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0', fontWeight: '500' }}>Manage your personal information and account settings</p>
        </div>

        {/* Header Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px',
              backgroundColor: 'white', border: '1px solid #CBD5E1', borderRadius: '30px',
              color: '#334155', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <Edit3 size={14} style={{ color: '#1B8C0A' }} />
            <span>Edit Profile</span>
          </button>

          <button 
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1.5px solid #EF4444', borderRadius: '30px',
              color: '#EF4444', fontSize: '12.5px', fontWeight: '750', cursor: 'pointer',
              transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EF4444';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
              e.currentTarget.style.color = '#EF4444';
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ==================== 2. GREEN HERO ACCOUNT BANNER ==================== */}
      <div className="hero-banner-row">
        {/* Left: Avatar Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex' }}>
            <UserAvatar user={user} size={90} style={{ border: '4px solid white', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)' }} />
            <span style={{ 
              position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#FFFFFF', 
              borderRadius: '50%', width: '22px', height: '22px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <CheckCircle size={16} style={{ color: '#10B981', fill: '#FFFFFF' }} />
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '850', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user.name}
            </h2>
            <span style={{ 
              fontSize: '11px', fontWeight: '750', textTransform: 'uppercase', color: '#15803D',
              backgroundColor: '#D1FAE5', padding: '3px 12px', borderRadius: '30px', width: 'fit-content'
            }}>
              {user.role === 'admin' ? '🛡️ Administrator' : '🎓 Aspirant'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: '#475569', marginTop: '6px', fontWeight: '500' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} style={{ color: '#1B8C0A' }} /> {profile.location || 'Ranchi, Jharkhand, India'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} style={{ color: '#1B8C0A' }} /> Member since May 2024
              </span>
            </div>
          </div>
        </div>

        {/* Right: Metrics widgets */}
        <div className="metric-cards-container">
          <div className="metric-widget-card">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>12</span>
              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>Applications</span>
            </div>
          </div>

          <div className="metric-widget-card">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={15} style={{ fill: '#2563EB' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>8</span>
              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>Saved Jobs</span>
            </div>
          </div>

          <div className="metric-widget-card">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>25</span>
              <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: '600' }}>Job Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 3. GRID CONTENT LAYER ==================== */}
      <div className="profile-dashboard-grid">
        {/* Left Column: Basic Info and Sub-tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sub-tab selection row */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
            <button 
              onClick={() => setActiveSubTab('basic')}
              style={{
                padding: '8px 16px', border: 'none', background: 'none', fontSize: '13px', fontWeight: '750',
                cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
                color: activeSubTab === 'basic' ? '#1B8C0A' : '#64748B',
                borderBottom: activeSubTab === 'basic' ? '2.5px solid #1B8C0A' : '2.5px solid transparent',
                marginBottom: '-11px'
              }}
            >
              Basic Information
            </button>
            <button 
              onClick={() => alert('Change password panel is coming soon!')}
              style={{
                padding: '8px 16px', border: 'none', background: 'none', fontSize: '13px', fontWeight: '750',
                cursor: 'pointer', outline: 'none', transition: 'all 0.2s', color: '#64748B',
                borderBottom: '2.5px solid transparent', marginBottom: '-11px'
              }}
            >
              Change Password
            </button>
            <button 
              onClick={() => alert('Notification settings panel is coming soon!')}
              style={{
                padding: '8px 16px', border: 'none', background: 'none', fontSize: '13px', fontWeight: '750',
                cursor: 'pointer', outline: 'none', transition: 'all 0.2s', color: '#64748B',
                borderBottom: '2.5px solid transparent', marginBottom: '-11px'
              }}
            >
              Notification Settings
            </button>
          </div>

          {/* Basic Info White Card Panel */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
              <User size={16} style={{ color: '#1B8C0A' }} />
              <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Basic Information</h3>
            </div>

            {/* List Row items */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="profile-info-row">
                <span style={{ color: '#64748B', fontWeight: '600', width: '150px', flexShrink: 0 }}>Full Name</span>
                <span style={{ color: '#0F172A', fontWeight: '700' }}>{user.name}</span>
              </div>
              <div className="profile-info-row">
                <span style={{ color: '#64748B', fontWeight: '600', width: '150px', flexShrink: 0 }}>Email Address</span>
                <span style={{ color: '#0F172A', fontWeight: '700' }}>{user.email}</span>
              </div>
              <div className="profile-info-row">
                <span style={{ color: '#64748B', fontWeight: '600', width: '150px', flexShrink: 0 }}>Mobile Number</span>
                <span style={{ color: '#0F172A', fontWeight: '700' }}>{user.phone || '+91 70000 12345'}</span>
              </div>
              <div className="profile-info-row">
                <span style={{ color: '#64748B', fontWeight: '600', width: '150px', flexShrink: 0 }}>Date of Birth</span>
                <span style={{ color: '#0F172A', fontWeight: '700' }}>{profile.dob || '15 August 2000'}</span>
              </div>
              <div className="profile-info-row">
                <span style={{ color: '#64748B', fontWeight: '600', width: '150px', flexShrink: 0 }}>Gender</span>
                <span style={{ color: '#0F172A', fontWeight: '700' }}>{profile.gender || 'Male'}</span>
              </div>
              <div className="profile-info-row">
                <span style={{ color: '#64748B', fontWeight: '600', width: '150px', flexShrink: 0 }}>Location</span>
                <span style={{ color: '#0F172A', fontWeight: '700' }}>{profile.location || 'Ranchi, Jharkhand, India'}</span>
              </div>
              <div className="profile-info-row">
                <span style={{ color: '#64748B', fontWeight: '600', width: '150px', flexShrink: 0 }}>Current Status</span>
                <span style={{ color: '#059669', fontWeight: '750' }}>{profile.currentStatus || 'Actively Looking for Opportunities'}</span>
              </div>
              <div className="profile-info-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>About Me</span>
                <p style={{ color: '#334155', fontWeight: '500', margin: 0, lineHeight: '1.5', fontSize: '13px' }}>
                  {profile.aboutMe || 'I am a dedicated aspirant preparing for government jobs. My goal is to secure a good position and serve the state.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Education, Preferences, Socials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: Education */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} style={{ color: '#1B8C0A' }} />
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Education</h3>
              </div>
              <button onClick={() => setModalOpen(true)} style={{ border: 'none', background: 'none', color: '#64748B', fontSize: '11px', fontWeight: '750', cursor: 'pointer', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F8FAFC' }}>Edit</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Highest Qualification</span>
                <span style={{ color: '#0F172A', fontWeight: '750' }}>{profile.qualification || 'B.Tech (Mechanical Engineering)'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>University/Board</span>
                <span style={{ color: '#0F172A', fontWeight: '750' }}>{profile.university || 'BIT Mesra, Ranchi'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Year of Passing</span>
                <span style={{ color: '#0F172A', fontWeight: '750' }}>{profile.yearOfPassing || '2023'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Preferences */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={15} style={{ color: '#1B8C0A' }} />
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Preferences</h3>
              </div>
              <button onClick={() => setModalOpen(true)} style={{ border: 'none', background: 'none', color: '#64748B', fontSize: '11px', fontWeight: '750', cursor: 'pointer', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F8FAFC' }}>Edit</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Preferred Job Types</span>
                <span style={{ color: '#0F172A', fontWeight: '750' }}>{profile.prefJobTypes || 'Government Jobs'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Preferred Sectors</span>
                <span style={{ color: '#0F172A', fontWeight: '750' }}>{profile.prefSectors || 'Engineering, Public Sector'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Preferred Locations</span>
                <span style={{ color: '#0F172A', fontWeight: '750' }}>{profile.prefLocations || 'Ranchi, Jamshedpur, Dhanbad'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Work Preference</span>
                <span style={{ color: '#1B8C0A', fontWeight: '800' }}>{profile.workPreference || 'Open to Relocation'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Social Profiles */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LinkIcon size={15} style={{ color: '#1B8C0A' }} />
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Social Profiles</h3>
              </div>
              <button onClick={() => setModalOpen(true)} style={{ border: 'none', background: 'none', color: '#64748B', fontSize: '11px', fontWeight: '750', cursor: 'pointer', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F8FAFC' }}>Edit</button>
            </div>

            {/* Icons row */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '4px' }}>
              <a href={profile.facebook || 'https://facebook.com'} target="_blank" rel="noreferrer" className="social-circle-btn" style={{ backgroundColor: '#1877F2' }}>
                f
              </a>
              <a href={profile.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" className="social-circle-btn" style={{ background: 'linear-gradient(45deg, #F09433 0%, #E6683C 25%, #DC2743 50%, #CC2366 75%, #BC1888 100%)' }}>
                i
              </a>
              <a href={profile.telegram || 'https://t.me'} target="_blank" rel="noreferrer" className="social-circle-btn" style={{ backgroundColor: '#0088cc' }}>
                t
              </a>
              <a href={profile.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" className="social-circle-btn" style={{ backgroundColor: '#0077b5' }}>
                in
              </a>
              <a href={profile.x || 'https://x.com'} target="_blank" rel="noreferrer" className="social-circle-btn" style={{ backgroundColor: '#000000' }}>
                𝕏
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== 4. FOOTER SECURITY ROW ==================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '28px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12.5px', fontWeight: '500' }}>
          <ShieldCheck size={16} style={{ color: '#1B8C0A' }} />
          <span>Your data is safe and secure with us. We respect your privacy.</span>
        </div>

        <button 
          onClick={() => alert('Account deletion requires administrative authorization. Please contact support.')}
          style={{
            border: 'none', background: 'none', color: '#EF4444', fontSize: '12.5px', 
            fontWeight: '700', cursor: 'pointer', padding: 0
          }}
        >
          Delete Account
        </button>
      </div>

      {/* ==================== 5. MODAL EDIT DIALOG OVERLAY ==================== */}
      {modalOpen && (
        <div className="profile-edit-modal-overlay">
          <div className="profile-edit-modal-card">
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '850', color: '#0F172A', margin: 0 }}>Edit Personal Profile</h3>
              <button 
                onClick={() => setModalOpen(false)} 
                style={{ border: 'none', background: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '24px', flex: 1, overflowY: 'auto' }}>
              
              {/* Alert message */}
              {error && (
                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#991B1B', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                  <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Group 1: Basic Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#1B8C0A', letterSpacing: '0.5px' }}>1. Basic Information</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Full Name</label>
                    <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Mobile Number</label>
                    <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Date of Birth</label>
                    <input type="text" value={editDob} onChange={(e) => setEditDob(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Gender</label>
                    <select value={editGender} onChange={(e) => setEditGender(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Location</label>
                    <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Current Status</label>
                    <input type="text" value={editCurrentStatus} onChange={(e) => setEditCurrentStatus(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>About Me Label</label>
                  <textarea value={editAboutMe} onChange={(e) => setEditAboutMe(e.target.value)} rows={3} style={{ padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>

              {/* Group 2: Education Profile */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#1B8C0A', letterSpacing: '0.5px' }}>2. Education Details</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Highest Qualification</label>
                    <input type="text" value={editQualification} onChange={(e) => setEditQualification(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>University / Board</label>
                    <input type="text" value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '50%' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Year of Passing</label>
                  <input type="text" value={editYearOfPassing} onChange={(e) => setEditYearOfPassing(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                </div>
              </div>

              {/* Group 3: Work Preferences */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#1B8C0A', letterSpacing: '0.5px' }}>3. Aspirant Preferences</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Preferred Job Types</label>
                    <input type="text" value={editPrefJobTypes} onChange={(e) => setEditPrefJobTypes(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Preferred Sectors</label>
                    <input type="text" value={editPrefSectors} onChange={(e) => setEditPrefSectors(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Preferred Locations</label>
                    <input type="text" value={editPrefLocations} onChange={(e) => setEditPrefLocations(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Work Preference</label>
                    <input type="text" value={editWorkPreference} onChange={(e) => setEditWorkPreference(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Group 4: Social Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#1B8C0A', letterSpacing: '0.5px' }}>4. Social Connections</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Facebook Profile URL</label>
                    <input type="text" value={editFacebook} onChange={(e) => setEditFacebook(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Instagram Profile URL</label>
                    <input type="text" value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Telegram Link</label>
                    <input type="text" value={editTelegram} onChange={(e) => setEditTelegram(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>LinkedIn URL</label>
                    <input type="text" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '50%' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>X (Twitter) URL</label>
                  <input type="text" value={editX} onChange={(e) => setEditX(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', padding: '16px 0 0 0', marginTop: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 18px', border: '1.5px solid #CBD5E1', borderRadius: '8px', backgroundColor: 'transparent', color: '#475569', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ padding: '8px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(27,140,10,0.15)' }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
