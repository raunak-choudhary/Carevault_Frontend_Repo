import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiClock, FiCalendar, FiUser, FiHome, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useMedications } from '../../hooks/useMedications';
import styles from './MedicationDetailPage.module.css';

const MedicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMedication, deleteMedication } = useMedications();
  
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch medication data
  useEffect(() => {
    const fetchMedication = async () => {
      try {
        setLoading(true);
        const medicationData = await getMedication(id);
        setMedication(medicationData);
        setError(null);
      } catch (err) {
        console.error('Error fetching medication:', err);
        setError('Failed to load medication details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedication();
  }, [id, getMedication]);
  
  // Handle medication deletion
  const handleDeleteMedication = async () => {
    try {
      setLoading(true);
      await deleteMedication(id);
      navigate('/medications');
    } catch (err) {
      console.error('Error deleting medication:', err);
      setError('Failed to delete medication. Please try again.');
      setLoading(false);
    }
  };
  
  // Format date for display - fixed to handle the timezone issue
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    // For YYYY-MM-DD format dates (from form inputs)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      // Create date with local timezone (no conversion)
      const date = new Date(year, month - 1, day); // month is 0-based in JS Date
      return date.toLocaleDateString(undefined, options);
    }
    
    // For ISO dates with time component
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/medications" className={styles.backButton}>
          <FiArrowLeft /> Back to Medications
        </Link>
      </div>
    );
  }
  
  if (!medication) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Medication Not Found</h2>
        <p>The medication you are looking for does not exist or has been removed.</p>
        <Link to="/medications" className={styles.backButton}>
          <FiArrowLeft /> Back to Medications
        </Link>
      </div>
    );
  }
  
  return (
    <div className={styles.detailPage}>
      <div className={styles.pageHeader}>
        <Link to="/medications" className={styles.backButton}>
          <FiArrowLeft /> Back to Medications
        </Link>
        <h1>{medication.name}</h1>
        
        <div className={styles.actionButtons}>
          <Link to={`/medications/edit/${medication.id}`} className={styles.editButton}>
            <FiEdit2 /> Edit
          </Link>
          <button 
            className={styles.deleteButton}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
      
      <div className={styles.medicationCard}>
        <div className={styles.medicationHeader}>
          <h2>{medication.name}</h2>
          <div className={styles.medicationDosage}>
            {medication.dosage} {medication.unit}
          </div>
        </div>
        
        <div className={styles.medicationDetails}>
          <div className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <FiClock />
            </div>
            <div className={styles.detailContent}>
              <div className={styles.detailLabel}>Frequency</div>
              <div className={styles.detailValue}>
                {formatFrequency(medication.frequency, medication.customFrequency)}
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
                <div className={styles.detailValue}>{medication.instructions}</div>
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
                <div className={styles.detailValue}>{formatDate(medication.refillDate)}</div>
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
                <div className={styles.detailValue}>{medication.prescribedBy}</div>
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
          <div className={styles.statusItem}>
            <div className={styles.statusLabel}>Status</div>
            <div className={`${styles.statusBadge} ${medication.status === 'active' ? styles.activeBadge : styles.inactiveBadge}`}>
              {medication.status === 'active' ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div className={styles.statusItem}>
            <div className={styles.statusLabel}>Created</div>
            <div className={styles.statusValue}>{formatDate(medication.createdAt)}</div>
          </div>
          
          {medication.updatedAt && (
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Last Updated</div>
              <div className={styles.statusValue}>{formatDate(medication.updatedAt)}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Delete Medication</h2>
            <p>Are you sure you want to delete {medication.name}? This action cannot be undone.</p>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteConfirmButton}
                onClick={handleDeleteMedication}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationDetailPage;