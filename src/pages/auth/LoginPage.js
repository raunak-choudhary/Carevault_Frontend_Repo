import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { login } from '../../services/authService';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setApiError('');

    // Validate form
    if (!validate()) {
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call login service
      const { user, token } = await login(formData);

      // Update auth context
      signIn(user);

      // Redirect to intended destination
      navigate(from, { replace: true });
    } catch (error) {
      setApiError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
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

        <h1 className={styles.title}>Sign In</h1>

        {apiError && <div className={styles.errorAlert}>{apiError}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <FiMail />
              </span>
              <input
                type="email"
                name="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            {errors.email && (
              <div className={styles.errorText}>{errors.email}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <FiLock />
              </span>
              <input
                type="password"
                name="password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            {errors.password && (
              <div className={styles.errorText}>{errors.password}</div>
            )}
          </div>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              <>
                Sign In <FiArrowRight className={styles.buttonIcon} />
              </>
            )}
          </button>
        </form>

        <div className={styles.registerLink}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>

        {/* Demo account info - remove in production */}
        <div className={styles.demoInfo}>
          <p>Demo Account: demo@carevault.com</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
