// CriticalAlertsWidget.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiChevronRight,
  FiFilter,
  FiAlertCircle,
} from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './CriticalAlertsWidget.module.css';

const CriticalAlertsWidget = () => {
  const { patients, switchPatient } = usePatients();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'high', 'medium', 'low'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Simulate fetching alerts
  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Generate sample alerts data
        const allAlerts = [];

        patients.forEach((patient) => {
          // Generate 0-3 random alerts per patient
          const alertCount = Math.floor(Math.random() * 4);

          for (let i = 0; i < alertCount; i++) {
            // Random alert type
            const types = ['appointment', 'medication', 'health'];
            const type = types[Math.floor(Math.random() * types.length)];

            // Random priority
            const priorities = ['high', 'medium', 'low'];
            const priority =
              priorities[Math.floor(Math.random() * priorities.length)];

            // Create alert message based on type
            let message = '';
            let redirectPath = '';

            if (type === 'appointment') {
              message = `Upcoming appointment in ${Math.floor(Math.random() * 5) + 1} days`;
              redirectPath = `/patient/${patient.id}/appointments`;
            } else if (type === 'medication') {
              message = `Medication refill needed for ${['Lisinopril', 'Metformin', 'Atorvastatin'][Math.floor(Math.random() * 3)]}`;
              redirectPath = `/patient/${patient.id}/medications`;
            } else {
              message = `Abnormal ${['blood pressure', 'blood glucose', 'heart rate'][Math.floor(Math.random() * 3)]} reading`;
              redirectPath = `/patient/${patient.id}/insights`;
            }

            // Add alert
            allAlerts.push({
              id: `alert-${patient.id}-${i}`,
              patientId: patient.id,
              patientName: `${patient.first_name} ${patient.last_name}`,
              type,
              priority,
              message,
              date: new Date(
                Date.now() -
                  Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
              ).toISOString(),
              redirectPath,
              isResolved: false,
            });
          }
        });

        // Sort by priority and date
        allAlerts.sort((a, b) => {
          // Sort by priority first (high to low)
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }

          // Then sort by date (newest first)
          return new Date(b.date) - new Date(a.date);
        });

        setAlerts(allAlerts);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [patients]);

  // Filter alerts
  const filteredAlerts = React.useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter((alert) => alert.priority === filter);
  }, [alerts, filter]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get alert icon based on type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <FiCalendar className={styles.alertTypeIcon} />;
      case 'medication':
        return <FiClock className={styles.alertTypeIcon} />;
      case 'health':
        return <FiActivity className={styles.alertTypeIcon} />;
      default:
        return <FiAlertTriangle className={styles.alertTypeIcon} />;
    }
  };

  // Get action icon based on type
  const getActionIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <FiCalendar />;
      case 'medication':
        return <FiClock />;
      case 'health':
        return <FiActivity />;
      default:
        return <FiAlertTriangle />;
    }
  };

  // Handle view patient
  const handleViewPatient = async (patientId, redirectPath) => {
    try {
      await switchPatient(patientId);
      navigate(redirectPath || '/dashboard');
    } catch (err) {
      console.error('Error switching patient:', err);
    }
  };

  // Handle resolving an alert
  const handleResolveAlert = (alertId, patientId, event) => {
    // Stop event propagation to prevent clicking the alert item
    event.stopPropagation();

    // In a real app, this would call an API to resolve the alert
    setAlerts(
      (prevAlerts) =>
        prevAlerts
          .map((alert) =>
            alert.id === alertId ? { ...alert, isResolved: true } : alert,
          )
          .filter((alert) => alert.id !== alertId), // Remove the resolved alert
    );
  };

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className={styles.alertsWidget}>
        <div className={styles.widgetHeader}>
          <h2>
            <FiAlertTriangle /> Critical Alerts
          </h2>
        </div>
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.alertsWidget}>
        <div className={styles.widgetHeader}>
          <h2>
            <FiAlertTriangle /> Critical Alerts
          </h2>
        </div>
        <div className={styles.errorContainer}>
          <FiAlertCircle className={styles.errorIcon} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (filteredAlerts.length === 0) {
    return (
      <div className={styles.alertsWidget}>
        <div className={styles.widgetHeader}>
          <h2>
            <FiAlertTriangle /> Critical Alerts
          </h2>
          <div className={styles.widgetControls}>
            <div className={styles.filterContainer}>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={styles.filterSelect}
                aria-label="Filter alerts by priority"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <FiFilter className={styles.filterIcon} />
            </div>
          </div>
        </div>
        <div className={styles.noAlerts}>
          <p>No critical alerts at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.alertsWidget}>
      <div className={styles.widgetHeader}>
        <h2>
          <FiAlertTriangle />
          Critical Alerts
          <span className={styles.alertCount}>{filteredAlerts.length}</span>
        </h2>
        <div className={styles.widgetControls}>
          <div className={styles.filterContainer}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filter alerts by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <FiFilter className={styles.filterIcon} />
          </div>
          <button
            className={styles.collapseButton}
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand alerts' : 'Collapse alerts'}
          >
            <FiChevronRight
              className={`${styles.collapseIcon} ${isCollapsed ? styles.collapsed : ''}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`${styles.alertsContainer} ${isCollapsed ? styles.collapsed : ''}`}
      >
        {filteredAlerts.slice(0, 5).map((alert, index) => (
          <div
            key={alert.id}
            className={`${styles.alertItem} ${styles[alert.priority + 'Priority']}`}
            onClick={() =>
              handleViewPatient(alert.patientId, alert.redirectPath)
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleViewPatient(alert.patientId, alert.redirectPath);
                e.preventDefault();
              }
            }}
          >
            <div className={styles.alertContent}>
              <div className={styles.alertHeader}>
                <div className={styles.alertType}>
                  {getAlertIcon(alert.type)}
                  <span className={styles.alertTypeName}>{alert.type}</span>
                </div>
                <div className={styles.alertDate}>{formatDate(alert.date)}</div>
              </div>

              <div className={styles.alertMessage}>{alert.message}</div>

              <div className={styles.patientInfo}>
                <span className={styles.patientName}>{alert.patientName}</span>
              </div>
            </div>

            <div className={styles.alertActions}>
              <button
                className={styles.resolveButton}
                onClick={(e) =>
                  handleResolveAlert(alert.id, alert.patientId, e)
                }
                title="Mark as resolved"
                aria-label="Mark alert as resolved"
              >
                <FiCheckCircle />
              </button>

              <button
                className={styles.viewButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPatient(alert.patientId, alert.redirectPath);
                }}
                title="View details"
                aria-label="View alert details"
              >
                {getActionIcon(alert.type)}
              </button>
            </div>
          </div>
        ))}

        {filteredAlerts.length > 5 && (
          <Link to="/patients" className={styles.viewAllButton}>
            View all {filteredAlerts.length} alerts
          </Link>
        )}
      </div>
    </div>
  );
};

export default CriticalAlertsWidget;
