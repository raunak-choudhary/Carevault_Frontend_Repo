import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrendingUp, FiActivity, FiHeart, FiDroplet, FiMoon, FiWatch } from 'react-icons/fi';
import MetricChart from '../../components/insights/MetricChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useHealth } from '../../hooks/useHealth';
import styles from './MetricDetailPage.module.css';

const MetricDetailPage = () => {
  const { metricType } = useParams();
  const navigate = useNavigate();
  const { getMetric, error } = useHealth();
  
  const [metric, setMetric] = useState(null);
  const [timeRange, setTimeRange] = useState('1m'); // '7d', '1m', '3m', '6m', '1y'
  const [pageLoading, setPageLoading] = useState(true);
  
  // Fetch metric data when component mounts or metricType changes
  useEffect(() => {
    const fetchMetricData = async () => {
      if (!metricType) {
        navigate('/insights');
        return;
      }
      
      try {
        setPageLoading(true);
        const metricData = await getMetric(metricType);
        setMetric(metricData);
      } catch (err) {
        console.error(`Error fetching ${metricType} data:`, err);
      } finally {
        setPageLoading(false);
      }
    };
    
    fetchMetricData();
  }, [metricType, getMetric, navigate]);
  
  // Get title and icon based on metric type
  const getMetricInfo = () => {
    switch (metricType) {
      case 'weight':
        return { 
          title: 'Weight',
          icon: <FiTrendingUp />
        };
      case 'bloodPressure':
        return { 
          title: 'Blood Pressure',
          icon: <FiActivity />
        };
      case 'bloodGlucose':
        return { 
          title: 'Blood Glucose',
          icon: <FiDroplet />
        };
      case 'heartRate':
        return { 
          title: 'Heart Rate',
          icon: <FiHeart />
        };
      case 'sleep':
        return { 
          title: 'Sleep',
          icon: <FiMoon />
        };
      case 'steps':
        return { 
          title: 'Steps',
          icon: <FiWatch />
        };
      default:
        return { 
          title: 'Health Metric',
          icon: <FiTrendingUp />
        };
    }
  };
  
  // Format metric value based on type
  const formatMetricValue = (entry) => {
    if (!entry) return 'N/A';
    
    switch (metricType) {
      case 'weight':
        return `${entry.value} ${entry.unit}`;
      case 'bloodPressure':
        return `${entry.systolic}/${entry.diastolic} mmHg`;
      case 'bloodGlucose':
        return `${entry.value} ${entry.unit}`;
      case 'heartRate':
        return `${entry.value} ${entry.unit}`;
      case 'sleep':
        return `${entry.duration} hours`;
      case 'steps':
        return `${entry.count} steps`;
      default:
        return 'N/A';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const { title, icon } = getMetricInfo();
  
  if (pageLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <div className={styles.detailPage}>
      <div className={styles.pageHeader}>
        <Link to="/insights" className={styles.backButton}>
          <FiArrowLeft /> Back to Insights
        </Link>
        <h1>
          <span className={styles.metricIcon}>{icon}</span>
          {title} History
        </h1>
        <Link 
          to={`/insights/input?type=${metricType}`} 
          className={styles.addButton}
        >
          <FiPlus /> Add Data
        </Link>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2>Trends</h2>
          <div className={styles.timeRangeButtons}>
            <button 
              className={`${styles.timeRangeButton} ${timeRange === '7d' ? styles.activeRange : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              Week
            </button>
            <button 
              className={`${styles.timeRangeButton} ${timeRange === '1m' ? styles.activeRange : ''}`}
              onClick={() => setTimeRange('1m')}
            >
              Month
            </button>
            <button 
              className={`${styles.timeRangeButton} ${timeRange === '3m' ? styles.activeRange : ''}`}
              onClick={() => setTimeRange('3m')}
            >
              3 Months
            </button>
            <button 
              className={`${styles.timeRangeButton} ${timeRange === '6m' ? styles.activeRange : ''}`}
              onClick={() => setTimeRange('6m')}
            >
              6 Months
            </button>
            <button 
              className={`${styles.timeRangeButton} ${timeRange === '1y' ? styles.activeRange : ''}`}
              onClick={() => setTimeRange('1y')}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className={styles.chart}>
          <MetricChart 
            data={metric?.data || []} 
            metricType={metricType}
            timeRange={timeRange}
          />
        </div>
      </div>
      
      <div className={styles.historySection}>
        <h2>History</h2>
        
        {metric?.data && metric.data.length > 0 ? (
          <div className={styles.historyTable}>
            <div className={styles.tableHeader}>
              <div className={styles.dateColumn}>Date</div>
              <div className={styles.timeColumn}>Time</div>
              <div className={styles.valueColumn}>Value</div>
              {(metricType === 'bloodGlucose' || metricType === 'heartRate') && (
                <div className={styles.contextColumn}>Context</div>
              )}
              {metricType === 'sleep' && (
                <div className={styles.contextColumn}>Quality</div>
              )}
            </div>
            
            <div className={styles.tableBody}>
              {metric.data.map((entry, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.dateColumn}>{formatDate(entry.timestamp)}</div>
                  <div className={styles.timeColumn}>{formatTime(entry.timestamp)}</div>
                  <div className={styles.valueColumn}>{formatMetricValue(entry)}</div>
                  {metricType === 'bloodGlucose' && (
                    <div className={styles.contextColumn}>{entry.context || 'N/A'}</div>
                  )}
                  {metricType === 'heartRate' && (
                    <div className={styles.contextColumn}>{entry.context || 'N/A'}</div>
                  )}
                  {metricType === 'sleep' && (
                    <div className={styles.contextColumn}>{entry.quality || 'N/A'}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No {title.toLowerCase()} data available</p>
            <Link 
              to={`/insights/input?type=${metricType}`} 
              className={styles.emptyStateButton}
            >
              Add Your First Entry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricDetailPage;