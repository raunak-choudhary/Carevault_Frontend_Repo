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
    setUser((prevUser) => ({ ...prevUser, ...userData }));
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is a caregiver
  const isCaregiver = () => {
    return hasRole('caregiver');
  };

  // Check if user is a patient
  const isPatient = () => {
    return hasRole('patient');
  };

  // Get user health metrics (simplified implementation)
  const getUserHealthMetrics = () => {
    // In a real app, this would be fetched from the backend
    // Here we're just returning a placeholder
    return {
      recentMetrics: {
        weight: {
          value: 70.5,
          unit: 'kg',
          timestamp: new Date().toISOString(),
        },
        bloodPressure: {
          systolic: 120,
          diastolic: 80,
          timestamp: new Date().toISOString(),
        },
        heartRate: {
          value: 72,
          unit: 'bpm',
          timestamp: new Date().toISOString(),
        },
        bloodGlucose: {
          value: 95,
          unit: 'mg/dL',
          timestamp: new Date().toISOString(),
        },
      },
      healthGoals: [
        { id: '1', title: 'Exercise 30 minutes daily', completed: false },
        { id: '2', title: 'Keep blood pressure below 130/85', completed: true },
        { id: '3', title: 'Maintain weight under 75kg', completed: true },
      ],
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateUser,
        getUserHealthMetrics,
        hasRole,
        isCaregiver,
        isPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
