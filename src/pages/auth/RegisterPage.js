import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { register } from '../../services/authService';
import TermsModal from '../../components/common/TermsModal';
import PrivacyModal from '../../components/common/PrivacyModal';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // Call register service
      const { user } = await register(formData);

      // Update auth context
      signIn(user);

      console.log(user);

      // Redirect to verification page if not verified
      if (!user.verified) {
        console.log(user);
        navigate('/verify-account');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setApiError(error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const openTermsModal = (e) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  const closeTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerCard}>
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

        <h1 className={styles.title}>Create an Account</h1>
        <p className={styles.subtitle}>
          Join CareVault to manage your healthcare efficiently
        </p>

        {apiError && <div className={styles.errorAlert}>{apiError}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FiUser />
                </span>
                <input
                  type="text"
                  name="firstName"
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              {errors.firstName && (
                <div className={styles.errorText}>{errors.firstName}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FiUser />
                </span>
                <input
                  type="text"
                  name="lastName"
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              {errors.lastName && (
                <div className={styles.errorText}>{errors.lastName}</div>
              )}
            </div>
          </div>

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
                placeholder="Email Address"
                required
              />
            </div>
            {errors.email && (
              <div className={styles.errorText}>{errors.email}</div>
            )}
          </div>

          <div className={styles.formRow}>
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
                  placeholder="Password"
                  required
                />
              </div>
              {errors.password && (
                <div className={styles.errorText}>{errors.password}</div>
              )}
              <div className={styles.passwordHint}>
                Must be at least 8 characters
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FiLock />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              {errors.confirmPassword && (
                <div className={styles.errorText}>{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>I am a:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={formData.role === 'patient'}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                Patient
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="caregiver"
                  checked={formData.role === 'caregiver'}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                Caregiver
              </label>
            </div>
          </div>

          <div className={styles.termsCheckbox}>
            <label
              className={`${styles.checkboxLabel} ${errors.agreeToTerms ? styles.checkboxError : ''}`}
            >
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={styles.checkboxInput}
                required
              />
              I agree to the{' '}
              <button
                type="button"
                onClick={openTermsModal}
                className={styles.termsLink}
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={openPrivacyModal}
                className={styles.termsLink}
              >
                Privacy Policy
              </button>
            </label>
            {errors.agreeToTerms && (
              <div className={styles.errorText}>{errors.agreeToTerms}</div>
            )}
          </div>

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              <>
                Create Account <FiArrowRight className={styles.buttonIcon} />
              </>
            )}
          </button>
        </form>

        <div className={styles.loginLink}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>

        {/* Modals */}
        <TermsModal isOpen={isTermsModalOpen} onClose={closeTermsModal} />
        <PrivacyModal isOpen={isPrivacyModalOpen} onClose={closePrivacyModal} />
      </div>
    </div>
  );
};

export default RegisterPage;
