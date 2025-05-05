import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './PatientForm.module.css';

const PatientForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  isEditMode = false,
  cancelUrl = '/patients',
  validationErrors = {},
  submitButtonText = null,
}) => {
  const [touchedFields, setTouchedFields] = useState({});
  const [formattedDates, setFormattedDates] = useState({
    dateOfBirth: formData.dateOfBirth || '',
    startDate: formData.startDate || '',
  });

  useEffect(() => {
    // Format date fields to ensure consistent display
    if (formData.dateOfBirth) {
      try {
        // If date is in ISO format, convert to YYYY-MM-DD for input field
        if (/^\d{4}-\d{2}-\d{2}T/.test(formData.dateOfBirth)) {
          const date = new Date(formData.dateOfBirth);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');

          setFormattedDates((prev) => ({
            ...prev,
            dateOfBirth: `${year}-${month}-${day}`,
          }));
        } else {
          setFormattedDates((prev) => ({
            ...prev,
            dateOfBirth: formData.dateOfBirth,
          }));
        }
      } catch (e) {
        console.error('Error formatting date:', e);
      }
    }
  }, [formData.dateOfBirth]);

  // Handle blur events to track touched fields
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Check if a field has been touched and has validation errors
  const showError = (fieldName) => {
    return touchedFields[fieldName] && validationErrors[fieldName];
  };

  return (
    <div className={styles.formContainer}>
      {error && (
        <div className={styles.errorMessage}>
          <FiAlertCircle className={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.patientForm}>
        <div className={styles.formSection}>
          <h2>Personal Information</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label
                htmlFor="firstName"
                className={showError('firstName') ? styles.errorLabel : ''}
              >
                First Name <span className={styles.requiredIndicator}>*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showError('firstName') ? styles.inputError : ''}
                required
                aria-required="true"
              />
              {showError('firstName') && (
                <div className={styles.errorText}>
                  {validationErrors.firstName}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label
                htmlFor="lastName"
                className={showError('lastName') ? styles.errorLabel : ''}
              >
                Last Name <span className={styles.requiredIndicator}>*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showError('lastName') ? styles.inputError : ''}
                required
                aria-required="true"
              />
              {showError('lastName') && (
                <div className={styles.errorText}>
                  {validationErrors.lastName}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formattedDates.dateOfBirth}
                onChange={(e) => {
                  handleChange(e);
                  setFormattedDates((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value,
                  }));
                }}
                onBlur={handleBlur}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
              {showError('dateOfBirth') && (
                <div className={styles.errorText}>
                  {validationErrors.dateOfBirth}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {showError('gender') && (
                <div className={styles.errorText}>
                  {validationErrors.gender}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Contact Information</h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label
                htmlFor="email"
                className={showError('email') ? styles.errorLabel : ''}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showError('email') ? styles.inputError : ''}
              />
              {showError('email') && (
                <div className={styles.errorText}>{validationErrors.email}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label
                htmlFor="contactPhone"
                className={showError('contactPhone') ? styles.errorLabel : ''}
              >
                Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showError('contactPhone') ? styles.inputError : ''}
                placeholder="(555) 555-5555"
              />
              {showError('contactPhone') && (
                <div className={styles.errorText}>
                  {validationErrors.contactPhone}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('address') && (
              <div className={styles.errorText}>{validationErrors.address}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="emergencyContact">Emergency Contact</label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Name and phone number"
            />
            {showError('emergencyContact') && (
              <div className={styles.errorText}>
                {validationErrors.emergencyContact}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Medical Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="healthId">Health ID / Insurance Number</label>
            <input
              type="text"
              id="healthId"
              name="healthId"
              value={formData.healthId || ''}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('healthId') && (
              <div className={styles.errorText}>
                {validationErrors.healthId}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={formData.notes || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter any relevant health information or notes"
            />
            {showError('notes') && (
              <div className={styles.errorText}>{validationErrors.notes}</div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <Link to={cancelUrl} className={styles.cancelButton}>
            Cancel
          </Link>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading
              ? isEditMode
                ? 'Updating...'
                : 'Adding...'
              : submitButtonText
                ? submitButtonText
                : isEditMode
                  ? 'Update Patient'
                  : 'Save Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
