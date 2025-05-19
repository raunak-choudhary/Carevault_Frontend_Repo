import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import { resetPassword } from '../../services/authService';
import styles from './ResetPasswordPage.module.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get token from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');

    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Password reset token is missing');
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError('');

    // Validate form
    if (!validate()) {
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call reset password service
      await resetPassword(token, formData.password);

      // Show success message
      setSuccess(true);

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPasswordPage}>
      <div className={styles.resetPasswordCard}>
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

        <h1 className={styles.title}>Reset Password</h1>

        {!success ? (
          <>
            <p className={styles.subtitle}>
              Please enter your new password below.
            </p>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>New Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiLock />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className={styles.input}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className={styles.passwordHint}>
                  Must be at least 8 characters
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm New Password</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiLock />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={styles.input}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !token}
              >
                {loading ? (
                  <span className={styles.loadingSpinner}></span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Password Reset Successful</h2>
            <p>
              Your password has been successfully reset. You will be redirected
              to the login page shortly.
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

export default ResetPasswordPage;
