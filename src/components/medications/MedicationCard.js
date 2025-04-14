import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCalendar, FiChevronRight } from 'react-icons/fi';
import styles from './MedicationCard.module.css';

const MedicationCard = ({ medication, showActions = true, onClick }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, options);
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
  
  // Check if medication has reminders
  const hasReminders = medication.dosageSchedule && medication.dosageSchedule.length > 0;
  
  return (
    <div 
      className={styles.medicationCard} 
      onClick={onClick}
    >
      <div className={styles.medicationHeader}>
        <h3 className={styles.medicationName}>{medication.name}</h3>
        <div className={styles.medicationDosage}>
          {medication.dosage} {medication.unit}
        </div>
      </div>
      
      <div className={styles.medicationDetails}>
        {medication.frequency && (
          <div className={styles.medicationFrequency}>
            <FiClock className={styles.icon} />
            <span>{formatFrequency(medication.frequency, medication.customFrequency)}</span>
          </div>
        )}
        
        {hasReminders && (
          <div className={styles.medicationSchedule}>
            <FiCalendar className={styles.icon} />
            <span>
              {medication.dosageSchedule.map((time, index) => (
                <span key={index} className={styles.scheduleTime}>
                  {formatTime(time)}
                  {index < medication.dosageSchedule.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
      
      {medication.notes && (
        <div className={styles.medicationNotes}>
          {medication.notes}
        </div>
      )}
      
      <div className={styles.medicationMeta}>
        <div className={styles.medicationRefill}>
          {medication.refillDate && (
            <span>Refill: {formatDate(medication.refillDate)}</span>
          )}
        </div>
        
        {medication.status === 'active' ? (
          <div className={styles.statusBadge}>Active</div>
        ) : (
          <div className={`${styles.statusBadge} ${styles.inactiveBadge}`}>Inactive</div>
        )}
      </div>
      
      {showActions && (
        <div className={styles.medicationActions}>
          <Link 
            to={`/medications/view/${medication.id}`} 
            className={styles.viewLink}
            onClick={(e) => e.stopPropagation()}
          >
            <FiChevronRight />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MedicationCard;