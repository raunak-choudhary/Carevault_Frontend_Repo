import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiCalendar, FiArrowRight, FiUpload } from 'react-icons/fi';
import { getUserDocuments } from '../../services/authService'; // Will be moved to documentService in future phases
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  
  // Placeholder data for stats and appointments
  const stats = [
    { label: 'Documents', value: documents.length || 0 },
    { label: 'Upcoming Appointments', value: 3 },
    { label: 'Medication Reminders', value: 8 },
    { label: 'Health Insights', value: 12 }
  ];
  
  const upcomingAppointments = [
    { id: 1, title: 'Dental Checkup', type: 'Dental', date: '2024-04-15', time: '10:00 AM', provider: 'Dr. White' },
    { id: 2, title: 'Eye Examination', type: 'Optometry', date: '2024-04-22', time: '2:30 PM', provider: 'Vision Care Clinic' }
  ];

  // Get the most recent documents (up to 3)
  const recentDocuments = documents.slice(0, 3);
  
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

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>Welcome to CareVault</h1>
        <p>Your personal healthcare management platform. Stay organized and informed about your health.</p>
      </div>
      
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
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
          {upcomingAppointments.map(appointment => (
            <div key={appointment.id} className={styles.appointmentCard}>
              <div className={styles.appointmentCardHeader}>
                <span className={styles.appointmentType}>
                  <FiCalendar style={{ marginRight: '4px' }} />
                  {appointment.type}
                </span>
                <span className={styles.appointmentDate}>{appointment.date}</span>
              </div>
              <h3 className={styles.appointmentTitle}>{appointment.title}</h3>
              <div className={styles.appointmentProvider}>
                {appointment.provider}
                <span className={styles.appointmentTime}>{appointment.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;