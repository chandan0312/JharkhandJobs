import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import AppLayout from './components/layout/AppLayout';

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
import Contact from './pages/Contact';

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
              <Route path="/govt-jobs" element={<GovtJobs />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/exams/:id" element={<ExamDetails />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
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
