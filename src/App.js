import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Import pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyAccountPage from './pages/auth/VerifyAccountPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/not-found/NotFoundPage';

// Import document pages
import DocumentsListPage from './pages/documents/DocumentsListPage';
import DocumentViewPage from './pages/documents/DocumentViewPage';
import DocumentUploadPage from './pages/documents/DocumentUploadPage';

// Import layout components
import BaseLayout from './components/layout/BaseLayout';

// Import global styles
import './styles/global.css';

// Protected route component that checks authentication status
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading indicator while checking auth status
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user is authenticated but not verified, redirect to verification
  if (user && !user.verified && location.pathname !== '/verify-account') {
    return <Navigate to="/verify-account" replace />;
  }
  
  return children;
};

// App routes component - separate from main App to access auth context
const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
      } />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Semi-protected route - only for authenticated but unverified users */}
      <Route path="/verify-account" element={
        !user ? <Navigate to="/login" replace /> : <VerifyAccountPage />
      } />
      
      {/* Protected routes with BaseLayout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <BaseLayout>
            <DashboardPage />
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <BaseLayout>
            <ProfilePage />
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      {/* Document management routes - Phase 3 */}
      <Route path="/documents" element={
        <ProtectedRoute>
          <BaseLayout>
            <DocumentsListPage />
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/documents/view/:id" element={
        <ProtectedRoute>
          <BaseLayout>
            <DocumentViewPage />
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/documents/upload" element={
        <ProtectedRoute>
          <BaseLayout>
            <DocumentUploadPage />
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      {/* Placeholder routes for other protected areas */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <BaseLayout>
            <div>Chat Page (Coming Soon)</div>
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/appointments" element={
        <ProtectedRoute>
          <BaseLayout>
            <div>Appointments Page (Coming Soon)</div>
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/insights" element={
        <ProtectedRoute>
          <BaseLayout>
            <div>Insights Page (Coming Soon)</div>
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <BaseLayout>
            <div>Settings Page (Coming Soon)</div>
          </BaseLayout>
        </ProtectedRoute>
      } />
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;