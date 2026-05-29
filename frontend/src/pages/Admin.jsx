import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, PlusCircle, Briefcase, FileText, Building, Users, Calendar, Settings, X, Plus, Trash2, CheckCircle, AlertCircle, File, Bell, TrendingUp, LogOut, ChevronDown, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Dashboard Stats States
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic Content Data States
  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Modal Control States
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Selected sidebar option state
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Unified lists states for unlocked sections
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);

  // ================= FORM FIELDS STATES =================

  // 1. Job Modal Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Ranchi');
  const [type, setType] = useState('Full Time');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [experience, setExperience] = useState('0 - 2 Years');
  const [category, setCategory] = useState('Private Jobs');
  const [industry, setIndustry] = useState('IT / Software');
  const [description, setDescription] = useState('');

  // 2. Exam Modal Form State
  const [examTitle, setExamTitle] = useState('');
  const [examOrg, setExamOrg] = useState('');
  const [examOrgShort, setExamOrgShort] = useState('JSSC');
  const [examCategory, setExamCategory] = useState('Upcoming Exams');
  const [examLastDate, setExamLastDate] = useState('');
  const [examPosts, setExamPosts] = useState('');
  const [examStatus, setExamStatus] = useState('Apply Now');
  const [examDescription, setExamDescription] = useState('');

  // 3. Blog Modal Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Career Guide');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCoverImage, setBlogCoverImage] = useState('');
  const [blogTags, setBlogTags] = useState('');

  // 4. Quiz Modal Form State
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState('600');
  const [quizIcon, setQuizIcon] = useState('HelpCircle');
  const [quizColor, setQuizColor] = useState('#2563EB');
  const [quizBgColor, setQuizBgColor] = useState('#EFF6FF');
  const [quizQuestions, setQuizQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: 0, explanation: '' }
  ]);

  // 5. Company Modal Form State
  const [companyNameField, setCompanyNameField] = useState('');
  const [companyIndustryField, setCompanyIndustryField] = useState('IT / Software');
  const [companyColorField, setCompanyColorField] = useState('#1B8C0A');
  const [companyFeatured, setCompanyFeatured] = useState(false);
  const [companyRecentlyAdded, setCompanyRecentlyAdded] = useState(false);

  // ================= INITIAL & ROUTE LOADERS =================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setError(null);
    setSuccess(false);
    if (activeMenu === 'Dashboard') {
      fetchDashboardData();
    } else if (activeMenu === 'Jobs Management') {
      fetchJobs();
    } else if (activeMenu === 'Exams') {
      fetchExams();
    } else if (activeMenu === 'Blog & Pages') {
      fetchBlogs();
    } else if (activeMenu === 'Quizzes') {
      fetchQuizzes();
    } else if (activeMenu === 'Applications') {
      fetchApplications();
    } else if (activeMenu === 'Users' || activeMenu === 'Recruiters') {
      fetchUsers();
    } else if (activeMenu === 'Companies') {
      fetchCompanies();
    }
  }, [activeMenu]);

  // ================= DATA FETCHING METHODS =================

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentApps(response.data.recentApplications);
        setChartData(response.data.charts);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard administration stats.');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setDataLoading(true);
    try {
      const res = await api.get('/jobs');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch job entries.');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchExams = async () => {
    setDataLoading(true);
    try {
      const res = await api.get('/exams');
      if (res.data.success) {
        setExams(res.data.exams);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch competitive exams notice list.');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setDataLoading(true);
    try {
      const res = await api.get('/blog');
      if (res.data.success) {
        setBlogs(res.data.posts);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch published blog articles.');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    setDataLoading(true);
    try {
      const res = await api.get('/quizzes');
      if (res.data.success) {
        setQuizzes(res.data.quizzes);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch practice quizzes.');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchApplications = async () => {
    setDataLoading(true);
    try {
      const res = await api.get('/applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch candidate applications list.');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUsers = async () => {
    setDataLoading(true);
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch registered user accounts.');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchCompanies = async () => {
    setDataLoading(true);
    try {
      const res = await api.get('/companies');
      if (res.data.success) {
        setCompaniesList(res.data.companies);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch companies.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchApplications();
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update application status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user account? This cannot be undone.')) {
      try {
        const res = await api.delete(`/auth/users/${userId}`);
        if (res.data.success) {
          fetchUsers();
          fetchDashboardData();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete user account.');
      }
    }
  };

  const handleDeleteCompany = async (compId) => {
    if (window.confirm('Are you sure you want to delete this company profile?')) {
      try {
        const res = await api.delete(`/companies/${compId}`);
        if (res.data.success) {
          fetchCompanies();
          fetchDashboardData();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete company.');
      }
    }
  };

  // ================= DELETE HANDLERS =================

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        const res = await api.delete(`/jobs/${id}`);
        if (res.data.success) {
          fetchJobs();
          fetchDashboardData();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete job entry.');
      }
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam notice?')) {
      try {
        const res = await api.delete(`/exams/${id}`);
        if (res.data.success) {
          fetchExams();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete exam notice.');
      }
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog article?')) {
      try {
        const res = await api.delete(`/blog/${id}`);
        if (res.data.success) {
          fetchBlogs();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete blog article.');
      }
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz suite?')) {
      try {
        const res = await api.delete(`/quizzes/${id}`);
        if (res.data.success) {
          fetchQuizzes();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete quiz.');
      }
    }
  };

  // ================= CREATE SUBMISSION HANDLERS =================

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const jobPayload = {
        title,
        company,
        location,
        type,
        salary: {
          min: Number(minSalary),
          max: Number(maxSalary),
          currency: '₹',
          period: 'LPA'
        },
        experience,
        category,
        industry,
        description,
        responsibilities: [
          'Perform key duties in alignment with company standard operating procedures.',
          'Collaborate on regional engineering and business workflows.',
          'Execute day-to-day corporate operations.'
        ],
        requirements: [
          'Excellent organizational and communications skills.',
          'Required degree in relevant discipline.',
          'A proactive drive to learn and grow.'
        ]
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/jobs/${editId}`, jobPayload);
      } else {
        res = await api.post('/jobs', jobPayload);
      }

      if (res.data.success) {
        setSuccess(true);
        setTitle('');
        setCompany('');
        setMinSalary('');
        setMaxSalary('');
        setDescription('');
        setIsEditMode(false);
        setEditId(null);
        fetchJobs();
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert(isEditMode ? 'Failed to update job listing.' : 'Failed to create new job listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const examPayload = {
        title: examTitle,
        organization: examOrg,
        orgShort: examOrgShort,
        category: examCategory,
        lastDate: examLastDate,
        posts: examPosts || undefined,
        status: examStatus,
        description: examDescription,
        isNew: true
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/exams/${editId}`, examPayload);
      } else {
        res = await api.post('/exams', examPayload);
      }

      if (res.data.success) {
        setSuccess(true);
        setExamTitle('');
        setExamOrg('');
        setExamLastDate('');
        setExamPosts('');
        setExamDescription('');
        setIsEditMode(false);
        setEditId(null);
        fetchExams();
      }
    } catch (err) {
      console.error(err);
      alert(isEditMode ? 'Failed to update exam notification.' : 'Failed to publish exam notification.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tagsArray = blogTags.split(',').map(t => t.trim()).filter(Boolean);
      const blogPayload = {
        title: blogTitle,
        category: blogCategory,
        author: blogAuthor || 'Exam Expert Team',
        excerpt: blogExcerpt,
        content: blogContent,
        coverImage: blogCoverImage || 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop',
        tags: tagsArray
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/blog/${editId}`, blogPayload);
      } else {
        res = await api.post('/blog', blogPayload);
      }

      if (res.data.success) {
        setSuccess(true);
        setBlogTitle('');
        setBlogAuthor('');
        setBlogExcerpt('');
        setBlogContent('');
        setBlogCoverImage('');
        setBlogTags('');
        setIsEditMode(false);
        setEditId(null);
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
      alert(isEditMode ? 'Failed to update blog article.' : 'Failed to publish blog article.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formattedQuestions = quizQuestions.map(q => ({
        question: q.question,
        options: q.options.filter(Boolean),
        answer: Number(q.answer),
        explanation: q.explanation || '',
        didYouKnow: q.didYouKnow || '',
        imageUrl: q.imageUrl || ''
      }));

      if (formattedQuestions.some(q => q.options.length < 2 || !q.question)) {
        alert('Each question must have text and at least 2 filled options.');
        setSubmitting(false);
        return;
      }

      const quizPayload = {
        title: quizTitle,
        description: quizDescription,
        duration: Number(quizDuration) || 600,
        icon: quizIcon,
        color: quizColor,
        bgColor: quizBgColor,
        questions: formattedQuestions
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/quizzes/${editId}`, quizPayload);
      } else {
        res = await api.post('/quizzes', quizPayload);
      }

      if (res.data.success) {
        setSuccess(true);
        setQuizTitle('');
        setQuizDescription('');
        setQuizDuration('600');
        setQuizQuestions([
          { question: '', options: ['', '', '', ''], answer: 0, explanation: '', didYouKnow: '', imageUrl: '' }
        ]);
        setIsEditMode(false);
        setEditId(null);
        fetchQuizzes();
      }
    } catch (err) {
      console.error(err);
      alert(isEditMode ? 'Failed to update prep quiz.' : 'Failed to publish prep quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const companyPayload = {
        name: companyNameField,
        industry: companyIndustryField,
        companyColor: companyColorField,
        featured: companyFeatured,
        recentlyAdded: companyRecentlyAdded
      };

      let res;
      if (isEditMode) {
        res = await api.put(`/companies/${editId}`, companyPayload);
      } else {
        res = await api.post('/companies', companyPayload);
      }

      if (res.data.success) {
        setSuccess(true);
        setCompanyNameField('');
        setCompanyColorField('#1B8C0A');
        setCompanyFeatured(false);
        setCompanyRecentlyAdded(false);
        setIsEditMode(false);
        setEditId(null);
        fetchCompanies();
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert(isEditMode ? 'Failed to update company profile.' : 'Failed to publish company profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // ================= ADD NEW & EDIT CLICK HANDLERS =================

  const handleAddNewJobClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setTitle('');
    setCompany('');
    setLocation('Ranchi');
    setType('Full Time');
    setMinSalary('');
    setMaxSalary('');
    setExperience('0 - 2 Years');
    setCategory('Private Jobs');
    setIndustry('IT / Software');
    setDescription('');
    setModalOpen(true);
    setSuccess(false);
  };

  const handleAddNewExamClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setExamTitle('');
    setExamOrg('');
    setExamOrgShort('JSSC');
    setExamCategory('Upcoming Exams');
    setExamLastDate('');
    setExamPosts('');
    setExamStatus('Apply Now');
    setExamDescription('');
    setModalOpen(true);
    setSuccess(false);
  };

  const handleAddNewBlogClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setBlogTitle('');
    setBlogCategory('Career Guide');
    setBlogAuthor('Exam Expert Team');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCoverImage('');
    setBlogTags('');
    setModalOpen(true);
    setSuccess(false);
  };

  const handleAddNewQuizClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setQuizTitle('');
    setQuizDescription('');
    setQuizDuration('600');
    setQuizIcon('HelpCircle');
    setQuizColor('#2563EB');
    setQuizBgColor('#EFF6FF');
    setQuizQuestions([
      { question: '', options: ['', '', '', ''], answer: 0, explanation: '', didYouKnow: '', imageUrl: '' }
    ]);
    setModalOpen(true);
    setSuccess(false);
  };

  const handleAddNewCompanyClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setCompanyNameField('');
    setCompanyIndustryField('IT / Software');
    setCompanyColorField('#1B8C0A');
    setCompanyFeatured(false);
    setCompanyRecentlyAdded(false);
    setModalOpen(true);
    setSuccess(false);
  };

  const handleEditJobClick = (job) => {
    setIsEditMode(true);
    setEditId(job._id);
    setTitle(job.title || '');
    setCompany(job.company || '');
    setLocation(job.location || 'Ranchi');
    setType(job.type || 'Full Time');
    setMinSalary(job.salary ? String(job.salary.min) : '');
    setMaxSalary(job.salary ? String(job.salary.max) : '');
    setExperience(job.experience || '0 - 2 Years');
    setCategory(job.category || 'Private Jobs');
    setIndustry(job.industry || 'IT / Software');
    setDescription(job.description || '');
    setModalOpen(true);
    setSuccess(false);
  };

  const handleEditExamClick = (exam) => {
    setIsEditMode(true);
    setEditId(exam._id);
    setExamTitle(exam.title || '');
    setExamOrg(exam.organization || '');
    setExamOrgShort(exam.orgShort || 'JSSC');
    setExamCategory(exam.category || 'Upcoming Exams');
    setExamLastDate(exam.lastDate || '');
    setExamPosts(exam.posts || '');
    setExamStatus(exam.status || 'Apply Now');
    setExamDescription(exam.description || '');
    setModalOpen(true);
    setSuccess(false);
  };

  const handleEditBlogClick = (blog) => {
    setIsEditMode(true);
    setEditId(blog._id);
    setBlogTitle(blog.title || '');
    setBlogCategory(blog.category || 'Career Guide');
    setBlogAuthor(blog.author || '');
    setBlogExcerpt(blog.excerpt || '');
    setBlogContent(blog.content || '');
    setBlogCoverImage(blog.coverImage || '');
    setBlogTags(blog.tags ? blog.tags.join(', ') : '');
    setModalOpen(true);
    setSuccess(false);
  };

  const handleEditQuizClick = (quiz) => {
    setIsEditMode(true);
    setEditId(quiz._id);
    setQuizTitle(quiz.title || '');
    setQuizDescription(quiz.description || '');
    setQuizDuration(quiz.duration ? String(quiz.duration) : '600');
    setQuizIcon(quiz.icon || 'HelpCircle');
    setQuizColor(quiz.color || '#2563EB');
    setQuizBgColor(quiz.bgColor || '#EFF6FF');
    setQuizQuestions(quiz.questions && quiz.questions.length > 0 ? quiz.questions.map(q => ({
      question: q.question || '',
      options: q.options ? [...q.options, '', '', ''].slice(0, 4) : ['', '', '', ''],
      answer: q.answer !== undefined ? q.answer : 0,
      explanation: q.explanation || '',
      didYouKnow: q.didYouKnow || '',
      imageUrl: q.imageUrl || ''
    })) : [{ question: '', options: ['', '', '', ''], answer: 0, explanation: '', didYouKnow: '', imageUrl: '' }]);
    setModalOpen(true);
    setSuccess(false);
  };

  const handleEditCompanyClick = (company) => {
    setIsEditMode(true);
    setEditId(company._id);
    setCompanyNameField(company.name || '');
    setCompanyIndustryField(company.industry || 'IT / Software');
    setCompanyColorField(company.companyColor || '#1B8C0A');
    setCompanyFeatured(company.featured || false);
    setCompanyRecentlyAdded(company.recentlyAdded || false);
    setModalOpen(true);
    setSuccess(false);
  };

  // ================= QUIZ QUESTION BUILDER HELPERS =================

  const handleQuizQuestionChange = (index, field, value) => {
    const updated = [...quizQuestions];
    updated[index][field] = value;
    setQuizQuestions(updated);
  };

  const handleQuizOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[oIndex] = value;
    setQuizQuestions(updated);
  };

  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: '', options: ['', '', '', ''], answer: 0, explanation: '', didYouKnow: '', imageUrl: '' }
    ]);
  };

  const removeQuizQuestion = (index) => {
    if (quizQuestions.length > 1) {
      const updated = [...quizQuestions];
      updated.splice(index, 1);
      setQuizQuestions(updated);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Recharts colors styling
  const COLORS = ['#1B8C0A', '#2563EB', '#EA580C', '#EF4444'];
  const STATUS_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#64748B'];

  const sidebarMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Jobs Management', icon: Briefcase },
    { name: 'Applications', icon: FileText },
    { name: 'Users', icon: Users },
    { name: 'Recruiters', icon: Users },
    { name: 'Companies', icon: Building },
    { name: 'Exams', icon: Calendar },
    { name: 'Blog & Pages', icon: File },
    { name: 'Quizzes', icon: HelpCircle },
    { name: 'Banners', icon: FileText },
    { name: 'Job Alerts', icon: Bell },
    { name: 'Reports & Analytics', icon: TrendingUp },
    { name: 'Settings', icon: Settings },
    { name: 'System Logs', icon: FileText }
  ];

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#F8F9FA' }}>
        <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px', fontFamily: 'sans-serif' }}>Loading Admin Console...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1E293B',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1E293B' }}>
          <svg style={{ width: '32px', height: '32px', flexShrink: 0 }} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#1B8C0A" />
            <path d="M12 25L17.5 17L22 23L28 14M12 28H28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.2' }}>Jharkhand Jobs</span>
            <span style={{ fontSize: '9px', color: '#1B8C0A', fontWeight: '700', lineHeight: '1.2' }}>Admin Panel</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sidebarMenuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <li key={idx}>
                  <button
                    onClick={() => setActiveMenu(item.name)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: isActive ? '#1E293B' : 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderLeft: isActive ? '3px solid #1B8C0A' : '3px solid transparent',
                      transition: 'all 0.2s ease',
                      borderTop: 'none',
                      borderRight: 'none',
                      borderBottom: 'none'
                    }}
                  >
                    <Icon size={16} style={{ color: isActive ? '#1B8C0A' : '#64748B' }} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer / Signout */}
        <div style={{ padding: '16px', borderTop: '1px solid #1E293B' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              backgroundColor: '#1E293B',
              color: '#EF4444',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Right Top Header Bar */}
        <header style={{
          height: '70px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>
              {activeMenu === 'Dashboard' ? 'Dashboard Overview' : `${activeMenu} Console`}
            </h2>
          </div>

          {/* User Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: '#F8F9FA',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#64748B',
              fontWeight: '500'
            }}>
              <Calendar size={14} style={{ color: '#1B8C0A' }} />
              <span>27 May 2026</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1B8C0A',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                AD
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Admin User</span>
            </div>
          </div>
        </header>

        {/* Dynamic Dashboard Main Body */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          
          {/* Main Title bar & Dynamic Action CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                {activeMenu === 'Dashboard' ? 'Dashboard Overview' : activeMenu}
              </h1>
            </div>
            
            {/* Conditional Action Button based on selected tab */}
            {(activeMenu === 'Dashboard' || activeMenu === 'Jobs Management') && (
              <button 
                onClick={handleAddNewJobClick}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add New Job
              </button>
            )}
            {activeMenu === 'Exams' && (
              <button 
                onClick={handleAddNewExamClick}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add Exam Notice
              </button>
            )}
            {activeMenu === 'Blog & Pages' && (
              <button 
                onClick={handleAddNewBlogClick}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add New Article
              </button>
            )}
            {activeMenu === 'Quizzes' && (
              <button 
                onClick={handleAddNewQuizClick}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add New Quiz
              </button>
            )}
            {activeMenu === 'Companies' && (
              <button 
                onClick={handleAddNewCompanyClick}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Plus size={16} /> Add Company
              </button>
            )}
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #DC2626', color: '#DC2626', padding: '12px', fontSize: '13px', borderRadius: '4px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {/* ==================== VIEW 1: DASHBOARD OVERVIEW ==================== */}
          {activeMenu === 'Dashboard' && (
            <div>
              {/* Stats Grid */}
              {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  <div className="card card-sm" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Total Jobs</span>
                      <strong style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{stats.totalJobs.toLocaleString()}</strong>
                      <span style={{ fontSize: '10px', color: '#1B8C0A', backgroundColor: '#E8F5E3', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>▲ +12.5%</span>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E8F5E3', color: '#1B8C0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={20} />
                    </div>
                  </div>

                  <div className="card card-sm" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Total Applications</span>
                      <strong style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{stats.totalApplications.toLocaleString()}</strong>
                      <span style={{ fontSize: '10px', color: '#1B8C0A', backgroundColor: '#E8F5E3', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>▲ +18.7%</span>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} />
                    </div>
                  </div>

                  <div className="card card-sm" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Total Users</span>
                      <strong style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{stats.totalUsers.toLocaleString()}</strong>
                      <span style={{ fontSize: '10px', color: '#1B8C0A', backgroundColor: '#E8F5E3', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>▲ +15.3%</span>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={20} />
                    </div>
                  </div>

                  <div className="card card-sm" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Total Companies</span>
                      <strong style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{stats.totalCompanies.toLocaleString()}</strong>
                      <span style={{ fontSize: '10px', color: '#1B8C0A', backgroundColor: '#E8F5E3', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>▲ +10.1%</span>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building size={20} />
                    </div>
                  </div>

                  <div className="card card-sm" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #E2E8F0' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Total Exams</span>
                      <strong style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{stats.totalExams.toLocaleString()}</strong>
                      <span style={{ fontSize: '10px', color: '#1B8C0A', backgroundColor: '#E8F5E3', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>▲ +11.4%</span>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={20} />
                    </div>
                  </div>
                </div>
              )}

              {/* Charts Row */}
              {chartData && (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {/* Applications Trend */}
                  <div className="card" style={{ flex: '2 1 450px', backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Job Applications Trend</h3>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontWeight: '600' }}>
                        <span style={{ color: '#2563EB', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }} /> This month</span>
                        <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94A3B8' }} /> Last Month</span>
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '240px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.applicationsTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis dataKey="name" stroke="#94A3B8" style={{ fontSize: '11px' }} />
                          <YAxis stroke="#94A3B8" style={{ fontSize: '11px' }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="applications" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApps)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Jobs by Type */}
                  <div className="card" style={{ flex: '1 1 250px', backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', width: '100%', textAlign: 'left' }}>Jobs by Type</h3>
                    
                    <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.jobsByType}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {chartData.jobsByType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <strong style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', display: 'block' }}>
                          {chartData.jobsByType.reduce((acc, curr) => acc + curr.value, 0)}
                        </strong>
                        <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>Total</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px', fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
                      {chartData.jobsByType.map((entry, idx) => (
                        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }} />
                          {entry.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Jobs by Status */}
                  <div className="card" style={{ flex: '1 1 250px', backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', width: '100%', textAlign: 'left' }}>Job Status</h3>
                    
                    <div style={{ width: '100%', height: '180px', position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.jobStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {chartData.jobStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <strong style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', display: 'block' }}>
                          {chartData.jobStatus.reduce((acc, curr) => acc + curr.value, 0)}
                        </strong>
                        <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>Total</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px', fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
                      {chartData.jobStatus.map((entry, idx) => (
                        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: STATUS_COLORS[idx % STATUS_COLORS.length] }} />
                          {entry.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Applications Table */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div className="card" style={{ flex: '2 1 450px', backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '16px' }}>Recent Applications</h3>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                          <th style={{ padding: '10px 12px' }}>Applicant</th>
                          <th style={{ padding: '10px 12px' }}>Job Position</th>
                          <th style={{ padding: '10px 12px' }}>Applied Date</th>
                          <th style={{ padding: '10px 12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentApps.length > 0 ? (
                          recentApps.map((app) => (
                            <tr key={app._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '12px', fontWeight: '600', color: '#0F172A' }}>{app.fullName}</td>
                              <td style={{ padding: '12px', color: '#334155' }}>
                                {app.job?.title} <span style={{ fontSize: '11px', color: '#94A3B8' }}>({app.job?.company})</span>
                              </td>
                              <td style={{ padding: '12px', color: '#94A3B8' }}>{new Date(app.appliedDate).toLocaleDateString()}</td>
                              <td style={{ padding: '12px' }}>
                                <span className="badge" style={{
                                  backgroundColor: app.status === 'pending' ? '#FEF3C7' : app.status === 'shortlisted' ? '#ECFDF5' : '#F8FAFC',
                                  color: app.status === 'pending' ? '#D97706' : app.status === 'shortlisted' ? '#059669' : '#64748B',
                                  fontSize: '10px',
                                  textTransform: 'capitalize',
                                  padding: '2px 8px'
                                }}>
                                  {app.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>No applications received yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="card" style={{ flex: '1 1 250px', maxWidth: '320px', backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>Quick Actions</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button onClick={() => { setActiveMenu('Jobs Management'); setModalOpen(true); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#F8FAFC' }}>
                      <PlusCircle size={18} style={{ color: '#1B8C0A' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#334155' }}>Add Job</span>
                    </button>
                    <button onClick={() => setActiveMenu('Jobs Management')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#F8FAFC' }}>
                      <Briefcase size={18} style={{ color: '#2563EB' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#334155' }}>Manage Jobs</span>
                    </button>
                    <button onClick={() => setActiveMenu('Exams')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#F8FAFC' }}>
                      <Calendar size={18} style={{ color: '#EA580C' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#334155' }}>Govt Exams</span>
                    </button>
                    <button onClick={() => setActiveMenu('Quizzes')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#F8FAFC' }}>
                      <HelpCircle size={18} style={{ color: '#7C3AED' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#334155' }}>Quizzes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== VIEW 2: JOBS MANAGEMENT ==================== */}
          {activeMenu === 'Jobs Management' && (
            <div className="card" style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Active Job Listings</h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Showing {jobs.length} jobs</span>
              </div>
              {dataLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #1B8C0A', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : jobs.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Job Info</th>
                        <th style={{ padding: '12px' }}>Category & Type</th>
                        <th style={{ padding: '12px' }}>Location</th>
                        <th style={{ padding: '12px' }}>Salary Range</th>
                        <th style={{ padding: '12px' }}>Experience</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#0F172A' }}>{job.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{job.company}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '500', color: '#334155' }}>{job.category}</div>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: job.type === 'Full Time' ? '#E8F5E3' : '#EFF6FF',
                              color: job.type === 'Full Time' ? '#1B8C0A' : '#2563EB',
                              fontWeight: '600',
                              display: 'inline-block',
                              marginTop: '2px'
                            }}>{job.type}</span>
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>{job.location}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>
                            {job.salary ? `${job.salary.currency}${job.salary.min} - ${job.salary.max} ${job.salary.period}` : 'N/A'}
                          </td>
                          <td style={{ padding: '12px', color: '#64748B' }}>{job.experience}</td>
                          <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button 
                              onClick={() => handleEditJobClick(job)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#2563EB', cursor: 'pointer', padding: '6px', borderRadius: '4px', marginRight: '6px' }}
                              title="Edit Job"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job._id)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                              title="Delete Job"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No job listings created yet. Click "Add New Job" to begin.</div>
              )}
            </div>
          )}

          {/* ==================== VIEW 3: EXAMS NOTICES ==================== */}
          {activeMenu === 'Exams' && (
            <div className="card" style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Active Exam Alerts</h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Showing {exams.length} notices</span>
              </div>
              {dataLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #1B8C0A', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : exams.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Exam Notice</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Last Date</th>
                        <th style={{ padding: '12px' }}>Posts Count</th>
                        <th style={{ padding: '12px' }}>Status Label</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam) => (
                        <tr key={exam._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#0F172A' }}>{exam.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{exam.organization} ({exam.orgShort})</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: exam.category === 'Results' ? '#FEF2F2' : exam.category === 'Admit Card' ? '#EFF6FF' : '#F0FDF4',
                              color: exam.category === 'Results' ? '#DC2626' : exam.category === 'Admit Card' ? '#2563EB' : '#1B8C0A',
                              fontWeight: '700',
                              display: 'inline-block'
                            }}>{exam.category}</span>
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>{exam.lastDate || 'N/A'}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>{exam.posts || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#F1F5F9',
                              color: '#4B5563',
                              fontWeight: '600'
                            }}>{exam.status}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button 
                              onClick={() => handleEditExamClick(exam)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#2563EB', cursor: 'pointer', padding: '6px', borderRadius: '4px', marginRight: '6px' }}
                              title="Edit Exam Notice"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteExam(exam._id)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                              title="Delete Exam"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No exam notices created yet. Click "Add Exam Notice" to begin.</div>
              )}
            </div>
          )}

          {/* ==================== VIEW 4: BLOGS & GUIDES ==================== */}
          {activeMenu === 'Blog & Pages' && (
            <div className="card" style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Published Articles</h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Showing {blogs.length} articles</span>
              </div>
              {dataLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #1B8C0A', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : blogs.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Article Details</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Published Date</th>
                        <th style={{ padding: '12px' }}>Views</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#0F172A', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{blog.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>By {blog.author || 'Staff Writer'}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#E8F5E3',
                              color: '#1B8C0A',
                              fontWeight: '600'
                            }}>{blog.category}</span>
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>
                            {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '12px', color: '#334155', fontWeight: '600' }}>{blog.views || 0}</td>
                          <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button 
                              onClick={() => handleEditBlogClick(blog)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#2563EB', cursor: 'pointer', padding: '6px', borderRadius: '4px', marginRight: '6px' }}
                              title="Edit Article"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteBlog(blog._id)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                              title="Delete Article"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No articles published yet. Click "Add New Article" to begin.</div>
              )}
            </div>
          )}

          {/* ==================== VIEW 5: PRACTICE QUIZZES ==================== */}
          {activeMenu === 'Quizzes' && (
            <div className="card" style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Available Quizzes</h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Showing {quizzes.length} quizzes</span>
              </div>
              {dataLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #1B8C0A', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : quizzes.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Quiz Suite Title</th>
                        <th style={{ padding: '12px' }}>Description</th>
                        <th style={{ padding: '12px' }}>Duration</th>
                        <th style={{ padding: '12px' }}>Questions</th>
                        <th style={{ padding: '12px' }}>Styling Theme</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((quiz) => (
                        <tr key={quiz._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#0F172A' }}>{quiz.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>Key: {quiz.key}</div>
                          </td>
                          <td style={{ padding: '12px', color: '#64748B', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {quiz.description || 'No description provided.'}
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>
                            {Math.round(quiz.duration / 60)} mins ({quiz.duration}s)
                          </td>
                          <td style={{ padding: '12px', color: '#1B8C0A', fontWeight: '700' }}>
                            {quiz.questions ? quiz.questions.length : 0} Questions
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '10px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: quiz.bgColor || '#F1F5F9',
                              color: quiz.color || '#4B5563',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: quiz.color }} />
                              {quiz.icon || 'HelpCircle'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button 
                              onClick={() => handleEditQuizClick(quiz)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#2563EB', cursor: 'pointer', padding: '6px', borderRadius: '4px', marginRight: '6px' }}
                              title="Edit Quiz"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteQuiz(quiz._id)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                              title="Delete Quiz"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No quizzes created yet. Click "Add New Quiz" to begin.</div>
              )}
            </div>
          )}

          {/* ==================== VIEW 6: APPLICATIONS MANAGEMENT ==================== */}
          {activeMenu === 'Applications' && (
            <div className="card" style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Job Applications</h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Showing {applications.length} applications</span>
              </div>
              {dataLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #1B8C0A', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : applications.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Applicant</th>
                        <th style={{ padding: '12px' }}>Job Position</th>
                        <th style={{ padding: '12px' }}>Contact Info</th>
                        <th style={{ padding: '12px' }}>Applied Date</th>
                        <th style={{ padding: '12px' }}>Resume</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#0F172A' }}>{app.fullName}</div>
                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>ID: {app._id}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '500', color: '#334155' }}>{app.job?.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{app.job?.company}</div>
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>
                            <div>{app.email}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{app.phone}</div>
                          </td>
                          <td style={{ padding: '12px', color: '#94A3B8' }}>
                            {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <a 
                              href={app.resumePath ? `http://localhost:5000${app.resumePath}` : '#'} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <FileText size={14} /> Resume
                            </a>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: app.status === 'shortlisted' ? '#ECFDF5' : app.status === 'pending' ? '#FEF3C7' : app.status === 'rejected' ? '#FEF2F2' : '#F1F5F9',
                              color: app.status === 'shortlisted' ? '#059669' : app.status === 'pending' ? '#D97706' : app.status === 'rejected' ? '#DC2626' : '#4B5563',
                              fontWeight: '700',
                              display: 'inline-block'
                            }}>{app.status}</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <select 
                              value={app.status} 
                              onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                              style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', cursor: 'pointer' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No job applications received yet.</div>
              )}
            </div>
          )}

          {/* ==================== VIEW 7: USERS & RECRUITERS ==================== */}
          {(activeMenu === 'Users' || activeMenu === 'Recruiters') && (
            <div className="card" style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                  {activeMenu === 'Users' ? 'Registered Candidates' : 'Recruiters'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>
                  Showing {users.filter(u => activeMenu === 'Users' ? (u.role === 'user' || u.role === 'admin') : u.role === 'recruiter').length} accounts
                </span>
              </div>
              {dataLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #1B8C0A', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : users.filter(u => activeMenu === 'Users' ? (u.role === 'user' || u.role === 'admin') : u.role === 'recruiter').length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Name</th>
                        <th style={{ padding: '12px' }}>Email</th>
                        <th style={{ padding: '12px' }}>Phone Number</th>
                        <th style={{ padding: '12px' }}>Role</th>
                        <th style={{ padding: '12px' }}>Joined Date</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => activeMenu === 'Users' ? (u.role === 'user' || u.role === 'admin') : u.role === 'recruiter').map((userObj) => (
                        <tr key={userObj._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#0F172A' }}>{userObj.name}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>{userObj.email}</td>
                          <td style={{ padding: '12px', color: '#334155' }}>{userObj.phone || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: userObj.role === 'admin' ? '#FEF3C7' : userObj.role === 'recruiter' ? '#EFF6FF' : '#E8F5E3',
                              color: userObj.role === 'admin' ? '#D97706' : userObj.role === 'recruiter' ? '#2563EB' : '#1B8C0A',
                              fontWeight: '700',
                              textTransform: 'uppercase'
                            }}>{userObj.role}</span>
                          </td>
                          <td style={{ padding: '12px', color: '#94A3B8' }}>
                            {userObj.createdAt ? new Date(userObj.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {userObj.role !== 'admin' && (
                              <button 
                                onClick={() => handleDeleteUser(userObj._id)}
                                style={{ border: 'none', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                                title="Delete User Account"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                  No accounts found.
                </div>
              )}
            </div>
          )}

          {/* ==================== VIEW 8: COMPANIES CRUD ==================== */}
          {activeMenu === 'Companies' && (
            <div className="card" style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Registered Companies</h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Showing {companiesList.length} companies</span>
              </div>
              {dataLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #1B8C0A', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : companiesList.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px' }}>Company Details</th>
                        <th style={{ padding: '12px' }}>Industry</th>
                        <th style={{ padding: '12px' }}>Jobs Published</th>
                        <th style={{ padding: '12px' }}>Featured Status</th>
                        <th style={{ padding: '12px' }}>Brand Color</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companiesList.map((comp) => (
                        <tr key={comp._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: comp.companyColor || '#1B8C0A',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                              {comp.name ? comp.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase() : 'CO'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: '#0F172A' }}>{comp.name}</div>
                              <div style={{ fontSize: '10px', color: '#94A3B8' }}>ID: {comp._id}</div>
                            </div>
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>{comp.industry}</td>
                          <td style={{ padding: '12px', color: '#1B8C0A', fontWeight: '700' }}>{comp.jobCount || 0} Jobs</td>
                          <td style={{ padding: '12px' }}>
                            {comp.featured ? (
                              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#E8F5E3', color: '#1B8C0A', fontWeight: '700' }}>Featured</span>
                            ) : (
                              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#64748B', fontWeight: '500' }}>Standard</span>
                            )}
                            {comp.recentlyAdded && (
                              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: '700', marginLeft: '6px' }}>Recent</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4B5563' }}>
                              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: comp.companyColor || '#1B8C0A', border: '1px solid #CBD5E1' }} />
                              {comp.companyColor || '#1B8C0A'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button 
                              onClick={() => handleEditCompanyClick(comp)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#2563EB', cursor: 'pointer', padding: '6px', borderRadius: '4px', marginRight: '6px' }}
                              title="Edit Company Profile"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompany(comp._id)}
                              style={{ border: 'none', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                              title="Delete Company"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No company profiles registered. Click "Add Company" to begin.</div>
              )}
            </div>
          )}

          {/* Fallback View for Unimplemented Sections */}
          {!['Dashboard', 'Jobs Management', 'Exams', 'Blog & Pages', 'Quizzes', 'Applications', 'Users', 'Recruiters', 'Companies'].includes(activeMenu) && (
            <div className="card text-center" style={{ padding: '60px 40px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <Settings size={48} style={{ color: '#94A3B8', margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B', marginBottom: '8px' }}>Console Section Under Construction</h2>
              <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                The "{activeMenu}" administration views are currently locked. All main CRUD features relative to Jobs, Exams, blogs, and quizzes are fully active and reflecting live.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* ==================== UNIFIED MODAL FORMS ENGINE ==================== */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px',
          backdropFilter: 'blur(3px)'
        }}>
          
          <div className="card animate-scale-in" style={{
            backgroundColor: 'white',
            maxWidth: '600px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            overflowY: 'auto',
            maxHeight: '90vh',
            boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
            borderRadius: '16px'
          }}>
            
            <button 
              onClick={() => { setModalOpen(false); setSuccess(false); }} 
              style={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer', color: '#9CA3AF', border: 'none', backgroundColor: 'transparent' }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {success ? (
              <div className="text-center animate-fade-in" style={{ padding: '20px 0' }}>
                <CheckCircle size={56} style={{ color: '#1B8C0A', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1A1A2E', marginBottom: '8px' }}>Publish Successful!</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
                  The entry has been successfully added to the database and is now properly reflecting in the candidate portal.
                </p>
                <button 
                  onClick={() => { setModalOpen(false); setSuccess(false); }} 
                  className="btn btn-primary"
                  style={{ padding: '8px 24px', cursor: 'pointer' }}
                >
                  Return to Console
                </button>
              </div>
            ) : (
              <div>
                
                {/* 1. JOBS CREATION FORM */}
                {(activeMenu === 'Dashboard' || activeMenu === 'Jobs Management') && (
                  <form onSubmit={handleCreateJob}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1A2E', marginBottom: '16px' }}>
                      {isEditMode ? 'Edit Private Job Listing' : 'Add Private Job Listing'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Job Position Title *</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="e.g. Junior Software Developer" />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Company Name *</label>
                        <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="form-input" placeholder="e.g. HCLTech" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Location *</label>
                          <select value={location} onChange={(e) => setLocation(e.target.value)} className="form-select">
                            <option value="Ranchi">Ranchi</option>
                            <option value="Jamshedpur">Jamshedpur</option>
                            <option value="Dhanbad">Dhanbad</option>
                            <option value="Bokaro">Bokaro</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Category *</label>
                          <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
                            <option value="Private Jobs">Private Jobs</option>
                            <option value="Govt Jobs">Govt Jobs</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Job Type *</label>
                          <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Experience *</label>
                          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="form-select">
                            <option value="0 - 2 Years">0 - 2 Years (Fresher)</option>
                            <option value="1 - 3 Years">1 - 3 Years</option>
                            <option value="2 - 5 Years">2 - 5 Years</option>
                            <option value="5+ Years">5+ Years</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Min Salary (LPA) *</label>
                          <input type="number" required value={minSalary} onChange={(e) => setMinSalary(e.target.value)} className="form-input" placeholder="e.g. 3" />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Max Salary (LPA) *</label>
                          <input type="number" required value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} className="form-input" placeholder="e.g. 6" />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Industry *</label>
                          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="form-select">
                            <option value="IT / Software">IT / Software</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Consulting">Consulting</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Description *</label>
                        <textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" placeholder="Briefly describe key duties..." style={{ resize: 'none' }} />
                      </div>
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: '15px', cursor: 'pointer', border: 'none' }}>
                      {submitting ? 'Saving job...' : isEditMode ? 'Update Job Listing' : 'Publish Job Listing'}
                    </button>
                  </form>
                )}

                {/* 2. EXAMS NOTIFICATION CREATION FORM */}
                {activeMenu === 'Exams' && (
                  <form onSubmit={handleCreateExam}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1A2E', marginBottom: '16px' }}>
                      {isEditMode ? 'Edit Government Exam Notice' : 'Add Government Exam Update'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Exam Notice Title *</label>
                        <input type="text" required value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className="form-input" placeholder="e.g. JSSC CGL Recruitment 2026" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Organization Name *</label>
                          <input type="text" required value={examOrg} onChange={(e) => setExamOrg(e.target.value)} className="form-input" placeholder="e.g. Jharkhand Staff Selection Commission" />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Abbreviation *</label>
                          <select value={examOrgShort} onChange={(e) => setExamOrgShort(e.target.value)} className="form-select">
                            <option value="JSSC">JSSC</option>
                            <option value="JPSC">JPSC</option>
                            <option value="Railway">Railway</option>
                            <option value="Police">Police</option>
                            <option value="Teaching">Teaching</option>
                            <option value="Banking">Banking</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Notice Category *</label>
                          <select value={examCategory} onChange={(e) => setExamCategory(e.target.value)} className="form-select">
                            <option value="Upcoming Exams">Upcoming Exams</option>
                            <option value="Admit Card">Admit Card</option>
                            <option value="Results">Results</option>
                            <option value="Answer Key">Answer Key</option>
                            <option value="Syllabus">Syllabus</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Last Date to Apply / Date</label>
                          <input type="text" value={examLastDate} onChange={(e) => setExamLastDate(e.target.value)} className="form-input" placeholder="e.g. 15 Jun 2026" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Posts Count (Optional)</label>
                          <input type="text" value={examPosts} onChange={(e) => setExamPosts(e.target.value)} className="form-input" placeholder="e.g. 2,018 Posts" />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Action Status *</label>
                          <select value={examStatus} onChange={(e) => setExamStatus(e.target.value)} className="form-select">
                            <option value="Apply Now">Apply Now</option>
                            <option value="Released">Released</option>
                            <option value="Declared">Declared</option>
                            <option value="Check Update">Check Update</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Short Description *</label>
                        <textarea required rows="3" value={examDescription} onChange={(e) => setExamDescription(e.target.value)} className="form-input" placeholder="e.g. Exam pattern updates, admit card download dates..." style={{ resize: 'none' }} />
                      </div>
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: '15px', cursor: 'pointer', border: 'none' }}>
                      {submitting ? 'Saving notice...' : isEditMode ? 'Update Exam Alert' : 'Publish Exam Alert'}
                    </button>
                  </form>
                )}

                {/* 3. BLOGS & GUIDES CREATION FORM */}
                {activeMenu === 'Blog & Pages' && (
                  <form onSubmit={handleCreateBlog}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1A2E', marginBottom: '16px' }}>
                      {isEditMode ? 'Edit Career Guide / Blog' : 'Create Career Guide / Blog'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Article Title *</label>
                        <input type="text" required value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} className="form-input" placeholder="e.g. 5 Best Tips to Crack JSSC Exam" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Category *</label>
                          <select value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} className="form-select">
                            <option value="Career Guide">Career Guide</option>
                            <option value="Industry Trends">Industry Trends</option>
                            <option value="Tips & Tricks">Tips & Tricks</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Author *</label>
                          <input type="text" required value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} className="form-input" placeholder="e.g. Exam Expert Team" />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Short Summary Excerpt *</label>
                        <input type="text" required value={blogExcerpt} onChange={(e) => setBlogExcerpt(e.target.value)} className="form-input" placeholder="A single sentence summarized preview..." />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Cover Image URL (Optional)</label>
                        <input type="text" value={blogCoverImage} onChange={(e) => setBlogCoverImage(e.target.value)} className="form-input" placeholder="Unsplash/web url link" />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Tags (Comma-separated)</label>
                        <input type="text" value={blogTags} onChange={(e) => setBlogTags(e.target.value)} className="form-input" placeholder="e.g. JSSC, Exams, Prep, 2026" />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Detailed HTML Content *</label>
                        <textarea required rows="4" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} className="form-input" placeholder="<h3>Introduction</h3><p>Start typing guide here...</p>" style={{ resize: 'none' }} />
                      </div>
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: '15px', cursor: 'pointer', border: 'none' }}>
                      {submitting ? 'Saving article...' : isEditMode ? 'Update Blog Article' : 'Publish Blog Article'}
                    </button>
                  </form>
                )}

                {/* 4. PRACTICE QUIZZES CREATION FORM */}
                {activeMenu === 'Quizzes' && (
                  <form onSubmit={handleCreateQuiz}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1A2E', marginBottom: '16px' }}>
                      {isEditMode ? 'Edit Prep Quiz Suite' : 'Create Prep Quiz Suite'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '6px' }}>
                      
                      {/* Meta Details */}
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Quiz Subject / Category *</label>
                        <select required value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className="form-select">
                          <option value="">-- Select Subject Category --</option>
                          <option value="General Knowledge">General Knowledge</option>
                          <option value="Jharkhand GK">Jharkhand GK</option>
                          <option value="Current Affairs">Current Affairs</option>
                          <option value="Indian Polity">Indian Polity</option>
                          <option value="History">History</option>
                          <option value="Geography">Geography</option>
                          <option value="Science">Science</option>
                          <option value="Maths">Maths</option>
                          <option value="Reasoning">Reasoning</option>
                          <option value="Computer">Computer Awareness</option>
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Short Description *</label>
                          <input type="text" required value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)} className="form-input" placeholder="e.g. Basic MS-Office & internet concepts." />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Timer (Seconds) *</label>
                          <input type="number" required value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} className="form-input" placeholder="600" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Quiz Icon *</label>
                          <select value={quizIcon} onChange={(e) => setQuizIcon(e.target.value)} className="form-select">
                            <option value="BookOpen">BookOpen</option>
                            <option value="HelpCircle">HelpCircle</option>
                            <option value="Clock">Clock</option>
                            <option value="Award">Award</option>
                            <option value="Shield">Shield</option>
                            <option value="FileText">FileText</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Brand Color *</label>
                          <input type="text" required value={quizColor} onChange={(e) => setQuizColor(e.target.value)} className="form-input" placeholder="#2563EB" />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Background Color *</label>
                          <input type="text" required value={quizBgColor} onChange={(e) => setQuizBgColor(e.target.value)} className="form-input" placeholder="#EFF6FF" />
                        </div>
                      </div>

                      {/* Question builder section */}
                      <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '16px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A2E' }}>Questions Set ({quizQuestions.length})</h4>
                          <button type="button" onClick={addQuizQuestion} className="btn btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '6px 12px', backgroundColor: '#E8F5E3', color: '#1B8C0A', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }}>
                            <Plus size={12} /> Add Question
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {quizQuestions.map((q, qIdx) => (
                            <div key={qIdx} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                              
                              {/* Remove Question button */}
                              {quizQuestions.length > 1 && (
                                <button type="button" onClick={() => removeQuizQuestion(qIdx)} style={{ position: 'absolute', top: '12px', right: '12px', border: 'none', backgroundColor: 'transparent', color: '#EF4444', cursor: 'pointer' }}>
                                  <Trash2 size={14} />
                                </button>
                              )}

                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#1B8C0A', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Question #{qIdx + 1}</span>
                              
                              {/* Question Text */}
                              <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Question Text *</label>
                                <input type="text" required value={q.question} onChange={(e) => handleQuizQuestionChange(qIdx, 'question', e.target.value)} className="form-input" placeholder="e.g. Which of the following is an input device?" style={{ fontSize: '12px', padding: '8px' }} />
                              </div>

                              {/* Options */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Option 1 *</label>
                                  <input type="text" required value={q.options[0]} onChange={(e) => handleQuizOptionChange(qIdx, 0, e.target.value)} className="form-input" placeholder="Option A" style={{ fontSize: '12px', padding: '6px' }} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Option 2 *</label>
                                  <input type="text" required value={q.options[1]} onChange={(e) => handleQuizOptionChange(qIdx, 1, e.target.value)} className="form-input" placeholder="Option B" style={{ fontSize: '12px', padding: '6px' }} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Option 3</label>
                                  <input type="text" value={q.options[2]} onChange={(e) => handleQuizOptionChange(qIdx, 2, e.target.value)} className="form-input" placeholder="Option C (Optional)" style={{ fontSize: '12px', padding: '6px' }} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Option 4</label>
                                  <input type="text" value={q.options[3]} onChange={(e) => handleQuizOptionChange(qIdx, 3, e.target.value)} className="form-input" placeholder="Option D (Optional)" style={{ fontSize: '12px', padding: '6px' }} />
                                </div>
                              </div>

                              {/* Correct Option and Explanation */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Correct Option *</label>
                                  <select value={q.answer} onChange={(e) => handleQuizQuestionChange(qIdx, 'answer', e.target.value)} className="form-select" style={{ fontSize: '12px', padding: '6px' }}>
                                    <option value={0}>Option 1 (A)</option>
                                    <option value={1}>Option 2 (B)</option>
                                    {q.options[2] && <option value={2}>Option 3 (C)</option>}
                                    {q.options[3] && <option value={3}>Option 4 (D)</option>}
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Educational Explanation</label>
                                  <input type="text" value={q.explanation} onChange={(e) => handleQuizQuestionChange(qIdx, 'explanation', e.target.value)} className="form-input" placeholder="Why this is the correct answer..." style={{ fontSize: '12px', padding: '6px' }} />
                                </div>
                              </div>

                              {/* Advanced Fields: Attachment Image and Did You Know Fact */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>Attachment Image URL (Optional)</label>
                                  <input type="text" value={q.imageUrl || ''} onChange={(e) => handleQuizQuestionChange(qIdx, 'imageUrl', e.target.value)} className="form-input" placeholder="e.g. Unsplash URL or local image link" style={{ fontSize: '12px', padding: '6px' }} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#4B5563', display: 'block', marginBottom: '4px' }}>"Did You Know?" Fact (Optional)</label>
                                  <input type="text" value={q.didYouKnow || ''} onChange={(e) => handleQuizQuestionChange(qIdx, 'didYouKnow', e.target.value)} className="form-input" placeholder="e.g. Interesting educational context fact..." style={{ fontSize: '12px', padding: '6px' }} />
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: '15px', cursor: 'pointer', border: 'none', marginTop: '10px' }}>
                      {submitting ? 'Saving prep quiz...' : isEditMode ? 'Update Prep Quiz Suite' : 'Publish Prep Quiz Suite'}
                    </button>
                  </form>
                )}

                {/* 5. COMPANIES CREATION FORM */}
                {activeMenu === 'Companies' && (
                  <form onSubmit={handleCreateCompany}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1A1A2E', marginBottom: '16px' }}>
                      {isEditMode ? 'Edit Company Profile' : 'Add Company Profile'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Company Name *</label>
                        <input type="text" required value={companyNameField} onChange={(e) => setCompanyNameField(e.target.value)} className="form-input" placeholder="e.g. Tata Steel" />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Industry *</label>
                        <select value={companyIndustryField} onChange={(e) => setCompanyIndustryField(e.target.value)} className="form-select">
                          <option value="IT / Software">IT / Software</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Finance">Finance</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Telecommunications">Telecommunications</option>
                          <option value="FMCG">FMCG</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Custom Brand Color (HEX) *</label>
                        <input type="text" required value={companyColorField} onChange={(e) => setCompanyColorField(e.target.value)} className="form-input" placeholder="e.g. #2563EB" />
                      </div>

                      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={companyFeatured} onChange={(e) => setCompanyFeatured(e.target.checked)} />
                          Featured Organization
                        </label>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={companyRecentlyAdded} onChange={(e) => setCompanyRecentlyAdded(e.target.checked)} />
                          Recently Added
                        </label>
                      </div>
                    </div>

                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: '15px', cursor: 'pointer', border: 'none' }}>
                      {submitting ? 'Saving company...' : isEditMode ? 'Update Company Profile' : 'Publish Company Profile'}
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
