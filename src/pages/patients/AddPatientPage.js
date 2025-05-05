import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { addPatient } from '../../services/patientService';
import PatientForm from '../../components/patients/PatientForm';
import styles from './AddPatientPage.module.css';

const AddPatientPage = () => {
  const { isCaregiver } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    contactPhone: '', // Changed from 'phone' to match PatientForm
    address: '',
    emergencyContact: '',
    healthId: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if not a caregiver
  useEffect(() => {
    if (!isCaregiver()) {
      // In a real app, we would redirect here
      console.warn('Non-caregiver attempting to access add patient page');
    }
  }, [isCaregiver]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
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
      setLoading(true);
      setError(null);

      // Add patient
      // eslint-disable-next-line no-unused-vars
      const newPatient = await addPatient({
        ...formData,
        status: 'active', // Default to active status
      });

      // Redirect to patients list on success
      navigate('/patients');
    } catch (err) {
      console.error('Error adding patient:', err);
      setError('Failed to add patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isCaregiver()) {
    return (
      <div className={styles.unauthorizedContainer}>
        <h1>Unauthorized</h1>
        <p>You don't have permission to view this page.</p>
        <Link to="/dashboard" className={styles.backButton}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.addPatientPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Link to="/patients" className={styles.backLink}>
            <FiArrowLeft /> Back to Patients
          </Link>
          <h1>Add New Patient</h1>
        </div>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formIcon}>
          <FiUserPlus size={40} />
        </div>

        <PatientForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          isEditMode={false}
          cancelUrl="/patients"
          validationErrors={validationErrors}
        />
      </div>
    </div>
  );
};

export default AddPatientPage;
