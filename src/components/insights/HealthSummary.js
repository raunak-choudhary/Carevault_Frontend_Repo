import React from 'react';
import { FiTrendingUp, FiInfo } from 'react-icons/fi';
import styles from './HealthSummary.module.css';

const HealthSummary = ({ metricType, summary, trend }) => {
  // Get appropriate title based on metric type
  const getTitle = () => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    switch (metricType) {
      case 'weight':
        return 'Weight Analysis';
      case 'bloodPressure':
        return 'Blood Pressure Analysis';
      case 'bloodGlucose':
        return 'Blood Glucose Analysis';
      case 'heartRate':
        return 'Heart Rate Analysis';
      case 'sleep':
        return 'Sleep Analysis';
      case 'steps':
        return 'Activity Analysis';
      default:
        return `${capitalize(metricType)} Analysis`;
    }
  };

  // Get appropriate icon based on metric type
  const getIcon = () => {
    switch (metricType) {
      case 'weight':
        return <FiTrendingUp />;
      case 'bloodPressure':
        return <FiInfo />;
      case 'bloodGlucose':
        return <FiInfo />;
      case 'heartRate':
        return <FiInfo />;
      case 'sleep':
        return <FiInfo />;
      case 'steps':
        return <FiInfo />;
      default:
        return <FiInfo />;
    }
  };

  return (
    <div className={styles.summaryCard}>
      <div className={styles.summaryHeader}>
        <div className={styles.headerIcon}>{getIcon()}</div>
        <h3>{getTitle()}</h3>
      </div>

      <div className={styles.summaryContent}>
        {summary ? (
          <>
            <h4>Summary</h4>
            <p>{summary}</p>
          </>
        ) : (
          <p className={styles.noDataMessage}>
            Not enough data to generate a summary yet. Continue tracking your{' '}
            {metricType} to get personalized insights.
          </p>
        )}

        {trend && (
          <div className={styles.trendSection}>
            <h4>Trend Analysis</h4>
            <p>{trend}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthSummary;
