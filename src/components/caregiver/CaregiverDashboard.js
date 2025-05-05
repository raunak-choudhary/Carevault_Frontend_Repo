// CaregiverDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiActivity,
  FiPlus,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi';
import CriticalAlertsWidget from './CriticalAlertsWidget';
import { usePatients } from '../../hooks/usePatients';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './CaregiverDashboard.module.css';

const CaregiverDashboard = () => {
  const { patients, loading, error } = usePatients();
  const [showAddButton, setShowAddButton] = useState(true);

  // Check if there are patients to determine if we should show the add button
  useEffect(() => {
    if (patients) {
      setShowAddButton(patients.length === 0);
    }
  }, [patients]);

  // Calculate summary statistics
  const activePatients =
    patients?.filter((p) => p.status === 'active').length || 0;
  const totalPatients = patients?.length || 0;
  const totalAlerts =
    patients?.reduce((sum, p) => sum + (p.alertCount || 0), 0) || 0;
  const upcomingAppointments =
    patients?.reduce((sum, p) => sum + (p.upcomingAppointmentsCount || 0), 0) ||
    0;

  // Stats for caregiver dashboard
  const stats = [
    {
      label: 'Active Patients',
      value: activePatients,
      icon: <FiUsers className={styles.statIcon} />,
      link: '/patients',
    },
    {
      label: 'Critical Alerts',
      value: totalAlerts,
      icon: <FiActivity className={styles.statIcon} />,
      highlight: totalAlerts > 0,
      link: '/patients',
    },
    {
      label: 'Upcoming Appointments',
      value: upcomingAppointments,
      icon: <FiCalendar className={styles.statIcon} />,
      link: '/appointments',
    },
    {
      label: 'Documents',
      value: patients?.reduce((sum, p) => sum + (p.documentCount || 0), 0) || 0,
      icon: <FiFileText className={styles.statIcon} />,
      link: '/documents',
    },
  ];

  return (
    <div className={styles.caregiverDashboard}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>Caregiver Dashboard</h1>
        <p>Manage your patients and monitor their health status</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className={styles.statCard}>
            <div
              className={`${styles.statValue} ${stat.highlight ? styles.highlightValue : ''}`}
            >
              {stat.value}
            </div>
            <div className={styles.statLabel}>
              {stat.icon}
              <span>{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {totalAlerts > 0 && (
        <section className={styles.alertsSection}>
          <div className={styles.sectionTitle}>
            <h2>
              <FiActivity className={styles.sectionIcon} /> Critical Alerts
            </h2>
            <Link to="/patients" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          <CriticalAlertsWidget />
        </section>
      )}

      <section className={styles.patientsSection}>
        <div className={styles.sectionTitle}>
          <h2>
            <FiUsers className={styles.sectionIcon} /> Your Patients
          </h2>
          {showAddButton && (
            <Link to="/patients/add" className={styles.addButton}>
              <FiPlus /> Add Patient
            </Link>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size="medium" />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <FiAlertCircle className={styles.errorIcon} />
            <p>{error}</p>
          </div>
        ) : totalPatients === 0 ? (
          <div className={styles.emptyState}>
            <p>
              You don't have any patients assigned yet. Add your first patient
              to get started!
            </p>
            <Link to="/patients/add" className={styles.addEmptyButton}>
              <FiPlus /> Add Patient
            </Link>
          </div>
        ) : (
          <Link to="/patients" className={styles.viewAllLink}>
            View All Patients <FiArrowRight />
          </Link>
        )}
      </section>
    </div>
  );
};

export default CaregiverDashboard;
