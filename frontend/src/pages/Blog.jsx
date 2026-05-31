import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  Tag, 
  ChevronRight, 
  Home, 
  MessageSquare, 
  BookOpen, 
  Trophy, 
  Briefcase, 
  PenTool, 
  Plus, 
  Heart, 
  Bookmark, 
  Eye, 
  Award,
  Pin,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Flame,
  Wrench,
  Lightbulb,
  Send,
  X
} from 'lucide-react';

const Blog = () => {
  const location = useLocation();
  // DB Blogs state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Layout view tabs
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Discussions', 'Articles', 'Stories', 'Tools'
  
  // Left side Discussion Categories selection
  const [selectedDiscussionCategory, setSelectedDiscussionCategory] = useState('All');
  
  // Middle Panel Discussions Feed tabs
  const [feedTab, setFeedTab] = useState('Latest'); // 'Latest', 'Unanswered', 'Most Answered'
  
  // Interactive Bookmarks/Likes for Articles
  const [likedArticles, setLikedArticles] = useState({});
  const [bookmarkedArticles, setBookmarkedArticles] = useState({});

  // Ask Question Modal trigger state
  const [showAskModal, setShowAskModal] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionCategory, setQuestionCategory] = useState('General Career Guidance');
  const [questionName, setQuestionName] = useState('');
  const [questionBody, setQuestionBody] = useState('');

  // Discussions Feed State (seeded with the exact mockup items!)
  const [discussions, setDiscussions] = useState([
    {
      id: 'd1',
      title: 'How to prepare for JPSC Civil Services Exam?',
      author: 'Aspirant_JH01',
      category: 'Government Jobs',
      date: '2 days ago',
      excerpt: 'I am a beginner. Please suggest a complete strategy and best books for JPSC Civil Services Examination.',
      comments: 26,
      answers: 48,
      views: '1.2K',
      pinned: true,
      avatarChar: 'S',
      avatarBg: '#a855f7'
    },
    {
      id: 'd2',
      title: 'Which courses are best after 12th for a government job?',
      author: 'Riya Kumari',
      category: 'General Career Guidance',
      date: '3 hours ago',
      excerpt: 'I am in 12th class (Arts). Please suggest some good courses that can help me in preparing for government jobs.',
      comments: 12,
      answers: 18,
      views: 356,
      pinned: false,
      avatarChar: 'R',
      avatarBg: '#22c55e'
    },
    {
      id: 'd3',
      title: 'How to crack SSC CGL in first attempt?',
      author: 'Abhishek Kr',
      category: 'Exam Preparation',
      date: '5 hours ago',
      excerpt: 'Please share your study plan, timetable and important tips to crack SSC CGL in first attempt.',
      comments: 8,
      answers: 14,
      views: 278,
      pinned: false,
      avatarChar: 'A',
      avatarBg: '#f97316'
    },
    {
      id: 'd4',
      title: 'Is MBA worth it for a government job?',
      author: 'Pooja Singh',
      category: 'Higher Education',
      date: '1 day ago',
      excerpt: 'I want to pursue MBA but confused if it is useful for government jobs. Please guide.',
      comments: 6,
      answers: 9,
      views: 192,
      pinned: false,
      avatarChar: 'P',
      avatarBg: '#3b82f6'
    },
    {
      id: 'd5',
      title: 'Best resume format for freshers?',
      author: 'Deepak Kumar',
      category: 'Resume & Profile Review',
      date: '2 hours ago',
      excerpt: 'I am a fresher. Please suggest the best resume format for applying in private companies.',
      comments: 4,
      answers: 7,
      views: 153,
      pinned: false,
      avatarChar: 'D',
      avatarBg: '#a855f7'
    }
  ]);

  // Seed default static articles matching mockup right sidebar
  const defaultArticlesFallback = [
    {
      _id: 'a1',
      title: 'How to Crack JSSC CGL 2024 Complete Strategy',
      category: 'Exam Preparation',
      publishedDate: new Date('2026-05-28'),
      views: '2.4K',
      likes: 120,
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&auto=format&fit=crop'
    },
    {
      _id: 'a2',
      title: 'Top 10 Government Jobs After Graduation in Jharkhand',
      category: 'Career Guide',
      publishedDate: new Date('2026-05-27'),
      views: '1.8K',
      likes: 98,
      readTime: '6 min read',
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300&auto=format&fit=crop'
    },
    {
      _id: 'a3',
      title: 'Resume Writing Guide for Freshers (With Examples)',
      category: 'Resume Tips',
      publishedDate: new Date('2026-05-26'),
      views: '1.6K',
      likes: 85,
      readTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=300&auto=format&fit=crop'
    },
    {
      _id: 'a4',
      title: 'Top Private Companies Hiring in Jharkhand (2024)',
      category: 'Private Jobs',
      publishedDate: new Date('2026-05-25'),
      views: '1.3K',
      likes: 76,
      readTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop'
    },
    {
      _id: 'a5',
      title: 'Interview Preparation Tips to Crack Any Interview',
      category: 'Interview Tips',
      publishedDate: new Date('2026-05-24'),
      views: '1.1K',
      likes: 66,
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'discussions') {
      setActiveTab('Discussions');
    } else if (tabParam === 'articles') {
      setActiveTab('Articles');
    } else if (tabParam === 'stories') {
      setActiveTab('Stories');
    } else if (tabParam === 'tools') {
      setActiveTab('Tools');
    } else {
      setActiveTab('Overview');
    }
  }, [location.search]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/blog');
      if (response.data.success && response.data.posts.length > 0) {
        // Hydrate backend values with formatted fallbacks for missing columns
        const backendPosts = response.data.posts.map((post, idx) => ({
          ...post,
          readTime: idx % 2 === 0 ? '5 min read' : '6 min read',
          likes: 50 + (idx * 15),
          views: post.views || (1200 + (idx * 250))
        }));
        setPosts(backendPosts);
      } else {
        setPosts(defaultArticlesFallback);
      }
    } catch (err) {
      console.error(err);
      setPosts(defaultArticlesFallback);
    } finally {
      setLoading(false);
    }
  };

  // Submit Ask a Question action (dynamically adds to community feed!)
  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!questionTitle || !questionBody || !questionName) return;

    const char = questionName.trim().charAt(0).toUpperCase();
    const colors = ['#a855f7', '#22c55e', '#f97316', '#3b82f6', '#ec4899', '#ef4444'];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    const newQuestion = {
      id: 'd-user-' + Date.now(),
      title: questionTitle,
      author: questionName,
      category: questionCategory,
      date: 'Just now',
      excerpt: questionBody,
      comments: 0,
      answers: 0,
      views: 1,
      pinned: false,
      avatarChar: char,
      avatarBg: randomBg
    };

    setDiscussions([newQuestion, ...discussions]);
    
    // Clear inputs
    setQuestionTitle('');
    setQuestionBody('');
    setQuestionName('');
    setShowAskModal(false);
  };

  const handleLikeToggle = (id) => {
    setLikedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleBookmarkToggle = (id) => {
    setBookmarkedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter discussions locally on selected category and feed tabs
  const getFilteredDiscussions = () => {
    return discussions.filter(item => {
      // Category filter
      if (selectedDiscussionCategory !== 'All' && item.category !== selectedDiscussionCategory) return false;
      // Feed Tabs Filter
      if (feedTab === 'Unanswered' && item.answers > 0) return false;
      return true;
    }).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (feedTab === 'Most Answered') {
        return b.answers - a.answers;
      }
      return 0; // Default order
    });
  };

  const filteredDiscussions = getFilteredDiscussions();

  // Static Categories data for Left Column listing
  const discussionCategoriesList = [
    { label: 'General Career Guidance', count: 245, icon: HelpCircle },
    { label: 'Government Jobs', count: 368, icon: Briefcase },
    { label: 'Private Jobs', count: 198, icon: Briefcase },
    { label: 'Exam Preparation', count: 278, icon: Award },
    { label: 'Higher Education', count: 154, icon: BookOpen },
    { label: 'Skills & Certifications', count: 112, icon: CheckCircle },
    { label: 'Interview Tips', count: 89, icon: TrendingUp },
    { label: 'Resume & Profile Review', count: 76, icon: PenTool },
    { label: 'Internships', count: 45, icon: Calendar },
    { label: 'Other Topics', count: 63, icon: Tag }
  ];

  // Static rankings data for Left Column listing with high fidelity Avatars
  const contributorsList = [
    { 
      name: 'Aspirant_JH01', 
      points: '2,450 Points', 
      medal: 'gold', 
      rank: 1, 
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' 
    },
    { 
      name: 'Career_Expert', 
      points: '2,120 Points', 
      medal: 'silver', 
      rank: 2, 
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' 
    },
    { 
      name: 'StudyWithAman', 
      points: '1,980 Points', 
      medal: 'bronze', 
      rank: 3, 
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100' 
    },
    { 
      name: 'Ranchi_Boy', 
      points: '1,730 Points', 
      rank: 4, 
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' 
    },
    { 
      name: 'Jharkhand_Star', 
      points: '1,420 Points', 
      rank: 5, 
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' 
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* 1. Compact Banner Hero section without right-side illustration */}
      <section className="career-hero-wrapper" style={{ padding: '24px 0 36px' }}>
        <div className="container">
          <div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#0F172A', 
              lineHeight: '1.2', 
              marginBottom: '2px',
              letterSpacing: '-0.5px'
            }}>
              Career Guide
            </h1>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#16a34a', marginBottom: '8px' }}>
              Learn, Discuss & Grow Your Career
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '700px', lineHeight: '1.5', margin: 0 }}>
              Get expert guidance, read useful articles and connect with aspirants.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Sub-navigation tabs block with green Ask Question CTA */}
      <div className="container">
        <div className="career-sub-nav">
          
          {/* Card tab headers */}
          <div className="career-nav-tabs">
            
            <div 
              onClick={() => setActiveTab('Overview')} 
              className={`career-nav-tab-item ${activeTab === 'Overview' ? 'active' : ''}`}
            >
              <Home size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Overview</span>
                <span className="career-nav-tab-subtitle">Community Home</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('Discussions')} 
              className={`career-nav-tab-item ${activeTab === 'Discussions' ? 'active' : ''}`}
            >
              <MessageSquare size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Discussions</span>
                <span className="career-nav-tab-subtitle">Ask & Answer</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('Overview')} 
              className="career-nav-tab-item"
            >
              <BookOpen size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Articles & Blogs</span>
                <span className="career-nav-tab-subtitle">Read & Learn</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('Overview')} 
              className="career-nav-tab-item"
            >
              <Trophy size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Success Stories</span>
                <span className="career-nav-tab-subtitle">Get Inspired</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('Overview')} 
              className="career-nav-tab-item"
            >
              <Briefcase size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Career Tools</span>
                <span className="career-nav-tab-subtitle">Resources</span>
              </div>
            </div>

          </div>

          {/* Ask question green button */}
          <button 
            onClick={() => setShowAskModal(true)} 
            className="btn btn-primary" 
            style={{ 
              backgroundColor: '#16a34a', 
              color: 'white',
              borderRadius: '8px', 
              fontSize: '14px',
              fontWeight: '700',
              padding: '10px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)'
            }}
          >
            <PenTool size={16} fill="white" /> Ask a Question
          </button>

        </div>
      </div>

      {/* 3. Main Dashboard grid container */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="career-grid-layout">
          
          {/* COLUMN 1: Left Categories and Rankings */}
          <aside>
            
            {/* Widget A: Discussion Categories list */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A' }}>Discussion Categories</h3>
                <span onClick={() => setSelectedDiscussionCategory('All')} style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {discussionCategoriesList.map((catItem) => {
                  const Icon = catItem.icon;
                  const isActive = selectedDiscussionCategory === catItem.label;
                  return (
                    <div 
                      key={catItem.label} 
                      onClick={() => setSelectedDiscussionCategory(isActive ? 'All' : catItem.label)} 
                      className={`quick-filter-item ${isActive ? 'active' : ''}`}
                      style={{ padding: '8px 10px', fontSize: '13px' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={14} style={{ color: isActive ? '#16a34a' : '#94A3B8' }} /> {catItem.label}
                      </span>
                      <span className="quick-filter-count" style={{ fontSize: '10.5px', padding: '2px 8px' }}>{catItem.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget B: Top Contributors */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A' }}>Top Contributors</h3>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {contributorsList.map((userObj) => (
                  <div key={userObj.name} className="contributor-item-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      
                      {/* Avatar Photo representing professional community */}
                      <img 
                        src={userObj.avatarUrl} 
                        alt={userObj.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid #F1F5F9'
                        }}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155' }}>{userObj.name}</span>
                        <span style={{ fontSize: '10px', color: '#64748B' }}>{userObj.points}</span>
                      </div>

                    </div>

                    {/* Rank badges styled as modern circles with custom shadows */}
                    <span className={`contributor-rank-badge ${userObj.medal || 'normal'}`}>
                      {userObj.rank}
                    </span>

                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* COLUMN 2: Middle Community Discussions Board */}
          <main style={{ minWidth: 0 }}>
            
            {/* Community Welcome card widget */}
            <div className="career-sidebar-widget" style={{ 
              background: '#edfbf2', 
              border: '1px solid rgba(22, 163, 74, 0.15)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
              marginBottom: '24px'
            }}>
              
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: '1 1 300px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '8px', 
                  backgroundColor: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#16a34a',
                  boxShadow: '0 2px 4px rgba(15, 23, 42, 0.05)',
                  flexShrink: 0
                }}>
                  <Pin size={18} style={{ transform: 'rotate(45deg)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#14532d', marginBottom: '4px' }}>Welcome to the Career Community! 👋</h4>
                  <p style={{ fontSize: '12.5px', color: '#166534', lineHeight: '1.5' }}>
                    Ask your doubts, share knowledge and help others in their career journey.
                  </p>
                </div>
              </div>

              {/* Stats pills aligned row */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderLeft: '1px solid rgba(22, 163, 74, 0.15)', paddingLeft: '20px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#14532d', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare size={13} style={{ color: '#16a34a' }} /> 1,258
                  </span>
                  <span style={{ fontSize: '10px', color: '#166534', fontWeight: '500' }}>Discussions</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#14532d', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={13} style={{ color: '#16a34a' }} /> 3,842
                  </span>
                  <span style={{ fontSize: '10px', color: '#166534', fontWeight: '500' }}>Answers</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#14532d', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} style={{ color: '#16a34a' }} /> 6,214
                  </span>
                  <span style={{ fontSize: '10px', color: '#166534', fontWeight: '500' }}>Members</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} /> 128
                  </span>
                  <span style={{ fontSize: '10px', color: '#166534', fontWeight: '500' }}>Online Now</span>
                </div>

              </div>

            </div>

            {/* Feed sorting and selectors */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>Latest Discussions</span>
                <div style={{ display: 'flex', gap: '16px', marginLeft: '12px' }}>
                  {['Latest', 'Unanswered', 'Most Answered'].map(tabOpt => (
                    <button 
                      key={tabOpt} 
                      onClick={() => setFeedTab(tabOpt)} 
                      style={{ 
                        fontSize: '12.5px', 
                        fontWeight: '700', 
                        color: feedTab === tabOpt ? '#16a34a' : '#64748B',
                        borderBottom: feedTab === tabOpt ? '2px solid #16a34a' : '2px solid transparent',
                        paddingBottom: '8px',
                        marginBottom: '-9px',
                        cursor: 'pointer'
                      }}
                    >
                      {tabOpt}
                    </button>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
            </div>

            {/* Discussions feed items */}
            <div>
              {filteredDiscussions.length > 0 ? (
                filteredDiscussions.map((item) => (
                  <div key={item.id} className="discussion-row-card">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      
                      {/* Avatar circle */}
                      <div className="discussion-avatar" style={{ backgroundColor: item.avatarBg }}>
                        {item.avatarChar}
                      </div>

                      {/* Info items */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          
                          {/* Pinned badge */}
                          {item.pinned && (
                            <span style={{ 
                              backgroundColor: '#fef3c7', 
                              color: '#d97706', 
                              fontSize: '10px', 
                              fontWeight: '700',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              📌 Pinned
                            </span>
                          )}

                          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{item.title}</h3>
                        </div>

                        {/* Metadata row */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: '#64748B', fontWeight: '500', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '700', color: '#475569' }}>{item.author}</span>
                          <span>•</span>
                          <span style={{ color: '#16a34a', fontWeight: '700' }}>{item.category}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>

                        {/* Excerpt body */}
                        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                          {item.excerpt}
                        </p>

                        {/* Stats metrics row - exact icons and numbers */}
                        <div style={{ display: 'flex', gap: '18px', fontSize: '12px', color: '#64748B', fontWeight: '600', alignItems: 'center' }}>
                          
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <MessageSquare size={14} style={{ color: '#94A3B8' }} /> {item.comments}
                          </span>

                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                            <CheckCircle size={14} style={{ color: '#22c55e' }} /> {item.answers}
                          </span>

                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Eye size={14} style={{ color: '#94A3B8' }} /> {item.views}
                          </span>

                        </div>

                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center" style={{ padding: '60px 40px', color: '#64748B' }}>
                  <AlertCircle size={36} style={{ margin: '0 auto 16px', color: '#94A3B8' }} />
                  <h3 style={{ fontSize: '15.5px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>No discussions found</h3>
                  <p style={{ fontSize: '13px', maxWidth: '360px', margin: '0 auto' }}>
                    Be the first to start a conversation in this category! Click "Ask a Question" above.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom load more discussions */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', marginBottom: '24px' }}>
              <button 
                onClick={() => { setSelectedDiscussionCategory('All'); setFeedTab('Latest'); }} 
                className="btn btn-ghost" 
                style={{ 
                  borderColor: '#16a34a', 
                  color: '#16a34a', 
                  fontWeight: '700',
                  borderRadius: '8px',
                  padding: '10px 24px'
                }}
              >
                View All Discussions
              </button>
            </div>

          </main>

          {/* COLUMN 3: Right Side Articles widget feed */}
          <aside>
            
            {/* Visual Articles widget */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A' }}>Latest Articles & Blogs</h3>
                <span onClick={fetchBlogs} style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #16a34a', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {posts.slice(0, 5).map((post) => {
                    const isLiked = !!likedArticles[post._id];
                    const isBookmarked = !!bookmarkedArticles[post._id];
                    return (
                      <div key={post._id} className="article-visual-card">
                        
                        {/* Thumbnail cover rounded */}
                        <div 
                          className="article-visual-img" 
                          style={{ backgroundImage: `url(${post.coverImage || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200&auto=format&fit=crop'})` }}
                        />

                        {/* Details */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '72px', minWidth: 0 }}>
                          <h4 className="article-visual-title" style={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {post.title}
                          </h4>
                          
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                            {post.category || 'Exam Prep'} • {post.readTime || '5 min read'}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                            
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                <Eye size={12} /> {post.views}
                              </span>
                              <button 
                                onClick={() => handleLikeToggle(post._id)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: isLiked ? '#ef4444' : '#94A3B8', cursor: 'pointer' }}
                              >
                                <Heart size={12} fill={isLiked ? '#ef4444' : 'transparent'} /> 
                                <span>{isLiked ? (parseInt(post.likes) + 1) : post.likes}</span>
                              </button>
                            </div>

                            <button 
                              onClick={() => handleBookmarkToggle(post._id)}
                              style={{ color: isBookmarked ? '#16a34a' : '#94A3B8', cursor: 'pointer' }}
                            >
                              <Bookmark size={12} fill={isBookmarked ? '#16a34a' : 'transparent'} />
                            </button>

                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </aside>

        </div>
      </div>

      {/* 4. Bottom Horizontal Tickers grid (Perfectly side-by-side) */}
      <div className="container">
        <div className="career-bottom-layout">
          
          {/* Widget A: Popular Topics Tag pills */}
          <div className="career-pills-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Flame size={16} style={{ color: '#f97316' }} /> Popular Topics
              </h4>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['JSSC', 'JPSC', 'SSC CGL', 'Banking', 'Railway', 'Teaching', 'Police', 'Defence', 'IT Jobs', 'Internship'].map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => setSelectedDiscussionCategory(tag === 'JSSC' || tag === 'JPSC' ? 'Government Jobs' : 'All')}
                  className="popular-tag"
                  style={{ fontSize: '11px', padding: '4px 12px' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Widget B: Career Tools Grid */}
          <div className="career-pills-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Wrench size={16} style={{ color: '#16a34a' }} /> Career Tools
              </h4>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', width: '100%' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <PenTool size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Resume Builder</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <CheckCircle size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Mock Tests</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <MessageSquare size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Interview Prep</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <BookOpen size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Skill Courses</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <TrendingUp size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Career Roadmap</span>
              </div>

            </div>
          </div>

          {/* Widget C: Daily Tip Box with Flying Rocket SVG Outline */}
          <div className="daily-tip-box">
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#d97706',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)',
                flexShrink: 0
              }}>
                <Lightbulb size={18} />
              </div>
              <div>
                <h5 style={{ fontSize: '13.5px', fontWeight: '800', color: '#166534', margin: '0 0 2px' }}>Daily Career Tip</h5>
                <p style={{ fontSize: '12px', color: '#14532d', fontWeight: '500', lineHeight: '1.4', margin: 0 }}>
                  "The future depends on what you do today. Build skills, stay consistent and success will follow."
                </p>
              </div>
            </div>
            
            {/* Outline Rocket flying up SVG Drawing */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(45deg)', opacity: 0.85 }}>
                <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
                <path d="M12 9c.5-2.5 1.5-4.5 4-5.5s4.5.5 5.5 4-1.5 4-5.5 4" />
                <path d="M9 15c-2.5-.5-4.5-1.5-5.5-4s.5-4.5 4-5.5 4 1.5 4 5.5" />
                <path d="M19 5l-4 4" />
                <path d="M14 10l-4 4" />
                <path d="M12 15l-3 3" />
                <path d="M15 12l-3 3" />
              </svg>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Interactive "Ask a Question" Modal form */}
      {showAskModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }}>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '540px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            animation: 'scaleIn 0.3s ease forwards'
          }}>
            
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 24px',
              borderBottom: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <MessageSquare size={18} style={{ color: '#16a34a' }} /> Ask a New Question
              </h3>
              <button 
                onClick={() => setShowAskModal(false)}
                style={{ color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAskSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Select Category</label>
                <select 
                  value={questionCategory} 
                  onChange={(e) => setQuestionCategory(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '13.5px', padding: '10px 14px' }}
                >
                  {discussionCategoriesList.map(item => (
                    <option key={item.label} value={item.label}>{item.label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Your Question Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Which JPSC pre study books should I refer?"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  required
                  className="form-input"
                  style={{ fontSize: '13.5px', padding: '10px 14px' }}
                />
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Your Screen Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ranchi_Boy, Aman_JH"
                  value={questionName}
                  onChange={(e) => setQuestionName(e.target.value)}
                  required
                  className="form-input"
                  style={{ fontSize: '13.5px', padding: '10px 14px' }}
                />
              </div>

              {/* Body */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Question Details / Description</label>
                <textarea 
                  rows="4" 
                  placeholder="Provide any details that will help experts answer your question..."
                  value={questionBody}
                  onChange={(e) => setQuestionBody(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '13.5px', padding: '10px 14px', resize: 'vertical' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAskModal(false)}
                  className="btn btn-ghost"
                  style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ backgroundColor: '#16a34a', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={14} /> Submit Question
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Blog;
