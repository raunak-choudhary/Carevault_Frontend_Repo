import React from 'react';
import { FiClock, FiCheck, FiX, FiBell, FiVolume2 } from 'react-icons/fi';
import styles from './ReminderCard.module.css';

const ReminderCard = ({ reminder, medication, onMarkTaken, onMarkSkipped, onEditReminder }) => {
  if (!reminder || !medication) {
    return null;
  }
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if reminder is for today
  const isToday = (dateString) => {
    const today = new Date();
    const reminderDate = new Date(dateString);
    return (
      today.getDate() === reminderDate.getDate() &&
      today.getMonth() === reminderDate.getMonth() &&
      today.getFullYear() === reminderDate.getFullYear()
    );
  };
  
  // Get time remaining until reminder
  const getTimeRemaining = (dateTimeString) => {
    const now = new Date();
    const reminderTime = new Date(dateTimeString);
    const diffMs = reminderTime - now;
    
    // Past time
    if (diffMs < 0) return 'Past due';
    
    // Less than 1 hour
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} from now`;
    }
    
    // Less than 1 day
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} from now`;
    }
    
    // More than 1 day
    const days = Math.floor(diffMs / 86400000);
    return `${days} day${days !== 1 ? 's' : ''} from now`;
  };
  
  // Get notification type icon
  const getNotificationIcon = () => {
    switch (reminder.notificationType) {
      case 'popup':
        return <FiBell className={styles.notificationIcon} />;
      case 'sound':
        return <FiVolume2 className={styles.notificationIcon} />;
      case 'both':
        return (
          <div className={styles.combinedIcons}>
            <FiBell className={styles.notificationIcon} />
            <FiVolume2 className={styles.notificationIcon} />
          </div>
        );
      default:
        return <FiBell className={styles.notificationIcon} />;
    }
  };
  
  return (
    <div className={`${styles.reminderCard} ${reminder.status === 'taken' ? styles.takenReminder : ''} ${reminder.status === 'skipped' ? styles.skippedReminder : ''}`}>
      <div className={styles.reminderHeader}>
        <div className={styles.reminderTime}>
          <FiClock className={styles.timeIcon} />
          {formatTime(reminder.scheduledTime)}
        </div>
        
        <div className={styles.reminderDate}>
          {isToday(reminder.scheduledTime) ? 'Today' : formatDate(reminder.scheduledTime)}
        </div>
      </div>
      
      <div className={styles.reminderInfo}>
        <div className={styles.medicationName}>{medication.name}</div>
        <div className={styles.medicationDosage}>{medication.dosage} {medication.unit}</div>
        
        {medication.instructions && (
          <div className={styles.instructions}>{medication.instructions}</div>
        )}
      </div>
      
      <div className={styles.reminderFooter}>
        <div className={styles.reminderStatus}>
          {reminder.status === 'scheduled' && (
            <span className={styles.scheduledStatus}>
              {getTimeRemaining(reminder.scheduledTime)}
            </span>
          )}
          {reminder.status === 'taken' && (
            <span className={styles.takenStatus}>Taken</span>
          )}
          {reminder.status === 'skipped' && (
            <span className={styles.skippedStatus}>Skipped</span>
          )}
        </div>
        
        <div className={styles.reminderSettings}>
          {getNotificationIcon()}
          {reminder.notificationTime === 'beforeTime' && (
            <span className={styles.reminderSettingText}>
              {reminder.minutesBefore} min before
            </span>
          )}
        </div>
      </div>
      
      {reminder.status === 'scheduled' && (
        <div className={styles.reminderActions}>
          <button
            className={styles.takenButton}
            onClick={() => onMarkTaken && onMarkTaken(reminder.id)}
            title="Mark as taken"
          >
            <FiCheck />
            <span>Taken</span>
          </button>
          
          <button
            className={styles.skipButton}
            onClick={() => onMarkSkipped && onMarkSkipped(reminder.id)}
            title="Mark as skipped"
          >
            <FiX />
            <span>Skip</span>
          </button>
          
          <button
            className={styles.editButton}
            onClick={() => onEditReminder && onEditReminder(reminder.id)}
            title="Edit reminder"
          >
            <FiClock />
            <span>Edit</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReminderCard;