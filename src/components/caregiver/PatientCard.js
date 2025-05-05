import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiCalendar,
  FiFileText,
  FiActivity,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
  FiEdit,
} from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import { updatePatient } from '../../services/patientService';
import styles from './PatientCard.module.css';

const PatientCard = ({ patient }) => {
  const navigate = useNavigate();
  const { switchPatient } = usePatients();
  const [isActive, setIsActive] = useState(patient.status === 'active');
  const [updating, setUpdating] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle view patient dashboard
  const handleViewDashboard = async () => {
    try {
      // First switch to the patient
      await switchPatient(patient.id);
      // Then navigate to the patient's dashboard
      navigate(`/patient/${patient.id}/dashboard`);
    } catch (error) {
      console.error('Error switching to patient:', error);
    }
  };

  // Handle edit patient profile
  const handleEditProfile = (e) => {
    e.stopPropagation();
    navigate(`/patients/profile/${patient.id}`);
  };

  // Handle toggle patient status
  const handleToggleStatus = async (e) => {
    e.stopPropagation(); // Prevent click from triggering parent actions

    try {
      setUpdating(true);
      const newStatus = isActive ? 'inactive' : 'active';

      // Call API to update patient status
      await updatePatient(patient.id, { status: newStatus });

      // Update local state
      setIsActive(!isActive);
    } catch (error) {
      console.error('Error updating patient status:', error);
      // You could add error handling UI here
    } finally {
      setUpdating(false);
    }
  };

  if (!patient) return null;

  return (
    <div className={styles.patientCard}>
      <div className={styles.patientHeader}>
        <div className={styles.patientAvatar}>
          <FiUser size={24} />
        </div>
        <div className={styles.patientName}>
          {patient.firstName} {patient.lastName}
        </div>
        <div
          className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusInactive}`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className={styles.patientInfo}>
        <div className={styles.infoItem}>
          <FiCalendar className={styles.infoIcon} />
          <div className={styles.infoContent}>
            <div className={styles.infoLabel}>Last Activity</div>
            <div className={styles.infoValue}>
              {formatDate(patient.lastActivity)}
            </div>
          </div>
        </div>

        <div className={styles.infoItem}>
          <FiFileText className={styles.infoIcon} />
          <div className={styles.infoContent}>
            <div className={styles.infoLabel}>Documents</div>
            <div className={styles.infoValue}>{patient.documentCount || 0}</div>
          </div>
        </div>

        <div className={styles.infoItem}>
          <FiActivity className={styles.infoIcon} />
          <div className={styles.infoContent}>
            <div className={styles.infoLabel}>Health Alerts</div>
            <div className={styles.infoValue}>
              {patient.alertCount > 0 ? (
                <span className={styles.alertCount}>{patient.alertCount}</span>
              ) : (
                'None'
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.patientActions}>
        <button
          className={styles.viewDashboardButton}
          onClick={handleViewDashboard}
          aria-label={`View dashboard for ${patient.firstName} ${patient.lastName}`}
        >
          <FiEye className={styles.buttonIcon} />
          View Dashboard
        </button>

        <button
          className={styles.editProfileButton}
          onClick={handleEditProfile}
          aria-label={`Edit profile for ${patient.firstName} ${patient.lastName}`}
        >
          <FiEdit className={styles.buttonIcon} />
          Edit Profile
        </button>

        <button
          className={`${styles.toggleStatusButton} ${isActive ? styles.deactivateButton : styles.activateButton}`}
          onClick={handleToggleStatus}
          disabled={updating}
          aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${patient.firstName} ${patient.lastName}`}
        >
          {updating ? (
            'Updating...'
          ) : (
            <>
              {isActive ? (
                <>
                  <FiToggleRight className={styles.buttonIcon} />
                  Deactivate
                </>
              ) : (
                <>
                  <FiToggleLeft className={styles.buttonIcon} />
                  Activate
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
