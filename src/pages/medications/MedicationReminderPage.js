import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiBell, FiFilter } from 'react-icons/fi';
import ReminderCard from '../../components/medications/ReminderCard';
import ReminderForm from '../../components/medications/ReminderForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useMedications } from '../../hooks/useMedications';
import notificationSystem from '../../utils/NotificationSystem';
import styles from './MedicationReminderPage.module.css';

const MedicationReminderPage = () => {
  const { medications, loading, error } = useMedications();
  const [reminders, setReminders] = useState([]);
  const [filterType, setFilterType] = useState('upcoming'); // upcoming, today, all
  const [showRequestPermission, setShowRequestPermission] = useState(false);
  
  // State for the reminder form modal
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [currentMedication, setCurrentMedication] = useState(null);
  
  // Generate reminders based on medications
  useEffect(() => {
    if (!medications || medications.length === 0) return;
    
    // Create upcoming reminders based on medication schedules
    const generateReminders = () => {
      const now = new Date();
      const generatedReminders = [];
      
      medications.forEach(medication => {
        // Skip inactive medications
        if (medication.status !== 'active') return;
        
        // Only process medications with a dosage schedule
        if (!medication.dosageSchedule || !medication.dosageSchedule.length) return;
        
        // Generate reminders for the next 7 days
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const reminderDate = new Date();
          reminderDate.setDate(now.getDate() + dayOffset);
          
          // Check if this medication should be taken on this day based on frequency
          let shouldTakeOnThisDay = true;
          
          if (medication.frequency === 'weekly') {
            // Only include if the day of week matches today's day of week
            shouldTakeOnThisDay = reminderDate.getDay() === now.getDay();
          } else if (medication.frequency === 'monthly') {
            // Only include if the day of month matches today's day of month
            shouldTakeOnThisDay = reminderDate.getDate() === now.getDate();
          } else if (medication.frequency === 'custom') {
            // Custom frequency handling would go here
            // For now, assume daily for custom frequency
            shouldTakeOnThisDay = true;
          }
          
          if (shouldTakeOnThisDay) {
            medication.dosageSchedule.forEach((time, timeIndex) => {
              // Parse time
              const [hours, minutes] = time.split(':').map(Number);
              
              // Create reminder datetime
              const reminderTime = new Date(reminderDate);
              reminderTime.setHours(hours, minutes, 0, 0);
              
              // Skip reminders that have already passed
              if (dayOffset === 0 && reminderTime < now) return;
              
              // Create reminder object
              const reminder = {
                id: `${medication.id}_${dayOffset}_${timeIndex}`,
                medicationId: medication.id,
                scheduledTime: reminderTime.toISOString(),
                status: 'scheduled', // scheduled, taken, skipped
                notificationType: 'both', // popup, sound, both
                notificationTime: 'atTime', // atTime, beforeTime
                minutesBefore: 15,
                soundEnabled: true,
                soundType: 'default',
                vibrationEnabled: true,
                repeatNotification: false,
                repeatInterval: 5,
                maxRepeats: 3
              };
              
              generatedReminders.push(reminder);
            });
          }
        }
      });
      
      // Sort reminders by scheduled time
      generatedReminders.sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
      
      setReminders(generatedReminders);
    };
    
    generateReminders();
  }, [medications]);
  
  // Request notification permission on page load
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const hasPermission = await notificationSystem.checkPermission();
      setShowRequestPermission(!hasPermission);
    };
    
    checkNotificationPermission();
  }, []);
  
  // Handle requesting notification permission
  const handleRequestPermission = async () => {
    const granted = await notificationSystem.requestPermission();
    setShowRequestPermission(!granted);
    
    if (granted) {
      // Send a test notification
      notificationSystem.sendNotification({
        title: 'Medication Reminders Enabled',
        body: 'You will now receive notifications for your medication reminders.',
        icon: '/logo192.png'
      });
    }
  };
  
  // Get filtered reminders
  const getFilteredReminders = () => {
    if (!reminders || reminders.length === 0) return [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (filterType) {
      case 'today':
        return reminders.filter(reminder => {
          const reminderDate = new Date(reminder.scheduledTime);
          return reminderDate >= today && reminderDate < tomorrow;
        });
      case 'upcoming':
        return reminders.filter(reminder => {
          const reminderDate = new Date(reminder.scheduledTime);
          return reminderDate >= now;
        });
      case 'all':
      default:
        return reminders;
    }
  };
  
  // Find medication for a reminder
  const findMedicationForReminder = (reminder) => {
    return medications.find(med => med.id === reminder.medicationId);
  };
  
  // Mark a reminder as taken
  const handleMarkTaken = (reminderId) => {
    setReminders(prevReminders => 
      prevReminders.map(reminder => 
        reminder.id === reminderId ? { ...reminder, status: 'taken' } : reminder
      )
    );
  };
  
  // Mark a reminder as skipped
  const handleMarkSkipped = (reminderId) => {
    setReminders(prevReminders => 
      prevReminders.map(reminder => 
        reminder.id === reminderId ? { ...reminder, status: 'skipped' } : reminder
      )
    );
  };
  
  // Edit a reminder's settings
  const handleEditReminder = (reminderId) => {
    const reminderToEdit = reminders.find(r => r.id === reminderId);
    if (!reminderToEdit) return;
    
    const medicationForReminder = findMedicationForReminder(reminderToEdit);
    if (!medicationForReminder) return;
    
    setCurrentReminder(reminderToEdit);
    setCurrentMedication(medicationForReminder);
    setShowReminderForm(true);
  };
  
  // Handle update reminder submission
  const handleReminderUpdate = (updatedReminderData) => {
    setReminders(prevReminders => 
      prevReminders.map(reminder => 
        reminder.id === updatedReminderData.id ? { ...reminder, ...updatedReminderData } : reminder
      )
    );
    
    // Close the form modal
    setShowReminderForm(false);
    setCurrentReminder(null);
    setCurrentMedication(null);
  };
  
  // Handle canceling the reminder edit
  const handleCancelEdit = () => {
    setShowReminderForm(false);
    setCurrentReminder(null);
    setCurrentMedication(null);
  };
  
  // Group reminders by date for display
  const groupRemindersByDate = (reminders) => {
    return reminders.reduce((groups, reminder) => {
      const dateKey = new Date(reminder.scheduledTime).toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(reminder);
      return groups;
    }, {});
  };
  
  const filteredReminders = getFilteredReminders();
  const groupedReminders = groupRemindersByDate(filteredReminders);
  
  return (
    <div className={styles.reminderPage}>
      <div className={styles.pageHeader}>
        <Link to="/medications" className={styles.backButton}>
          <FiArrowLeft /> Back to Medications
        </Link>
        <h1>
          <FiBell className={styles.headerIcon} /> 
          Medication Reminders
        </h1>
      </div>
      
      {showRequestPermission && (
        <div className={styles.permissionBanner}>
          <FiBell className={styles.bannerIcon} />
          <div className={styles.bannerContent}>
            <h3>Enable Notifications</h3>
            <p>Allow notifications to receive medication reminders.</p>
          </div>
          <button 
            className={styles.permissionButton}
            onClick={handleRequestPermission}
          >
            Enable
          </button>
        </div>
      )}
      
      <div className={styles.reminderFilters}>
        <div className={styles.filterText}>
          <FiFilter /> View:
        </div>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filterType === 'upcoming' ? styles.activeFilter : ''}`}
            onClick={() => setFilterType('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`${styles.filterButton} ${filterType === 'today' ? styles.activeFilter : ''}`}
            onClick={() => setFilterType('today')}
          >
            Today
          </button>
          <button
            className={`${styles.filterButton} ${filterType === 'all' ? styles.activeFilter : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          {error}
        </div>
      ) : (
        <div className={styles.reminderList}>
          {Object.keys(groupedReminders).length > 0 ? (
            Object.entries(groupedReminders).map(([date, dayReminders]) => (
              <div key={date} className={styles.reminderDateGroup}>
                <div className={styles.dateHeader}>
                  <FiCalendar className={styles.dateIcon} />
                  <div className={styles.dateText}>
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                {dayReminders.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    medication={findMedicationForReminder(reminder)}
                    onMarkTaken={handleMarkTaken}
                    onMarkSkipped={handleMarkSkipped}
                    onEditReminder={handleEditReminder}
                  />
                ))}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FiClock className={styles.emptyIcon} />
              <h3>No Reminders</h3>
              <p>
                {filterType === 'upcoming'
                  ? "You don't have any upcoming medication reminders."
                  : filterType === 'today'
                  ? "You don't have any medication reminders for today."
                  : "You don't have any medication reminders."}
              </p>
              <Link to="/medications/add" className={styles.addButton}>
                Add Medication
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Reminder Form Modal */}
      {showReminderForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ReminderForm
              medication={currentMedication}
              initialData={currentReminder}
              onSubmit={handleReminderUpdate}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationReminderPage;