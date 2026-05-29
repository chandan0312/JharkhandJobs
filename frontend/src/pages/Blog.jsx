import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Calendar, User, Clock, AlertCircle, Tag, ChevronRight } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch blogs on load
  useEffect(() => {
    fetchBlogs(selectedCategory, search);
  }, []);

  const fetchBlogs = async (cat, queryStr) => {
    setLoading(true);
    setError(null);
    try {
      let queryParams = [];
      if (cat && cat !== 'All') queryParams.push(`category=${encodeURIComponent(cat)}`);
      if (queryStr) queryParams.push(`search=${encodeURIComponent(queryStr)}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await api.get(`/blog${queryString}`);
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs(selectedCategory, search);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    fetchBlogs(cat, search);
  };

  // Static tags for display
  const tags = ['JSSC', 'Interview Tips', 'IT Careers', 'Sarkari Preparations', 'Resume Builder', 'Ranchi Tech', 'Govt Jobs'];

  return (
    <div className="page-content animate-fade-in">
      
      {/* Hero Banner */}
      <header 
        style={{
          position: 'relative',
          padding: '160px 0 120px',
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.35)), url(/assets/images/hero-blog.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            <h1 className="animate-slide-up" style={{ fontSize: '44px', fontWeight: '800', marginBottom: '16px' }}>
              Career Tips & Insights
            </h1>
            <p className="animate-slide-up delay-1" style={{ fontSize: '18px', marginBottom: '8px' }}>
              to Build Your Career
            </p>
            <p className="animate-slide-up delay-2" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', maxWidth: '600px' }}>
              Get expert guidance, exam strategy preparation materials, and industry insights to scale your career in Jharkhand.
            </p>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', maxWidth: '400px', border: 'none', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }} className="animate-slide-up delay-3">
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px' }}>
                <Search size={16} style={{ color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', padding: '10px', width: '100%', fontSize: '13px', color: '#1A1A2E' }}
                />
              </div>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: '#1B8C0A', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '60px' }}>
          
          {/* Left: Articles Grid */}
          <main style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #E5E7EB', paddingBottom: '10px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A2E' }}>Latest Articles</h2>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>Showing {posts.length} entries</span>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', flexDirection: 'column' }}>
                <div style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #1B8C0A', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '14px' }}>Loading articles...</p>
              </div>
            ) : error ? (
              <div className="card text-center" style={{ padding: '40px', color: '#DC2626' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
                <p>{error}</p>
              </div>
            ) : posts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {posts.map((post) => (
                  <article key={post._id} className="card card-sm animate-scale-in" style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
                    
                    {/* Cover image (standard or fallback) */}
                    <div style={{ height: '150px', width: '100%', backgroundColor: '#E5E7EB', backgroundImage: post.coverImage ? `url(${post.coverImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '10px', fontWeight: '700', backgroundColor: '#E8F5E3', color: '#1B8C0A', padding: '2px 8px', borderRadius: '4px' }}>
                        {post.category}
                      </span>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '8px', lineHeight: '1.4' }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', flex: 1, lineHeight: '1.6' }}>
                        {post.excerpt}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F3F4F6', paddingTop: '12px', fontSize: '11px', color: '#9CA3AF' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {new Date(post.publishedDate).toLocaleDateString()}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {post.views} views
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px 0' }}>No articles match your search parameters.</p>
            )}
          </main>

          {/* Right: Sidebar */}
          <aside style={{ flex: '1 1 250px', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Category Filter List */}
            <div className="card" style={{ backgroundColor: 'white', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
                Categories
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['All', 'Career Guide', 'Industry Trends', 'Tips & Tricks'].map((catOpt) => (
                  <li key={catOpt}>
                    <button 
                      onClick={() => handleCategorySelect(catOpt)}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        fontSize: '13px', 
                        color: selectedCategory === catOpt ? '#1B8C0A' : '#4B5563', 
                        fontWeight: selectedCategory === catOpt ? 'bold' : '500',
                        cursor: 'pointer', 
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ChevronRight size={14} />
                        {catOpt === 'All' ? 'All Guides' : catOpt}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div className="card" style={{ backgroundColor: 'white', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
                Popular Tags
              </h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tags.map((tag, idx) => (
                  <button 
                    key={idx}
                    onClick={() => fetchExams('All', tag)}
                    style={{ 
                      fontSize: '11px', 
                      color: '#4B5563', 
                      backgroundColor: '#F3F4F6', 
                      border: 'none', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Tag size={10} /> {tag}
                  </button>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default Blog;
