import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import MedicationForm from '../../components/medications/MedicationForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useMedications } from '../../hooks/useMedications';
import styles from './MedicationAddPage.module.css';

const MedicationAddPage = () => {
  const navigate = useNavigate();
  const { addMedication } = useMedications();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (medicationData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the add medication function from the medication context
      await addMedication(medicationData);
      
      // Set success state
      setSuccess(true);
      
      // Redirect to medications list after a brief delay
      setTimeout(() => {
        navigate('/medications');
      }, 1500);
    } catch (err) {
      console.error('Error adding medication:', err);
      setError(err.message || 'Failed to add medication. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle form cancel
  const handleCancel = () => {
    navigate('/medications');
  };
  
  return (
    <div className={styles.addPage}>
      <div className={styles.pageHeader}>
        <Link to="/medications" className={styles.backButton}>
          <FiArrowLeft /> Back to Medications
        </Link>
        <h1>Add New Medication</h1>
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
          <h2>Medication Added!</h2>
          <p>Your medication has been successfully added.</p>
          <LoadingSpinner size="small" />
          <p className={styles.redirectMessage}>Redirecting to medications page...</p>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <MedicationForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            isEditing={false}
            loading={loading} // Added the loading prop to pass to the form
          />
        </div>
      )}
    </div>
  );
};

export default MedicationAddPage;