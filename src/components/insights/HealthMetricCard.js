import React from 'react';
import styles from './HealthMetricCard.module.css';

const HealthMetricCard = ({ title, icon, data = [], unit, isSelected, onClick }) => {
  // Get the most recent value, or placeholder if no data
  const getLatestValue = () => {
    if (!data || data.length === 0) {
      return 'No data';
    }
    
    const latest = data[0];
    
    // Format based on data type
    if (title === 'Blood Pressure' && latest.systolic && latest.diastolic) {
      return `${latest.systolic}/${latest.diastolic}`;
    } else if (title === 'Sleep' && latest.duration) {
      return latest.duration;
    } else if (title === 'Steps' && latest.count) {
      return latest.count;
    } else if (latest.value) {
      return latest.value;
    }
    
    return 'No data';
  };
  
  // Get trend indicator for the data
  const getTrend = () => {
    if (!data || data.length < 2) {
      return null;
    }
    
    // Calculate trend based on metric type
    let trend;
    
    if (title === 'Blood Pressure') {
      const latest = data[0];
      const previous = data[1];
      
      if (latest.systolic < previous.systolic && latest.diastolic < previous.diastolic) {
        trend = 'down';
      } else if (latest.systolic > previous.systolic && latest.diastolic > previous.diastolic) {
        trend = 'up';
      } else {
        trend = 'stable';
      }
    } else if (title === 'Sleep') {
      const latestDuration = data[0].duration;
      const previousDuration = data[1].duration;
      
      if (latestDuration > previousDuration) {
        trend = 'up';
      } else if (latestDuration < previousDuration) {
        trend = 'down';
      } else {
        trend = 'stable';
      }
    } else if (title === 'Steps') {
      const latestCount = data[0].count;
      const previousCount = data[1].count;
      
      if (latestCount > previousCount) {
        trend = 'up';
      } else if (latestCount < previousCount) {
        trend = 'down';
      } else {
        trend = 'stable';
      }
    } else {
      // For weight, blood glucose, heart rate
      const latestValue = data[0].value;
      const previousValue = data[1].value;
      
      if (latestValue > previousValue) {
        trend = 'up';
      } else if (latestValue < previousValue) {
        trend = 'down';
      } else {
        trend = 'stable';
      }
    }
    
    // Determine if trend is good or bad (simplified logic)
    let isGood;
    
    if (title === 'Weight') {
      // For weight, down is usually good
      isGood = trend === 'stable' || trend === 'down';
    } else if (title === 'Blood Pressure') {
      // For blood pressure, lower is usually better (up to a point)
      isGood = trend === 'stable' || trend === 'down';
    } else if (title === 'Blood Glucose') {
      // For blood glucose, stability is key
      isGood = trend === 'stable';
    } else if (title === 'Heart Rate') {
      // For heart rate, stability is usually good
      isGood = trend === 'stable';
    } else if (title === 'Sleep') {
      // For sleep, more is usually better (up to a point)
      isGood = trend === 'stable' || trend === 'up';
    } else if (title === 'Steps') {
      // For steps, more is usually better
      isGood = trend === 'stable' || trend === 'up';
    }
    
    return { direction: trend, isGood };
  };
  
  const trend = getTrend();
  const latestValue = getLatestValue();
  
  return (
    <div 
      className={`${styles.metricCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.metricIcon}>
        {icon}
      </div>
      
      <div className={styles.metricTitle}>
        {title}
      </div>
      
      <div className={styles.metricValue}>
        {latestValue} {typeof latestValue === 'number' || latestValue !== 'No data' ? unit : ''}
      </div>
      
      {trend && (
        <div className={styles.trendIndicator}>
          {trend.direction === 'up' && (
            <span className={`${styles.trendArrow} ${trend.isGood ? styles.trendGood : styles.trendBad}`}>
              ↑
            </span>
          )}
          {trend.direction === 'down' && (
            <span className={`${styles.trendArrow} ${trend.isGood ? styles.trendGood : styles.trendBad}`}>
              ↓
            </span>
          )}
          {trend.direction === 'stable' && (
            <span className={`${styles.trendArrow} ${styles.trendStable}`}>
              →
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthMetricCard;