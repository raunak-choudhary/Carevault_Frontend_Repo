import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import styles from './RecommendationsList.module.css';

const RecommendationsList = ({ recommendations = [] }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className={styles.recommendationsCard}>
        <div className={styles.recommendationsHeader}>
          <h3>Recommendations</h3>
        </div>
        <div className={styles.recommendationsContent}>
          <p className={styles.noDataMessage}>
            Add more health data to receive personalized recommendations.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.recommendationsCard}>
      <div className={styles.recommendationsHeader}>
        <h3>Recommendations</h3>
      </div>
      
      <div className={styles.recommendationsContent}>
        <ul className={styles.recommendationsList}>
          {recommendations.map((recommendation, index) => (
            <li key={index} className={styles.recommendationItem}>
              <div className={styles.recommendationIcon}>
                <FiCheckCircle />
              </div>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendationsList;