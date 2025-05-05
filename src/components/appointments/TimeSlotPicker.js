import React, { useState, useEffect } from 'react';
import { FiClock, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { getAvailableTimeSlots } from '../../services/appointmentService';
import styles from './TimeSlotPicker.module.css';

const TimeSlotPicker = ({
  date,
  providerId,
  onSelectTimeSlot,
  selectedStartTime,
}) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available time slots for the selected date and provider
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!date || !providerId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const availableSlots = await getAvailableTimeSlots(date, providerId);
        setTimeSlots(availableSlots);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Failed to load available time slots');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [date, providerId]);

  // Group time slots by morning, afternoon, and evening
  const groupedTimeSlots = () => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    timeSlots.forEach((slot) => {
      const hour = parseInt(slot.startTime.split(':')[0]);

      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Handle time slot selection
  const handleSelectTimeSlot = (slot) => {
    onSelectTimeSlot(slot.startTime, slot.endTime);
  };

  // If loading, show spinner
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="medium" />
        <p>Loading available time slots...</p>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FiAlertCircle className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    );
  }

  // If no time slots available, show message
  if (timeSlots.length === 0) {
    return (
      <div className={styles.noSlotsContainer}>
        <FiClock className={styles.noSlotsIcon} />
        <p>
          No time slots available for the selected date. Please try another
          date.
        </p>
      </div>
    );
  }

  // Group time slots
  const { morning, afternoon, evening } = groupedTimeSlots();

  return (
    <div className={styles.timeSlotPicker}>
      {morning.length > 0 && (
        <div className={styles.timeSlotSection}>
          <h3 className={styles.sectionTitle}>Morning</h3>
          <div className={styles.timeSlotGrid}>
            {morning.map((slot, index) => (
              <button
                key={index}
                className={`${styles.timeSlot} ${slot.startTime === selectedStartTime ? styles.selectedTimeSlot : ''}`}
                onClick={() => handleSelectTimeSlot(slot)}
                type="button"
              >
                {formatTime(slot.startTime)}
              </button>
            ))}
          </div>
        </div>
      )}

      {afternoon.length > 0 && (
        <div className={styles.timeSlotSection}>
          <h3 className={styles.sectionTitle}>Afternoon</h3>
          <div className={styles.timeSlotGrid}>
            {afternoon.map((slot, index) => (
              <button
                key={index}
                className={`${styles.timeSlot} ${slot.startTime === selectedStartTime ? styles.selectedTimeSlot : ''}`}
                onClick={() => handleSelectTimeSlot(slot)}
                type="button"
              >
                {formatTime(slot.startTime)}
              </button>
            ))}
          </div>
        </div>
      )}

      {evening.length > 0 && (
        <div className={styles.timeSlotSection}>
          <h3 className={styles.sectionTitle}>Evening</h3>
          <div className={styles.timeSlotGrid}>
            {evening.map((slot, index) => (
              <button
                key={index}
                className={`${styles.timeSlot} ${slot.startTime === selectedStartTime ? styles.selectedTimeSlot : ''}`}
                onClick={() => handleSelectTimeSlot(slot)}
                type="button"
              >
                {formatTime(slot.startTime)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
