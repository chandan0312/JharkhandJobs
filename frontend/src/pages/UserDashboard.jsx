import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Bookmark, Briefcase, Bell, User, Settings, LogOut, CheckCircle2, 
  AlertCircle, ShieldCheck, FileText, Lock, Save, Trash2, ExternalLink 
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [jobAlerts, setJobAlerts] = useState({
    category: 'Govt Jobs',
    location: 'Jharkhand',
    qualification: 'Graduate',
    enabled: true
  });

  // Profile Edit Form state
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || user?.phone || '');
  const [bio, setBio] = useState(user?.profileData?.bio || '');
  
  // Password Change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loadingData, setLoadingData] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sync state when user profile changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.mobile || user.phone || '');
      setBio(user.profileData?.bio || '');
    }
  }, [user]);

  // Fetch saved jobs & applications for logged-in candidate
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch saved jobs
        if (user && user.savedJobs && user.savedJobs.length > 0) {
          const jobsPromises = user.savedJobs.map(id => 
            api.get(`/jobs/${id}`).catch(() => null)
          );
          const results = await Promise.all(jobsPromises);
          const validJobs = results
            .filter(res => res && res.data && res.data.job)
            .map(res => res.data.job);
          setSavedJobsList(validJobs);
        } else {
          setSavedJobsList([]);
        }

        // Fetch user applications
        try {
          const appRes = await api.get('/applications/my-applications');
          if (appRes.data && appRes.data.applications) {
            setApplicationsList(appRes.data.applications);
          }
        } catch (appErr) {
          // If endpoint not present, set empty list safely
          setApplicationsList([]);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let score = 30; // base score for account creation
    if (user.emailVerified) score += 20;
    if (user.mobile || user.phone) score += 20;
    if (user.profileImage) score += 15;
    if (user.profileData && (user.profileData.bio || user.profileData.qualification)) score += 15;
    return Math.min(score, 100);
  };

  const profilePct = calculateProfileCompletion();

  // Save Profile update
  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);
    try {
      await updateProfile({
        name,
        phone: mobile,
        mobile,
        profileData: {
          ...(user?.profileData || {}),
          bio
        }
      });
      setStatusMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    }
  };

  // Change Password submit
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      setStatusMsg('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change password.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{
      minHeight: '90vh',
      backgroundColor: '#F8FAFC',
      padding: '32px 16px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <meta name="robots" content="noindex, nofollow" />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Welcome Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <UserAvatar user={user} size={64} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Welcome, {user.name} 👋
                </h1>
                {user.emailVerified ? (
                  <span style={{ fontSize: '11px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                    Verified
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                    Unverified
                  </span>
                )}
              </div>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: '4px 0 0' }}>
                {user.email} {user.mobile ? `• +91 ${user.mobile}` : ''}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Status / Error Alerts */}
        {statusMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', color: '#15803D', fontSize: '13.5px', marginBottom: '20px' }}>
            <CheckCircle2 size={18} />
            <span>{statusMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#B91C1C', fontSize: '13.5px', marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Completion Meter */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Profile Completion</span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#1B8C0A' }}>{profilePct}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{
              width: `${profilePct}%`,
              height: '100%',
              backgroundColor: profilePct === 100 ? '#10B981' : '#1B8C0A',
              borderRadius: '5px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Quick Stat Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Saved Jobs */}
          <div 
            onClick={() => setActiveTab('saved-jobs')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '20px',
              border: activeTab === 'saved-jobs' ? '2px solid #1B8C0A' : '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', margin: '0 0 4px' }}>Saved Jobs</p>
              <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                {user.savedJobs?.length || 0}
              </h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={24} />
            </div>
          </div>

          {/* Card 2: Applications */}
          <div 
            onClick={() => setActiveTab('applications')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '20px',
              border: activeTab === 'applications' ? '2px solid #1B8C0A' : '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', margin: '0 0 4px' }}>Applications</p>
              <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                {applicationsList.length}
              </h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={24} />
            </div>
          </div>

          {/* Card 3: Job Alerts */}
          <div 
            onClick={() => setActiveTab('job-alerts')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '20px',
              border: activeTab === 'job-alerts' ? '2px solid #1B8C0A' : '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', margin: '0 0 4px' }}>Job Alerts</p>
              <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                {jobAlerts.enabled ? 'Active' : 'Disabled'}
              </h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={24} />
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'overview', label: 'My Profile', icon: User },
            { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark },
            { id: 'applications', label: 'Applications', icon: Briefcase },
            { id: 'job-alerts', label: 'Job Alerts', icon: Bell },
            { id: 'settings', label: 'Account Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: active ? '3px solid #1B8C0A' : '3px solid transparent',
                  color: active ? '#1B8C0A' : '#64748B',
                  fontWeight: active ? '700' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: My Profile */}
        {activeTab === 'overview' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 20px' }}>Personal Profile</h3>
            <form onSubmit={handleUpdateProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>About Me / Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell recruiters about your background, skills, and target job roles in Jharkhand..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#1B8C0A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} /> Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* Tab Content 2: Saved Jobs */}
        {activeTab === 'saved-jobs' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 20px' }}>Bookmarked Jobs</h3>
            {savedJobsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B' }}>
                <Bookmark size={40} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
                <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 8px' }}>No saved jobs yet</p>
                <p style={{ fontSize: '13px', margin: '0 0 16px' }}>Browse government and private jobs and click the bookmark icon to save them for later.</p>
                <Link to="/jobs" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#1B8C0A', color: '#FFFFFF', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                  Explore Jobs
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedJobsList.map((job) => (
                  <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px' }}>{job.title}</h4>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{job.company} • {job.location}</p>
                    </div>
                    <Link to={`/jobs/${job.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1B8C0A', fontWeight: '700', fontSize: '13.5px', textDecoration: 'none' }}>
                      View Details <ExternalLink size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Applications */}
        {activeTab === 'applications' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 20px' }}>My Applications</h3>
            {applicationsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B' }}>
                <Briefcase size={40} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
                <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 8px' }}>No active job applications</p>
                <p style={{ fontSize: '13px', margin: '0 0 16px' }}>When you submit applications for open positions, your status will appear here.</p>
                <Link to="/jobs" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#1B8C0A', color: '#FFFFFF', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                  Find Job Vacancies
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applicationsList.map((app) => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 4px' }}>{app.full_name}</h4>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Applied on {new Date(app.applied_date).toLocaleDateString()}</p>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#B45309' }}>
                      {app.status || 'Submitted'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 4: Job Alerts */}
        {activeTab === 'job-alerts' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px' }}>Personalized Job Alerts</h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 20px' }}>Get daily email notifications for fresh government and private job openings in Jharkhand.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Category</label>
                <select 
                  value={jobAlerts.category} 
                  onChange={(e) => setJobAlerts({ ...jobAlerts, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                >
                  <option value="Govt Jobs">Govt Jobs (JPSC, JSSC, State)</option>
                  <option value="Private Jobs">Private Jobs</option>
                  <option value="Teaching">Education & Teaching (JTET)</option>
                  <option value="All">All Categories</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Target Qualification</label>
                <select 
                  value={jobAlerts.qualification} 
                  onChange={(e) => setJobAlerts({ ...jobAlerts, qualification: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                >
                  <option value="Graduate">Graduate / Degree</option>
                  <option value="10th/12th">10th / 12th Pass</option>
                  <option value="Diploma/ITI">Diploma / ITI</option>
                  <option value="Post Graduate">Post Graduate / M.Tech</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <input
                  type="checkbox"
                  id="job-alerts-enable"
                  checked={jobAlerts.enabled}
                  onChange={(e) => setJobAlerts({ ...jobAlerts, enabled: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="job-alerts-enable" style={{ fontSize: '14px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                  Send daily email alerts for new matches
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 5: Account Settings */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 20px' }}>Security & Change Password</h3>
            <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Lock size={16} /> Update Password
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;
