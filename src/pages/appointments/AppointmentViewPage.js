import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiEdit, FiMapPin, FiUser, FiXCircle, FiCheck, FiMessageSquare } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MapView from '../../components/appointments/MapView';
import { getAppointmentById, cancelAppointment } from '../../services/appointmentService';
import styles from './AppointmentViewPage.module.css';

const AppointmentViewPage = () => {
  const { id } = useParams();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  
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
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  // Calculate appointment status
  const getAppointmentStatus = () => {
    if (!appointment) return {};
    
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
  
  // Handle appointment cancellation
  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      return;
    }
    
    try {
      setCancelling(true);
      const updatedAppointment = await cancelAppointment(id, cancelReason);
      setAppointment(updatedAppointment);
      setShowCancelModal(false);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };
  
  const status = appointment ? getAppointmentStatus() : {};
  const isPastAppointment = appointment && new Date(appointment.startTime) < new Date();
  const isCancelled = appointment && appointment.status === 'cancelled';
  
  return (
    <div className={styles.viewPage}>
      <div className={styles.pageHeader}>
        <Link to="/appointments" className={styles.backButton}>
          <FiArrowLeft /> Back to Appointments
        </Link>
        <h1>Appointment Details</h1>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : appointment ? (
        <div className={styles.appointmentContainer}>
          <div className={styles.appointmentHeader}>
            <div className={styles.appointmentTitle}>
              <h2>{appointment.title || 'Appointment'}</h2>
              <div className={`${styles.appointmentStatus} ${status.className}`}>
                {status.label}
              </div>
            </div>
            
            {!isPastAppointment && !isCancelled && (
              <div className={styles.appointmentActions}>
                <Link 
                  to={`/appointments/edit/${appointment.id}`} 
                  className={styles.editButton}
                >
                  <FiEdit /> Edit
                </Link>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowCancelModal(true)}
                >
                  <FiXCircle /> Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.appointmentDetails}>
            <div className={styles.detailsSection}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <FiCalendar />
                </div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Date</div>
                  <div className={styles.detailValue}>{formatDate(appointment.startTime)}</div>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <FiClock />
                </div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Time</div>
                  <div className={styles.detailValue}>
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </div>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                  <FiUser />
                </div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Provider</div>
                  <div className={styles.detailValue}>{appointment.providerName || 'Unknown Provider'}</div>
                </div>
              </div>
              
              {appointment.type && (
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <FiMessageSquare />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Appointment Type</div>
                    <div className={styles.detailValue}>
                      {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {appointment.location && (
              <div className={styles.locationSection}>
                <h3>
                  <FiMapPin className={styles.sectionIcon} />
                  Location
                </h3>
                <div className={styles.locationAddress}>
                  {appointment.location}
                </div>
                
                <div className={styles.mapContainer}>
                  <MapView address={appointment.location} />
                </div>
              </div>
            )}
            
            {appointment.notes && (
              <div className={styles.notesSection}>
                <h3>Notes</h3>
                <div className={styles.notesContent}>
                  {appointment.notes}
                </div>
              </div>
            )}
            
            {isCancelled && appointment.cancellationReason && (
              <div className={styles.cancellationSection}>
                <h3>Cancellation Reason</h3>
                <div className={styles.cancellationReason}>
                  {appointment.cancellationReason}
                </div>
                <div className={styles.cancellationDate}>
                  Cancelled on: {formatDate(appointment.cancelledAt)} at {formatTime(appointment.cancelledAt)}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.notFoundMessage}>
          Appointment not found
        </div>
      )}
      
      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Cancel Appointment</h3>
            <p className={styles.modalText}>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Reason for cancellation</label>
              <textarea
                className={styles.textareaInput}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                rows={3}
              ></textarea>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancelButton}
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
              >
                Go Back
              </button>
              
              <button 
                className={styles.modalConfirmButton}
                onClick={handleCancelAppointment}
                disabled={cancelling || !cancelReason.trim()}
              >
                {cancelling ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    <FiCheck /> Confirm Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentViewPage;