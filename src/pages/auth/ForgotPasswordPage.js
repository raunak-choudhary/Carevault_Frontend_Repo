import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { requestPasswordReset } from '../../services/authService';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess(false);
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
      // Call password reset service
      await requestPasswordReset(email);
      
      // Show success message
      setSuccess(true);
      setEmail(''); // Clear the form
    } catch (error) {
      setError(error.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.forgotPasswordCard}>
        <div className={styles.logo}>
          <div className={styles.logoImage}>
            <img src={require('../../assets/images/carevault-logo.png')} alt="CareVault" className={styles.logoImage} />
          </div>
          <div className={styles.logoText}>CareVault</div>
        </div>
        
        <h1 className={styles.title}>Forgot Password</h1>
        
        {!success ? (
          <>
            <p className={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><FiMail /></span>
                  <input
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? (
                  <span className={styles.loadingSpinner}></span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Check Your Email</h2>
            <p>
              If an account exists with the email you provided, we've sent instructions
              on how to reset your password.
            </p>
          </div>
        )}
        
        <div className={styles.backLink}>
          <Link to="/login">
            <FiArrowLeft className={styles.backIcon} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;