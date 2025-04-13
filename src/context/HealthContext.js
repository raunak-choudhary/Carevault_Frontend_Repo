import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getHealthMetrics, 
  getMetricById, 
  addMetricEntry, 
  getMetricInsights,
  getMetricTargets
} from '../services/healthService';
import { useAuth } from '../hooks/useAuth';

// Create the context
export const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targets, setTargets] = useState({});
  
  // Fetch health metrics on component mount
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const metricsData = await getHealthMetrics(user.id);
        setMetrics(metricsData);
        
        const targetsData = await getMetricTargets();
        setTargets(targetsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching health metrics:', err);
        setError('Failed to load health data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [user]);
  
  // Get a specific metric's data
  const getMetric = useCallback(async (metricType) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      const metricData = await getMetricById(metricType, user.id);
      return metricData;
    } catch (err) {
      console.error(`Error fetching ${metricType}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Add a new metric entry
  const addMetric = useCallback(async (metricType, entry) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      const updatedMetric = await addMetricEntry(metricType, entry, user.id);
      
      // Update the metrics state
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        [metricType]: updatedMetric.data
      }));
      
      return updatedMetric;
    } catch (err) {
      console.error(`Error adding ${metricType} entry:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Get insights for a specific metric
  const getInsights = useCallback(async (metricType) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const insights = await getMetricInsights(metricType, user.id);
      return insights;
    } catch (err) {
      console.error(`Error getting insights for ${metricType}:`, err);
      throw err;
    }
  }, [user]);
  
  return (
    <HealthContext.Provider 
      value={{
        metrics,
        targets,
        loading,
        error,
        getMetric,
        addMetric,
        getInsights
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export default HealthProvider;