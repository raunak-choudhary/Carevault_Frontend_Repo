import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiTrendingUp, FiActivity, FiHeart, FiDroplet, FiMoon, FiWatch } from 'react-icons/fi';
import HealthMetricCard from '../../components/insights/HealthMetricCard';
import HealthSummary from '../../components/insights/HealthSummary';
import RecommendationsList from '../../components/insights/RecommendationsList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useHealth } from '../../hooks/useHealth';
import styles from './HealthInsightsPage.module.css';

const HealthInsightsPage = () => {
  const { metrics, loading, error, getInsights } = useHealth();
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [insights, setInsights] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  
  // Get initial insights when component mounts
  useEffect(() => {
    const fetchInitialInsights = async () => {
      if (loading || !metrics) return;
      
      try {
        setInsightLoading(true);
        const initialInsights = await getInsights('weight');
        setInsights(initialInsights);
      } catch (err) {
        console.error('Error fetching initial insights:', err);
      } finally {
        setInsightLoading(false);
      }
    };
    
    fetchInitialInsights();
  }, [loading, metrics, getInsights]);
  
  // Get insights when selected metric changes
  useEffect(() => {
    const fetchInsights = async () => {
      if (!selectedMetric) return;
      
      try {
        setInsightLoading(true);
        const metricInsights = await getInsights(selectedMetric);
        setInsights(metricInsights);
      } catch (err) {
        console.error(`Error fetching ${selectedMetric} insights:`, err);
      } finally {
        setInsightLoading(false);
      }
    };
    
    fetchInsights();
  }, [selectedMetric, getInsights]);
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Health Data</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className={styles.insightsPage}>
      <div className={styles.pageHeader}>
        <h1>Health Insights</h1>
        <Link to="/insights/input" className={styles.addButton}>
          <FiPlusCircle /> Add Health Data
        </Link>
      </div>
      
      <div className={styles.metricCards}>
        <HealthMetricCard
          title="Weight"
          icon={<FiTrendingUp />}
          data={metrics.weight}
          unit="kg"
          isSelected={selectedMetric === 'weight'}
          onClick={() => setSelectedMetric('weight')}
        />
        <HealthMetricCard
          title="Blood Pressure"
          icon={<FiActivity />}
          data={metrics.bloodPressure}
          unit="mmHg"
          isSelected={selectedMetric === 'bloodPressure'}
          onClick={() => setSelectedMetric('bloodPressure')}
        />
        <HealthMetricCard
          title="Blood Glucose"
          icon={<FiDroplet />}
          data={metrics.bloodGlucose}
          unit="mg/dL"
          isSelected={selectedMetric === 'bloodGlucose'}
          onClick={() => setSelectedMetric('bloodGlucose')}
        />
        <HealthMetricCard
          title="Heart Rate"
          icon={<FiHeart />}
          data={metrics.heartRate}
          unit="bpm"
          isSelected={selectedMetric === 'heartRate'}
          onClick={() => setSelectedMetric('heartRate')}
        />
        <HealthMetricCard
          title="Sleep"
          icon={<FiMoon />}
          data={metrics.sleep}
          unit="hrs"
          isSelected={selectedMetric === 'sleep'}
          onClick={() => setSelectedMetric('sleep')}
        />
        <HealthMetricCard
          title="Steps"
          icon={<FiWatch />}
          data={metrics.steps}
          unit="steps"
          isSelected={selectedMetric === 'steps'}
          onClick={() => setSelectedMetric('steps')}
        />
      </div>
      
      <div className={styles.insightsContainer}>
        <div className={styles.detailSection}>
          <h2>
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Details
            <Link to={`/insights/metric/${selectedMetric}`} className={styles.viewAllLink}>
              View All
            </Link>
          </h2>
          
          {metrics[selectedMetric]?.length > 0 ? (
            <div className={styles.metricDetail}>
              <div className={styles.metricChartPlaceholder}>
                {/* This will be replaced with MetricChart component */}
                <div className={styles.chartPlaceholder}>
                  Chart visualization will appear here
                </div>
              </div>
              
              <div className={styles.metricInfoCard}>
                <h3>Latest Reading</h3>
                {selectedMetric === 'weight' && metrics.weight[0] && (
                  <div className={styles.metricValue}>
                    {metrics.weight[0].value} {metrics.weight[0].unit}
                    <span className={styles.metricDate}>
                      {new Date(metrics.weight[0].timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedMetric === 'bloodPressure' && metrics.bloodPressure[0] && (
                  <div className={styles.metricValue}>
                    {metrics.bloodPressure[0].systolic}/{metrics.bloodPressure[0].diastolic} mmHg
                    <span className={styles.metricDate}>
                      {new Date(metrics.bloodPressure[0].timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedMetric === 'bloodGlucose' && metrics.bloodGlucose[0] && (
                  <div className={styles.metricValue}>
                    {metrics.bloodGlucose[0].value} {metrics.bloodGlucose[0].unit}
                    <span className={styles.metricDate}>
                      {new Date(metrics.bloodGlucose[0].timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedMetric === 'heartRate' && metrics.heartRate[0] && (
                  <div className={styles.metricValue}>
                    {metrics.heartRate[0].value} {metrics.heartRate[0].unit}
                    <span className={styles.metricDate}>
                      {new Date(metrics.heartRate[0].timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedMetric === 'sleep' && metrics.sleep[0] && (
                  <div className={styles.metricValue}>
                    {metrics.sleep[0].duration} hours
                    <span className={styles.metricDate}>
                      {new Date(metrics.sleep[0].timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedMetric === 'steps' && metrics.steps[0] && (
                  <div className={styles.metricValue}>
                    {metrics.steps[0].count} steps
                    <span className={styles.metricDate}>
                      {new Date(metrics.steps[0].timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No {selectedMetric} data available yet</p>
              <Link to="/insights/input" className={styles.emptyStateButton}>
                Add {selectedMetric} Data
              </Link>
            </div>
          )}
        </div>
        
        <div className={styles.insightsSection}>
          {insightLoading ? (
            <div className={styles.insightLoading}>
              <LoadingSpinner size="medium" />
              <p>Generating insights...</p>
            </div>
          ) : (
            <>
              <HealthSummary 
                metricType={selectedMetric}
                summary={insights?.summary || ""}
                trend={insights?.trend || ""}
              />
              
              <RecommendationsList 
                recommendations={insights?.recommendations || []}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthInsightsPage;