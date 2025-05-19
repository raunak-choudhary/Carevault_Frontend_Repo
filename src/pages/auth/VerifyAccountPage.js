import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { verifyAccount } from '../../services/authService';
import styles from './VerifyAccountPage.module.css';

const VerifyAccountPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if user is already verified
  useEffect(() => {
    if (user?.email_verified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError('');

    // Validate verification code
    if (!verificationCode) {
      setError('Please enter verification code');
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call verify account service
      const updatedUser = await verifyAccount(verificationCode);

      // Update user in context
      updateUser(updatedUser);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to verify account');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    // In a real app, this would call an API to resend verification code

    // For demo, we'll just show a success message
    setError('');
    setCountdown(60); // 60 seconds until can resend again

    // Show feedback that code was sent
    alert('A new verification code has been sent to your email');
  };

  return (
    <div className={styles.verifyPage}>
      <div className={styles.verifyCard}>
        <div className={styles.logo}>
          <div className={styles.logoImage}>
            <img
              src={require('../../assets/images/carevault-logo.png')}
              alt="CareVault"
              className={styles.logoImage}
            />
          </div>
          <div className={styles.logoText}>CareVault</div>
        </div>

        <h1 className={styles.title}>Verify Your Account</h1>

        <div className={styles.verifyContent}>
          <div className={styles.verifyIcon}>
            <FiCheckCircle />
          </div>

          <p className={styles.subtitle}>
            We've sent a verification code to <strong>{user?.email}</strong>.
            Please enter the code below to verify your account.
          </p>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form className={styles.form} onSubmit={handleVerify}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Verification Code</label>
              <input
                type="text"
                className={styles.input}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <div className={styles.hint}>
                For demo purposes, use code: 123456
              </div>
            </div>

            <button
              type="submit"
              className={styles.verifyButton}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loadingSpinner}></span>
              ) : (
                'Verify Account'
              )}
            </button>
          </form>

          <div className={styles.resendCodeSection}>
            <p>Didn't receive a code?</p>
            <button
              onClick={handleResendCode}
              className={styles.resendButton}
              disabled={countdown > 0}
            >
              Resend Code {countdown > 0 ? `(${countdown}s)` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
