import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiUpload,
  FiActivity,
  FiPackage,
  FiBell,
  FiClock,
  FiCheck,
  FiX,
  FiPlus,
  FiUsers,
} from 'react-icons/fi';
import { getUserDocuments } from '../../services/authService';
import { useAppointments } from '../../hooks/useAppointments';
import { useHealth } from '../../hooks/useHealth';
import { useMedications } from '../../hooks/useMedications';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CaregiverDashboard from '../../components/caregiver/CaregiverDashboard';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams(); // Get patientId from URL params if available
  const { isCaregiver } = useAuth();
  const {
    activePatient,
    isViewingPatient,
    clearActivePatient,
    setActivePatient,
  } = usePatients();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get appointments from context
  const { upcomingAppointments, loading: appointmentsLoading } =
    useAppointments();

  // Get health metrics from context
  const { metrics, loading: healthLoading } = useHealth();

  // Get medications from context
  const { medications, loading: medicationsLoading } = useMedications();

  // If we have a patientId in the URL and we're a caregiver, set that patient as active
  useEffect(() => {
    if (
      isCaregiver() &&
      patientId &&
      (!activePatient || activePatient.id !== patientId)
    ) {
      setActivePatient(patientId);
    }
  }, [patientId, isCaregiver, activePatient, setActivePatient]);

  // Fetch user documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      // Only fetch documents if we're not showing the caregiver dashboard
      if (isCaregiver() && !isViewingPatient) {
        setLoading(false);
        return;
      }

      try {
        const docs = await getUserDocuments(
          isViewingPatient ? activePatient?.id : null,
        );
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [isViewingPatient, activePatient, isCaregiver]);

  // Handle returning to caregiver dashboard
  const handleReturnToCaregiverDashboard = () => {
    // First clear the active patient
    clearActivePatient();

    // Use a small timeout to ensure state is updated before navigation
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 10);
  };

  // Calculate the number of health metrics that have data
  const calculateHealthInsightsCount = () => {
    if (!metrics) return 0;

    // Count metrics that have at least one entry
    let count = 0;

    if (metrics.weight && metrics.weight.length > 0) count++;
    if (metrics.bloodPressure && metrics.bloodPressure.length > 0) count++;
    if (metrics.bloodGlucose && metrics.bloodGlucose.length > 0) count++;
    if (metrics.heartRate && metrics.heartRate.length > 0) count++;
    if (metrics.sleep && metrics.sleep.length > 0) count++;
    if (metrics.steps && metrics.steps.length > 0) count++;

    return count;
  };

  // Get active medications count
  const getActiveMedicationsCount = () => {
    if (!medications) return 0;
    return medications.filter((med) => med.status === 'active').length;
  };

  // Generate upcoming medication reminders
  const getUpcomingReminders = () => {
    if (!medications) return [];

    const now = new Date();
    const reminders = [];

    // Only get active medications
    const activeMedications = medications.filter(
      (med) => med.status === 'active',
    );

    // For each medication, create reminders for today
    activeMedications.forEach((medication) => {
      // Only process medications with a dosage schedule
      if (!medication.dosageSchedule || !medication.dosageSchedule.length)
        return;

      medication.dosageSchedule.forEach((timeString) => {
        // Parse time
        const [hours, minutes] = timeString.split(':').map(Number);

        // Create today's date with this time
        const doseTime = new Date(now);
        doseTime.setHours(hours, minutes, 0, 0);

        // Only include upcoming doses for today (within next 12 hours)
        if (doseTime > now && doseTime - now < 12 * 60 * 60 * 1000) {
          reminders.push({
            id: `${medication.id}-${doseTime.toISOString()}`,
            medicationId: medication.id,
            medicationName: medication.name,
            dosage: `${medication.dosage} ${medication.unit}`,
            time: doseTime,
            status: 'scheduled',
          });
        }
      });
    });

    // Sort by time (soonest first)
    reminders.sort((a, b) => a.time - b.time);

    // Return at most 3 reminders
    return reminders.slice(0, 3);
  };

  // Mark a reminder as taken
  const handleMarkTaken = (reminderId) => {
    // This would normally update the backend
    console.log('Marked as taken:', reminderId);
  };

  // Mark a reminder as skipped
  const handleMarkSkipped = (reminderId) => {
    // This would normally update the backend
    console.log('Marked as skipped:', reminderId);
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Stats with real data
  const stats = [
    {
      label: 'Documents',
      value: documents.length || 0,
      link: isViewingPatient
        ? `/patient/${activePatient.id}/documents`
        : '/documents',
    },
    {
      label: 'Upcoming Appointments',
      value: upcomingAppointments.length || 0,
      link: isViewingPatient
        ? `/patient/${activePatient.id}/appointments`
        : '/appointments',
    },
    {
      label: 'Active Medications',
      value: getActiveMedicationsCount(),
      link: isViewingPatient
        ? `/patient/${activePatient.id}/medications`
        : '/medications',
    },
    {
      label: 'Health Insights',
      value: calculateHealthInsightsCount(),
      link: isViewingPatient
        ? `/patient/${activePatient.id}/insights`
        : '/insights',
    },
  ];

  // Get the most recent documents (up to 3)
  const recentDocuments = documents.slice(0, 3);

  // Get most recent upcoming appointments (up to 2)
  const recentAppointments = upcomingAppointments.slice(0, 2);

  // Get most recent active medications (up to 2)
  const recentMedications = medications
    ? medications.filter((med) => med.status === 'active').slice(0, 2)
    : [];

  // Get upcoming medication reminders
  const upcomingReminders = getUpcomingReminders();

  // Format date properly without timezone issues
  const formatDocumentDate = (document) => {
    // Always prioritize document.date if available
    if (document.date) {
      // Parse the date string without timezone conversion
      const parts = document.date.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Months are 0-indexed in JS
        const day = parseInt(parts[2]);

        const date = new Date(year, month, day);
        return date.toLocaleDateString();
      }
    }

    // Fallback to createdAt
    return new Date(document.createdAt).toLocaleDateString();
  };

  // Format appointment date
  const formatAppointmentDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format appointment time
  const formatAppointmentTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // If user is a caregiver and not viewing a patient, show caregiver dashboard
  if (isCaregiver() && !isViewingPatient) {
    return <CaregiverDashboard />;
  }

  return (
    <div className={styles.dashboard}>
      {/* Patient Context Banner (only for caregivers) */}
      {isCaregiver() && isViewingPatient && (
        <div className={styles.patientContextBanner}>
          <div className={styles.patientInfo}>
            <FiUsers className={styles.patientIcon} />
            <span>
              Viewing dashboard for:{' '}
              <strong>
                {activePatient.firstName} {activePatient.lastName}
              </strong>
            </span>
          </div>
          <button
            className={styles.returnButton}
            onClick={handleReturnToCaregiverDashboard}
          >
            Return to Caregiver Dashboard
          </button>
        </div>
      )}

      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>
          {isCaregiver() && isViewingPatient
            ? `${activePatient.firstName}'s Dashboard`
            : 'Welcome to CareVault'}
        </h1>
        <p>
          Your personal healthcare management platform. Stay organized and
          informed about your health.
        </p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </Link>
        ))}
      </div>

      <section className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2>
            <FiFileText style={{ marginRight: '8px' }} /> Recent Documents
          </h2>
          <div className={styles.sectionActions}>
            <Link
              to={
                isViewingPatient
                  ? `/patient/${activePatient.id}/documents/upload`
                  : '/documents/upload'
              }
              className={styles.uploadButton}
            >
              <FiUpload style={{ marginRight: '4px' }} /> Upload
            </Link>
            <Link
              to={
                isViewingPatient
                  ? `/patient/${activePatient.id}/documents`
                  : '/documents'
              }
              className={styles.viewAllLink}
            >
              View All <FiArrowRight style={{ marginLeft: '4px' }} />
            </Link>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="medium" />
            </div>
          ) : recentDocuments.length > 0 ? (
            recentDocuments.map((doc) => (
              <Link
                key={doc.id}
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/documents/view/${doc.id}`
                    : `/documents/view/${doc.id}`
                }
                className={styles.documentCard}
              >
                <div className={styles.documentCardHeader}>
                  <span className={styles.documentType}>
                    <FiFileText style={{ marginRight: '4px' }} />
                    {doc.type || 'Document'}
                  </span>
                  <span className={styles.documentDate}>
                    {formatDocumentDate(doc)}
                  </span>
                </div>
                <h3 className={styles.documentTitle}>{doc.title}</h3>
                <div className={styles.documentProvider}>
                  {doc.provider || 'Unknown provider'}
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>
                No documents yet. Upload your first document to get started!
              </p>
              <Link
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/documents/upload`
                    : '/documents/upload'
                }
                className={styles.uploadButtonLarge}
              >
                <FiUpload style={{ marginRight: '8px' }} /> Upload Document
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Medication Reminders Section */}
      <section className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2>
            <FiBell style={{ marginRight: '8px' }} /> Medication Reminders
          </h2>
          <Link
            to={
              isViewingPatient
                ? `/patient/${activePatient.id}/medications/reminders`
                : '/medications/reminders'
            }
            className={styles.viewAllLink}
          >
            View All <FiArrowRight style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {medicationsLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="medium" />
            </div>
          ) : upcomingReminders.length > 0 ? (
            <div className={styles.medicationsOverview}>
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className={styles.reminderItem}>
                  <div className={styles.reminderTime}>
                    <FiClock color="#4CAF50" />
                    {formatTime(reminder.time)}
                  </div>
                  <div className={styles.reminderMedication}>
                    <div>
                      <strong>{reminder.medicationName}</strong>
                    </div>
                    <div>{reminder.dosage}</div>
                  </div>
                  <div className={styles.reminderActions}>
                    <button
                      className={styles.reminderTakenButton}
                      onClick={() => handleMarkTaken(reminder.id)}
                      title="Mark as taken"
                    >
                      <FiCheck />
                    </button>
                    <button
                      className={styles.reminderSkipButton}
                      onClick={() => handleMarkSkipped(reminder.id)}
                      title="Skip"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}
              <Link
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/medications/reminders`
                    : '/medications/reminders'
                }
                className={styles.viewMedicationsButton}
              >
                <FiBell style={{ marginRight: '8px' }} /> Manage Reminders
              </Link>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>
                No upcoming medication reminders. Add medications to receive
                reminders.
              </p>
              <Link
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/medications/add`
                    : '/medications/add'
                }
                className={styles.actionButtonLarge}
              >
                <FiPlus style={{ marginRight: '8px' }} /> Add Medication
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2>
            <FiPackage style={{ marginRight: '8px' }} /> Recent Medications
          </h2>
          <Link
            to={
              isViewingPatient
                ? `/patient/${activePatient.id}/medications`
                : '/medications'
            }
            className={styles.viewAllLink}
          >
            View All <FiArrowRight style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {medicationsLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="medium" />
            </div>
          ) : recentMedications.length > 0 ? (
            recentMedications.map((medication) => (
              <Link
                key={medication.id}
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/medications/view/${medication.id}`
                    : `/medications/view/${medication.id}`
                }
                className={styles.medicationCard}
              >
                <div className={styles.medicationCardHeader}>
                  <span className={styles.medicationType}>
                    <FiPackage style={{ marginRight: '4px' }} />
                    {medication.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <span className={styles.medicationDate}>
                    {new Date(medication.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className={styles.medicationTitle}>{medication.name}</h3>
                <div className={styles.medicationDetails}>
                  {medication.instructions || 'No special instructions'}
                  <span className={styles.medicationDosage}>
                    {medication.dosage} {medication.unit}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>
                No medications added yet. Add your first medication to get
                started!
              </p>
              <Link
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/medications/add`
                    : '/medications/add'
                }
                className={styles.actionButtonLarge}
              >
                <FiPlus style={{ marginRight: '8px' }} /> Add Medication
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2>
            <FiCalendar style={{ marginRight: '8px' }} /> Upcoming Appointments
          </h2>
          <Link
            to={
              isViewingPatient
                ? `/patient/${activePatient.id}/appointments`
                : '/appointments'
            }
            className={styles.viewAllLink}
          >
            View All <FiArrowRight style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {appointmentsLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="medium" />
            </div>
          ) : recentAppointments.length > 0 ? (
            recentAppointments.map((appointment) => (
              <Link
                key={appointment.id}
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/appointments/view/${appointment.id}`
                    : `/appointments/view/${appointment.id}`
                }
                className={styles.appointmentCard}
              >
                <div className={styles.appointmentCardHeader}>
                  <span className={styles.appointmentType}>
                    <FiCalendar style={{ marginRight: '4px' }} />
                    {appointment.type
                      ? appointment.type.charAt(0).toUpperCase() +
                        appointment.type.slice(1)
                      : 'Appointment'}
                  </span>
                  <span className={styles.appointmentDate}>
                    {formatAppointmentDate(appointment.startTime)}
                  </span>
                </div>
                <h3 className={styles.appointmentTitle}>
                  {appointment.title || 'Appointment'}
                </h3>
                <div className={styles.appointmentProvider}>
                  {appointment.providerName || 'Unknown Provider'}
                  <span className={styles.appointmentTime}>
                    {formatAppointmentTime(appointment.startTime)}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No upcoming appointments. Schedule your first appointment!</p>
              <Link
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/appointments/create`
                    : '/appointments/create'
                }
                className={styles.uploadButtonLarge}
              >
                <FiCalendar style={{ marginRight: '8px' }} /> Schedule
                Appointment
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2>
            <FiActivity style={{ marginRight: '8px' }} /> Health Insights
          </h2>
          <Link
            to={
              isViewingPatient
                ? `/patient/${activePatient.id}/insights`
                : '/insights'
            }
            className={styles.viewAllLink}
          >
            View All <FiArrowRight style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        <div className={styles.cardGrid}>
          {healthLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="medium" />
            </div>
          ) : calculateHealthInsightsCount() > 0 ? (
            <div className={styles.healthInsightsOverview}>
              <p>
                You have health data for {calculateHealthInsightsCount()}{' '}
                metrics. Visit the Health Insights page to see detailed
                analysis.
              </p>
              <Link
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/insights`
                    : '/insights'
                }
                className={styles.viewInsightsButton}
              >
                <FiActivity style={{ marginRight: '8px' }} /> View Health
                Insights
              </Link>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>
                No health data available yet. Add your first health metric to
                get started!
              </p>
              <Link
                to={
                  isViewingPatient
                    ? `/patient/${activePatient.id}/insights/input`
                    : '/insights/input'
                }
                className={styles.uploadButtonLarge}
              >
                <FiActivity style={{ marginRight: '8px' }} /> Add Health Data
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
