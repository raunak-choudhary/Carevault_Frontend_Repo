import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiCalendar, FiArrowRight, FiUpload, FiActivity } from 'react-icons/fi';
import { getUserDocuments } from '../../services/authService';
import { useAppointments } from '../../hooks/useAppointments';
import { useHealth } from '../../hooks/useHealth'; // Added for health insights
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get appointments from context
  const { upcomingAppointments, loading: appointmentsLoading } = useAppointments();
  
  // Get health metrics from context
  const { metrics, loading: healthLoading } = useHealth();
  
  // Fetch user documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getUserDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  
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
  
  // Stats with real data
  const stats = [
    { label: 'Documents', value: documents.length || 0, link: '/documents' },
    { label: 'Upcoming Appointments', value: upcomingAppointments.length || 0, link: '/appointments' },
    { label: 'Medication Reminders', value: 8, link: '#' }, // This is still a placeholder
    { label: 'Health Insights', value: calculateHealthInsightsCount(), link: '/insights' }
  ];

  // Get the most recent documents (up to 3)
  const recentDocuments = documents.slice(0, 3);
  
  // Get most recent upcoming appointments (up to 2)
  const recentAppointments = upcomingAppointments.slice(0, 2);
  
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

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>Welcome to CareVault</h1>
        <p>Your personal healthcare management platform. Stay organized and informed about your health.</p>
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
          <h2><FiFileText style={{ marginRight: '8px' }} /> Recent Documents</h2>
          <div className={styles.sectionActions}>
            <Link to="/documents/upload" className={styles.uploadButton}>
              <FiUpload style={{ marginRight: '4px' }} /> Upload
            </Link>
            <Link to="/documents" className={styles.viewAllLink}>
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
            recentDocuments.map(doc => (
              <Link key={doc.id} to={`/documents/view/${doc.id}`} className={styles.documentCard}>
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
                <div className={styles.documentProvider}>{doc.provider || 'Unknown provider'}</div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No documents yet. Upload your first document to get started!</p>
              <Link to="/documents/upload" className={styles.uploadButtonLarge}>
                <FiUpload style={{ marginRight: '8px' }} /> Upload Document
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <section className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2><FiCalendar style={{ marginRight: '8px' }} /> Upcoming Appointments</h2>
          <Link to="/appointments" className={styles.viewAllLink}>
            View All <FiArrowRight style={{ marginLeft: '4px' }} />
          </Link>
        </div>
        
        <div className={styles.cardGrid}>
          {appointmentsLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="medium" />
            </div>
          ) : recentAppointments.length > 0 ? (
            recentAppointments.map(appointment => (
              <Link key={appointment.id} to={`/appointments/view/${appointment.id}`} className={styles.appointmentCard}>
                <div className={styles.appointmentCardHeader}>
                  <span className={styles.appointmentType}>
                    <FiCalendar style={{ marginRight: '4px' }} />
                    {appointment.type ? appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1) : 'Appointment'}
                  </span>
                  <span className={styles.appointmentDate}>{formatAppointmentDate(appointment.startTime)}</span>
                </div>
                <h3 className={styles.appointmentTitle}>{appointment.title || 'Appointment'}</h3>
                <div className={styles.appointmentProvider}>
                  {appointment.providerName || 'Unknown Provider'}
                  <span className={styles.appointmentTime}>{formatAppointmentTime(appointment.startTime)}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No upcoming appointments. Schedule your first appointment!</p>
              <Link to="/appointments/create" className={styles.uploadButtonLarge}>
                <FiCalendar style={{ marginRight: '8px' }} /> Schedule Appointment
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <section className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2><FiActivity style={{ marginRight: '8px' }} /> Health Insights</h2>
          <Link to="/insights" className={styles.viewAllLink}>
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
              <p>You have health data for {calculateHealthInsightsCount()} metrics. Visit the Health Insights page to see detailed analysis.</p>
              <Link to="/insights" className={styles.viewInsightsButton}>
                <FiActivity style={{ marginRight: '8px' }} /> View Health Insights
              </Link>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No health data available yet. Add your first health metric to get started!</p>
              <Link to="/insights/input" className={styles.uploadButtonLarge}>
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