import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiClock, FiCalendar } from 'react-icons/fi';
import MedicationList from '../../components/medications/MedicationList';
import MedicationSchedule from '../../components/medications/MedicationSchedule';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useMedications } from '../../hooks/useMedications';
import styles from './MedicationsListPage.module.css';

const MedicationsListPage = () => {
  const { medications, loading, error } = useMedications();
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'schedule'
  const navigate = useNavigate();
  
  // Handle medication click
  const handleMedicationClick = (medication) => {
    navigate(`/medications/view/${medication.id}`);
  };
  
  // Handle marking a dose as taken
  const handleMarkTaken = (dose) => {
    // In a real app, this would update the medication tracking history
    console.log('Dose marked as taken:', dose);
  };
  
  // Handle marking a dose as skipped
  const handleMarkSkipped = (dose) => {
    // In a real app, this would update the medication tracking history
    console.log('Dose marked as skipped:', dose);
  };
  
  return (
    <div className={styles.medicationsPage}>
      <div className={styles.pageHeader}>
        <h1>Medications</h1>
        <Link to="/medications/add" className={styles.addButton}>
          <FiPlus /> Add Medication
        </Link>
      </div>
      
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'list' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <FiCalendar className={styles.tabIcon} />
          My Medications
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'schedule' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <FiClock className={styles.tabIcon} />
          Schedule & Reminders
        </button>
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
      ) : (
        <div className={styles.tabContent}>
          {activeTab === 'list' ? (
            <MedicationList 
              medications={medications}
              onMedicationClick={handleMedicationClick}
            />
          ) : (
            <MedicationSchedule 
              medications={medications}
              onMarkTaken={handleMarkTaken}
              onMarkSkipped={handleMarkSkipped}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationsListPage;