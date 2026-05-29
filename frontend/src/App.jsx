import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Imports
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import GovtJobs from './pages/GovtJobs';
import Exams from './pages/Exams';
import Companies from './pages/Companies';
import JobDetails from './pages/JobDetails';
import ExamDetails from './pages/ExamDetails';
import Login from './pages/Login';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  
  // Standalone Layout for the Admin Dashboard (hides standard Navbar/Footer)
  const showHeaderFooter = !location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      
      {/* Centralized Navigation Header */}
      {showHeaderFooter && <Navbar />}
      
      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/govt-jobs" element={<GovtJobs />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:id" element={<ExamDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<Login />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Placed here for scalability */}
          </Route>

          {/* Admin Protected Panel */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </div>

      {/* Centralized Footer */}
      {showHeaderFooter && <Footer />}

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
