import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { createAppointment } from '../../services/appointmentService';
import styles from './AppointmentCreatePage.module.css';

const AppointmentCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create appointment
      const appointment = await createAppointment(appointmentData);
      
      // Show success state
      setSuccess(true);
      
      // Redirect after a brief delay
      setTimeout(() => {
        navigate(`/appointments/view/${appointment.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.createPage}>
      <div className={styles.pageHeader}>
        <Link to="/appointments" className={styles.backButton}>
          <FiArrowLeft /> Back to Appointments
        </Link>
        <h1>Schedule Appointment</h1>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {success ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <FiCheck size={32} />
          </div>
          <h2>Appointment Scheduled!</h2>
          <p>Your appointment has been successfully scheduled.</p>
          <LoadingSpinner size="small" />
          <p className={styles.redirectMessage}>Redirecting to appointment details...</p>
        </div>
      ) : (
        <div className={styles.createContainer}>
          <AppointmentForm 
            onSubmit={handleSubmit} 
            loading={loading}
          />
          
          <div className={styles.createInfoSidebar}>
            <h3>About Appointments</h3>
            <ul className={styles.infoList}>
              <li>
                <strong>Search Providers</strong> – Find healthcare providers near you
              </li>
              <li>
                <strong>Select Time</strong> – Choose from available time slots
              </li>
              <li>
                <strong>Set Reminder</strong> – Get notified before your appointment
              </li>
              <li>
                <strong>Easy Rescheduling</strong> – Change your appointment if needed
              </li>
            </ul>
            
            <div className={styles.infoNote}>
              <h4>Cancellation Policy</h4>
              <p>
                Appointments can be cancelled or rescheduled up to 24 hours before the scheduled time without any penalty.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCreatePage;