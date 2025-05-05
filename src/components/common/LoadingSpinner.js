import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const spinnerClasses = [styles.spinner, styles[size], styles[color]]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.spinnerContainer}>
      <div className={spinnerClasses}></div>
    </div>
  );
};

export default LoadingSpinner;
