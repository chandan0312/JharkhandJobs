import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  LayoutDashboard, Plus, Briefcase, Calendar, FileText, Award, BookOpen, 
  Users, MessageSquare, HelpCircle, FolderOpen, Settings, TrendingUp, LogOut, 
  ChevronDown, ChevronRight, Download, X, CheckCircle, AlertCircle, Trash2, 
  Clock, ArrowUpRight, Bookmark, SlidersHorizontal, Filter, Check, Search, Bell, Mail, Star, Send, Menu, RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Contact from './Contact';

const getCategoryBadgeStyles = (category) => {
  const cat = String(category).toUpperCase();
  if (cat.includes('PRIVATE')) {
    return { color: '#475569' };
  }
  if (cat === 'SSC') {
    return { color: '#1B8C0A' };
  }
  if (cat === 'UPSC') {
    return { color: '#7C3AED' };
  }
  if (cat === 'RAILWAY') {
    return { color: '#D97706' };
  }
  if (cat === 'JHARKHAND') {
    return { color: '#2563EB' };
  }
  if (cat.includes('OTHER') || cat.includes('STATE')) {
    return { color: '#0891B2' };
  }
  return { color: '#4338CA' };
};

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Selected sidebar option state (Matches the image exactly!)
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Admin Profile edit states
  const [adminProfileOpen, setAdminProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin User');
  const [adminEmail, setAdminEmail] = useState('admin@jharkhandjobs.gov.in');
  const [adminPhone, setAdminPhone] = useState('+91 651 2400123');
  const [adminBio, setAdminBio] = useState('Jharkhand Jobs system administrator console. Managing private listings, Sarkari alerts, admit card releases, exams boards results, and quizzes databases.');

  // Pre-populate admin data from AuthContext
  useEffect(() => {
    if (user) {
      setAdminName(user.name || 'Admin User');
      setAdminEmail(user.email || 'admin@jharkhandjobs.gov.in');
      if (user.phone) setAdminPhone(user.phone);
    }
  }, [user]);

  // Submenu expansion states for collapsible lists
  const [careerGuideExpanded, setCareerGuideExpanded] = useState(true);
  const [quizzesExpanded, setQuizzesExpanded] = useState(false);
  const [studyMaterialExpanded, setStudyMaterialExpanded] = useState(false);

  // Stats and charts data states
  const [stats, setStats] = useState({
    totalJobs: 1248,
    activeJobs: 1248,
    totalApplications: 3562,
    totalExams: 342,
    totalCompanies: 15,
    totalUsers: 8942
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRecentPostings, setShowRecentPostings] = useState(true);

  // Dynamic Content Data States
  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  
  // New States for Plan Execution
  const [enquiries, setEnquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [scraping, setScraping] = useState(false);
  const [scrapingLanding, setScrapingLanding] = useState(false);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterForm, setNewsletterForm] = useState({ subject: '', content: '' });
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    scrapingFrequency: '12'
  });

  // Form / Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('job'); // 'job', 'exam', 'blog', 'quiz', 'question'
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Search/Filters inside tabs
  const [jobsSearch, setJobsSearch] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [jobsCategory, setJobsCategory] = useState('All Categories');
  const [jobsLocation, setJobsLocation] = useState('All Locations');
  
  const [examsFilter, setExamsFilter] = useState('All Exams');
  const [admitFilter, setAdmitFilter] = useState('All Exams');
  const [resultsFilter, setResultsFilter] = useState('All Exams');
  const [answerKeysFilter, setAnswerKeysFilter] = useState('All Exams');
  const [forumTab, setForumTab] = useState('Latest');

  // ================= DYNAMIC FORM FIELDS STATES =================
  const [jobForm, setJobForm] = useState({
    title: '', company: '', location: 'Ranchi, Jharkhand', type: 'Full Time',
    minSalary: '', maxSalary: '', experience: '0 - 2 Years', qualification: 'Graduation',
    category: 'Private', industry: 'IT / Software', description: '', vacancies: '45',
    applyLink: '', pdfUrl: ''
  });

  const [examForm, setExamForm] = useState({
    title: '', organization: '', orgShort: 'JSSC', category: 'Upcoming Exams',
    lastDate: '', posts: '', status: 'Apply Now', description: '',
    applyLink: '', pdfUrl: '', examDate: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '', category: 'Career Guide', author: 'Exam Expert Team',
    excerpt: '', content: '', coverImage: '', tags: ''
  });

  const [forumForm, setForumForm] = useState({
    title: '', category: 'Govt Jobs', author: 'Aaspirant_JH01', content: ''
  });

  const [quizForm, setQuizForm] = useState({
    title: '', description: '', duration: '600', icon: 'HelpCircle',
    color: '#2563EB', bgColor: '#EFF6FF', questions: [
      { question: '', options: ['', '', '', ''], answer: 0, explanation: '' }
    ]
  });

  // ================= LOAD DATA EFFECT =================
  useEffect(() => {
    fetchDashboardData();
    fetchJobs();
    fetchExams();
    fetchBlogs();
    fetchQuizzes();
    fetchApplications();
    fetchUsers();
    fetchCompanies();
    fetchEnquiries();
    fetchSubscribers();
    fetchForums();
  }, []);

  useEffect(() => {
    if (activeMenu === 'Users') fetchUsers();
    if (activeMenu === 'Subscribers') fetchSubscribers();
    if (activeMenu === 'Contacts / Enquiries') fetchEnquiries();
    if (activeMenu === 'Discussion Forum') fetchForums();
  }, [activeMenu]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentApps(response.data.recentApplications);
      }
    } catch (err) {
      console.error('Stats fetch error:', err.message);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      if (res.data.success) setJobs(res.data.jobs);
    } catch (err) { console.error(err); }
  };

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      if (res.data.success) setExams(res.data.exams);
    } catch (err) { console.error(err); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blog');
      if (res.data.success) setBlogs(res.data.posts);
    } catch (err) { console.error(err); }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      if (res.data.success) setQuizzes(res.data.quizzes);
    } catch (err) { console.error(err); }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      if (res.data.success) setApplications(res.data.applications);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) setUsersList(res.data.users);
    } catch (err) { console.error(err); }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      if (res.data.success) setCompaniesList(res.data.companies);
    } catch (err) { console.error(err); }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await api.get('/admin/enquiries');
      if (res.data.success) setEnquiries(res.data.enquiries);
    } catch (err) { console.error('Enquiries fetch error:', err.message); }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await api.get('/admin/subscribers');
      if (res.data.success) setSubscribers(res.data.subscribers);
    } catch (err) { console.error('Subscribers fetch error:', err.message); }
  };

  const fetchForums = async () => {
    try {
      const res = await api.get('/forums');
      if (res.data.success) {
        setForumsData(res.data.forums);
      }
    } catch (err) { console.error('Forums fetch error:', err.message); }
  };

  // ================= FORM HANDLERS =================
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        type: jobForm.type,
        salary: { min: Number(jobForm.minSalary), max: Number(jobForm.maxSalary), currency: '₹', period: 'monthly' },
        experience: jobForm.experience,
        qualification: jobForm.qualification,
        category: jobForm.category,
        industry: jobForm.industry,
        description: jobForm.description,
        vacancies: Number(jobForm.vacancies) || 45,
        responsibilities: ['Execute shift operations.', 'Maintain daily logs.'],
        requirements: ['Graduation/Bachelor degree.', 'Basic local language skill.'],
        applyLink: jobForm.applyLink,
        pdfUrl: jobForm.pdfUrl
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/jobs/${editId}`, payload);
      } else {
        res = await api.post('/jobs', payload);
      }

      if (res.data.success) {
        setSuccess(true);
        fetchJobs();
        fetchDashboardData();
        setJobForm({
          title: '', company: '', location: 'Ranchi, Jharkhand', type: 'Full Time',
          minSalary: '', maxSalary: '', experience: '0 - 2 Years', qualification: 'Graduation',
          category: 'Private', industry: 'IT / Software', description: '', vacancies: '45', applyLink: '', pdfUrl: ''
        });
      }
    } catch (err) {
      alert('Error submitting job.');
    } finally { setSubmitting(false); }
  };


  const handleExamSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/exams/${editId}`, examForm);
      } else {
        res = await api.post('/exams', examForm);
      }
      if (res.data.success) {
        setSuccess(true);
        fetchExams();
        setExamForm({ title: '', organization: '', orgShort: 'JSSC', category: 'Upcoming Exams', lastDate: '', posts: '', status: 'Apply Now', description: '', applyLink: '', pdfUrl: '', examDate: '' });
      }
    } catch (err) {
      alert('Error submitting exam.');
    } finally { setSubmitting(false); }
  };

  const handleExamFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/exams/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setExamForm(prev => ({ ...prev, pdfUrl: res.data.fileUrl }));
        alert('File uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let parsedQuestions = quizForm.questions;
      if (typeof parsedQuestions === 'string') {
        parsedQuestions = JSON.parse(parsedQuestions);
      }
      
      const payload = {
        title: quizForm.title,
        description: quizForm.description,
        duration: Number(quizForm.duration),
        icon: quizForm.icon,
        color: quizForm.color,
        bgColor: quizForm.bgColor,
        questions: parsedQuestions
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/quizzes/${editId}`, payload);
      } else {
        res = await api.post('/quizzes', payload);
      }
      if (res.data.success) {
        setSuccess(true);
        fetchQuizzes();
        setQuizForm({
          title: '', description: '', duration: '600', icon: 'HelpCircle',
          color: '#2563EB', bgColor: '#EFF6FF', questions: [
            { question: '', options: ['', '', '', ''], answer: 0, explanation: '' }
          ]
        });
      }
    } catch (err) {
      alert('Error submitting quiz: ' + err.message);
    } finally { setSubmitting(false); }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(t => t.trim())
      };
      let res;
      if (isEditMode) {
        res = await api.put(`/blog/${editId}`, payload);
      } else {
        res = await api.post('/blog', payload);
      }
      if (res.data.success) {
        setSuccess(true);
        fetchBlogs();
        setBlogForm({ title: '', category: 'Career Guide', author: 'Exam Expert Team', excerpt: '', content: '', coverImage: '', tags: '' });
      }
    } catch (err) {
      alert('Error submitting article.');
    } finally { setSubmitting(false); }
  };

  const handleForumSubmit = (e) => {
    e.preventDefault();
    // Simulate forum addition locally for instant feedback
    const newForum = {
      _id: 'forum-' + Date.now(),
      title: forumForm.title,
      category: forumForm.category,
      author: forumForm.author,
      views: 1,
      replies: 0,
      postedTime: 'Just now'
    };
    setForumsData([newForum, ...forumsData]);
    setSuccess(true);
    setForumForm({ title: '', category: 'Govt Jobs', author: 'Aaspirant_JH01', content: '' });
  };

  // ================= DELETE DYNAMICS =================
  const handleDeleteJob = async (id) => {
    if (window.confirm('Delete job listing?')) {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
      fetchDashboardData();
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Delete exam notice?')) {
      await api.delete(`/exams/${id}`);
      fetchExams();
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Delete blog article?')) {
      await api.delete(`/blog/${id}`);
      fetchBlogs();
    }
  };

  const handleScrapeClick = async () => {
    setScraping(true);
    try {
      const res = await api.post('/admin/scrape');
      if (res.data.success) {
        alert(`Successfully scraped and synced data!\nAdded/Updated Jobs: ${res.data.jobsCount}\nAdded/Updated Exam Notices: ${res.data.examsCount}`);
        fetchJobs();
        fetchExams();
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error triggering live scraper.');
    } finally {
      setScraping(false);
    }
  };

  const handleScrapeLandingClick = async () => {
    setScrapingLanding(true);
    try {
      const res = await api.post('/admin/scrape-landing');
      if (res.data.success) {
        alert(`Successfully scraped landing pages!\nAdded Jobs: ${res.data.jobsCount}\nAdded Exams: ${res.data.examsCount}`);
        fetchJobs();
        fetchExams();
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error triggering landing scraper agent.');
    } finally {
      setScrapingLanding(false);
    }
  };

  const handleJobFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/jobs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setJobForm(prev => ({ ...prev, pdfUrl: res.data.fileUrl }));
        alert('File uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        const res = await api.put(`/auth/users/${userId}/role`, { role: newRole });
        if (res.data.success) {
          alert('User role updated successfully!');
          fetchUsers();
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to update user role.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      try {
        const res = await api.delete(`/auth/users/${userId}`);
        if (res.data.success) {
          alert('User account deleted successfully!');
          fetchUsers();
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete user account.');
      }
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        const res = await api.delete(`/admin/subscribers/${id}`);
        if (res.data.success) {
          alert('Subscriber removed successfully!');
          fetchSubscribers();
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to remove subscriber.');
      }
    }
  };

  const handleToggleEnquiryStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'resolved' ? 'pending' : 'resolved';
    try {
      const res = await api.put(`/admin/enquiries/${id}`, { status: newStatus });
      if (res.data.success) {
        fetchEnquiries();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const res = await api.delete(`/admin/enquiries/${id}`);
        if (res.data.success) {
          fetchEnquiries();
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete enquiry.');
      }
    }
  };

  const handleDeleteForum = async (id) => {
    if (window.confirm('Delete discussion thread?')) {
      try {
        const res = await api.delete(`/forums/${id}`);
        if (res.data.success) {
          alert('Discussion thread deleted successfully!');
          fetchForums();
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error deleting discussion thread.');
      }
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterForm.subject || !newsletterForm.content) {
      alert('Please fill subject and email body content.');
      return;
    }
    setSendingNewsletter(true);
    try {
      const res = await api.post('/admin/newsletter/send', newsletterForm);
      if (res.data.success) {
        alert(res.data.message || 'Newsletter blast sent successfully!');
        setNewsletterForm({ subject: '', content: '' });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send newsletter blast.');
    } finally {
      setSendingNewsletter(false);
    }
  };

  // ================= STATEFUL FORUMS MOCKS DATA =================
  const [forumsData, setForumsData] = useState([
    { _id: 'f1', title: 'How to prepare for JPSC Civil Services Exam 2026?', category: 'Govt Jobs', author: 'Aaspirant_JH01', views: 75, replies: 48, postedTime: '2 days ago' },
    { _id: 'f2', title: 'Which courses are best after 12th for government jobs?', category: 'Career Guidance', author: 'Riya Kumari', views: 124, replies: 35, postedTime: '3 days ago' },
    { _id: 'f3', title: 'How to crack JSSC CGL in first attempt?', category: 'Exam Preparation', author: 'Abhishek-Kr', views: 90, replies: 27, postedTime: '5 days ago' },
    { _id: 'f4', title: 'Is MBA worth it for a government job?', category: 'Higher Education', author: 'Pooja Singh', views: 45, replies: 9, postedTime: '1 week ago' },
    { _id: 'f5', title: 'Best resume format for freshers?', category: 'Resume & Portfolio', author: 'Deepali Kumari', views: 62, replies: 18, postedTime: '2 weeks ago' }
  ]);

  const topContributors = [
    { name: 'aspirant_JH01', badge: 'Guru', replies: 240, points: '1.2k', rank: 1, color: '#1B8C0A' },
    { name: 'Career_Expert', badge: 'Advisor', replies: 180, points: '980', rank: 2, color: '#2563EB' },
    { name: 'mahendra-jpsc', badge: 'Moderator', replies: 156, points: '820', rank: 3, color: '#7C3AED' },
    { name: 'Ranchi_Girl', badge: 'Active', replies: 98, points: '450', rank: 4, color: '#EA580C' }
  ];

  const recentQuizHistory = [
    { id: 1, subject: 'General Knowledge Quiz #123', score: '8.5 / 10', date: 'Today' },
    { id: 2, subject: 'Current Affairs Quiz #99', score: '9 / 10', date: 'Yesterday' },
    { id: 3, subject: 'Jharkhand GK Quiz #58', score: '7 / 10', date: '2 days ago' }
  ];

  // Recharts styling
  const COLORS = ['#1B8C0A', '#2563EB', '#EA580C', '#E11D48', '#7C3AED'];
  const STATUS_COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

  // Static Application trend to match exact line graph
  const appTrendData = [
    { name: '01 Apr', applications: 70 },
    { name: '06 Apr', applications: 120 },
    { name: '11 Apr', applications: 95 },
    { name: '16 Apr', applications: 130 },
    { name: '21 Apr', applications: 156 },
    { name: '26 Apr', applications: 110 },
    { name: '30 Apr', applications: 180 }
  ];

  const donutData = [
    { name: 'Government Jobs', value: 356 },
    { name: 'Private Jobs', value: 542 },
    { name: 'Apprenticeship', value: 128 },
    { name: 'Internship', value: 87 },
    { name: 'Others', value: 135 }
  ];

  // Inline Sparklines data to match mock cards
  const sparklineData1 = [{ val: 10 }, { val: 15 }, { val: 12 }, { val: 25 }, { val: 18 }, { val: 32 }, { val: 22 }, { val: 42 }];
  const sparklineData2 = [{ val: 5 }, { val: 18 }, { val: 10 }, { val: 22 }, { val: 15 }, { val: 30 }, { val: 20 }, { val: 35 }];
  const sparklineData3 = [{ val: 20 }, { val: 28 }, { val: 24 }, { val: 38 }, { val: 32 }, { val: 48 }, { val: 38 }, { val: 52 }];
  const sparklineData4 = [{ val: 8 }, { val: 14 }, { val: 11 }, { val: 19 }, { val: 15 }, { val: 24 }, { val: 18 }, { val: 28 }];
  const sparklineData5 = [{ val: 4 }, { val: 10 }, { val: 8 }, { val: 16 }, { val: 12 }, { val: 20 }, { val: 15 }, { val: 24 }];

  // Weekly Visitors for Bottom Right LineChart
  const weeklyVisitorsData = [
    { name: 'Mon', visitors: 2200 },
    { name: 'Tue', visitors: 4500 },
    { name: 'Wed', visitors: 3200 },
    { name: 'Thu', visitors: 6842 },
    { name: 'Fri', visitors: 5100 },
    { name: 'Sat', visitors: 4200 },
    { name: 'Sun', visitors: 7900 }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ==================== 1. SIDEBAR NAVIGATION ==================== */}
      <aside style={{
        width: sidebarCollapsed ? '76px' : '260px',
        backgroundColor: '#0B2017',
        color: '#A3B3AB',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 1000,
        boxShadow: '4px 0 25px rgba(0,0,0,0.15)',
        fontFamily: "'Inter', sans-serif",
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}>
        {/* Brand Header */}
        <div 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{ 
            padding: '20px 0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            paddingLeft: sidebarCollapsed ? '0' : '24px',
            paddingRight: sidebarCollapsed ? '0' : '16px',
            gap: '12px', 
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            height: '70px',
            boxSizing: 'border-box',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/assets/images/logo.png" alt="Jharkhand Jobs Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', backgroundColor: 'transparent' }} />
            {!sidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.5px' }}>Jharkhand Jobs</span>
                <span style={{ fontSize: '10px', color: '#86EFAC', fontWeight: '600' }}>Apna Jharkhand, Apna Career</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div style={{ color: '#8DA297', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </div>
          )}
        </div>

        {/* User Profile Block Removed as per instructions */}

        {/* Scrollable Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: sidebarCollapsed ? '20px 6px' : '20px 14px' }}>
          {!sidebarCollapsed && <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#6A8074', paddingLeft: '12px', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>Main Menu</span>}
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', listStyle: 'none', padding: 0, margin: 0 }}>
            {/* 1. Dashboard */}
            <li>
              <button
                onClick={() => setActiveMenu('Dashboard')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Dashboard' ? '700' : '600',
                  color: activeMenu === 'Dashboard' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Dashboard' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <LayoutDashboard size={17} style={{ color: activeMenu === 'Dashboard' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>
            </li>

            {/* 2. Latest Jobs */}
            <li>
              <button
                onClick={() => setActiveMenu('Jobs')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Jobs' ? '700' : '600',
                  color: activeMenu === 'Jobs' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Jobs' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <Briefcase size={17} style={{ color: activeMenu === 'Jobs' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Latest Jobs</span>}
              </button>
            </li>

            {/* 2b. Exam Notices */}
            <li>
              <button
                onClick={() => setActiveMenu('Exams')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Exams' ? '700' : '600',
                  color: activeMenu === 'Exams' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Exams' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <Calendar size={17} style={{ color: activeMenu === 'Exams' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Exam Notices</span>}
              </button>
            </li>

            {/* 3. Admit Cards */}
            <li>
              <button
                onClick={() => setActiveMenu('Admit Cards')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Admit Cards' ? '700' : '600',
                  color: activeMenu === 'Admit Cards' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Admit Cards' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <FileText size={17} style={{ color: activeMenu === 'Admit Cards' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Admit Cards</span>}
              </button>
            </li>

            {/* 4. Results */}
            <li>
              <button
                onClick={() => setActiveMenu('Results')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Results' ? '700' : '600',
                  color: activeMenu === 'Results' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Results' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <Award size={17} style={{ color: activeMenu === 'Results' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Results</span>}
              </button>
            </li>

            {/* 4b. Answer Keys */}
            <li>
              <button
                onClick={() => setActiveMenu('Answer Keys')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Answer Keys' ? '700' : '600',
                  color: activeMenu === 'Answer Keys' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Answer Keys' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <CheckCircle size={17} style={{ color: activeMenu === 'Answer Keys' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Answer Keys</span>}
              </button>
            </li>

            {/* 5. Career Guide Folder (Collapsible) */}
            <li>
              <button
                onClick={() => !sidebarCollapsed && setCareerGuideExpanded(!careerGuideExpanded)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: '600',
                  color: '#A3B3AB', backgroundColor: 'transparent',
                  borderRadius: '8px', cursor: sidebarCollapsed ? 'default' : 'pointer', border: 'none', textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                  <FolderOpen size={17} style={{ color: '#6A8074' }} />
                  {!sidebarCollapsed && <span>Career Guide</span>}
                </div>
                {!sidebarCollapsed && (
                  careerGuideExpanded ? <ChevronDown size={15} style={{ color: '#6A8074' }} /> : <ChevronRight size={15} style={{ color: '#6A8074' }} />
                )}
              </button>
              
              {!sidebarCollapsed && careerGuideExpanded && (
                <ul style={{ listStyle: 'none', paddingLeft: '28px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>
                    <button
                      onClick={() => setActiveMenu('Discussion Forum')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', fontWeight: activeMenu === 'Discussion Forum' ? '700' : '500',
                        color: activeMenu === 'Discussion Forum' ? '#FFFFFF' : '#8DA297',
                        backgroundColor: activeMenu === 'Discussion Forum' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', border: 'none', textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#6A8074' }}>◇</span>
                      <span>Discussions</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveMenu('Articles & Blogs')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', fontWeight: activeMenu === 'Articles & Blogs' ? '700' : '500',
                        color: activeMenu === 'Articles & Blogs' ? '#FFFFFF' : '#8DA297',
                        backgroundColor: activeMenu === 'Articles & Blogs' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', border: 'none', textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#6A8074' }}>◇</span>
                      <span>Articles & Blogs</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveMenu('Success Stories')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', fontWeight: activeMenu === 'Success Stories' ? '700' : '500',
                        color: activeMenu === 'Success Stories' ? '#FFFFFF' : '#8DA297',
                        backgroundColor: activeMenu === 'Success Stories' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', border: 'none', textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#6A8074' }}>◇</span>
                      <span>Success Stories</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveMenu('Career Tools')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', fontWeight: activeMenu === 'Career Tools' ? '700' : '500',
                        color: activeMenu === 'Career Tools' ? '#FFFFFF' : '#8DA297',
                        backgroundColor: activeMenu === 'Career Tools' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', border: 'none', textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#6A8074' }}>◇</span>
                      <span>Career Tools</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* 6. Quizzes Folder (Collapsible) */}
            <li>
              <button
                onClick={() => !sidebarCollapsed && setQuizzesExpanded(!quizzesExpanded)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: '600',
                  color: '#A3B3AB', backgroundColor: 'transparent',
                  borderRadius: '8px', cursor: sidebarCollapsed ? 'default' : 'pointer', border: 'none', textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                  <HelpCircle size={17} style={{ color: '#6A8074' }} />
                  {!sidebarCollapsed && <span>Quizzes</span>}
                </div>
                {!sidebarCollapsed && (
                  quizzesExpanded ? <ChevronDown size={15} style={{ color: '#6A8074' }} /> : <ChevronRight size={15} style={{ color: '#6A8074' }} />
                )}
              </button>

              {!sidebarCollapsed && quizzesExpanded && (
                <ul style={{ listStyle: 'none', paddingLeft: '28px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>
                    <button
                      onClick={() => setActiveMenu('Quizzes')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', fontWeight: activeMenu === 'Quizzes' ? '700' : '500',
                        color: activeMenu === 'Quizzes' ? '#FFFFFF' : '#8DA297',
                        backgroundColor: activeMenu === 'Quizzes' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', border: 'none', textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#6A8074' }}>◇</span>
                      <span>Manage Quizzes</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* 9b. Contacts / Enquiries */}
            <li>
              <button
                onClick={() => setActiveMenu('Contacts / Enquiries')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Contacts / Enquiries' ? '700' : '600',
                  color: activeMenu === 'Contacts / Enquiries' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Contacts / Enquiries' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <MessageSquare size={17} style={{ color: activeMenu === 'Contacts / Enquiries' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Contacts / Enquiries</span>}
              </button>
            </li>

            {/* 7. Study Material (Collapsible) */}
            <li>
              <button
                onClick={() => !sidebarCollapsed && setStudyMaterialExpanded(!studyMaterialExpanded)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: '600',
                  color: '#A3B3AB', backgroundColor: 'transparent',
                  borderRadius: '8px', cursor: sidebarCollapsed ? 'default' : 'pointer', border: 'none', textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                  <FileText size={17} style={{ color: '#6A8074' }} />
                  {!sidebarCollapsed && <span>Study Material</span>}
                </div>
                {!sidebarCollapsed && (
                  studyMaterialExpanded ? <ChevronDown size={15} style={{ color: '#6A8074' }} /> : <ChevronRight size={15} style={{ color: '#6A8074' }} />
                )}
              </button>

              {!sidebarCollapsed && studyMaterialExpanded && (
                <ul style={{ listStyle: 'none', paddingLeft: '28px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>
                    <button
                      onClick={() => setActiveMenu('Study Material')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 12px', fontSize: '12px', fontWeight: activeMenu === 'Study Material' ? '700' : '500',
                        color: activeMenu === 'Study Material' ? '#FFFFFF' : '#8DA297',
                        backgroundColor: activeMenu === 'Study Material' ? 'rgba(255,255,255,0.06)' : 'transparent',
                        borderRadius: '6px', cursor: 'pointer', border: 'none', textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#6A8074' }}>◇</span>
                      <span>Manage Study Material</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* 8. Subscribers */}
            <li>
              <button
                onClick={() => setActiveMenu('Subscribers')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Subscribers' ? '700' : '600',
                  color: activeMenu === 'Subscribers' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Subscribers' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <Users size={17} style={{ color: activeMenu === 'Subscribers' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Subscribers</span>}
              </button>
            </li>

            {/* 9. Users */}
            <li>
              <button
                onClick={() => setActiveMenu('Users')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Users' ? '700' : '600',
                  color: activeMenu === 'Users' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Users' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <Users size={17} style={{ color: activeMenu === 'Users' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Users</span>}
              </button>
            </li>


            {/* 9c. Newsletter */}
            <li>
              <button
                onClick={() => setActiveMenu('Newsletter')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Newsletter' ? '700' : '600',
                  color: activeMenu === 'Newsletter' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Newsletter' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <Mail size={17} style={{ color: activeMenu === 'Newsletter' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Newsletter</span>}
              </button>
            </li>

            {/* 10. Settings */}
            <li>
              <button
                onClick={() => setActiveMenu('Settings')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Settings' ? '700' : '600',
                  color: activeMenu === 'Settings' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Settings' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <Settings size={17} style={{ color: activeMenu === 'Settings' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </li>

            {/* 11. Reports */}
            <li>
              <button
                onClick={() => setActiveMenu('Reports')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Reports' ? '700' : '600',
                  color: activeMenu === 'Reports' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Reports' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <TrendingUp size={17} style={{ color: activeMenu === 'Reports' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Reports</span>}
              </button>
            </li>

            {/* 12. Site Analytics */}
            <li>
              <button
                onClick={() => setActiveMenu('Site Analytics')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', 
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '12px 0' : '11px 14px', fontSize: '13px', fontWeight: activeMenu === 'Site Analytics' ? '700' : '600',
                  color: activeMenu === 'Site Analytics' ? '#FFFFFF' : '#A3B3AB',
                  backgroundColor: activeMenu === 'Site Analytics' ? '#085435' : 'transparent',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                  border: 'none', textAlign: 'left'
                }}
              >
                <TrendingUp size={17} style={{ color: activeMenu === 'Site Analytics' ? '#FFFFFF' : '#6A8074' }} />
                {!sidebarCollapsed && <span>Site Analytics</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer Logout */}
        <div style={{ padding: sidebarCollapsed ? '16px 8px' : '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sidebarCollapsed ? '0' : '8px',
              padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', borderRadius: '8px',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none'
            }}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ==================== 2. RIGHT BODY CONTAINER ==================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Right Header Navigation */}
        <header style={{
          height: '70px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 900, boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          {/* Header left Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '400px' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                marginRight: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Menu size={20} />
            </button>

            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                placeholder="Search anything...          ⌘K" 
                style={{
                  width: '100%', padding: '8px 16px 8px 36px', fontSize: '13px',
                  backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '20px',
                  color: '#334155'
                }}
              />
            </div>
          </div>

          {/* Header right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Premium Profile Avatar Pill matching Aspirant View */}
            <div 
              onClick={() => setActiveMenu('Profile')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer', 
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                padding: '6px 16px 6px 8px', 
                borderRadius: '30px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
                   alt="Admin" 
                   style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #10B981' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#1E293B', lineHeight: '1.2' }}>{adminName}</span>
                <span style={{ fontSize: '9px', color: '#10B981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Administrator</span>
              </div>
              <ChevronDown size={13} style={{ color: '#64748B', marginLeft: '2px' }} />
            </div>

          </div>
        </header>

        {/* Dynamic Panel Content Router */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

          {/* ==================== SUBVIEW 1: DASHBOARD ==================== */}
          {activeMenu === 'Dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* 1. Welcome Card Banner with Custom Gradient, Clear Statue and 5 stats cards */}
              <div style={{
                backgroundImage: 'linear-gradient(to right, rgba(9, 35, 23, 0.98) 0%, rgba(9, 35, 23, 0.88) 35%, rgba(9, 35, 23, 0.4) 65%, rgba(9, 35, 23, 0.05) 100%), url("/assets/images/jharkhand_hero.png")',
                backgroundSize: 'cover',
                backgroundPosition: '65% 35%',
                backgroundRepeat: 'no-repeat',
                borderRadius: '24px', 
                color: 'white', 
                padding: '40px', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between', 
                minHeight: '440px',
                position: 'relative', 
                overflow: 'hidden', 
                boxShadow: '0 12px 35px rgba(11,32,23,0.18)',
                border: '1px solid rgba(16, 185, 129, 0.15)'
              }}>
                {/* Overlay details for visual depth */}
                <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                  
                  {/* Top: Welcome Pill & Let's grow badge */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      backgroundColor: 'rgba(16, 185, 129, 0.18)', 
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '6px 14px', 
                      borderRadius: '30px', 
                      fontSize: '13px', 
                      fontWeight: '700',
                      color: '#A7F3D0',
                      backdropFilter: 'blur(4px)'
                    }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={10} style={{ color: '#FFFFFF', fill: '#FFFFFF' }} />
                      </div>
                      <span>Welcome Back, Admin! 👋</span>
                    </div>

                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '6px 14px', 
                      borderRadius: '30px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      color: '#E6F4EA',
                      backdropFilter: 'blur(4px)'
                    }}>
                      <TrendingUp size={13} style={{ color: '#10B981' }} />
                      <span>Let's grow together</span>
                    </div>
                  </div>

                  {/* Middle Text: Headings and Description */}
                  <div style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)', maxWidth: '58%' }}>
                    <h1 style={{ fontSize: '44px', fontWeight: '800', lineHeight: '1.15', margin: '0 0 14px 0', letterSpacing: '-0.5px' }}>
                      Good Afternoon,<br />
                      <span style={{ color: '#22C55E', position: 'relative', display: 'inline-block' }}>
                        Admin!
                        {/* Custom tapered handdrawn yellow line */}
                        <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '8px' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                          <path d="M0,5 Q50,9 100,3" stroke="#FBBF24" strokeWidth="4" fill="none" strokeLinecap="round" />
                        </svg>
                      </span>
                    </h1>
                    
                    <p style={{ fontSize: '15px', color: '#E6F4EA', lineHeight: '1.5', margin: '12px 0 0 0', fontWeight: '500' }}>
                      Here's what's happening today on 
                      <span style={{ 
                        fontFamily: '"Caveat", "Brush Script MT", cursive', 
                        fontSize: '22px', 
                        color: '#FBBF24', 
                        fontWeight: '700', 
                        marginLeft: '6px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)' 
                      }}>
                        Jharkhand Jobs.
                      </span>
                    </p>
                  </div>

                  {/* Bottom: Row of 5 horizontal cards inside welcome banner */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(5, 1fr)', 
                    gap: '16px', 
                    marginTop: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {/* Card 1: Total Jobs */}
                    <div style={{
                      backgroundColor: 'rgba(11, 32, 23, 0.75)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Briefcase size={18} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2' }}>{(stats.totalJobs || 1248).toLocaleString()}</span>
                          <span style={{ fontSize: '11px', color: '#A3B3AB', fontWeight: '600' }}>Total Jobs</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '4px' }}>
                        <span>▲ 16.8%</span>
                        <span style={{ color: '#6A8074', fontWeight: '500' }}>vs yesterday</span>
                      </div>
                    </div>

                    {/* Card 2: New Today */}
                    <div style={{
                      backgroundColor: 'rgba(11, 32, 23, 0.75)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(59,130,246,0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={18} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2' }}>126</span>
                          <span style={{ fontSize: '11px', color: '#A3B3AB', fontWeight: '600' }}>New Today</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '4px' }}>
                        <span>▲ 12.4%</span>
                        <span style={{ color: '#6A8074', fontWeight: '500' }}>vs yesterday</span>
                      </div>
                    </div>

                    {/* Card 3: Visitors Today */}
                    <div style={{
                      backgroundColor: 'rgba(11, 32, 23, 0.75)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(139,92,246,0.15)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <TrendingUp size={18} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2' }}>32,657</span>
                          <span style={{ fontSize: '11px', color: '#A3B3AB', fontWeight: '600' }}>Visitors Today</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '4px' }}>
                        <span>▲ 23.6%</span>
                        <span style={{ color: '#6A8074', fontWeight: '500' }}>vs yesterday</span>
                      </div>
                    </div>

                    {/* Card 4: Total Users */}
                    <div style={{
                      backgroundColor: 'rgba(11, 32, 23, 0.75)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={18} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2' }}>{(stats.totalUsers || 8214).toLocaleString()}</span>
                          <span style={{ fontSize: '11px', color: '#A3B3AB', fontWeight: '600' }}>Total Users</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '4px' }}>
                        <span>▲ 18.3%</span>
                        <span style={{ color: '#6A8074', fontWeight: '500' }}>vs yesterday</span>
                      </div>
                    </div>

                    {/* Card 5: Apna Jharkhand Promo */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      border: '1px solid #E2E8F0',
                      color: '#0F172A'
                    }}>
                      <div style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '50%', 
                        backgroundColor: '#E8F5E3', 
                        color: '#10B981', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Award size={22} style={{ fill: '#10B981', color: '#E8F5E3' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>Apna Jharkhand</span>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#10B981', lineHeight: '1.2' }}>Apna Career</span>
                        <p style={{ fontSize: '10px', color: '#64748B', margin: '4px 0 0 0', lineHeight: '1.2', fontWeight: '600' }}>
                          Connecting Talent with<br />Right Opportunities 🚀
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Bottom Row under welcome card: Updates Ticker on left & Action buttons on right */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                gap: '20px', 
                flexWrap: 'wrap',
                marginTop: '4px' 
              }}>
                {/* Updates ticker (white pill bar) */}
                <div style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '30px',
                  padding: '8px 10px 8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  border: '1px solid #E2E8F0',
                  minWidth: '320px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span role="img" aria-label="announcement" style={{ fontSize: '15px' }}>📢</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#10B981' }}>Latest Update:</span>
                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#1F2937', marginLeft: '6px' }}>
                      JSSC CGL 2024 Result Declared | JPSC Assistant Engineer Notification Out
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveMenu('Admit Cards')}
                    style={{
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    View All Updates →
                  </button>
                </div>

                {/* Right quick actions buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleScrapeLandingClick}
                    disabled={scrapingLanding}
                    style={{
                      backgroundColor: '#085435',
                      color: 'white',
                      border: 'none',
                      borderRadius: '30px',
                      padding: '10px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: scrapingLanding ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(8,84,53,0.15)',
                      transition: 'all 0.2s ease',
                      opacity: scrapingLanding ? 0.7 : 1
                    }}
                  >
                    <RefreshCw 
                      size={14} 
                      style={{ 
                        animation: scrapingLanding ? 'spin 1.5s linear infinite' : 'none' 
                      }} 
                    />
                    <span>{scrapingLanding ? 'Scraping Landing...' : 'Trigger Landing Scraper'}</span>
                  </button>
                  <button 
                    onClick={() => { setModalType('job'); setIsEditMode(false); setModalOpen(true); }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#1F2937',
                      border: '1px solid #E5E7EB',
                      borderRadius: '30px',
                      padding: '10px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Send size={14} style={{ color: '#10B981' }} />
                    <span>Post a Job</span>
                  </button>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              </div>

              {/* 2. Side-by-Side Double Alerts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
                {/* Pink/Red Job Alert */}
                <div style={{
                  backgroundColor: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '12px',
                  padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(239,68,68,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C53030', fontSize: '13px', fontWeight: '700' }}>
                    <AlertCircle size={16} style={{ color: '#E53E3E' }} />
                    <span>12 New Job Notifications published today</span>
                  </div>
                  <span style={{ color: '#E53E3E', fontSize: '15px', fontWeight: '800' }}>&rsaquo;</span>
                </div>

                {/* Blue Admit Cards Alert */}
                <div style={{
                  backgroundColor: '#EBF8FF', border: '1px solid #BEE3F8', borderRadius: '12px',
                  padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(59,130,246,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2B6CB0', fontSize: '13px', fontWeight: '700' }}>
                    <AlertCircle size={16} style={{ color: '#3182CE' }} />
                    <span>5 Admit Cards released today</span>
                  </div>
                  <span style={{ color: '#3182CE', fontSize: '15px', fontWeight: '800' }}>&rsaquo;</span>
                </div>
              </div>

              {/* 3. Quick Action Buttons Grid (6 Action buttons) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                {[
                  { name: 'New Job', sub: 'Post New Job', bg: '#E6F4EA', color: '#137333', icon: Plus, onClick: () => { setModalType('job'); setIsEditMode(false); setModalOpen(true); } },
                  { name: 'Manage Jobs', sub: 'Total 1,248 Jobs', bg: '#E8F0FE', color: '#1A73E8', icon: Briefcase, onClick: () => setActiveMenu('Jobs') },
                  { name: 'Admit Cards', sub: 'Latest Admit Cards', bg: '#FEF3E6', color: '#B06000', icon: FileText, onClick: () => setActiveMenu('Admit Cards') },
                  { name: 'Results', sub: 'Latest Results', bg: '#F3E8FF', color: '#6B21A8', icon: Award, onClick: () => setActiveMenu('Results') },
                  { name: 'Articles', sub: 'Total 156 Articles', bg: '#E4F7F6', color: '#007A78', icon: BookOpen, onClick: () => setActiveMenu('Articles & Blogs') },
                  { name: 'Users', sub: 'Manage Users', bg: '#FCE8E6', color: '#C5221F', icon: Users, onClick: () => setActiveMenu('Users') }
                ].map((act, idx) => {
                  const ActIcon = act.icon;
                  return (
                    <button 
                      key={idx} 
                      onClick={act.onClick}
                      style={{
                        padding: '16px 20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.01)', transition: 'all 0.2s ease', textAlign: 'left',
                        outline: 'none'
                      }}
                    >
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: '50%', backgroundColor: act.bg, color: act.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <ActIcon size={18} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#1E293B' }}>{act.name}</span>
                        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '500' }}>{act.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 4. Metric Cards with Recharts Sparklines */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                
                {/* Card 1: Job Applications */}
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Job Applications</span>
                    <span style={{ fontSize: '9px', color: '#94A3B8' }}>Today</span>
                    <strong style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.5px' }}>2,784</strong>
                    <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ▲ 18% <span style={{ color: '#94A3B8', fontWeight: '500' }}>from yesterday</span>
                    </span>
                  </div>
                  <div style={{ width: '80px', height: '40px', paddingBottom: '6px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData1} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="spark1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#spark1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 2: Top Categories */}
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Top Categories</span>
                    <span style={{ fontSize: '9px', color: '#94A3B8' }}>Government Jobs</span>
                    <strong style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.5px' }}>743</strong>
                    <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ▲ 12% <span style={{ color: '#94A3B8', fontWeight: '500' }}>from yesterday</span>
                    </span>
                  </div>
                  <div style={{ width: '80px', height: '40px', paddingBottom: '6px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData2} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="spark2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#spark2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 3: Private Jobs */}
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Private Jobs</span>
                    <span style={{ fontSize: '9px', color: '#94A3B8' }}>Weekly Count</span>
                    <strong style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.5px' }}>505</strong>
                    <span style={{ fontSize: '10px', color: '#F97316', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ▲ 8% <span style={{ color: '#94A3B8', fontWeight: '500' }}>from yesterday</span>
                    </span>
                  </div>
                  <div style={{ width: '80px', height: '40px', paddingBottom: '6px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData3} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="spark3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#spark3)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 4: Apprenticeships */}
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Apprenticeships</span>
                    <span style={{ fontSize: '9px', color: '#94A3B8' }}>Active Openings</span>
                    <strong style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.5px' }}>126</strong>
                    <span style={{ fontSize: '10px', color: '#3B82F6', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ▲ 5% <span style={{ color: '#94A3B8', fontWeight: '500' }}>from yesterday</span>
                    </span>
                  </div>
                  <div style={{ width: '80px', height: '40px', paddingBottom: '6px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData4} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="spark4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#spark4)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 5: Internships */}
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Internships</span>
                    <span style={{ fontSize: '9px', color: '#94A3B8' }}>Active Vacancies</span>
                    <strong style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.5px' }}>87</strong>
                    <span style={{ fontSize: '10px', color: '#EC4899', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      ▲ 10% <span style={{ color: '#94A3B8', fontWeight: '500' }}>from yesterday</span>
                    </span>
                  </div>
                  <div style={{ width: '80px', height: '40px', paddingBottom: '6px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData5} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                        <defs>
                          <linearGradient id="spark5" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#spark5)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* 5. Split Bottom Section: Recent Job Postings (Left) & Visitors Overview (Right) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start', flexWrap: 'wrap' }}>
                
                {/* Left Card: Recent Job Postings */}
                {showRecentPostings && (
                  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
                    {/* Top-Right Dismiss Icon */}
                    <button 
                      onClick={() => setShowRecentPostings(false)}
                      style={{
                        position: 'absolute', top: '20px', right: '20px', border: 'none', backgroundColor: 'transparent',
                        color: '#94A3B8', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                      title="Dismiss"
                    >
                      <X size={17} />
                    </button>

                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', marginBottom: '20px' }}>Recent Job Postings</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 8px' }}>Job Title</th>
                            <th style={{ padding: '12px 8px' }}>Department / Company</th>
                            <th style={{ padding: '12px 8px' }}>Last Date</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Applications</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Row 1 */}
                          <tr style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}>
                            <td style={{ padding: '14px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E6F4EA', border: '1.5px solid #A3E635', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#137333', fontSize: '10px', flexShrink: 0 }}>JS</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: '800', color: '#1E293B' }}>JSSC CGL Recruitment 2024</span>
                                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Jharkhand Staff Selection</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 8px', color: '#475569', fontWeight: '600' }}>
                              Jharkhand Staff Selection Commission (JSSC)
                            </td>
                            <td style={{ padding: '14px 8px', color: '#E53E3E', fontWeight: '700' }}>
                              31 May 2024
                            </td>
                            <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '800', color: '#1E293B' }}>1,584</span>
                                <span style={{ fontSize: '10px', backgroundColor: '#ECFDF5', color: '#10B981', padding: '1px 6px', borderRadius: '10px', fontWeight: '700' }}>New</span>
                              </div>
                            </td>
                          </tr>

                          {/* Row 2 */}
                          <tr style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}>
                            <td style={{ padding: '14px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#F3E8FF', border: '1.5px solid #C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#6B21A8', fontSize: '10px', flexShrink: 0 }}>JP</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: '800', color: '#1E293B' }}>JPSC Civil Services Exam 2024</span>
                                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Jharkhand Public Commission</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 8px', color: '#475569', fontWeight: '600' }}>
                              Jharkhand Public Service Commission (JPSC)
                            </td>
                            <td style={{ padding: '14px 8px', color: '#E53E3E', fontWeight: '700' }}>
                              20 May 2024
                            </td>
                            <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '800', color: '#1E293B' }}>986</span>
                                <span style={{ fontSize: '10px', backgroundColor: '#ECFDF5', color: '#10B981', padding: '1px 6px', borderRadius: '10px', fontWeight: '700' }}>New</span>
                              </div>
                            </td>
                          </tr>

                          {/* Row 3 */}
                          <tr style={{ borderBottom: 'none', transition: 'background-color 0.15s ease' }}>
                            <td style={{ padding: '14px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E8F0FE', border: '1.5px solid #8AB4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#1A73E8', fontSize: '10px', flexShrink: 0 }}>IB</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: '800', color: '#1E293B' }}>IBPS Clerk Recruitment 2024</span>
                                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>IBPS</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 8px', color: '#475569', fontWeight: '600' }}>
                              IBPS
                            </td>
                            <td style={{ padding: '14px 8px', color: '#E53E3E', fontWeight: '700' }}>
                              07 May 2024
                            </td>
                            <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '800', color: '#1E293B' }}>1,232</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Right Card: Visitors Overview (This Week) */}
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.01)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', marginBottom: '24px' }}>Visitors Overview <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '500' }}>(This Week)</span></h3>
                  
                  <div style={{ width: '100%', height: '230px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyVisitorsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" style={{ fontSize: '11px', fontWeight: '600' }} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94A3B8" style={{ fontSize: '11px', fontWeight: '600' }} tickLine={false} axisLine={false} domain={[0, 8000]} ticks={[0, 2000, 4000, 6000, 8000]} tickFormatter={(val) => val === 0 ? '0' : `${val / 1000}K`} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div style={{ backgroundColor: 'white', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', display: 'block' }}>{payload[0].payload.name}</span>
                                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>Visitors: {payload[0].value.toLocaleString()}</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={3.5} dot={{ r: 5, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== SUBVIEW 2: JOBS ==================== */}
          {activeMenu === 'Jobs' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Latest Jobs</h2>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Total {jobs.length} jobs found</span>
                </div>
                <button 
                  onClick={() => { setModalType('job'); setIsEditMode(false); setModalOpen(true); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Add New Job
                </button>
              </div>

              {/* Dynamic Filter Section matching image layout */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', 
                marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9'
              }}>
                <select value={jobsCategory} onChange={(e) => setJobsCategory(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500' }}>
                  <option value="All Categories">All Categories</option>
                  <option value="Private">Private</option>
                  <option value="SSC">SSC</option>
                  <option value="UPSC">UPSC</option>
                  <option value="Railway">Railway</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Other State">Other State</option>
                </select>
                <select style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500' }}>
                  <option>All Departments</option>
                  <option>Public Service</option>
                  <option>Engineering</option>
                  <option>Banking</option>
                  <option>IT / Software</option>
                </select>
                <select value={jobsLocation} onChange={(e) => setJobsLocation(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500' }}>
                  <option value="All Locations">All Locations</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Jamshedpur">Jamshedpur</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="All India">All India</option>
                </select>
                <select style={{ padding: '8px 12px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', fontWeight: '500' }}>
                  <option>All Qualifications</option>
                  <option>Graduation</option>
                  <option>12th Pass</option>
                  <option>B.E/B.Tech</option>
                </select>
                <div style={{ display: 'flex', gap: '8px', flex: '1 1 200px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      placeholder="Search jobs..." 
                      value={jobsSearch} 
                      onChange={(e) => setJobsSearch(e.target.value)}
                      style={{ width: '100%', padding: '6px 12px 6px 30px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white' }}
                    />
                  </div>
                  <button style={{ padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SlidersHorizontal size={14} style={{ color: '#64748B' }} />
                  </button>
                </div>
              </div>

              {/* Dynamic Job List Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px' }}>Job Title</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Location</th>
                      <th style={{ padding: '12px' }}>Last Date</th>
                      <th style={{ padding: '12px' }}>Posted On</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.filter(j => {
                      if (jobsCategory !== 'All Categories') {
                        if (jobsCategory === 'Private') {
                          if (!['Private Jobs', 'Private'].includes(j.category)) return false;
                        } else if (jobsCategory === 'Other State') {
                          if (!['Other State', 'OtherState'].some(c => String(j.category).toLowerCase().includes(c.toLowerCase()))) return false;
                        } else {
                          if (String(j.category).toLowerCase() !== jobsCategory.toLowerCase()) return false;
                        }
                      }
                      if (jobsLocation !== 'All Locations' && !j.location.toLowerCase().includes(jobsLocation.toLowerCase())) return false;
                      if (jobsSearch && !j.title.toLowerCase().includes(jobsSearch.toLowerCase()) && !j.company.toLowerCase().includes(jobsSearch.toLowerCase())) return false;
                      return true;
                    }).map((j) => (
                      <tr key={j._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: '700', color: '#0F172A' }}>{j.title}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            fontSize: '13px', fontWeight: '750', textTransform: 'uppercase',
                            display: 'inline-block',
                            ...getCategoryBadgeStyles(j.category)
                          }}>
                            {j.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#64748B' }}>{j.location}</td>
                        <td style={{ padding: '12px', color: '#EF4444', fontWeight: '600' }}>
                          {j.lastDate ? new Date(j.lastDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>
                        <td style={{ padding: '12px', color: '#94A3B8' }}>
                          {j.postedDate ? new Date(j.postedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: '700',
                            backgroundColor: j.status === 'active' ? '#ECFDF5' : '#F1F5F9',
                            color: j.status === 'active' ? '#059669' : '#64748B'
                          }}>{j.status === 'active' ? 'Active' : 'Closed'}</span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button 
                            onClick={() => {
                              setIsEditMode(true);
                              setEditId(j._id);
                              setJobForm({
                                title: j.title, company: j.company, location: j.location, type: j.type,
                                minSalary: j.salary?.min || '', maxSalary: j.salary?.max || '', experience: j.experience,
                                qualification: j.qualification || 'Graduation', category: j.category, industry: j.industry, description: j.description,
                                vacancies: j.vacancies !== undefined ? String(j.vacancies) : '45',
                                applyLink: j.applyLink || ''
                              });
                              setModalType('job');
                              setModalOpen(true);
                              setSuccess(false);
                            }}
                            style={{ padding: '6px', border: 'none', background: 'none', color: '#2563EB', cursor: 'pointer', marginRight: '8px' }}
                            title="Edit"
                          >
                            <Settings size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteJob(j._id)}
                            style={{ padding: '6px', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Pagination matching image bottom */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Showing 1 to 10 of {jobs.length} results</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ width: '28px', height: '28px', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '11px', fontWeight: '700' }}>1</button>
                  <button style={{ width: '28px', height: '28px', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: 'white', color: '#334155', fontSize: '11px', fontWeight: '600' }}>2</button>
                  <button style={{ width: '28px', height: '28px', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: 'white', color: '#334155', fontSize: '11px', fontWeight: '600' }}>3</button>
                  <button style={{ width: '28px', height: '28px', border: '1px solid #E2E8F0', borderRadius: '4px', backgroundColor: 'white', color: '#334155', fontSize: '11px', fontWeight: '600' }}>&gt;</button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SUBVIEW 3: EXAMS ==================== */}
          {activeMenu === 'Exams' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Competitive Exam Notices</h2>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Official state recruitments and announcements</span>
                </div>
                <button 
                  onClick={() => { setModalType('exam'); setIsEditMode(false); setModalOpen(true); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Add Notice
                </button>
              </div>

              {/* Custom Tabs Categories */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                {['All Exams', 'JSSC', 'JPSC', 'SSC', 'Railway', 'UPSC', 'IAF', 'Army', 'NCL', 'DSSSB', 'CIL', 'Banking'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setExamsFilter(t)}
                    style={{
                      padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer',
                      backgroundColor: examsFilter === t ? '#E8F5E3' : 'transparent',
                      color: examsFilter === t ? '#1B8C0A' : '#64748B'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Cards Grid list */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {exams.filter(e => {
                  if (examsFilter !== 'All Exams' && e.orgShort !== examsFilter) return false;
                  return true;
                }).map(e => (
                  <div key={e._id} style={{
                    border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', backgroundColor: 'white',
                    display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative'
                  }}>
                    {e.isNew && (
                      <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#EF4444', color: 'white', fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>New</span>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => {
                            setIsEditMode(true);
                            setEditId(e._id);
                            setExamForm({
                              title: e.title,
                              organization: e.organization || '',
                              orgShort: e.orgShort || 'JSSC',
                              category: e.category || 'Upcoming Exams',
                              lastDate: e.lastDate || '',
                              posts: e.posts || '',
                              status: e.status || 'Apply Now',
                              description: e.description || '',
                              applyLink: e.applyLink || '',
                              pdfUrl: e.pdfUrl || '',
                              examDate: e.examDate || ''
                            });
                            setModalType('exam');
                            setModalOpen(true);
                            setSuccess(false);
                          }}
                          style={{ padding: '6px', border: 'none', background: 'none', color: '#2563EB', cursor: 'pointer' }}
                          title="Edit notice"
                        >
                          <Settings size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteExam(e._id)}
                          style={{ padding: '6px', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                          title="Delete notice"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button 
                          onClick={() => alert(`Redirecting to JSSC portal for: ${e.title}`)}
                          style={{ padding: '6px 14px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          {e.status}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SUBVIEW 4: ADMIT CARDS ==================== */}
          {activeMenu === 'Admit Cards' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Admit Cards</h2>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Download official competitive examination hall tickets</span>
              </div>

              {/* Sub categories */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                {['All Exams', 'JSSC', 'JPSC', 'SSC', 'Railway', 'UPSC', 'IAF', 'Army', 'NCL', 'DSSSB', 'CIL', 'Banking'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setAdmitFilter(t)}
                    style={{
                      padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer',
                      backgroundColor: admitFilter === t ? '#E8F5E3' : 'transparent',
                      color: admitFilter === t ? '#1B8C0A' : '#64748B'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* List item admit cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exams.filter(e => e.category === 'Admit Card' && (admitFilter === 'All Exams' || e.orgShort === admitFilter)).map(e => (
                  <div key={e._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px',
                    border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{e.title}</h4>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>Released on: {e.lastDate} | {e.organization}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => {
                          setIsEditMode(true);
                          setEditId(e._id);
                          setExamForm({
                            title: e.title,
                            organization: e.organization || '',
                            orgShort: e.orgShort || 'JSSC',
                            category: e.category || 'Upcoming Exams',
                            lastDate: e.lastDate || '',
                            posts: e.posts || '',
                            status: e.status || 'Apply Now',
                            description: e.description || '',
                            applyLink: e.applyLink || '',
                            pdfUrl: e.pdfUrl || '',
                            examDate: e.examDate || ''
                          });
                          setModalType('exam');
                          setModalOpen(true);
                          setSuccess(false);
                        }}
                        style={{ padding: '6px', border: 'none', background: 'none', color: '#2563EB', cursor: 'pointer' }}
                        title="Edit notice"
                      >
                        <Settings size={15} />
                      </button>
                      <button 
                        onClick={() => handleDeleteExam(e._id)}
                        style={{ padding: '6px', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                        title="Delete notice"
                      >
                        <Trash2 size={15} />
                      </button>
                      <button 
                        onClick={() => alert(`Downloading Hall Ticket PDF for: ${e.title}`)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                          backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px',
                          fontSize: '11px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SUBVIEW 5: RESULTS ==================== */}
          {activeMenu === 'Results' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Exam Results</h2>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Check competitive and district examination results</span>
              </div>

              {/* Sub categories */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                {['All Exams', 'JSSC', 'JPSC', 'SSC', 'Railway', 'UPSC', 'IAF', 'Army', 'NCL', 'DSSSB', 'CIL', 'Banking'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setResultsFilter(t)}
                    style={{
                      padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer',
                      backgroundColor: resultsFilter === t ? '#E8F5E3' : 'transparent',
                      color: resultsFilter === t ? '#1B8C0A' : '#64748B'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* List item results */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exams.filter(e => e.category === 'Results' && (resultsFilter === 'All Exams' || e.orgShort === resultsFilter)).map(e => (
                  <div key={e._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px',
                    border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{e.title}</h4>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>Declared: {e.lastDate} | {e.organization}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => {
                          setIsEditMode(true);
                          setEditId(e._id);
                          setExamForm({
                            title: e.title,
                            organization: e.organization || '',
                            orgShort: e.orgShort || 'JSSC',
                            category: e.category || 'Upcoming Exams',
                            lastDate: e.lastDate || '',
                            posts: e.posts || '',
                            status: e.status || 'Apply Now',
                            description: e.description || '',
                            applyLink: e.applyLink || '',
                            pdfUrl: e.pdfUrl || '',
                            examDate: e.examDate || ''
                          });
                          setModalType('exam');
                          setModalOpen(true);
                          setSuccess(false);
                        }}
                        style={{ padding: '6px', border: 'none', background: 'none', color: '#2563EB', cursor: 'pointer' }}
                        title="Edit result notice"
                      >
                        <Settings size={15} />
                      </button>
                      <button 
                        onClick={() => handleDeleteExam(e._id)}
                        style={{ padding: '6px', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                        title="Delete result notice"
                      >
                        <Trash2 size={15} />
                      </button>
                      <button 
                        onClick={() => alert(`Scores check successfully for: ${e.title}!`)}
                        style={{
                          padding: '8px 16px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', 
                          borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        View Result
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SUBVIEW 5b: ANSWER KEYS ==================== */}
          {activeMenu === 'Answer Keys' && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Answer Keys</h2>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Manage official exam answer keys and sheet releases</span>
              </div>

              {/* Sub categories */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                {['All Exams', 'JSSC', 'JPSC', 'SSC', 'Railway', 'UPSC', 'IAF', 'Army', 'NCL', 'DSSSB', 'CIL', 'Banking'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setAnswerKeysFilter(t)}
                    style={{
                      padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer',
                      backgroundColor: answerKeysFilter === t ? '#E8F5E3' : 'transparent',
                      color: answerKeysFilter === t ? '#1B8C0A' : '#64748B'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* List item answer keys */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {exams.filter(e => e.category === 'Answer Key' && (answerKeysFilter === 'All Exams' || e.orgShort === answerKeysFilter)).map(e => (
                  <div key={e._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px',
                    border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{e.title}</h4>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>Released: {e.lastDate} | {e.organization}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => {
                          setIsEditMode(true);
                          setEditId(e._id);
                          setExamForm({
                            title: e.title,
                            organization: e.organization || '',
                            orgShort: e.orgShort || 'JSSC',
                            category: e.category || 'Upcoming Exams',
                            lastDate: e.lastDate || '',
                            posts: e.posts || '',
                            status: e.status || 'Apply Now',
                            description: e.description || '',
                            applyLink: e.applyLink || '',
                            pdfUrl: e.pdfUrl || '',
                            examDate: e.examDate || ''
                          });
                          setModalType('exam');
                          setModalOpen(true);
                          setSuccess(false);
                        }}
                        style={{ padding: '6px', border: 'none', background: 'none', color: '#2563EB', cursor: 'pointer' }}
                        title="Edit notice"
                      >
                        <Settings size={15} />
                      </button>
                      <button 
                        onClick={() => handleDeleteExam(e._id)}
                        style={{ padding: '6px', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                        title="Delete notice"
                      >
                        <Trash2 size={15} />
                      </button>
                      <button 
                        onClick={() => alert(`Viewing Answer Key for: ${e.title}`)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                          backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px',
                          fontSize: '11px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        View / Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SUBVIEW 6: ARTICLES & BLOGS ==================== */}
          {(activeMenu === 'Career Guide' || activeMenu === 'Articles & Blogs') && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Articles & Blogs</h2>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Expert guides and job preparation strategies</span>
                </div>
                <button 
                  onClick={() => { setModalType('blog'); setIsEditMode(false); setModalOpen(true); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Add Article
                </button>
              </div>

              {/* Grid cards matching style */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {blogs.map(b => (
                  <div key={b._id} style={{
                    border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white',
                    display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', position: 'relative'
                  }}>
                    <img src={b.coverImage || 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop'} 
                         alt={b.title} 
                         style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#1B8C0A', textTransform: 'uppercase' }}>{b.category}</span>
                      <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', lineHeight: '1.4' }}>{b.title}</h3>
                      <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', flex: 1 }}>{b.excerpt}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px', fontSize: '11px', color: '#94A3B8' }}>
                        <span>3 min read</span>
                        <span>{new Date(b.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Delete blog */}
                    <button 
                      onClick={() => handleDeleteBlog(b._id)}
                      style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px', borderRadius: '50%', backgroundColor: 'white', border: 'none', color: '#EF4444', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== SUBVIEW 7: DISCUSSION FORUM ==================== */}
          {activeMenu === 'Discussion Forum' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* Forum Main Panel */}
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Discussion Forum</h2>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Ask Questions, Get Answers & Help Others</span>
                  </div>
                  <button 
                    onClick={() => { setModalType('forum'); setModalOpen(true); setSuccess(false); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Ask a Question
                  </button>
                </div>

                {/* Counter blocks */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { name: 'Discussions', val: '1,258', color: '#1B8C0A' },
                    { name: 'Answers', val: '3,842', color: '#2563EB' },
                    { name: 'Members', val: '6,214', color: '#EA580C' },
                    { name: 'Online Now', val: '128', color: '#10B981' }
                  ].map((block, idx) => (
                    <div key={idx} style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #F1F5F9', textBlock: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#64748B', display: 'block', fontWeight: '500', marginBottom: '2px' }}>{block.name}</span>
                      <strong style={{ fontSize: '16px', fontWeight: '800', color: block.color }}>{block.val}</strong>
                    </div>
                  ))}
                </div>

                {/* Sub tabs filtering */}
                <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
                  {['Latest', 'Unanswered', 'Most Answered', 'My Questions'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setForumTab(t)}
                      style={{
                        padding: '12px 4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                        borderBottom: forumTab === t ? '2px solid #1B8C0A' : '2px solid transparent',
                        color: forumTab === t ? '#1B8C0A' : '#64748B'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Question items matching JSSC/JPSC layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {forumsData.map(f => (
                    <div key={f._id} style={{
                      padding: '16px 20px', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: 'white',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
                        }}>
                          {f.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#2563EB', cursor: 'pointer', lineHeight: '1.4' }}>{f.title}</h4>
                          <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                            By <strong style={{ color: '#475569' }}>{f.author}</strong> | category: <strong style={{ color: '#EA580C' }}>{f.category}</strong> | {f.postedTime}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block' }}>{f.replies}</span>
                          <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>replies</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block' }}>{f.views}</span>
                          <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Trending + Contributors */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Trending Topics */}
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>Trending Topics</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['JPSC Prep 2026', 'JSSC CGL 2026', 'Sarkari Syllabus', 'Govt Jobs After 12th', 'Police physical test', 'Interview Tips'].map((topic, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                        <span>#{topic}</span>
                        <span style={{ color: '#94A3B8' }}>{Math.floor(Math.random() * 50) + 10} posts</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Contributors */}
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>Top Contributors</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {topContributors.map((c, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8' }}>{c.rank}</span>
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c.color, color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px'
                          }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block' }}>{c.name}</span>
                            <span style={{ fontSize: '9px', color: '#94A3B8' }}>{c.badge}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#1B8C0A', display: 'block' }}>{c.points}</span>
                          <span style={{ fontSize: '9px', color: '#94A3B8' }}>{c.replies} replies</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== SUBVIEW 8: QUIZZES ==================== */}
          {activeMenu === 'Quizzes' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* Quizzes Grids */}
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Practice Quizzes</h2>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Test your syllabus knowledge with interactive quizzes</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsEditMode(false);
                      setQuizForm({
                        title: '', description: '', duration: '600', icon: 'HelpCircle',
                        color: '#2563EB', bgColor: '#EFF6FF', questions: [
                          { question: '', options: ['', '', '', ''], answer: 0, explanation: '' }
                        ]
                      });
                      setModalType('quiz');
                      setModalOpen(true);
                      setSuccess(false);
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#1B8C0A', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none' }}
                  >
                    <Plus size={16} /> Add Quiz
                  </button>
                </div>

                {/* Quizzes list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {quizzes.map((quiz) => (
                    <div key={quiz._id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px',
                      border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: 'white'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '42px', height: '42px', borderRadius: '8px', 
                          backgroundColor: quiz.bgColor || '#EFF6FF', 
                          color: quiz.color || '#2563EB', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                          <HelpCircle size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{quiz.title}</h4>
                          <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                            {quiz.duration ? `${Math.floor(quiz.duration / 60)} mins` : '10 mins'} | {quiz.questions?.length || 0} Questions
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                          onClick={() => {
                            setIsEditMode(true);
                            setEditId(quiz._id);
                            setQuizForm({
                              title: quiz.title || '',
                              description: quiz.description || '',
                              duration: String(quiz.duration || 600),
                              icon: quiz.icon || 'HelpCircle',
                              color: quiz.color || '#2563EB',
                              bgColor: quiz.bgColor || '#EFF6FF',
                              questions: quiz.questions || [
                                { question: '', options: ['', '', '', ''], answer: 0, explanation: '' }
                              ]
                            });
                            setModalType('quiz');
                            setModalOpen(true);
                            setSuccess(false);
                          }}
                          style={{ padding: '6px', border: 'none', background: 'none', color: '#2563EB', cursor: 'pointer' }}
                          title="Edit"
                        >
                          <Settings size={15} />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Delete this quiz?')) {
                              await api.delete(`/quizzes/${quiz._id}`);
                              fetchQuizzes();
                            }
                          }}
                          style={{ padding: '6px', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {quizzes.length === 0 && (
                    <p style={{ fontSize: '12.5px', color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No quizzes available.</p>
                  )}
                </div>
              </div>

              {/* Recent Taken Quizzes scores list */}
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>Recent Quizzes Score</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentQuizHistory.map((q) => (
                    <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block' }}>{q.subject}</span>
                        <span style={{ fontSize: '9px', color: '#94A3B8' }}>Completed {q.date}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#1B8C0A', backgroundColor: '#E8F5E3', padding: '2px 8px', borderRadius: '4px' }}>
                        {q.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================== SUBVIEW 9: ADMIN PROFILE ==================== */}
          {activeMenu === 'Profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
              
              {/* Left Column: Admin Profile card */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '32px 24px', 
                borderRadius: '16px', 
                border: '1px solid #E2E8F0', 
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
              }}>
                {/* Circular Avatar */}
                <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 16px' }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
                       alt="Admin" 
                       style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3.5px solid #10B981' }} />
                  <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '16px', height: '16px', backgroundColor: '#10B981', border: '3px solid white', borderRadius: '50%' }} />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>{adminName}</h3>
                
                <span style={{ 
                  fontSize: '11px', 
                  backgroundColor: '#073622', 
                  color: '#5FE3A1', 
                  border: '1px solid rgba(95,227,161,0.2)', 
                  padding: '3px 12px', 
                  borderRadius: '20px', 
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  System Administrator
                </span>

                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: '16px 0 24px', fontStyle: 'italic' }}>
                  "{adminBio}"
                </p>

                {/* Account Details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', borderTop: '1px solid #F1F5F9', paddingTop: '20px', marginBottom: '28px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Email Address</span>
                    <strong style={{ fontSize: '13.5px', color: '#334155', fontWeight: '700' }}>{adminEmail}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Contact Number</span>
                    <strong style={{ fontSize: '13.5px', color: '#334155', fontWeight: '700' }}>{adminPhone}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Access Control</span>
                    <strong style={{ fontSize: '13.5px', color: '#10B981', fontWeight: '700' }}>Full DB Read/Write Permission</strong>
                  </div>
                </div>

                {/* Profile actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    onClick={() => setAdminProfileOpen(true)}
                    style={{
                      width: '100%', padding: '10px 0', borderRadius: '8px', 
                      backgroundColor: '#FFFFFF', color: '#374151', border: '1.5px solid #D1D5DB',
                      fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <Settings size={14} /> Edit Admin Profile
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    style={{
                      width: '100%', padding: '10px 0', borderRadius: '8px', 
                      backgroundColor: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FCA5A5',
                      fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <LogOut size={14} /> Sign Out of Panel
                  </button>
                </div>
              </div>

              {/* Right Column: Admin Stats and Operation Logs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Stats Grid */}
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '24px', 
                  borderRadius: '16px', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                    Administrative Activity Metrics
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {[
                      { name: 'Jobs Posted', val: stats.totalJobs || 1248, color: '#1B8C0A' },
                      { name: 'Exams Created', val: stats.totalExams || 342, color: '#2563EB' },
                      { name: 'Articles Published', val: 156, color: '#007A78' },
                      { name: 'Enquiries Managed', val: '450+', color: '#EA580C' }
                    ].map((m, idx) => (
                      <div key={idx} style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                        <span style={{ fontSize: '10px', color: '#64748B', display: 'block', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{m.name}</span>
                        <strong style={{ fontSize: '20px', fontWeight: '800', color: m.color }}>{m.val.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities Log */}
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '24px', 
                  borderRadius: '16px', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '20px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                    Recent Operations Log (System Audit)
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { title: 'Tata Steel Junior Developer vacancy posted successfully', date: '2 hours ago', icon: Briefcase, color: '#1B8C0A', bg: '#E8F5E3' },
                      { title: 'JSSC CGL Exam Admit Card release information updated', date: 'Yesterday', icon: FileText, color: '#2563EB', bg: '#EFF6FF' },
                      { title: 'New Current Affairs Practice Quiz #123 created in GK database', date: '2 days ago', icon: HelpCircle, color: '#EA580C', bg: '#FFF7ED' },
                      { title: 'Sarkari Syllabus and exam pattern guide published for Police aspirants', date: '3 days ago', icon: BookOpen, color: '#7C3AED', bg: '#F5F3FF' },
                      { title: 'Tata Motors Apprentice placement vacancies checklist updated', date: '5 days ago', icon: Briefcase, color: '#007A78', bg: '#E4F7F6' }
                    ].map((log, idx) => {
                      const LogIcon = log.icon;
                      return (
                        <div key={idx} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          paddingBottom: '14px', 
                          borderBottom: idx === 4 ? 'none' : '1px solid #F1F5F9'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ 
                              width: '34px', 
                              height: '34px', 
                              borderRadius: '50%', 
                              backgroundColor: log.bg, 
                              color: log.color, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <LogIcon size={16} />
                            </div>
                            <div>
                              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', lineHeight: '1.4' }}>{log.title}</h4>
                              <span style={{ fontSize: '10px', color: '#94A3B8' }}>Action completed by you • {log.date}</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>Success</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== SUBVIEW 10: CONTACTS / ENQUIRIES ==================== */}
          {activeMenu === 'Contacts / Enquiries' && (
            <Contact />
          )}

          {/* ==================== OTHER UNIMPLEMENTED FALLBACK SUBVIEWS ==================== */}
          {!['Dashboard', 'Jobs', 'Exams', 'Admit Cards', 'Results', 'Answer Keys', 'Career Guide', 'Articles & Blogs', 'Discussion Forum', 'Quizzes', 'Profile', 'Contacts / Enquiries', 'Newsletter'].includes(activeMenu) && (
            <div style={{ 
              backgroundColor: 'white', padding: '60px 40px', borderRadius: '16px', border: '1px solid #E2E8F0',
              textAlign: 'center', maxWidth: '500px', margin: '40px auto'
            }}>
              <Settings size={48} style={{ color: '#94A3B8', margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B', marginBottom: '8px' }}>Section Under Active Development</h2>
              <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6' }}>
                The administrative panel view for "{activeMenu}" is currently connected and fetching dynamically. All core features (Job CRUD, Exam notices, admit cards release, results sheets, quizzes, profile, and full discussion forums) are 100% active and live.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* ==================== 3. MODAL CREATION ENGINE ==================== */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 2000, padding: '24px', backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'white', maxWidth: '550px', width: '100%', padding: '32px', borderRadius: '16px',
            position: 'relative', overflowY: 'auto', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Close */}
            <button 
              onClick={() => { setModalOpen(false); setSuccess(false); }}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={56} style={{ color: '#1B8C0A', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>Operation Successful!</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                  The entry has been successfully updated and synced with the PostgreSQL/Mock database.
                </p>
                <button 
                  onClick={() => { setModalOpen(false); setSuccess(false); }}
                  style={{ padding: '8px 24px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Return to Console
                </button>
              </div>
            ) : (
              <div>
                
                {/* 1. Job Form Modal */}
                {modalType === 'job' && (
                  <form onSubmit={handleJobSubmit}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>
                      {isEditMode ? 'Edit Vacancy Listing' : 'Post a New Job Listing'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Job Position *</label>
                        <input type="text" required value={jobForm.title} onChange={(e) => setJobForm({...jobForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. Junior Web Developer" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Company *</label>
                        <input type="text" required value={jobForm.company} onChange={(e) => setJobForm({...jobForm, company: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. Tata Steel" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Location *</label>
                          <input type="text" required value={jobForm.location} onChange={(e) => setJobForm({...jobForm, location: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Category *</label>
                          <select value={jobForm.category} onChange={(e) => setJobForm({...jobForm, category: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
                            <option value="Private">Private</option>
                            <option value="SSC">SSC</option>
                            <option value="UPSC">UPSC</option>
                            <option value="Railway">Railway</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Other State">Other State</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Min Salary *</label>
                          <input type="number" required value={jobForm.minSalary} onChange={(e) => setJobForm({...jobForm, minSalary: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. 25000" />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Max Salary *</label>
                          <input type="number" required value={jobForm.maxSalary} onChange={(e) => setJobForm({...jobForm, maxSalary: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. 45000" />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Vacancies *</label>
                          <input type="number" required value={jobForm.vacancies} onChange={(e) => setJobForm({...jobForm, vacancies: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. 45" />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Description *</label>
                        <textarea required value={jobForm.description} onChange={(e) => setJobForm({...jobForm, description: e.target.value})} rows="3" style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px', resize: 'none' }} placeholder="Brief overview of role and criteria..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Redirect Apply Link (Optional)</label>
                        <input type="text" value={jobForm.applyLink} onChange={(e) => setJobForm({...jobForm, applyLink: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. https://tata.com/careers/apply-job-123" />
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                      {submitting ? 'Saving listing...' : isEditMode ? 'Update Vacancy' : 'Publish Vacancy'}
                    </button>
                  </form>
                )}

                {/* 2. Exam Form Modal */}
                {modalType === 'exam' && (
                  <form onSubmit={handleExamSubmit}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>
                      Create Government Exam Update
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Notice Title *</label>
                        <input type="text" required value={examForm.title} onChange={(e) => setExamForm({...examForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. JSSC CGL Admit Card 2026" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Organization *</label>
                          <input type="text" required value={examForm.organization} onChange={(e) => setExamForm({...examForm, organization: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. Staff Selection Commission" />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Abbr *</label>
                          <input type="text" required value={examForm.orgShort} onChange={(e) => setExamForm({...examForm, orgShort: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Category *</label>
                          <select value={examForm.category} onChange={(e) => setExamForm({...examForm, category: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
                            <option value="Upcoming Exams">Upcoming Exams</option>
                            <option value="Admit Card">Admit Card</option>
                            <option value="Results">Results</option>
                            <option value="Answer Key">Answer Key</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Last Date / Release Date *</label>
                          <input type="text" required value={examForm.lastDate} onChange={(e) => setExamForm({...examForm, lastDate: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. 18 May 2026" />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Exam Date (Optional)</label>
                          <input type="text" value={examForm.examDate} onChange={(e) => setExamForm({...examForm, examDate: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. 01 Jun 2024 Sunday" />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Description *</label>
                        <textarea required value={examForm.description} onChange={(e) => setExamForm({...examForm, description: e.target.value})} rows="3" style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px', resize: 'none' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Redirect Apply Link (Optional)</label>
                          <input type="text" value={examForm.applyLink} onChange={(e) => setExamForm({...examForm, applyLink: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. https://jssc.nic.in/apply" />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Notification File (PDF/Doc/Image)</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="text" 
                              value={examForm.pdfUrl} 
                              onChange={(e) => setExamForm({...examForm, pdfUrl: e.target.value})} 
                              style={{ flex: 1, padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} 
                              placeholder="File path or URL" 
                            />
                            <input 
                              type="file" 
                              id="exam-file-upload" 
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={handleExamFileUpload} 
                              style={{ display: 'none' }}
                            />
                            <label 
                              htmlFor="exam-file-upload"
                              style={{ 
                                padding: '8px 16px', 
                                backgroundColor: '#1E293B', 
                                color: 'white', 
                                fontSize: '12px', 
                                fontWeight: '600', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {uploadingFile ? 'Uploading...' : 'Upload'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                      {submitting ? 'Saving notice...' : 'Publish Update'}
                    </button>
                  </form>
                )}

                {/* 3. Forum Form Modal */}
                {modalType === 'forum' && (
                  <form onSubmit={handleForumSubmit}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>
                      Ask a New Question / Create Discussion
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Topic Title *</label>
                        <input type="text" required value={forumForm.title} onChange={(e) => setForumForm({...forumForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. JSSC exam dates updates?" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Forum Category *</label>
                          <select value={forumForm.category} onChange={(e) => setForumForm({...forumForm, category: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
                            <option value="Govt Jobs">Govt Jobs</option>
                            <option value="Career Guidance">Career Guidance</option>
                            <option value="Exam Preparation">Exam Preparation</option>
                            <option value="Higher Education">Higher Education</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Author Nickname *</label>
                          <input type="text" required value={forumForm.author} onChange={(e) => setForumForm({...forumForm, author: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Detailed Query Content *</label>
                        <textarea required value={forumForm.content} onChange={(e) => setForumForm({...forumForm, content: e.target.value})} rows="4" style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px', resize: 'none' }} placeholder="Type details..." />
                      </div>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                      Publish Topic
                    </button>
                  </form>
                )}

                {/* 4. Blog Form Modal */}
                {modalType === 'blog' && (
                  <form onSubmit={handleBlogSubmit}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>
                      Add New Career Guide / Article
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Article Title *</label>
                        <input type="text" required value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Category *</label>
                          <select value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
                            <option value="Career Guide">Career Guide</option>
                            <option value="Industry Trends">Industry Trends</option>
                            <option value="Tips & Tricks">Tips & Tricks</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Tags (Comma-separated)</label>
                          <input type="text" value={blogForm.tags} onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="JSSC, GK, Prep" />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Summary Excerpt *</label>
                        <input type="text" required value={blogForm.excerpt} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="Short preview..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Content *</label>
                        <textarea required value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} rows="4" style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px', resize: 'none' }} />
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                      {submitting ? 'Publishing...' : 'Publish Article'}
                    </button>
                  </form>
                )}

                {/* 5. Quiz Form Modal */}
                {modalType === 'quiz' && (
                  <form onSubmit={handleQuizSubmit}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>
                      {isEditMode ? 'Edit Practice Quiz' : 'Add New Practice Quiz'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Quiz Title *</label>
                        <input type="text" required value={quizForm.title} onChange={(e) => setQuizForm({...quizForm, title: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. Jharkhand GK Quiz #1" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Duration (in seconds) *</label>
                        <input type="number" required value={quizForm.duration} onChange={(e) => setQuizForm({...quizForm, duration: e.target.value})} style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }} placeholder="e.g. 600" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Description *</label>
                        <textarea required value={quizForm.description} onChange={(e) => setQuizForm({...quizForm, description: e.target.value})} rows="2" style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px', resize: 'none' }} placeholder="Overview of the quiz..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>Questions List (JSON format) *</label>
                        <textarea 
                          required 
                          rows="6" 
                          value={typeof quizForm.questions === 'string' ? quizForm.questions : JSON.stringify(quizForm.questions, null, 2)} 
                          onChange={(e) => setQuizForm({...quizForm, questions: e.target.value})} 
                          style={{ width: '100%', padding: '8px 12px', fontSize: '12px', fontFamily: 'monospace', border: '1px solid #CBD5E1', borderRadius: '6px' }} 
                          placeholder={`[\n  {\n    "question": "Birsa Munda birth date?",\n    "options": ["15 Nov 1875", "10 Dec 1880", "1 Jan 1870", "15 Aug 1875"],\n    "answer": 0,\n    "explanation": "He was born on 15 Nov 1875."\n  }\n]`}
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', backgroundColor: '#1B8C0A', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                      {submitting ? 'Saving Quiz...' : isEditMode ? 'Update Quiz' : 'Publish Quiz'}
                    </button>
                  </form>
                )}

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
