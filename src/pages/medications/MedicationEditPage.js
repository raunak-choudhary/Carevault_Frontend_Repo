import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import MedicationForm from '../../components/medications/MedicationForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useMedications } from '../../hooks/useMedications';
import styles from './MedicationEditPage.module.css';

const MedicationEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMedication, updateMedication } = useMedications();
  
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
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
  
  // Handle form submission
  const handleSubmit = async (medicationData) => {
    try {
      setSaving(true);
      setError(null);
      
      // Update medication
      await updateMedication(id, medicationData);
      
      // Set success state
      setSuccess(true);
      
      // Redirect to medication details after a brief delay
      setTimeout(() => {
        navigate(`/medications/view/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating medication:', err);
      setError(err.message || 'Failed to update medication. Please try again.');
      setSaving(false);
    }
  };
  
  // Handle form cancel
  const handleCancel = () => {
    navigate(`/medications/view/${id}`);
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error && !medication) {
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
        <p>The medication you are trying to edit does not exist or has been removed.</p>
        <Link to="/medications" className={styles.backButton}>
          <FiArrowLeft /> Back to Medications
        </Link>
      </div>
    );
  }
  
  return (
    <div className={styles.editPage}>
      <div className={styles.pageHeader}>
        <Link to={`/medications/view/${id}`} className={styles.backButton}>
          <FiArrowLeft /> Back to Medication
        </Link>
        <h1>Edit Medication</h1>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {success ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <FiSave size={32} />
          </div>
          <h2>Medication Updated!</h2>
          <p>Your medication has been successfully updated.</p>
          <LoadingSpinner size="small" />
          <p className={styles.redirectMessage}>Redirecting to medication details...</p>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <MedicationForm 
            initialData={medication}
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            isEditing={true}
            loading={saving} // Added the loading prop to pass the saving state
          />
        </div>
      )}
    </div>
  );
};

export default MedicationEditPage;