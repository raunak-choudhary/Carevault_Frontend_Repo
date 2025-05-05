import React from 'react';
import {
  FiClock,
  FiCalendar,
  FiUser,
  FiHome,
  FiAlertCircle,
} from 'react-icons/fi';
import styles from './MedicationDetails.module.css';

const MedicationDetails = ({ medication }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
      undefined,
      options,
    );
  };

  // Format frequency text
  const formatFrequency = (frequency, customFrequency) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'twice_daily':
        return 'Twice Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'as_needed':
        return 'As Needed';
      case 'custom':
        return customFrequency || 'Custom Schedule';
      default:
        return 'Not specified';
    }
  };

  if (!medication) {
    return (
      <div className={styles.detailsPlaceholder}>
        Select a medication to view details
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <h2 className={styles.medicationName}>{medication.name}</h2>
        <div className={styles.medicationDosage}>
          {medication.dosage} {medication.unit}
        </div>
      </div>

      <div className={styles.detailsContent}>
        <div className={styles.detailItem}>
          <div className={styles.detailIcon}>
            <FiClock />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailLabel}>Frequency</div>
            <div className={styles.detailValue}>
              {formatFrequency(
                medication.frequency,
                medication.customFrequency,
              )}
            </div>
          </div>
        </div>

        {medication.instructions && (
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <FiAlertCircle />
            </div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Instructions</div>
              <div className={styles.detailValue}>
                {medication.instructions}
              </div>
            </div>
          </div>
        )}

        {medication.dosageSchedule && medication.dosageSchedule.length > 0 && (
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <FiClock />
            </div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Schedule</div>
              <div className={styles.detailValue}>
                {medication.dosageSchedule.map((time, index) => (
                  <span key={index} className={styles.scheduleTime}>
                    {formatTime(time)}
                    {index < medication.dosageSchedule.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {medication.refillDate && (
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <FiCalendar />
            </div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Refill Date</div>
              <div className={styles.detailValue}>
                {formatDate(medication.refillDate)}
              </div>
            </div>
          </div>
        )}

        {medication.prescribedBy && (
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <FiUser />
            </div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Prescribed By</div>
              <div className={styles.detailValue}>
                {medication.prescribedBy}
              </div>
            </div>
          </div>
        )}

        {medication.pharmacy && (
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <FiHome />
            </div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Pharmacy</div>
              <div className={styles.detailValue}>{medication.pharmacy}</div>
            </div>
          </div>
        )}
      </div>

      {medication.notes && (
        <div className={styles.notesSection}>
          <h3>Notes</h3>
          <div className={styles.notesContent}>{medication.notes}</div>
        </div>
      )}

      <div className={styles.statusSection}>
        <div
          className={`${styles.statusBadge} ${medication.status === 'active' ? styles.activeBadge : styles.inactiveBadge}`}
        >
          {medication.status === 'active' ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;
