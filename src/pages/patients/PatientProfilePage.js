import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiSave } from 'react-icons/fi';
import { getPatientById, updatePatient } from '../../services/patientService';
import { usePatients } from '../../hooks/usePatients'; // Import the hook
import PatientForm from '../../components/patients/PatientForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './PatientProfilePage.module.css';

const PatientProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshActivePatient } = usePatients(); // Get the refresh function
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const patientData = await getPatientById(id);
        setPatient(patientData);
        
        // Convert data for form fields
        setFormData({
          firstName: patientData.firstName || '',
          lastName: patientData.lastName || '',
          dateOfBirth: patientData.dateOfBirth || '',
          gender: patientData.gender || '',
          email: patientData.email || '',
          contactPhone: patientData.phone || '',
          address: patientData.address || '',
          emergencyContact: patientData.emergencyContact || '',
          healthId: patientData.healthId || '',
          notes: patientData.notes || ''
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Update patient
      await updatePatient(id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        phone: formData.contactPhone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        healthId: formData.healthId,
        notes: formData.notes
      });
      
      // Refresh patient data in context to update UI everywhere
      await refreshActivePatient();
      
      // Redirect to patients list on success
      navigate('/patients');
    } catch (err) {
      console.error('Error updating patient:', err);
      setError('Failed to update patient. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error && !patient) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/patients" className={styles.backButton}>
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Link to="/patients" className={styles.backLink}>
            <FiArrowLeft /> Back to Patients
          </Link>
          <h1>Edit Patient Profile</h1>
        </div>
      </div>
      
      <div className={styles.formWrapper}>
        <div className={styles.formIcon}>
          <FiUser size={40} />
        </div>
        
        <PatientForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={saving}
          error={error}
          isEditMode={true}
          cancelUrl="/patients"
          validationErrors={validationErrors}
          submitButtonText={
            <>
              <FiSave /> Save Changes
            </>
          }
        />
      </div>
    </div>
  );
};

export default PatientProfilePage;