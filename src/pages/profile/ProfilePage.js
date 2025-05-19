import React, { useState } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiSave,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/authService';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    dateOfBirth: user?.date_of_birth || '',
    address: user?.address || '',
    emergencyContact: user?.emergency_contact_name || '',
    medicalConditions: user?.medical_conditions || '',
  });

  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditing(true);
    // Clear any previous messages
    setApiError('');
    setSuccess('');
  };

  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone_number || '',
      dateOfBirth: user?.date_of_birth || '',
      address: user?.address || '',
      emergencyContact: user?.emergency_contact_name || '',
      medicalConditions: user?.medical_conditions || '',
    });

    // Exit edit mode
    setEditing(false);

    // Clear any errors or messages
    setErrors({});
    setApiError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setApiError('');
    setSuccess('');

    // Validate form
    if (!validate()) {
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call update profile service
      const updatedUser = await updateProfile(formData);

      // Update user in context
      updateUser(updatedUser);

      // Show success message
      setSuccess('Profile updated successfully');

      // Exit edit mode
      setEditing(false);
    } catch (error) {
      setApiError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <h1>My Profile</h1>
        {!editing && (
          <button className={styles.editButton} onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </div>

      {apiError && <div className={styles.errorAlert}>{apiError}</div>}

      {success && <div className={styles.successAlert}>{success}</div>}

      <div className={styles.profileContent}>
        <div className={styles.profileAvatar}>
          <div className={styles.avatarCircle}>
            {user?.first_name && user?.last_name
              ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
              : 'U'}
          </div>
          <h2>
            {user?.first_name} {user?.last_name}
          </h2>
          <p>{user?.user_role === 'patient' ? 'Patient' : 'Caregiver'}</p>
        </div>

        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Personal Information</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>
                {errors.firstName && (
                  <div className={styles.errorText}>{errors.firstName}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>
                {errors.lastName && (
                  <div className={styles.errorText}>{errors.lastName}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>
                {errors.email && (
                  <div className={styles.errorText}>{errors.email}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiPhone />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    className={styles.input}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Date of Birth</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiCalendar />
                  </span>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className={styles.input}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Address</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FiMapPin />
                  </span>
                  <input
                    type="text"
                    name="address"
                    className={styles.input}
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Medical Information</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Emergency Contact</label>
                <textarea
                  name="emergencyContact"
                  className={styles.textarea}
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Name and phone number"
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Medical Conditions</label>
                <textarea
                  name="medicalConditions"
                  className={styles.textarea}
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="List any medical conditions, allergies, or medications"
                ></textarea>
              </div>
            </div>
          </div>

          {editing && (
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.loadingSpinner}></span>
                ) : (
                  <>
                    <FiSave className={styles.buttonIcon} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
