import React from 'react';
import { FiUser, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import styles from './ContextIndicator.module.css';

const ContextIndicator = () => {
  const { user } = useAuth();
  const { activePatient } = usePatients();
  
  if (!user) return null;
  
  // Determine indicator type
  const isCaregiver = user.role === 'caregiver';
  const hasActivePatient = Boolean(activePatient);
  
  // Get appropriate class and text
  let indicatorClass = styles.indicator;
  let indicatorText = 'Your Account';
  let indicatorIcon = <FiUser className={styles.icon} />;
  
  if (isCaregiver && !hasActivePatient) {
    indicatorClass = `${styles.indicator} ${styles.caregiverMode}`;
    indicatorText = 'Caregiver Dashboard';
    indicatorIcon = <FiUsers className={styles.icon} />;
  } else if (isCaregiver && hasActivePatient) {
    indicatorClass = `${styles.indicator} ${styles.patientMode}`;
    indicatorText = `Viewing: ${activePatient.firstName} ${activePatient.lastName}`;
    indicatorIcon = <FiUser className={styles.icon} />;
  } else if (!isCaregiver) {
    indicatorClass = `${styles.indicator} ${styles.userMode}`;
    indicatorText = 'Patient Dashboard';
    indicatorIcon = <FiUser className={styles.icon} />;
  }
  
  return (
    <div className={indicatorClass} role="status" aria-live="polite">
      <div className={styles.iconContainer}>
        {indicatorIcon}
      </div>
      <span className={styles.text}>{indicatorText}</span>
    </div>
  );
};

export default ContextIndicator;