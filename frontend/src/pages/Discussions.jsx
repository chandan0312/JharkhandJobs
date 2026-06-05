import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  Tag, 
  MessageSquare, 
  BookOpen, 
  Trophy, 
  Briefcase, 
  PenTool, 
  CheckCircle, 
  HelpCircle, 
  TrendingUp, 
  Flame, 
  Wrench, 
  Lightbulb, 
  Send, 
  X,
  Pin,
  Eye,
  Award,
  ArrowLeft
} from 'lucide-react';

const Discussions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Selected thread detail state
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadAnswers, setThreadAnswers] = useState([]);
  const [answerContent, setAnswerContent] = useState('');
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  // Left side Discussion Categories selection
  const [selectedDiscussionCategory, setSelectedDiscussionCategory] = useState('All');
  
  // Middle Panel Discussions Feed tabs
  const [feedTab, setFeedTab] = useState('Latest'); // 'Latest', 'Unanswered', 'Most Answered'
  const [searchQuery, setSearchQuery] = useState('');

  // Ask Question Modal trigger state
  const [showAskModal, setShowAskModal] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionCategory, setQuestionCategory] = useState('General Career Guidance');
  const [questionBody, setQuestionBody] = useState('');

  // Discussions Feed State
  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(true);

  // Fetch discussions from API
  const fetchDiscussions = async () => {
    setLoadingDiscussions(true);
    try {
      const catParam = selectedDiscussionCategory !== 'All' ? `?category=${encodeURIComponent(selectedDiscussionCategory)}` : '';
      const response = await api.get(`/forums${catParam}`);
      if (response.data.success) {
        setDiscussions(response.data.forums || []);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoadingDiscussions(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [selectedDiscussionCategory]);

  // Handle clicking a thread
  const handleSelectThread = async (thread) => {
    setSelectedThread(thread);
    setLoadingAnswers(true);
    try {
      const response = await api.get(`/forums/${thread.slug}`);
      if (response.data.success) {
        setThreadAnswers(response.data.answers || []);
        // Increment views count locally
        setSelectedThread(prev => prev ? { ...prev, views: prev.views + 1 } : null);
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
    } finally {
      setLoadingAnswers(false);
    }
  };

  // Submit Answer / Reply action
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    if (!user) {
      alert('You must be logged in to submit an answer.');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/forums/${selectedThread._id || selectedThread.id}/answers`, {
        content: answerContent
      });
      if (response.data.success) {
        setThreadAnswers(prev => [...prev, response.data.answer]);
        setAnswerContent('');
        // Update reply count locally
        setSelectedThread(prev => prev ? { ...prev, replies: prev.replies + 1 } : null);
      }
    } catch (error) {
      console.error('Error posting answer:', error);
      alert('Failed to submit reply. Please try again.');
    }
  };

  // Submit Ask a Question action
  const handleAskSubmit = async (e) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionCategory) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!user) {
      alert('You must be logged in to ask a question.');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/forums', {
        title: questionTitle,
        category: questionCategory
      });
      
      if (response.data.success) {
        const newForum = response.data.forum;
        
        // If description body exists, submit it as the first reply answer automatically
        if (questionBody.trim() && newForum) {
          await api.post(`/forums/${newForum._id || newForum.id}/answers`, {
            content: questionBody
          });
        }
        
        // Clear inputs
        setQuestionTitle('');
        setQuestionBody('');
        setShowAskModal(false);
        fetchDiscussions();
        alert('Question submitted successfully!');
      }
    } catch (error) {
      console.error('Error creating discussion post:', error);
      alert('Failed to submit question. Please try again.');
    }
  };

  // Filter discussions locally
  const getFilteredDiscussions = () => {
    return discussions.filter(item => {
      // Category filter
      if (selectedDiscussionCategory !== 'All' && item.category !== selectedDiscussionCategory) return false;
      // Feed Tabs Filter
      if (feedTab === 'Unanswered' && item.replies > 0) return false;
      // Search query filter
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(s);
      }
      return true;
    }).sort((a, b) => {
      if (feedTab === 'Most Answered') {
        return b.replies - a.replies;
      }
      // default newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const filteredDiscussions = getFilteredDiscussions();

  // Static Categories data for Left Column listing
  const discussionCategoriesList = [
    { label: 'General Career Guidance', icon: HelpCircle },
    { label: 'Government Jobs', icon: Briefcase },
    { label: 'Private Jobs', icon: Briefcase },
    { label: 'Exam Preparation', icon: Award },
    { label: 'Higher Education', icon: BookOpen },
    { label: 'Skills & Certifications', icon: CheckCircle },
    { label: 'Interview Tips', icon: TrendingUp },
    { label: 'Resume & Profile Review', icon: PenTool },
    { label: 'Internships', icon: Calendar },
    { label: 'Other Topics', icon: Tag }
  ];

  // Static rankings data for Left Column listing
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
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* 1. Hero Section */}
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
              Discussion Forum
            </h1>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#16a34a', marginBottom: '8px' }}>
              Ask Questions, Share Answers & Learn Together
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '700px', lineHeight: '1.5', margin: 0 }}>
              Connect with fellow Jharkhand government job aspirants and experts. Get your doubts resolved instantly.
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
              onClick={() => { setSelectedThread(null); navigate('/discussions'); }} 
              className="career-nav-tab-item active"
            >
              <MessageSquare size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Discussions</span>
                <span className="career-nav-tab-subtitle">Ask & Answer</span>
              </div>
            </div>

            <div 
              onClick={() => navigate('/blog')} 
              className="career-nav-tab-item"
            >
              <BookOpen size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Articles & Blogs</span>
                <span className="career-nav-tab-subtitle">Read & Learn</span>
              </div>
            </div>

            <div 
              onClick={() => navigate('/quiz')} 
              className="career-nav-tab-item"
            >
              <Trophy size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Quizzes & Tests</span>
                <span className="career-nav-tab-subtitle">Practice GK</span>
              </div>
            </div>

          </div>

          {/* Ask question green button */}
          <button 
            onClick={() => {
              if (!user) {
                alert('You must be logged in to ask a question.');
                navigate('/login');
                return;
              }
              setShowAskModal(true);
            }} 
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
              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)',
              cursor: 'pointer'
            }}
          >
            <PenTool size={16} fill="white" /> Ask a Question
          </button>

        </div>
      </div>

      {/* 3. Main Dashboard grid container */}
      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* Search and filter bar for discussions */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          backgroundColor: 'white',
          padding: '16px',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              placeholder="Search JSSC strategy, preparation books, qualifications, or queries..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 44px',
                fontSize: '13.5px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                color: '#334155',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="btn btn-ghost"
              style={{ padding: '0 12px', fontSize: '13px' }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="career-grid-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
          
          {/* COLUMN 1: Left Categories and Rankings */}
          <aside>
            
            {/* Widget A: Discussion Categories list */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A' }}>Forum Categories</h3>
                <span onClick={() => setSelectedDiscussionCategory('All')} style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {discussionCategoriesList.map((catItem) => {
                  const Icon = catItem.icon;
                  const isActive = selectedDiscussionCategory === catItem.label;
                  return (
                    <div 
                      key={catItem.label} 
                      onClick={() => { setSelectedThread(null); setSelectedDiscussionCategory(isActive ? 'All' : catItem.label); }} 
                      className={`quick-filter-item ${isActive ? 'active' : ''}`}
                      style={{ 
                        padding: '8px 10px', 
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: isActive ? '#f0fdf4' : 'transparent',
                        color: isActive ? '#16a34a' : '#475569'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={14} style={{ color: isActive ? '#16a34a' : '#94A3B8' }} /> {catItem.label}
                      </span>
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
                  <div key={userObj.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>
                      #{userObj.rank}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* COLUMN 2: Middle Community Discussions Board */}
          <main style={{ minWidth: 0 }}>
            
            {selectedThread ? (
              /* Thread Detail Subview */
              <div className="card" style={{ padding: '28px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                {/* Back Button */}
                <button 
                  onClick={() => setSelectedThread(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    padding: '4px 0'
                  }}
                >
                  <ArrowLeft size={16} /> Back to Forums
                </button>

                {/* Topic Title */}
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 10px 0', lineHeight: '1.3' }}>
                  {selectedThread.title}
                </h2>

                {/* Metadata Row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ fontWeight: '800', color: '#0F172A' }}>{selectedThread.author}</span>
                  <span>•</span>
                  <span style={{ color: '#16a34a' }}>{selectedThread.category}</span>
                  <span>•</span>
                  <span>{new Date(selectedThread.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{selectedThread.views} Views</span>
                  <span>•</span>
                  <span>{selectedThread.replies} Replies</span>
                </div>

                {/* Replies / Answers Section */}
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>Replies & Answers</h3>
                
                {loadingAnswers ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>Loading replies...</div>
                ) : threadAnswers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    {threadAnswers.map((answer, index) => (
                      <div key={answer._id || answer.id} style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: index === 0 ? '#f0fdf4' : '#F8FAFC', borderRadius: '12px', border: index === 0 ? '1px dashed #bbf7d0' : '1px solid #E2E8F0' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: index === 0 ? '#16a34a' : '#4B5563', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                          {answer.author.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                              {answer.author} {index === 0 && <span style={{ fontSize: '10px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Author / Question Details</span>}
                            </span>
                            <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                              {new Date(answer.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.5', margin: 0 }}>
                            {answer.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '13px', marginBottom: '32px' }}>
                    No replies yet. Be the first to reply below!
                  </div>
                )}

                {/* Add Reply Form */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>Write your answer</h4>
                  {user ? (
                    <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <textarea
                        rows="4"
                        placeholder="Type your helpful answer or response here..."
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          fontSize: '13.5px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          resize: 'vertical'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          alignSelf: 'flex-end',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          padding: '10px 24px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Send size={14} /> Submit Reply
                      </button>
                    </form>
                  ) : (
                    <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
                      Please <Link to="/login" style={{ color: '#16a34a', fontWeight: '700' }}>log in</Link> to reply or contribute to this topic.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Forum List View */
              <>
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
                  </div>

                </div>

                {/* Feed sorting and selectors */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                      {selectedDiscussionCategory === 'All' ? 'Latest Discussions' : `${selectedDiscussionCategory} Feed`}
                    </span>
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
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            outline: 'none'
                          }}
                        >
                          {tabOpt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span onClick={() => { setSelectedDiscussionCategory('All'); setSearchQuery(''); }} style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>Reset Filters</span>
                </div>

                {/* Discussions feed items */}
                <div>
                  {loadingDiscussions ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>Loading discussions...</div>
                  ) : filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map((item) => (
                      <div 
                        key={item._id || item.id} 
                        onClick={() => handleSelectThread(item)}
                        className="discussion-row-card"
                        style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                      >
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div className="discussion-avatar" style={{ backgroundColor: item.avatarBg || '#16a34a' }}>
                            {item.author.charAt(0).toUpperCase()}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{item.title}</h3>
                            </div>

                            {/* Metadata row */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: '#64748B', fontWeight: '500', marginBottom: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>{item.author}</span>
                              <span>•</span>
                              <span style={{ color: '#16a34a', fontWeight: '700' }}>{item.category}</span>
                              <span>•</span>
                              <span>{new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>

                            {/* Stats metrics row */}
                            <div style={{ display: 'flex', gap: '18px', fontSize: '12px', color: '#64748B', fontWeight: '600', alignItems: 'center' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                                <CheckCircle size={14} style={{ color: '#22c55e' }} /> {item.replies} Replies
                              </span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Eye size={14} style={{ color: '#94A3B8' }} /> {item.views} Views
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="card text-center" style={{ padding: '60px 40px', color: '#64748B', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                      <AlertCircle size={36} style={{ margin: '0 auto 16px', color: '#94A3B8' }} />
                      <h3 style={{ fontSize: '15.5px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>No discussions found</h3>
                      <p style={{ fontSize: '13px', maxWidth: '360px', margin: '0 auto' }}>
                        Be the first to start a conversation in this category! Click "Ask a Question" above.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom reset feed */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', marginBottom: '24px' }}>
                  <button 
                    onClick={() => { setSelectedDiscussionCategory('All'); setFeedTab('Latest'); setSearchQuery(''); }} 
                    className="btn btn-ghost" 
                    style={{ 
                      borderColor: '#16a34a', 
                      color: '#16a34a', 
                      fontWeight: '700',
                      borderRadius: '8px',
                      padding: '10px 24px',
                      backgroundColor: 'transparent',
                      border: '1.5px solid #16a34a',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Feed & View All Discussions
                  </button>
                </div>
              </>
            )}

          </main>

        </div>
      </div>

      {/* 4. Bottom Horizontal Tickers grid */}
      <div className="container">
        <div className="career-bottom-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
          
          {/* Widget A: Popular Topics Tag pills */}
          <div className="career-pills-row" style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Flame size={16} style={{ color: '#f97316' }} /> Popular Topics
              </h4>
              <span onClick={() => setSelectedDiscussionCategory('All')} style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['JSSC', 'JPSC', 'SSC CGL', 'Banking', 'Railway', 'Teaching', 'Police', 'Defence', 'IT Jobs', 'Internship'].map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => {
                    setSelectedThread(null);
                    setSelectedDiscussionCategory(tag === 'JSSC' || tag === 'JPSC' ? 'Government Jobs' : 'All');
                    setSearchQuery(tag);
                  }}
                  className="popular-tag"
                  style={{ 
                    fontSize: '11px', 
                    padding: '4px 12px', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '20px', 
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer' 
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Widget B: Career Tools Grid */}
          <div className="career-pills-row" style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Wrench size={16} style={{ color: '#16a34a' }} /> Quick Tools
              </h4>
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', width: '100%' }}>
              
              <div onClick={() => navigate('/blog')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <PenTool size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Resume Tips</span>
              </div>

              <div onClick={() => navigate('/quiz')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <CheckCircle size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Mock Tests</span>
              </div>

              <div onClick={() => navigate('/quiz')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <MessageSquare size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Interview Prep</span>
              </div>

              <div onClick={() => navigate('/blog')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, cursor: 'pointer' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eefdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 2px 5px rgba(22, 163, 74, 0.15)' }}>
                  <BookOpen size={16} />
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#334155', lineHeight: '1.2' }}>Skill Courses</span>
              </div>

            </div>
          </div>

          {/* Widget C: Daily Tip Box */}
          <div className="daily-tip-box" style={{ backgroundColor: '#edfbf2', border: '1px solid rgba(22, 163, 74, 0.15)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center' }}>
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
                  "Consistent practice is the key to cracking any government exam. Take daily mini-quizzes to stay sharp."
                </p>
              </div>
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
            overflow: 'hidden'
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
                style={{ color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none' }}
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
                  style={{ 
                    fontSize: '13.5px', 
                    padding: '10px 14px',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    outline: 'none'
                  }}
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
                  style={{ 
                    fontSize: '13.5px', 
                    padding: '10px 14px',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
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
                  style={{ 
                    fontSize: '13.5px', 
                    padding: '10px 14px', 
                    resize: 'vertical',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAskModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', border: '1px solid #CBD5E1', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
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

export default Discussions;
