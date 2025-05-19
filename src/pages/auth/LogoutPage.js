import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './LogoutPage.module.css';

const LogoutPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout
    const performLogout = async () => {
      try {
        await signOut();

        // Wait a brief moment for visual feedback
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/login');
      }
    };

    performLogout();
  }, [signOut, navigate]);

  return (
    <div className={styles.logoutPage}>
      <div className={styles.logoutCard}>
        <h1 className={styles.title}>Signing Out</h1>
        <div className={styles.spinnerContainer}>
          <LoadingSpinner size="large" color="primary" />
        </div>
        <p className={styles.message}>
          Please wait while we securely log you out...
        </p>
      </div>
    </div>
  );
};

export default LogoutPage;
