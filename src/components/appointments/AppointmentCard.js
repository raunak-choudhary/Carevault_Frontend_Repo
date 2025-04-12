import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiUser, FiCalendar, FiChevronRight } from 'react-icons/fi';
import styles from './AppointmentCard.module.css';

const AppointmentCard = ({ appointment }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  // Calculate status
  const getAppointmentStatus = () => {
    const appointmentDate = new Date(appointment.startTime);
    const now = new Date();
    
    if (appointment.status === 'cancelled') {
      return { label: 'Cancelled', className: styles.statusCancelled };
    } else if (appointmentDate < now) {
      return { label: 'Completed', className: styles.statusCompleted };
    } else {
      // Check if appointment is today
      const isToday = appointmentDate.toDateString() === now.toDateString();
      if (isToday) {
        return { label: 'Today', className: styles.statusToday };
      } else {
        return { label: 'Upcoming', className: styles.statusUpcoming };
      }
    }
  };
  
  const status = getAppointmentStatus();
  
  return (
    <Link to={`/appointments/view/${appointment.id}`} className={styles.appointmentCard}>
      <div className={styles.appointmentCardContent}>
        <div className={styles.appointmentHeader}>
          <div className={styles.appointmentType}>
            {appointment.type || 'General Checkup'}
          </div>
          <div className={`${styles.appointmentStatus} ${status.className}`}>
            {status.label}
          </div>
        </div>
        
        <h3 className={styles.appointmentTitle}>
          {appointment.title || 'Appointment'}
        </h3>
        
        <div className={styles.appointmentDetails}>
          <div className={styles.detailItem}>
            <FiCalendar className={styles.detailIcon} />
            <span>{formatDate(appointment.startTime)}</span>
          </div>
          
          <div className={styles.detailItem}>
            <FiClock className={styles.detailIcon} />
            <span>{formatTime(appointment.startTime)}</span>
          </div>
          
          <div className={styles.detailItem}>
            <FiUser className={styles.detailIcon} />
            <span>{appointment.providerName || 'Dr. Unknown'}</span>
          </div>
          
          {appointment.location && (
            <div className={styles.detailItem}>
              <FiMapPin className={styles.detailIcon} />
              <span>{appointment.location}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.appointmentAction}>
        <FiChevronRight className={styles.actionIcon} />
      </div>
    </Link>
  );
};

export default AppointmentCard;