import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// This component can be used to add extra authentication logic
// such as session timeout, token refresh, etc.
const AuthGuard = ({ children }) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Example: Auto logout on session timeout
  useEffect(() => {
    if (!user || loading) return;
    
    // Check for auth token expiration
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        signOut();
        navigate('/login');
      }
      
      // In a real app, you would check if the token has expired
      // For now, we'll just keep the session active
    };
    
    // Check token initially
    checkTokenExpiration();
    
    // Set up regular checks (e.g., every 5 minutes)
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, loading, signOut, navigate]);
  
  return <>{children}</>;
};

export default AuthGuard;