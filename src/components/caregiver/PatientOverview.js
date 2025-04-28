import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiFileText, 
  FiActivity, 
  FiClock,
  FiArrowRight,
  FiAlertCircle
} from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './PatientOverview.module.css';

const PatientOverview = () => {
  const { activePatient, loading: patientLoading, isViewingPatient } = usePatients();
  const [loading, setLoading] = useState(true);
  const [patientSummary, setPatientSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching patient summary data
    const fetchPatientSummary = async () => {
      if (!activePatient) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call - in a real app, this would be an actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Sample data - in a real app, this would come from the API
        const summary = {
          appointments: {
            upcoming: 2,
            next: {
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              provider: "Dr. Smith",
              type: "Follow-up"
            }
          },
          medications: {
            total: 5,
            dueToday: 3
          },
          documents: {
            total: 12,
            recent: {
              name: "Blood Test Results",
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
          },
          vitals: {
            lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: "Normal"
          }
        };
        
        setPatientSummary(summary);
      } catch (err) {
        console.error('Error fetching patient summary:', err);
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientSummary();
  }, [activePatient]);

  if (patientLoading || !activePatient) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FiAlertCircle className={styles.errorIcon} />
        <p>{error}</p>
      </div>
    );
  }

  if (!patientSummary) {
    return (
      <div className={styles.noPatientSelected}>
        <p>No patient data available</p>
      </div>
    );
  }

  // Create base URL for navigation links based on context
  const getBaseUrl = () => {
    return isViewingPatient ? `/patient/${activePatient.id}` : '';
  };

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.patientHeader}>
        <div className={styles.patientInfo}>
          <div className={styles.patientAvatar}>
            {activePatient.avatar ? (
              <img 
                src={activePatient.avatar} 
                alt={`${activePatient.firstName} ${activePatient.lastName}`} 
              />
            ) : activePatient.firstName && activePatient.lastName ? (
              `${activePatient.firstName.charAt(0)}${activePatient.lastName.charAt(0)}`
            ) : (
              'P'
            )}
          </div>
          <div className={styles.patientDetails}>
            <h2 className={styles.patientName}>
              {activePatient.firstName} {activePatient.lastName}
            </h2>
            <div className={styles.patientMeta}>
              {activePatient.dateOfBirth && (
                <div className={styles.patientDetail}>
                  <span>DOB:</span> {new Date(activePatient.dateOfBirth).toLocaleDateString()}
                </div>
              )}
              {activePatient.healthId && (
                <div className={styles.patientDetail}>
                  <span>Health ID:</span> {activePatient.healthId}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingGrid}>
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FiCalendar className={styles.cardIcon} />
              <h3>Appointments</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.statValue}>{patientSummary.appointments.upcoming}</div>
              <div className={styles.statLabel}>Upcoming</div>
              {patientSummary.appointments.next && (
                <div className={styles.detailItem}>
                  <span>Next:</span> {patientSummary.appointments.next.date} with {patientSummary.appointments.next.provider}
                </div>
              )}
            </div>
            <Link to={`${getBaseUrl()}/appointments`} className={styles.cardLink}>
              View Appointments <FiArrowRight />
            </Link>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FiClock className={styles.cardIcon} />
              <h3>Medications</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.statValue}>{patientSummary.medications.dueToday}</div>
              <div className={styles.statLabel}>Due Today</div>
              <div className={styles.detailItem}>
                <span>Total:</span> {patientSummary.medications.total} medications
              </div>
            </div>
            <Link to={`${getBaseUrl()}/medications`} className={styles.cardLink}>
              View Medications <FiArrowRight />
            </Link>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FiFileText className={styles.cardIcon} />
              <h3>Documents</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.statValue}>{patientSummary.documents.total}</div>
              <div className={styles.statLabel}>Total Documents</div>
              {patientSummary.documents.recent && (
                <div className={styles.detailItem}>
                  <span>Recent:</span> {patientSummary.documents.recent.name} ({patientSummary.documents.recent.date})
                </div>
              )}
            </div>
            <Link to={`${getBaseUrl()}/documents`} className={styles.cardLink}>
              View Documents <FiArrowRight />
            </Link>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <FiActivity className={styles.cardIcon} />
              <h3>Health Metrics</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.statusIndicator}>
                {patientSummary.vitals.status}
              </div>
              <div className={styles.detailItem}>
                <span>Last Updated:</span> {patientSummary.vitals.lastUpdated}
              </div>
            </div>
            <Link to={`${getBaseUrl()}/insights`} className={styles.cardLink}>
              View Health Metrics <FiArrowRight />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientOverview;