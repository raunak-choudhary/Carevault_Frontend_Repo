import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requireVerification = true,
  allowedRoles = [], // Optional: roles allowed to access the route
  redirectPath = '/dashboard' // Default redirect path
}) => {
  const { user, loading, isCaregiver } = useAuth();
  const location = useLocation();
  
  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If verification is required and user is not verified, redirect to verification page
  if (requireVerification && !user.verified && location.pathname !== '/verify-account') {
    return <Navigate to="/verify-account" replace />;
  }
  
  // Check if user role is allowed (if roles are specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Special handling for caregivers - redirect to caregiver dashboard
    if (isCaregiver() && redirectPath === '/dashboard') {
      return <Navigate to="/caregiver" replace />;
    }
    
    return <Navigate to="/unauthorized" replace />;
  }
  // eslint-disable-next-line no-unused-vars 
  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;