import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import styles from './UnauthorizedPage.module.css';

const UnauthorizedPage = () => {
  return (
    <div className={styles.unauthorizedPage}>
      <div className={styles.unauthorizedCard}>
        <div className={styles.iconContainer}>
          <FiAlertTriangle className={styles.icon} />
        </div>
        
        <h1 className={styles.title}>Access Denied</h1>
        
        <p className={styles.message}>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className={styles.actions}>
          <Link to="/dashboard" className={styles.backButton}>
            <FiArrowLeft className={styles.buttonIcon} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;