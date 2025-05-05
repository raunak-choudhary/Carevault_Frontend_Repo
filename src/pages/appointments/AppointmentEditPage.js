import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  getAppointmentById,
  updateAppointment,
} from '../../services/appointmentService';
import styles from './AppointmentEditPage.module.css';

const AppointmentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch appointment on component mount
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const appointmentData = await getAppointmentById(id);
        setAppointment(appointmentData);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (appointmentData) => {
    try {
      setSaving(true);
      setError(null);

      // Update appointment
      await updateAppointment(id, appointmentData);

      // Show success state
      setSuccess(true);

      // Redirect after a brief delay
      setTimeout(() => {
        navigate(`/appointments/view/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(
        err.message || 'Failed to update appointment. Please try again.',
      );
      setSaving(false);
    }
  };

  // Prepare appointment data for the form
  const prepareFormData = (appointment) => {
    if (!appointment) return {};

    // Extract date from startTime
    const startDate = appointment.startTime.split('T')[0];

    // Extract time from startTime and endTime
    const startTime = appointment.startTime.split('T')[1];
    const endTime = appointment.endTime.split('T')[1];

    return {
      ...appointment,
      date: startDate,
      startTime: startTime,
      endTime: endTime,
    };
  };

  return (
    <div className={styles.editPage}>
      <div className={styles.pageHeader}>
        <Link to={`/appointments/view/${id}`} className={styles.backButton}>
          <FiArrowLeft /> Back to Appointment
        </Link>
        <h1>Edit Appointment</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : success ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <FiSave size={32} />
          </div>
          <h2>Appointment Updated!</h2>
          <p>Your appointment has been successfully updated.</p>
          <LoadingSpinner size="small" />
          <p className={styles.redirectMessage}>
            Redirecting to appointment details...
          </p>
        </div>
      ) : appointment ? (
        <div className={styles.editContainer}>
          <AppointmentForm
            initialData={prepareFormData(appointment)}
            onSubmit={handleSubmit}
            loading={saving}
            isEditing={true}
          />
        </div>
      ) : (
        <div className={styles.notFoundMessage}>Appointment not found</div>
      )}
    </div>
  );
};

export default AppointmentEditPage;
