import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  Tag, 
  ChevronRight, 
  MessageSquare, 
  BookOpen, 
  Trophy, 
  Briefcase, 
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
  ArrowRight
} from 'lucide-react';

const Blog = () => {
  const navigate = useNavigate();
  // DB Blogs state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active category filter & search query
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Bookmarks/Likes for Articles
  const [likedArticles, setLikedArticles] = useState({});
  const [bookmarkedArticles, setBookmarkedArticles] = useState({});

  // Seed default static articles matching mockup right sidebar
  const defaultArticlesFallback = [
    {
      _id: 'a1',
      title: 'How to Crack JSSC CGL 2024 Complete Strategy',
      excerpt: 'Struggling with JSSC CGL preparation? Get the complete step-by-step preparation plan, exam pattern insights, local language paper selection, and list of recommended books from top Jharkhand civil servants.',
      category: 'Exam Preparation',
      author: 'Exam Expert Team',
      publishedDate: new Date('2026-05-28'),
      views: '2.4K',
      likes: 120,
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'
    },
    {
      _id: 'a2',
      title: 'Top 10 Government Jobs After Graduation in Jharkhand',
      excerpt: 'Discover the most rewarding state government careers, salary structures, growth avenues, and entry criteria for public sector job vacancies in Jharkhand for graduates.',
      category: 'Career Guide',
      author: 'Job Market Analyst',
      publishedDate: new Date('2026-05-27'),
      views: '1.8K',
      likes: 98,
      readTime: '6 min read',
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'
    },
    {
      _id: 'a3',
      title: 'Resume Writing Guide for Freshers (With Examples)',
      excerpt: 'Learn the exact resume template that catches recruiters eyes at Tata Steel, HCL, and other top employers hiring in Jharkhand. Includes sample downloads for engineering and general stream freshers.',
      category: 'Resume Tips',
      author: 'HR Recruiter Specialist',
      publishedDate: new Date('2026-05-26'),
      views: '1.6K',
      likes: 85,
      readTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop'
    },
    {
      _id: 'a4',
      title: 'Top Private Companies Hiring in Jharkhand (2024)',
      excerpt: 'An in-depth review of private sector industries expanding operations in Jamshedpur, Ranchi, and Bokaro, listing direct recruitment drives, internship options, and package estimates.',
      category: 'Private Jobs',
      author: 'HR Recruiter Specialist',
      publishedDate: new Date('2026-05-25'),
      views: '1.3K',
      likes: 76,
      readTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
    },
    {
      _id: 'a5',
      title: 'Interview Preparation Tips to Crack Any Interview',
      excerpt: 'Facing behavioral interviews or JPSC viva panels? Learn best practice tactics, body language etiquette, dress codes, and how to effectively answer hard domain questions with confidence.',
      category: 'Interview Tips',
      author: 'Career Expert',
      publishedDate: new Date('2026-05-24'),
      views: '1.1K',
      likes: 66,
      readTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  // Filter articles based on category and search query
  const getFilteredArticles = () => {
    return posts.filter(post => {
      // Category filter
      if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
      // Search query filter
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(s) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(s))
        );
      }
      return true;
    });
  };

  const filteredArticles = getFilteredArticles();

  // Static Categories for Articles
  const articleCategoriesList = [
    'All',
    'Exam Preparation',
    'Career Guide',
    'Resume Tips',
    'Private Jobs',
    'Interview Tips'
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* 1. Hero section */}
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
              Career Guide & Blogs
            </h1>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#16a34a', marginBottom: '8px' }}>
              Expert Articles, Study Strategies & Guidance
            </h3>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '700px', lineHeight: '1.5', margin: 0 }}>
              Read premium articles written by educators, HR specialists, and civil servants to stay ahead in your career journey.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Sub-navigation tabs block */}
      <div className="container">
        <div className="career-sub-nav">
          
          <div className="career-nav-tabs">
            
            <div 
              onClick={() => navigate('/discussions')} 
              className="career-nav-tab-item"
            >
              <MessageSquare size={18} />
              <div className="career-nav-tab-text">
                <span className="career-nav-tab-title">Discussions</span>
                <span className="career-nav-tab-subtitle">Ask & Answer</span>
              </div>
            </div>

            <div 
              onClick={() => navigate('/blog')} 
              className="career-nav-tab-item active"
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

          <button 
            onClick={() => navigate('/discussions')} 
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
            <MessageSquare size={16} fill="white" /> Go to Discussions
          </button>

        </div>
      </div>

      {/* 3. Main Dashboard grid container */}
      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* Search bar specifically for articles */}
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
              placeholder="Search JSSC strategy, private company updates, resume guides, interview tips..." 
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

        <div className="career-grid-layout" style={{ gridTemplateColumns: '260px 1fr 310px' }}>
          
          {/* COLUMN 1: Article Categories */}
          <aside>
            <div className="card" style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A' }}>Categories</h3>
                <span onClick={() => setSelectedCategory('All')} style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>Clear</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {articleCategoriesList.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <div 
                      key={category} 
                      onClick={() => setSelectedCategory(category)} 
                      className={`quick-filter-item ${isActive ? 'active' : ''}`}
                      style={{ padding: '8px 10px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={14} style={{ color: isActive ? '#16a34a' : '#94A3B8' }} /> {category}
                      </span>
                      {isActive && <ChevronRight size={14} style={{ color: '#16a34a' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Topics tags widget */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <Flame size={16} style={{ color: '#f97316' }} /> Hot Topics
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['JSSC', 'JPSC', 'SSC CGL', 'Resume Tips', 'Tata Steel', 'IT Jobs'].map((tag) => (
                  <span 
                    key={tag} 
                    onClick={() => setSearchQuery(tag)}
                    style={{ 
                      fontSize: '11px', 
                      padding: '4px 10px', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '20px', 
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: '#475569'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Main Articles Feed */}
          <main style={{ minWidth: 0 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div style={{ border: '3px solid #f3f4f6', borderTop: '3px solid #16a34a', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : filteredArticles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredArticles.map((post) => {
                  const isLiked = !!likedArticles[post._id];
                  const isBookmarked = !!bookmarkedArticles[post._id];
                  return (
                    <article 
                      key={post._id} 
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)';
                      }}
                    >
                      {/* Cover Image */}
                      <div 
                        style={{
                          height: '200px',
                          backgroundImage: `url(${post.coverImage || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          {post.category || 'Career'}
                        </span>
                      </div>

                      {/* Content details */}
                      <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748B', fontWeight: '500', marginBottom: '10px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <User size={13} /> {post.author || 'Writer'}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} /> {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> {post.readTime || '5 min read'}
                          </span>
                        </div>

                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '12px', lineHeight: '1.4' }}>
                          {post.title}
                        </h2>

                        <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
                          {post.excerpt || 'Read the full guide for details, links, and strategies.'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                          
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: '#64748B', fontWeight: '600' }}>
                              <Eye size={14} style={{ color: '#94A3B8' }} /> {post.views} Views
                            </span>

                            <button 
                              onClick={() => handleLikeToggle(post._id)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: isLiked ? '#ef4444' : '#64748B', cursor: 'pointer', background: 'none', border: 'none', fontSize: '12.5px', fontWeight: '600' }}
                            >
                              <Heart size={14} fill={isLiked ? '#ef4444' : 'transparent'} /> 
                              <span>{isLiked ? (parseInt(post.likes) + 1) : post.likes} Likes</span>
                            </button>

                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              onClick={() => handleBookmarkToggle(post._id)}
                              style={{ color: isBookmarked ? '#16a34a' : '#94A3B8', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center' }}
                            >
                              <Bookmark size={16} fill={isBookmarked ? '#16a34a' : 'transparent'} />
                            </button>
                          </div>

                        </div>
                      </div>

                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="card text-center" style={{ padding: '60px 40px', color: '#64748B', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                <AlertCircle size={36} style={{ margin: '0 auto 16px', color: '#94A3B8' }} />
                <h3 style={{ fontSize: '15.5px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>No articles found</h3>
                <p style={{ fontSize: '13px', maxWidth: '360px', margin: '0 auto' }}>
                  We couldn't find any articles matching your filters or search keywords.
                </p>
              </div>
            )}
          </main>

          {/* COLUMN 3: Right Sidebar Promo Cards */}
          <aside>
            
            {/* Promo Forum Widget */}
            <div className="card" style={{ 
              padding: '24px 20px', 
              backgroundColor: '#EEFDF4', 
              border: '1px solid rgba(22, 163, 74, 0.2)', 
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'white', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(22,163,74,0.06)' }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: '#14532d', margin: '0 0 4px' }}>Have Doubts or Questions? 💡</h4>
                <p style={{ fontSize: '12px', color: '#166534', lineHeight: '1.5', margin: 0 }}>
                  Ask questions about exam schedules, preparation strategies, eligibility criteria and get replies from Jharkhand experts.
                </p>
              </div>
              <button 
                onClick={() => navigate('/discussions')}
                className="btn"
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white', 
                  fontSize: '12.5px', 
                  fontWeight: '700', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '6px',
                  boxShadow: '0 4px 8px rgba(22, 163, 74, 0.15)'
                }}
              >
                Go to Discussions <ArrowRight size={14} />
              </button>
            </div>

            {/* Daily tip Box */}
            <div className="card" style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={16} />
                </div>
                <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Tip of the Day</h4>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                "Keep your syllabus checklist updated. Checking off finished units gives a psychological boost and tracks true progress."
              </p>
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
};

export default Blog;
