import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import AppLayout from './components/layout/AppLayout';

// Page Imports
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Exams from './pages/Exams';
import Companies from './pages/Companies';
import JobDetails from './pages/JobDetails';
import ExamDetails from './pages/ExamDetails';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import UserDashboard from './pages/UserDashboard';
import Blog from './pages/Blog';
import Discussions from './pages/Discussions';
import Admin from './pages/Admin';
import Quiz from './pages/Quiz';
import Contact from './pages/Contact';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import SavedJobs from './pages/SavedJobs';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Wrap ALL pages inside the unified Global Sidebar Layout */}
            <Route element={<AppLayout />}>
              {/* Public Candidate Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/exams/:id" element={<ExamDetails />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Auth Guest Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Candidate Profile & Dashboard */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
              </Route>
            </Route>

            {/* Protected Admin Console */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
