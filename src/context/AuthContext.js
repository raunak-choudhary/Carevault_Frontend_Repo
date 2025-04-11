import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Sign in handler
  const signIn = (userData) => {
    setUser(userData);
  };
  
  // Sign out handler
  const signOut = () => {
    logout();
    setUser(null);
  };
  
  // Update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};