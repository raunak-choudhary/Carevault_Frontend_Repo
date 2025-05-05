import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiArrowLeft,
  FiTrendingUp,
  FiActivity,
  FiHeart,
  FiDroplet,
  FiMoon,
  FiWatch,
  FiCheck,
} from 'react-icons/fi';
import MetricInputForm from '../../components/insights/MetricInputForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useHealth } from '../../hooks/useHealth';
import styles from './MetricInputPage.module.css';

const MetricInputPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addMetric } = useHealth();

  // Extract metric type from URL query parameters or default to 'weight'
  const queryParams = new URLSearchParams(location.search);
  const defaultMetricType = queryParams.get('type') || 'weight';

  const [selectedMetric, setSelectedMetric] = useState(defaultMetricType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // List of metric types with their icons and labels
  const metricTypes = [
    { type: 'weight', label: 'Weight', icon: <FiTrendingUp /> },
    { type: 'bloodPressure', label: 'Blood Pressure', icon: <FiActivity /> },
    { type: 'bloodGlucose', label: 'Blood Glucose', icon: <FiDroplet /> },
    { type: 'heartRate', label: 'Heart Rate', icon: <FiHeart /> },
    { type: 'sleep', label: 'Sleep', icon: <FiMoon /> },
    { type: 'steps', label: 'Steps', icon: <FiWatch /> },
  ];

  // Handle metric type selection
  const handleSelectMetric = (metricType) => {
    setSelectedMetric(metricType);
  };

  // Handle form cancel
  const handleCancel = () => {
    navigate('/insights');
  };

  // Handle form submission
  const handleSave = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Add metric entry
      await addMetric(selectedMetric, data);

      // Show success state
      setSuccess(true);

      // Redirect after a brief delay
      setTimeout(() => {
        navigate('/insights');
      }, 1500);
    } catch (err) {
      console.error(`Error saving ${selectedMetric} data:`, err);
      setError('Failed to save health data. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.inputPage}>
      <div className={styles.pageHeader}>
        <Link to="/insights" className={styles.backButton}>
          <FiArrowLeft /> Back to Insights
        </Link>
        <h1>Add Health Data</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {success ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <FiCheck size={32} />
          </div>
          <h2>Data Saved Successfully!</h2>
          <p>Your health data has been recorded.</p>
          <LoadingSpinner size="small" />
          <p className={styles.redirectMessage}>
            Redirecting to health insights...
          </p>
        </div>
      ) : (
        <div className={styles.inputContainer}>
          <div className={styles.metricSelector}>
            {metricTypes.map((metric) => (
              <button
                key={metric.type}
                className={`${styles.metricButton} ${selectedMetric === metric.type ? styles.selectedMetric : ''}`}
                onClick={() => handleSelectMetric(metric.type)}
              >
                <div className={styles.metricIcon}>{metric.icon}</div>
                <span>{metric.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.formContainer}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <LoadingSpinner size="large" />
                <p>Saving your health data...</p>
              </div>
            ) : (
              <MetricInputForm
                metricType={selectedMetric}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricInputPage;
