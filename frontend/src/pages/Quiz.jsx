import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { 
  Clock, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Loader2,
  Search,
  BookOpen,
  Calendar,
  Bookmark,
  FileText,
  Users,
  TrendingUp,
  MapPin,
  Shield,
  Briefcase,
  Flame,
  Award as TrophyIcon,
  Share2,
  Sparkles,
  Search as SearchIcon
} from 'lucide-react';

const Quiz = () => {
  const { t } = useLanguage();
  // Quizzes list state
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation states: selection | active | results | leaderboard
  const [quizState, setQuizState] = useState('selection'); 
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  
  // Game states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timeSpent, setTimeSpent] = useState('');
  const [reviewMode, setReviewMode] = useState(false);

  // Selection states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState('Week');
  
  // Gold points count
  const [goldPoints, setGoldPoints] = useState(1250);

  // 12 subjects matching mockup exactly
  const mockSubjects = [
    { id: 'sub-1', title: 'General Knowledge', questionsCount: 2450, icon: BookOpen, color: '#4F46E5', bgColor: '#EEF2FF' },
    { id: 'sub-2', title: 'Jharkhand GK', questionsCount: 1850, icon: Shield, color: '#1B8C0A', bgColor: '#E8F5E3' },
    { id: 'sub-3', title: 'Current Affairs', questionsCount: 2980, icon: FileText, color: '#2563EB', bgColor: '#EFF6FF' },
    { id: 'sub-4', title: 'Indian Polity', questionsCount: 1620, icon: Award, color: '#EA580C', bgColor: '#FFF7ED' },
    { id: 'sub-5', title: 'History', questionsCount: 1450, icon: Calendar, color: '#7C3AED', bgColor: '#F5F3FF' },
    { id: 'sub-6', title: 'Geography', questionsCount: 1380, icon: GlobeIcon, color: '#0D9488', bgColor: '#CCFBF1' },
    { id: 'sub-7', title: 'Science', questionsCount: 1780, icon: FlaskIcon, color: '#DC2626', bgColor: '#FEF2F2' },
    { id: 'sub-8', title: 'Maths', questionsCount: 2100, icon: CalculatorIcon, color: '#0891B2', bgColor: '#ECFEFF' },
    { id: 'sub-9', title: 'Reasoning', questionsCount: 1900, icon: BrainIcon, color: '#DB2777', bgColor: '#FDF2F8' },
    { id: 'sub-10', title: 'Computer', questionsCount: 980, icon: ComputerIcon, color: '#4B5563', bgColor: '#F3F4F6' },
    { id: 'sub-11', title: 'English', questionsCount: 1550, icon: AaIcon, color: '#2563EB', bgColor: '#EFF6FF' },
    { id: 'sub-12', title: 'Hindi', questionsCount: 1200, icon: DevnagariIcon, color: '#D97706', bgColor: '#FEF3C7' }
  ];

  // Curated Fallback High-Fidelity Question Sets for subjects
  const fallbackQuestions = {
    'Jharkhand GK': [
      {
        question: 'झारखंड राज्य की राजधानी क्या है?',
        options: ['जमशेदपुर', 'बोकारो', 'रांची', 'धनबाद'],
        answer: 2,
        explanation: 'रांची झारखंड की प्रशासनिक राजधानी है। इसे झरनों का शहर भी कहा जाता है क्योंकि यहाँ कई प्रसिद्ध जलप्रपात स्थित हैं।',
        didYouKnow: 'रांची का नामकरण स्थानीय "ऋंची" नामक एक छोटे से पक्षी या "रांची" नामक गांव से हुआ माना जाता है।',
        imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?q=80&w=600&auto=format&fit=crop'
      },
      {
        question: 'झारखंड राज्य का गठन कब हुआ था?',
        options: ['15 नवंबर 2000', '1 नवंबर 2000', '26 जनवरी 2001', '15 अगस्त 2000'],
        answer: 0,
        explanation: 'झारखंड का गठन 15 नवंबर 2000 को बिहार के दक्षिणी भाग को विभाजित करके किया गया था। 15 नवंबर भगवान बिरसा मुंडा की जन्म जयंती है।',
        didYouKnow: 'झारखंड भारत संघ का 28वां राज्य है, जिसमें प्रचुर मात्रा में खनिज संपदा पाई जाती है।',
        imageUrl: 'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?q=80&w=600&auto=format&fit=crop'
      },
      {
        question: 'झारखंड का राजकीय पशु कौन सा है?',
        options: ['बाघ', 'भारतीय हाथी', 'एक सींग वाला गेंडा', 'चित्तीदार हिरण'],
        answer: 1,
        explanation: 'भारतीय हाथी (Elephas maximus) झारखंड का राजकीय पशु है। यह ताकत और राजकीय गरिमा का प्रतीक है।',
        didYouKnow: 'झारखंड के राजकीय प्रतीकों में राजकीय पक्षी कोयल और राजकीय वृक्ष साल (सखुआ) शामिल हैं।',
        imageUrl: 'https://images.unsplash.com/photo-1581852017103-e4ac9176ac92?q=80&w=600&auto=format&fit=crop'
      },
      {
        question: 'हुंडरू जलप्रपात किस नदी पर स्थित है?',
        options: ['दामोदर नदी', 'संजय नदी', 'स्वर्णरेखा नदी', 'कोयल नदी'],
        answer: 2,
        explanation: 'हुंडरू जलप्रपात रांची जिले में स्वर्णरेखा नदी पर स्थित है। यह झारखंड का एक अत्यंत लोकप्रिय पर्यटन स्थल है।',
        didYouKnow: 'हुंडरू प्रपात की ऊंचाई लगभग 98 मीटर (320 फीट) है, जो राज्य के सबसे ऊंचे प्रपातों में से एक है।',
        imageUrl: 'https://images.unsplash.com/photo-1627393139033-0f759c75240c?q=80&w=600&auto=format&fit=crop'
      },
      {
        question: 'झारखंड के प्रथम मुख्यमंत्री कौन थे?',
        options: ['शिबू सोरेन', 'बाबूलाल मरांडी', 'अर्जुन मुंडा', 'रघुवर दास'],
        answer: 1,
        explanation: 'बाबूलाल मरांडी झारखंड के प्रथम मुख्यमंत्री थे। उन्होंने राज्य गठन के तुरंत बाद 15 नवंबर 2000 से पदभार संभाला था।',
        didYouKnow: 'बाबूलाल मरांडी वर्तमान में झारखंड भाजपा के प्रमुख नेताओं में से एक हैं और पहले कोडरमा लोकसभा क्षेत्र का प्रतिनिधित्व कर चुके हैं।',
        imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop'
      }
    ],
    'General Knowledge': [
      {
        question: 'भारत के संविधान के जनक कौन माने जाते हैं?',
        options: ['महात्मा गांधी', 'डॉ. बी.आर. अंबेडकर', 'जवाहरलाल नेहरू', 'डॉ. राजेंद्र प्रसाद'],
        answer: 1,
        explanation: 'डॉ. भीमराव रामजी अंबेडकर को भारतीय संविधान का जनक माना जाता है। वे संविधान सभा की प्रारूप समिति के अध्यक्ष थे।',
        didYouKnow: 'भारतीय संविधान दुनिया का सबसे लंबा लिखित राष्ट्रीय संविधान है, जिसमें कुल 395 अनुच्छेद थे।',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop'
      },
      {
        question: 'क्षेत्रफल की दृष्टि से भारत का सबसे बड़ा राज्य कौन सा है?',
        options: ['मध्य प्रदेश', 'उत्तर प्रदेश', 'महाराष्ट्र', 'राजस्थान'],
        answer: 3,
        explanation: 'राजस्थान क्षेत्रफल की दृष्टि से भारत का सबसे बड़ा राज्य है, जिसका क्षेत्रफल 342,239 वर्ग किलोमीटर है।',
        didYouKnow: 'राजस्थान का थार मरुस्थल (महान भारतीय मरुस्थल) दुनिया का 17वां सबसे बड़ा मरुस्थल है।',
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-471a5ed94245?q=80&w=600&auto=format&fit=crop'
      }
    ]
  };

  // Fetch quizzes from API on load
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await api.get('/quizzes');
        if (response.data.success && response.data.quizzes?.length > 0) {
          setQuizzes(response.data.quizzes);
        } else {
          setQuizzes([]);
        }
      } catch (err) {
        console.error('Error fetching database quizzes:', err.message);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (quizState !== 'active') return;
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizState]);

  // Start selected quiz
  const handleStartQuiz = (subjectTitle) => {
    // 1. Check if we have dynamic quiz in fetched DB
    let selectedQuiz = quizzes.find(q => q.title.toLowerCase() === subjectTitle.toLowerCase());
    
    // 2. Generate fallback quiz structure if DB list doesn't match
    if (!selectedQuiz) {
      const fallbackSet = fallbackQuestions[subjectTitle] || fallbackQuestions['Jharkhand GK'];
      selectedQuiz = {
        _id: 'fallback-' + subjectTitle.replace(/\s+/g, '-'),
        title: subjectTitle,
        duration: 300, // 5 minutes
        color: '#1B8C0A',
        questions: fallbackSet.map(q => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          didYouKnow: q.didYouKnow,
          imageUrl: q.imageUrl
        }))
      };
    }

    setSelectedQuizId(selectedQuiz._id);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setTimeLeft(selectedQuiz.duration);
    setQuizState('active');
    setReviewMode(false);
  };

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  };

  const handleNextQuestion = () => {
    const quiz = getActiveQuiz();
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const quiz = getActiveQuiz();
    let correctCount = 0;
    
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const timeTaken = quiz.duration - timeLeft;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    setScore(correctCount);
    setAccuracy(Math.round((correctCount / quiz.questions.length) * 100));
    setTimeSpent(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    
    // Add bonus gold coins based on score!
    setGoldPoints(prev => prev + correctCount * 10);
    
    setQuizState('results');
  };

  const getActiveQuiz = () => {
    if (!selectedQuizId) return null;
    if (selectedQuizId.startsWith('fallback-')) {
      const subjectTitle = selectedQuizId.replace('fallback-', '').replace(/-/g, ' ');
      const fallbackSet = fallbackQuestions[subjectTitle] || fallbackQuestions['Jharkhand GK'];
      return {
        _id: selectedQuizId,
        title: subjectTitle,
        duration: 300,
        color: '#1B8C0A',
        questions: fallbackSet
      };
    }
    return quizzes.find(q => q._id === selectedQuizId);
  };

  const handleBackToSelection = () => {
    setSelectedQuizId(null);
    setQuizState('selection');
    setReviewMode(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter subject cards based on search query
  const filteredSubjects = mockSubjects.filter(sub => 
    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentQuiz = getActiveQuiz();

  return (
    <div className="page-content animate-fade-in" style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', paddingBottom: '80px' }}>
      <style>{`
        @keyframes flamePulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(239, 68, 68, 0.5)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.8)); }
        }
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(251, 191, 36, 0.2); }
          50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.55); }
        }
        @keyframes userRowGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(16, 185, 129, 0.15); }
          50% { box-shadow: 0 0 18px rgba(16, 185, 129, 0.45); }
        }
        @keyframes floatEffect {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spinCoin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes purplePulse {
          0%, 100% { border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 0 15px rgba(139, 92, 246, 0.15); }
          50% { border-color: rgba(139, 92, 246, 0.8); box-shadow: 0 0 25px rgba(139, 92, 246, 0.4); }
        }
        @keyframes orangePulse {
          0%, 100% { border-color: rgba(249, 115, 22, 0.4); box-shadow: 0 0 15px rgba(249, 115, 22, 0.15); }
          50% { border-color: rgba(249, 115, 22, 0.8); box-shadow: 0 0 25px rgba(249, 115, 22, 0.4); }
        }
        @keyframes emeraldPulse {
          0%, 100% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 15px rgba(16, 185, 129, 0.15); }
          50% { border-color: rgba(16, 185, 129, 0.8); box-shadow: 0 0 25px rgba(16, 185, 129, 0.4); }
        }
        .flame-animate {
          animation: flamePulse 1.5s infinite ease-in-out;
          display: inline-block;
        }
        .gold-animate {
          animation: goldGlow 2s infinite ease-in-out;
        }
        .user-row-animate {
          animation: userRowGlow 2.5s infinite ease-in-out;
        }
        .float-animate {
          animation: floatEffect 4s infinite ease-in-out;
        }
        .coin-spin {
          animation: spinCoin 3s infinite linear;
          display: inline-block;
        }
        .level-card-glow {
          animation: purplePulse 3s infinite ease-in-out;
        }
        .streak-card-glow {
          animation: orangePulse 3s infinite ease-in-out;
        }
        .leaderboard-card-glow {
          animation: emeraldPulse 3s infinite ease-in-out;
        }
        .podium-item:hover {
          transform: translateY(-10px) scale(1.04) !important;
          box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3) !important;
        }
      `}</style>
      
      {/* ==================== SCREEN 1: CHOOSE SUBJECT (AND HEADER HERO) ==================== */}
      {quizState === 'selection' && (
        <div>
          {/* Dashboard Header Hero - Matches Mockup Style */}
          <header 
            style={{
              position: 'relative',
              padding: '60px 0',
              background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
              color: 'white',
              overflow: 'hidden',
              borderBottom: '1px solid #1E293B',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                
                {/* Left side text and stats */}
                 <div style={{ flex: '1 1 500px' }}>
                  <h1 className="animate-slide-up" style={{ 
                    fontSize: '42px', 
                    fontWeight: '800', 
                    lineHeight: '1.2', 
                    marginBottom: '16px',
                    letterSpacing: '-0.02em'
                  }}>
                    {t('quiz.title')}
                  </h1>
                  <p className="animate-slide-up delay-1" style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '32px', maxWidth: '550px', lineHeight: '1.6' }}>
                    {t('quiz.desc')}
                  </p>

                  {/* Horizontal Stats Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    
                    <div style={{ backgroundColor: 'rgba(30, 27, 75, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <TrophyIcon size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', display: 'block', color: 'white' }}>50,000+</strong>
                        <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>{t('quiz.played')}</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(30, 27, 75, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Users size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', display: 'block', color: 'white' }}>25,000+</strong>
                        <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>{t('quiz.active')}</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(30, 27, 75, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <HelpCircle size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', display: 'block', color: 'white' }}>1,00,000+</strong>
                        <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>{t('quiz.questions')}</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(30, 27, 75, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <TrendingUp size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', display: 'block', color: 'white' }}>85%</strong>
                        <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase' }}>{t('quiz.success')}</span>
                      </div>
                    </div>

                  </div>

                  <button 
                    onClick={() => handleStartQuiz('Jharkhand GK')}
                    className="btn btn-primary"
                    style={{ 
                      backgroundColor: '#4F46E5', 
                      borderColor: '#4F46E5',
                      padding: '12px 28px',
                      fontSize: '14px',
                      fontWeight: '700',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
                    }}
                  >
                    {t('quiz.startBtn')}
                  </button>

                </div>

                {/* Right side vertically aligned stats column - perfectly aligned in same line */}
                <div style={{ 
                  flex: '1 1 320px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '14px',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  maxWidth: '340px',
                  width: '100%',
                  position: 'relative',
                  zIndex: 2
                }}>
                  
                  {/* 1. Level 12 Card */}
                  <div 
                    className="level-card-glow"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(139, 92, 246, 0.4)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(139, 92, 246, 0.15)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '22px', 
                      boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
                      flexShrink: 0 
                    }}>
                      🌟
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: 'white' }}>{t('quiz.level')} 12</span>
                        <span style={{ fontSize: '10px', color: '#A78BFA', fontWeight: '600' }}>XP: 7.2k/10k</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block', marginTop: '1px' }}>{t('quiz.quizMaster')}</span>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#1E293B', borderRadius: '3px', marginTop: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', borderRadius: '3px', boxShadow: '0 0 8px #8B5CF6' }} />
                      </div>
                    </div>
                  </div>

                  {/* 2. Streak Card */}
                  <div 
                    className="streak-card-glow"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(249, 115, 22, 0.4)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(249, 115, 22, 0.15)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '22px', 
                      boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)',
                      flexShrink: 0 
                    }}>
                      <span className="flame-animate">🔥</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '18px', color: 'white', display: 'block', lineHeight: '1.2', fontWeight: '900' }}>7 Days</strong>
                      <span style={{ fontSize: '10px', color: '#F97316', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('quiz.streak')} ACTIVE</span>
                    </div>
                  </div>

                  {/* 3. Total Points Card */}
                  <div 
                    className="gold-animate"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(251, 191, 36, 0.4)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onClick={() => setQuizState('leaderboard')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(251, 191, 36, 0.15)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '22px', 
                      boxShadow: '0 0 15px rgba(251, 191, 36, 0.3)',
                      flexShrink: 0 
                    }}>
                      <span className="coin-spin">🪙</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '20px', color: '#FBBF24', display: 'block', lineHeight: '1.2', fontWeight: '900' }}>{goldPoints}</strong>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>{t('quiz.totalPoints')}</span>
                    </div>
                  </div>

                  {/* 4. Leaderboard Card */}
                  <div 
                    className="leaderboard-card-glow"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onClick={() => setQuizState('leaderboard')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '22px', 
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
                      flexShrink: 0 
                    }}>
                      🏆
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '14px', color: '#34D399', display: 'block', fontWeight: '800' }}>Rank #6</strong>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>Leaderboard (This Week)</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </header>

          <div className="container" style={{ marginTop: '40px' }}>
            
            {/* Subject Selector Mockup Layout */}
            <div style={{ 
              backgroundColor: '#1E1B4B', // Deep indigo/blue theme matching mockup
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
              border: '1px solid #2E2A6B'
            }}>
              
              {/* Header inside subject selector */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('quiz.chooseSubject')}</span>
                  <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginTop: '4px' }}>{t('quiz.selectSubject')}</h2>
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>{t('quiz.selectDesc')}</p>
                </div>
                
                {/* Gold Points status top right */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  backgroundColor: '#2E2A6B', 
                  padding: '8px 18px', 
                  borderRadius: '20px',
                  border: '1px solid #4F46E5',
                  color: '#FBBF24',
                  fontWeight: '700',
                  fontSize: '14px'
                }}>
                  <span>🪙</span>
                  <span>{goldPoints}</span>
                </div>
              </div>

              {/* Search Bar matching mockup exactly */}
              <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '400px' }}>
                <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder={t('quiz.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    fontSize: '13.5px',
                    borderRadius: '10px',
                    backgroundColor: '#111827',
                    border: '1.5px solid #2E2A6B',
                    color: 'white',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#2E2A6B'}
                />
              </div>

              {/* Subjects Cards Grid (12 Items) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {filteredSubjects.map((sub) => {
                  const Icon = sub.icon || HelpCircle;
                  return (
                    <div 
                      key={sub.id}
                      onClick={() => handleStartQuiz(sub.title)}
                      className="animate-scale-in"
                      style={{
                        backgroundColor: 'rgba(30, 27, 75, 0.45)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '24px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1.5px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                        e.currentTarget.style.boxShadow = `0 10px 25px ${sub.color}35`;
                        e.currentTarget.style.borderColor = sub.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      }}
                    >
                      {/* Round Avatar icon bubble */}
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%', 
                        backgroundColor: sub.bgColor, 
                        color: sub.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 16px',
                        boxShadow: `0 0 10px ${sub.color}30`
                      }}>
                        <Icon size={22} />
                      </div>
                      
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                        {sub.title}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
                        {sub.questionsCount.toLocaleString()} Questions
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Subject search empty state fallback */}
              {filteredSubjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  <HelpCircle size={32} style={{ margin: '0 auto 12px' }} />
                  <p>No subjects match your search terms. Try another query.</p>
                </div>
              )}

              {/* Daily Challenge Bonus footer box matching mockup exactly */}
              <div style={{ 
                background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)',
                borderRadius: '16px',
                padding: '24px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                    🏆
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'white', marginBottom: '2px' }}>{t('quiz.dailyChallenge')}</h4>
                    <p style={{ fontSize: '12px', color: '#C7D2FE' }}>{t('quiz.dailyDesc')}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleStartQuiz('Jharkhand GK')}
                  className="btn"
                  style={{
                    backgroundColor: 'white',
                    color: '#4F46E5',
                    fontSize: '13px',
                    fontWeight: '700',
                    borderRadius: '8px',
                    padding: '8px 24px',
                    border: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {t('quiz.playNow')}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==================== SCREEN 2: QUIZ IN PROGRESS ==================== */}
      {quizState === 'active' && currentQuiz && (
        <div className="container" style={{ marginTop: '40px' }}>
          
          <div style={{ 
            backgroundColor: '#1E1B4B', // Mockup matching theme
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
            border: '1px solid #2E2A6B',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            
            {/* Header bar inside active quiz */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <button 
                onClick={handleBackToSelection}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: '#94A3B8', 
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none'
                }}
              >
                {t('quiz.exitQuiz')}
              </button>

              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>
                {currentQuiz.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontWeight: '700', fontSize: '13px' }}>
                <span>🪙</span>
                <span>{goldPoints}</span>
              </div>
            </div>

            {/* Question Bar and Timer Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ color: 'white' }}>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{t('quiz.questionText')} {currentQuestionIndex + 1} {t('quiz.of')} {currentQuiz.questions?.length || 0}</span>
              </div>

              {/* Timer indicator flashing red when low */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: timeLeft < 60 ? '#EF4444' : '#FBBF24',
                fontWeight: '700',
                fontSize: '15px'
              }}>
                <Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question Progress bar */}
            <div style={{ width: '100%', height: '5px', backgroundColor: '#2E2A6B', borderRadius: '3px', marginBottom: '32px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${((currentQuestionIndex + 1) / (currentQuiz.questions?.length || 1)) * 100}%`,
                height: '100%',
                backgroundColor: '#22C55E',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* Main Question Card (White layout matching mockup exactly) */}
            {currentQuiz.questions && currentQuiz.questions[currentQuestionIndex] && (
              <div>
                <div className="card animate-scale-in" style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '36px', 
                  border: 'none', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  marginBottom: '28px'
                }}>
                  
                  {/* Bold question prompt in Hindi */}
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '20px', lineHeight: '1.4' }}>
                    {currentQuiz.questions[currentQuestionIndex].question}
                  </h2>

                  {/* Image attachment box underneath prompt (Mockup fidelity) */}
                  {currentQuiz.questions[currentQuestionIndex].imageUrl && (
                    <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', maxHeight: '200px' }}>
                      <img 
                        src={currentQuiz.questions[currentQuestionIndex].imageUrl} 
                        alt="Question context reference" 
                        style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }} 
                      />
                    </div>
                  )}

                  {/* Multiple Choice lists with letters */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {currentQuiz.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                      const optionLetter = String.fromCharCode(65 + oIdx); // A, B, C, D
                      
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(oIdx)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: `1.5px solid ${isSelected ? '#22C55E' : '#F3F4F6'}`,
                            backgroundColor: isSelected ? '#F0FDF4' : '#F9FAFB',
                            color: isSelected ? '#1B8C0A' : '#374151',
                            fontSize: '13.5px',
                            fontWeight: isSelected ? '700' : '500',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{optionLetter}. {opt}</span>
                          
                          {/* Checked circle bubble status */}
                          <div style={{ 
                            width: '18px', 
                            height: '18px', 
                            borderRadius: '50%', 
                            border: `2px solid ${isSelected ? '#22C55E' : '#CBD5E1'}`,
                            backgroundColor: isSelected ? '#22C55E' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isSelected && <Check size={12} style={{ color: 'white' }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* "Did you know?" Educational Factbox */}
                  {currentQuiz.questions[currentQuestionIndex].didYouKnow && (
                    <div style={{ 
                      backgroundColor: '#F5F3FF', 
                      borderRadius: '8px', 
                      padding: '12px 18px', 
                      fontSize: '12.5px', 
                      color: '#6B21A8',
                      borderLeft: '4px solid #7C3AED',
                      lineHeight: '1.5'
                    }}>
                      <strong>💡 Did you know?</strong> {currentQuiz.questions[currentQuestionIndex].didYouKnow}
                    </div>
                  )}

                </div>

                {/* Bottom Navigation Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                  
                  {/* Previous question ghost */}
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="btn"
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: currentQuestionIndex === 0 ? '#4F46E5' : 'white',
                      backgroundColor: '#2E2A6B',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentQuestionIndex === 0 ? 0.5 : 1
                    }}
                  >
                    &lt; {t('quiz.previous')}
                  </button>

                  {/* Mark for review Bookmark */}
                  <button
                    onClick={handleToggleReview}
                    className="btn"
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: markedForReview[currentQuestionIndex] ? '#FBBF24' : '#94A3B8',
                      backgroundColor: '#2E2A6B',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    🔖 {markedForReview[currentQuestionIndex] ? t('quiz.markedForReview') : t('quiz.markReview')}
                  </button>

                  {/* Next / Submit solid green CTA */}
                  {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="btn"
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: 'white',
                        backgroundColor: '#22C55E',
                        borderRadius: '8px',
                        padding: '10px 24px',
                        boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)'
                      }}
                    >
                      {t('quiz.next')} &gt;
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="btn"
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: 'white',
                        backgroundColor: '#22C55E',
                        borderRadius: '8px',
                        padding: '10px 24px',
                        boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)'
                      }}
                    >
                      {t('quiz.submitQuiz')}
                    </button>
                  )}
                </div>

                {/* 1 to 20 question slots grid (Mockup style) */}
                <div style={{ borderTop: '1px solid #2E2A6B', paddingTop: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px', marginBottom: '20px' }}>
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const isCurrent = idx === currentQuestionIndex;
                      const isAnswered = selectedAnswers[idx] !== undefined;
                      const isReview = markedForReview[idx] === true;

                      let cellBg = '#2E2A6B';
                      let cellColor = '#94A3B8';
                      let cellBorder = '1.5px solid transparent';

                      if (isAnswered) {
                        cellBg = '#22C55E';
                        cellColor = 'white';
                      } else if (isReview) {
                        cellBg = '#F59E0B';
                        cellColor = 'white';
                      }

                      if (isCurrent) {
                        cellBorder = '1.5px solid #FBBF24';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (idx < currentQuiz.questions.length) {
                              setCurrentQuestionIndex(idx);
                            }
                          }}
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: '50%',
                            backgroundColor: cellBg,
                            color: cellColor,
                            fontSize: '12px',
                            fontWeight: '700',
                            border: cellBorder,
                            cursor: idx < currentQuiz.questions.length ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: idx < currentQuiz.questions.length ? 1 : 0.3
                          }}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Grid Legend Row */}
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '12px', color: '#94A3B8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                      Answered
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                      Review
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E2A6B' }} />
                      Not Answered
                    </span>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ==================== SCREEN 3: QUIZ RESULT ==================== */}
      {quizState === 'results' && currentQuiz && (
        <div className="container" style={{ marginTop: '40px' }}>
          
          <div style={{ 
            backgroundColor: '#1E1B4B', // Mockup matching theme
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
            border: '1px solid #2E2A6B',
            maxWidth: '800px',
            margin: '0 auto',
            color: 'white'
          }}>

            {/* Results Title header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }} className="animate-fade-in">
              <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Quiz Completed!</h1>
              <p style={{ color: '#94A3B8', fontSize: '13.5px', marginTop: '4px' }}>Great Job, Keep it Up!</p>
            </div>

            {/* Circle Accuracy and Trophy row */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '48px', 
              marginBottom: '36px',
              flexWrap: 'wrap'
            }}>
              
              {/* Circular gauge progress */}
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '10px solid #2E2A6B',
                borderTop: '10px solid #22C55E',
                borderRight: '10px solid #22C55E',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                <strong style={{ fontSize: '36px', fontWeight: '800' }}>{accuracy}%</strong>
                <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Score</span>
              </div>

              {/* Golden Trophy graphic on the right */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', animation: 'pulse 2s infinite' }}>🏆</div>
                <span style={{ fontSize: '12px', color: '#FBBF24', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginTop: '8px' }}>Passed Challenge</span>
              </div>

            </div>

            {/* 4 Stats Grid boxes (Mockup exact replica) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '32px' }}>
              
              {/* Correct */}
              <div style={{ backgroundColor: '#2E2A6B', padding: '16px', borderRadius: '12px', border: '1px solid #3B387E', textAlign: 'center' }}>
                <strong style={{ fontSize: '24px', fontWeight: '800', color: '#22C55E', display: 'block' }}>{score}</strong>
                <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>Correct</span>
              </div>

              {/* Incorrect */}
              <div style={{ backgroundColor: '#2E2A6B', padding: '16px', borderRadius: '12px', border: '1px solid #3B387E', textAlign: 'center' }}>
                <strong style={{ fontSize: '24px', fontWeight: '800', color: '#EF4444', display: 'block' }}>
                  {currentQuiz.questions.length - score - (currentQuiz.questions.length - Object.keys(selectedAnswers).length)}
                </strong>
                <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>Incorrect</span>
              </div>

              {/* Unattempted */}
              <div style={{ backgroundColor: '#2E2A6B', padding: '16px', borderRadius: '12px', border: '1px solid #3B387E', textAlign: 'center' }}>
                <strong style={{ fontSize: '24px', fontWeight: '800', color: '#3B82F6', display: 'block' }}>
                  {currentQuiz.questions.length - Object.keys(selectedAnswers).length}
                </strong>
                <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>Unattempted</span>
              </div>

              {/* Points Earned */}
              <div style={{ backgroundColor: '#2E2A6B', padding: '16px', borderRadius: '12px', border: '1px solid #3B387E', textAlign: 'center' }}>
                <strong style={{ fontSize: '24px', fontWeight: '800', color: '#FBBF24', display: 'block' }}>+{score * 10}</strong>
                <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>Points Earned</span>
              </div>

            </div>

            {/* Performance Overview card */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              padding: '24px', 
              color: '#334155',
              border: 'none',
              boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '20px', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                Performance Overview
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                
                {/* Accuracy */}
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎯</div>
                  <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Accuracy</span>
                  <strong style={{ fontSize: '13.5px', color: '#111827' }}>{accuracy}%</strong>
                </div>

                {/* Time Taken */}
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>⏱️</div>
                  <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Time Taken</span>
                  <strong style={{ fontSize: '13.5px', color: '#111827' }}>{timeSpent}</strong>
                </div>

                {/* Best Streak */}
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔥</div>
                  <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Best Streak</span>
                  <strong style={{ fontSize: '13.5px', color: '#111827' }}>{score}</strong>
                </div>

                {/* Rank */}
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎖️</div>
                  <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Rank</span>
                  <strong style={{ fontSize: '13.5px', color: '#111827' }}>{accuracy > 70 ? 'Top 15%' : 'Top 45%'}</strong>
                </div>

              </div>
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '36px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setReviewMode(true)}
                className="btn btn-ghost"
                style={{ 
                  color: 'white', 
                  border: '1.5px solid #2E2A6B', 
                  backgroundColor: '#2E2A6B', 
                  padding: '10px 24px', 
                  fontSize: '13.5px',
                  borderRadius: '8px'
                }}
              >
                View Solutions
              </button>
              <button 
                onClick={() => handleStartQuiz(currentQuiz.title)}
                className="btn btn-primary"
                style={{ 
                  backgroundColor: '#22C55E', 
                  borderColor: '#22C55E', 
                  padding: '10px 32px', 
                  fontSize: '13.5px',
                  fontWeight: '700',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)'
                }}
              >
                Play Again
              </button>
              <button 
                onClick={() => setQuizState('leaderboard')}
                className="btn"
                style={{ 
                  backgroundColor: '#4F46E5', 
                  color: 'white', 
                  padding: '10px 24px', 
                  fontSize: '13.5px',
                  borderRadius: '8px',
                  border: 'none'
                }}
              >
                Show Leaderboard
              </button>
            </div>

            {/* Share Your Result panel */}
            <div style={{ borderTop: '1px solid #2E2A6B', paddingTop: '24px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>
                Share Your Result
              </span>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                {/* Whatsapp */}
                <a href="https://whatsapp.com" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.59 2.016 14.11 1.01 11.99 1.01c-5.444 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L2.457 21.65l6.19-1.496zm9.382-7.013c-.27-.135-1.597-.788-1.846-.878-.25-.09-.432-.135-.613.135-.18.27-.7.878-.858 1.058-.158.18-.316.202-.586.067-.27-.135-1.14-.42-2.172-1.341-.803-.715-1.346-1.6-1.503-1.87-.158-.27-.017-.417.118-.552.122-.122.27-.315.405-.473.135-.158.18-.27.27-.45.09-.18.045-.338-.022-.473-.068-.135-.613-1.478-.84-2.023-.22-.53-.443-.46-.613-.468-.158-.008-.338-.01-.518-.01a1.002 1.002 0 0 0-.723.338c-.25.27-.95.928-.95 2.261 0 1.333.977 2.62 1.113 2.8.136.18 1.92 2.92 4.654 4.1c.65.28 1.157.447 1.554.573.654.208 1.25.178 1.72.108.524-.078 1.597-.653 1.822-1.283.226-.63.226-1.17.158-1.283-.068-.112-.248-.18-.518-.315z"/>
                  </svg>
                </a>
                
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#1877F2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Twitter */}
                <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#1DA1F2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a href="https://telegram.org" target="_blank" rel="noreferrer" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0088cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 24a12 12 0 100-24 12 12 0 000 24zm5.562-16.71c-.135.586-.5 2.766-.688 3.754-.084.444-.249.593-.408.608-.344.032-.605-.228-.938-.446-.52-.342-.814-.555-1.32-.888-.584-.385-.205-.597.127-1.144.088-.142 1.602-1.47 1.631-1.593.003-.016.007-.075-.028-.106-.035-.03-.086-.02-.124-.012-.053.012-.897.57-2.532 1.674-.24.165-.456.247-.648.242-.211-.005-.618-.12-1.07-.266-.554-.18-.995-.276-.957-.582.02-.16.24-.325.66-.497 2.584-1.127 4.31-1.87 5.176-2.228 2.463-.997 2.973-1.17 3.307-1.176.073-.001.237.017.342.102.088.072.113.173.123.252.008.083.018.262.008.43z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Solutions Review Mode Panel underneath Results card */}
          {reviewMode && (
            <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '30px auto 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>Detailed Solutions Explanations</h3>
                <button 
                  onClick={() => setReviewMode(false)}
                  className="btn"
                  style={{ backgroundColor: '#2E2A6B', color: 'white', fontSize: '12px', fontWeight: '600', padding: '6px 16px', borderRadius: '6px' }}
                >
                  Close Explanations
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentQuiz.questions?.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.answer;
                  return (
                    <div 
                      key={idx} 
                      className="card" 
                      style={{ 
                        backgroundColor: 'white', 
                        padding: '30px', 
                        borderRadius: '16px', 
                        border: `1.5px solid ${isCorrect ? '#22C55E' : '#EF4444'}`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF' }}>Question {idx + 1}</span>
                        <span className="badge" style={{ 
                          backgroundColor: isCorrect ? '#F0FDF4' : '#FEF2F2', 
                          color: isCorrect ? '#1B8C0A' : '#DC2626',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '20px'
                        }}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '18px', lineHeight: '1.4' }}>{q.question}</h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAns === optIdx;
                          const isRightOption = q.answer === optIdx;
                          
                          let optionBorderColor = '#F3F4F6';
                          let optionBgColor = 'transparent';
                          let optionTextColor = '#374151';
                          let checkBadge = null;

                          if (isRightOption) {
                            optionBorderColor = '#22C55E';
                            optionBgColor = '#F0FDF4';
                            optionTextColor = '#1B8C0A';
                            checkBadge = '✅';
                          } else if (isSelected && !isCorrect) {
                            optionBorderColor = '#EF4444';
                            optionBgColor = '#FEF2F2';
                            optionTextColor = '#EF4444';
                            checkBadge = '❌';
                          }

                          return (
                            <div 
                              key={optIdx}
                              style={{
                                padding: '12px 18px',
                                borderRadius: '8px',
                                border: `1.5px solid ${optionBorderColor}`,
                                backgroundColor: optionBgColor,
                                fontSize: '13px',
                                fontWeight: isSelected || isRightOption ? '700' : '500',
                                color: optionTextColor,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <span>{opt}</span>
                              <span>{checkBadge}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div style={{ 
                        backgroundColor: '#F9FAFB', 
                        padding: '16px 20px', 
                        borderRadius: '10px', 
                        borderLeft: `4px solid #4F46E5`,
                        fontSize: '13px',
                        color: '#4B5563',
                        lineHeight: '1.6'
                      }}>
                        <span style={{ color: '#4F46E5', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Explanation:</span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ==================== SCREEN 4: LEADERBOARD ==================== */}
      {quizState === 'leaderboard' && (
        <div className="container" style={{ marginTop: '40px' }}>
          
          <div style={{ 
            backgroundColor: '#1E1B4B', // Mockup matching theme
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
            border: '1px solid #2E2A6B',
            maxWidth: '650px',
            margin: '0 auto',
            color: 'white'
          }}>

            {/* Leaderboard Header bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <button 
                onClick={handleBackToSelection}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: '#94A3B8', 
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none'
                }}
              >
                &lt; Back to Quiz
              </button>

              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>
                Leaderboard
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontWeight: '700', fontSize: '13px' }}>
                <span>🪙</span>
                <span>{goldPoints}</span>
              </div>
            </div>

            {/* Time period tab controls */}
            <div style={{
              display: 'flex',
              backgroundColor: '#111827',
              padding: '4px',
              borderRadius: '8px',
              marginBottom: '32px',
              border: '1px solid #2E2A6B'
            }}>
              {['This Week', 'This Month', 'All Time'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveLeaderboardTab(tab)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '12px',
                    fontWeight: activeLeaderboardTab === tab ? '700' : '500',
                    color: activeLeaderboardTab === tab ? 'white' : '#94A3B8',
                    backgroundColor: activeLeaderboardTab === tab ? '#4F46E5' : 'transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: 'none'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Top 3 Podium Podium Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-end', 
              gap: '16px', 
              marginBottom: '36px',
              paddingTop: '36px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              paddingBottom: '24px'
            }}>
              
              {/* #2: Neha Singh (Left podium) */}
              <div 
                className="podium-item"
                style={{ 
                  textAlign: 'center', 
                  width: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ position: 'relative', width: '56px', height: '56px', marginBottom: '8px' }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '3px solid #94A3B8',
                    overflow: 'hidden',
                    backgroundColor: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    boxShadow: '0 0 15px rgba(148, 163, 184, 0.45)'
                  }}>
                    👩‍💼
                  </div>
                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#94A3B8', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', border: '1.5px solid #1E1B4B' }}>2</div>
                </div>
                <strong style={{ fontSize: '12.5px', display: 'block', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>Neha Singh</strong>
                <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px', fontWeight: '600' }}>2,450 pts</span>
                
                {/* Silver Pedestal */}
                <div style={{
                  width: '85px',
                  height: '75px',
                  background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.9), rgba(71, 85, 105, 0.9))',
                  borderRadius: '12px 12px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 0 20px rgba(148, 163, 184, 0.25)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderBottom: 'none'
                }}>
                  <span style={{ fontSize: '32px', fontWeight: '900', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>2</span>
                </div>
              </div>

              {/* #1: Rahul Kumar (Center podium with golden crown) */}
              <div 
                className="podium-item float-animate"
                style={{ 
                  textAlign: 'center', 
                  width: '115px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  top: '-10px'
                }}
              >
                {/* Golden Crown floating badge */}
                <div style={{ fontSize: '24px', position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)', filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.65))', zIndex: 3 }}>👑</div>
                
                <div style={{ position: 'relative', width: '68px', height: '68px', marginBottom: '8px' }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '4px solid #FBBF24',
                    overflow: 'hidden',
                    backgroundColor: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                  }}>
                    🧑‍💼
                  </div>
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', backgroundColor: '#FBBF24', color: '#78350F', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', border: '2px solid #1E1B4B' }}>1</div>
                </div>
                <strong style={{ fontSize: '14.5px', display: 'block', color: '#FBBF24', fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>Rahul Kumar</strong>
                <span style={{ fontSize: '11.5px', color: '#FBBF24', fontWeight: '800', marginBottom: '8px' }}>3,120 pts</span>
                
                {/* Gold Pedestal */}
                <div style={{
                  width: '95px',
                  height: '110px',
                  background: 'linear-gradient(to bottom, #FBBF24, #D97706, #78350F)',
                  borderRadius: '12px 12px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.4), 0 0 25px rgba(251, 191, 36, 0.4)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  borderBottom: 'none'
                }}>
                  <span style={{ fontSize: '42px', fontWeight: '900', color: 'white', textShadow: '0 3px 6px rgba(0,0,0,0.4)' }}>1</span>
                </div>
              </div>

              {/* #3: Aman Raj (Right podium) */}
              <div 
                className="podium-item"
                style={{ 
                  textAlign: 'center', 
                  width: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ position: 'relative', width: '56px', height: '56px', marginBottom: '8px' }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '3px solid #D97706',
                    overflow: 'hidden',
                    backgroundColor: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    boxShadow: '0 0 15px rgba(217, 119, 6, 0.45)'
                  }}>
                    👨‍💻
                  </div>
                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#D97706', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', border: '1.5px solid #1E1B4B' }}>3</div>
                </div>
                <strong style={{ fontSize: '12.5px', display: 'block', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>Aman Raj</strong>
                <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px', fontWeight: '600' }}>2,100 pts</span>
                
                {/* Bronze Pedestal */}
                <div style={{
                  width: '85px',
                  height: '55px',
                  background: 'linear-gradient(to bottom, rgba(217, 119, 6, 0.9), rgba(120, 53, 15, 0.9))',
                  borderRadius: '12px 12px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 0 20px rgba(217, 119, 6, 0.25)',
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                  borderBottom: 'none'
                }}>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>3</span>
                </div>
              </div>

            </div>

            {/* Rankings List (Rank 4 to 10) matching mockup */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
              {[
                { rank: 4, name: 'Pankaj Yadav', score: 1980, isUser: false, avatar: '👨‍💼' },
                { rank: 5, name: 'Priya Kumari', score: 1850, isUser: false, avatar: '👩‍💼' },
                { rank: 6, name: 'You', score: 1650, isUser: true, avatar: '😎' }, // Highlighted User row
                { rank: 7, name: 'Vikash Oraon', score: 1500, isUser: false, avatar: '👨‍💻' },
                { rank: 8, name: 'Sandhya Rani', score: 1450, isUser: false, avatar: '👩‍💻' },
                { rank: 9, name: 'Rohit Toppo', score: 1300, isUser: false, avatar: '👨‍💼' },
                { rank: 10, name: 'Anjali Tigga', score: 1200, isUser: false, avatar: '👩‍💼' }
              ].map((player, pIdx) => (
                <div 
                  key={pIdx}
                  className={player.isUser ? 'user-row-animate' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    backgroundColor: player.isUser ? 'rgba(16, 185, 129, 0.18)' : '#111827',
                    border: `1px solid ${player.isUser ? '#10B981' : '#2E2A6B'}`,
                    color: player.isUser ? '#D1FAE5' : 'white',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.015)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', width: '20px', color: player.isUser ? '#34D399' : '#94A3B8' }}>
                      {player.rank}
                    </span>
                    <div style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      backgroundColor: player.isUser ? 'rgba(52, 211, 153, 0.3)' : '#2E2A6B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px'
                    }}>
                      {player.avatar}
                    </div>
                    <strong style={{ fontSize: '13px' }}>{player.name}</strong>
                  </div>

                  <strong style={{ fontSize: '13.5px', color: player.isUser ? '#34D399' : '#22C55E' }}>
                    {player.score} pts
                  </strong>
                </div>
              ))}
            </div>

            {/* Target and Arrow graphic decor banner */}
            <div style={{ 
              backgroundColor: '#111827', 
              borderRadius: '16px', 
              padding: '18px 24px', 
              border: '1.5px dashed #2E2A6B',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>🎯</span>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                Keep Playing & Improve Your Rank!
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

// Lucide custom icons fallback components wrapper to avoid react-dom compile warnings
const GlobeIcon = (props) => <Globe {...props} />;
const FlaskIcon = (props) => <Award {...props} />; // Replaced Flask with Award for simplicity
const CalculatorIcon = (props) => <TrendingUp {...props} />; // Replaced Calculator with stats
const BrainIcon = (props) => <Sparkles {...props} />; // Replaced Brain with Sparkles
const ComputerIcon = (props) => <Shield {...props} />; // Replaced Computer with Shield
const AaIcon = (props) => <Award {...props} />;
const DevnagariIcon = (props) => <HelpCircle {...props} />;

const Globe = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export default Quiz;
