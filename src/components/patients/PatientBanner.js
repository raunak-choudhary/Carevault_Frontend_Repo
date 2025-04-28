import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiClipboard, FiCalendar, FiActivity, FiPackage } from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import styles from './PatientBanner.module.css';

const PatientBanner = () => {
  const { activePatient, isViewingPatient } = usePatients();
  
  if (!activePatient) return null;
  
  // Calculate age from birthdate if available
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    
    try {
      const birthDate = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (e) {
      console.error('Error calculating age:', e);
      return null;
    }
  };
  
  // Create base URL for navigation links based on context
  const getBaseUrl = () => {
    return isViewingPatient ? `/patient/${activePatient.id}` : '';
  };
  
  const patientAge = calculateAge(activePatient.birthDate);
  
  return (
    <div className={styles.patientBanner}>
      <div className={styles.patientInfo}>
        <div className={styles.patientAvatar}>
          {activePatient.avatar ? (
            <img 
              src={activePatient.avatar} 
              alt={`${activePatient.firstName} ${activePatient.lastName}`} 
            />
          ) : (
            <FiUser className={styles.avatarIcon} />
          )}
        </div>
        
        <div className={styles.patientDetails}>
          <h2>{activePatient.firstName} {activePatient.lastName}</h2>
          <div className={styles.patientMeta}>
            {patientAge !== null && <span className={styles.metaItem}>{patientAge} years</span>}
            {activePatient.gender && <span className={styles.metaItem}>{activePatient.gender}</span>}
            {activePatient.contactPhone && (
              <span className={styles.metaItem}>{activePatient.contactPhone}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.quickActions}>
        <Link to={`${getBaseUrl()}/documents`} className={styles.actionButton}>
          <FiClipboard className={styles.actionIcon} />
          <span>Documents</span>
        </Link>
        <Link to={`${getBaseUrl()}/appointments`} className={styles.actionButton}>
          <FiCalendar className={styles.actionIcon} />
          <span>Appointments</span>
        </Link>
        <Link to={`${getBaseUrl()}/medications`} className={styles.actionButton}>
          <FiPackage className={styles.actionIcon} />
          <span>Medications</span>
        </Link>
        <Link to={`${getBaseUrl()}/insights`} className={styles.actionButton}>
          <FiActivity className={styles.actionIcon} />
          <span>Health</span>
        </Link>
      </div>
    </div>
  );
};

export default PatientBanner;