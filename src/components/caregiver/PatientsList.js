import React from 'react';
import PatientCard from './PatientCard';
import { usePatients } from '../../hooks/usePatients';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './PatientsList.module.css';

const PatientsList = ({ filteredPatients }) => {
  const { loading, error, patients } = usePatients();
  
  return (
    <div className={styles.listContent}>
      {loading ? (
        <div className={styles.loadingState}>
          <LoadingSpinner size="medium" />
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          {error}
        </div>
      ) : filteredPatients.length > 0 ? (
        filteredPatients.map(patient => (
          <PatientCard
            key={patient.id}
            patient={patient}
          />
        ))
      ) : (
        <div className={styles.emptyState}>
          {patients.length === 0 ? (
            <p>No patients assigned to you yet</p>
          ) : (
            <p>No patients match your search</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientsList;