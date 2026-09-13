import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current profile on app load
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Error loading profile:', err.message);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Standard Login
  const login = async (emailOrMobile, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { emailOrMobile, password });
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email/mobile or password';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Standard Register
  const register = async ({ name, email, mobile, phone, password, confirmPassword }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        mobile: mobile || phone, 
        password, 
        confirmPassword 
      });
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setUser(response.data.user);
        return response.data;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Integration
  const loginWithGoogle = async (googleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/google', googleData);
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    setError(null);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send password reset email';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Reset Password
  const resetPassword = async (token, password, confirmPassword) => {
    setError(null);
    try {
      const response = await api.post('/auth/reset-password', { token, password, confirmPassword });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Password reset failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Verify Email
  const verifyEmail = async (token) => {
    setError(null);
    try {
      const response = await api.post('/auth/verify-email', { token });
      if (response.data.success && user) {
        setUser({ ...user, emailVerified: true });
      }
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Email verification failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Change Password
  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    setError(null);
    try {
      const response = await api.post('/auth/change-password', { oldPassword, newPassword, confirmPassword });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Change password failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      
      /* global google */
      if (typeof google !== 'undefined') {
        try {
          google.accounts.id.disableAutoSelect();
        } catch (err) {
          console.error('Failed to disable Google auto-select on logout:', err);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        login,
        register,
        loginWithGoogle,
        forgotPassword,
        resetPassword,
        verifyEmail,
        changePassword,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
