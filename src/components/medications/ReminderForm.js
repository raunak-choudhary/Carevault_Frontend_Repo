import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiClock, FiVolume2, FiBell } from 'react-icons/fi';
import styles from './ReminderForm.module.css';

const ReminderForm = ({ medication, initialData, onSubmit, onCancel }) => {
  const defaultFormData = {
    medicationId: medication?.id || '',
    enabled: true,
    notificationType: 'popup', // popup, sound, both
    notificationTime: 'atTime', // atTime, beforeTime
    minutesBefore: 15,
    soundEnabled: true,
    soundType: 'default',
    vibrationEnabled: true,
    repeatNotification: false,
    repeatInterval: 5, // in minutes
    maxRepeats: 3,
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [errors, setErrors] = useState({});

  // Update form when medication or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (medication) {
      setFormData((prevData) => ({
        ...prevData,
        medicationId: medication.id,
      }));
    }
  }, [medication, initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field if any
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // Handle number input changes with validation
  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    // Allow empty string or valid numbers
    if (value === '' || !isNaN(Number(value))) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value === '' ? '' : Number(value),
      }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    if (formData.notificationTime === 'beforeTime' && !formData.minutesBefore) {
      newErrors.minutesBefore = 'Please specify how many minutes before';
    }

    if (formData.repeatNotification) {
      if (!formData.repeatInterval) {
        newErrors.repeatInterval = 'Please specify repeat interval';
      }
      if (!formData.maxRepeats) {
        newErrors.maxRepeats = 'Please specify max repeats';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className={styles.reminderForm} onSubmit={handleSubmit}>
      <div className={styles.formTitle}>
        {initialData ? 'Edit Reminder' : 'Add Reminder'}
      </div>

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <div className={styles.switchGroup}>
            <label htmlFor="enabled">Enable Reminder</label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                id="enabled"
                name="enabled"
                checked={formData.enabled}
                onChange={handleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Notification Type</label>
          <div className={styles.optionButtons}>
            <label
              className={`${styles.optionButton} ${formData.notificationType === 'popup' ? styles.optionButtonSelected : ''}`}
            >
              <input
                type="radio"
                name="notificationType"
                value="popup"
                checked={formData.notificationType === 'popup'}
                onChange={handleChange}
                className={styles.hiddenRadio}
              />
              <FiBell className={styles.optionIcon} />
              <span>Popup</span>
            </label>

            <label
              className={`${styles.optionButton} ${formData.notificationType === 'sound' ? styles.optionButtonSelected : ''}`}
            >
              <input
                type="radio"
                name="notificationType"
                value="sound"
                checked={formData.notificationType === 'sound'}
                onChange={handleChange}
                className={styles.hiddenRadio}
              />
              <FiVolume2 className={styles.optionIcon} />
              <span>Sound</span>
            </label>

            <label
              className={`${styles.optionButton} ${formData.notificationType === 'both' ? styles.optionButtonSelected : ''}`}
            >
              <input
                type="radio"
                name="notificationType"
                value="both"
                checked={formData.notificationType === 'both'}
                onChange={handleChange}
                className={styles.hiddenRadio}
              />
              <div className={styles.combinedIcons}>
                <FiBell className={styles.optionIcon} />
                <FiVolume2 className={styles.optionIcon} />
              </div>
              <span>Both</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Notification Timing</label>
          <div className={styles.optionButtons}>
            <label
              className={`${styles.optionButton} ${formData.notificationTime === 'atTime' ? styles.optionButtonSelected : ''}`}
            >
              <input
                type="radio"
                name="notificationTime"
                value="atTime"
                checked={formData.notificationTime === 'atTime'}
                onChange={handleChange}
                className={styles.hiddenRadio}
              />
              <FiClock className={styles.optionIcon} />
              <span>At scheduled time</span>
            </label>

            <label
              className={`${styles.optionButton} ${formData.notificationTime === 'beforeTime' ? styles.optionButtonSelected : ''}`}
            >
              <input
                type="radio"
                name="notificationTime"
                value="beforeTime"
                checked={formData.notificationTime === 'beforeTime'}
                onChange={handleChange}
                className={styles.hiddenRadio}
              />
              <FiClock className={styles.optionIcon} />
              <span>Before scheduled time</span>
            </label>
          </div>
        </div>

        {formData.notificationTime === 'beforeTime' && (
          <div className={styles.formGroup}>
            <label htmlFor="minutesBefore">Minutes Before</label>
            <input
              type="number"
              id="minutesBefore"
              name="minutesBefore"
              value={formData.minutesBefore}
              onChange={handleNumberChange}
              min="1"
              max="120"
              className={errors.minutesBefore ? styles.inputError : ''}
            />
            {errors.minutesBefore && (
              <div className={styles.errorText}>{errors.minutesBefore}</div>
            )}
          </div>
        )}

        {(formData.notificationType === 'sound' ||
          formData.notificationType === 'both') && (
          <div className={styles.formGroup}>
            <label htmlFor="soundType">Sound Type</label>
            <select
              id="soundType"
              name="soundType"
              value={formData.soundType}
              onChange={handleChange}
            >
              <option value="default">Default</option>
              <option value="chime">Chime</option>
              <option value="bell">Bell</option>
              <option value="gentle">Gentle</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <div className={styles.switchGroup}>
            <label htmlFor="vibrationEnabled">Enable Vibration</label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                id="vibrationEnabled"
                name="vibrationEnabled"
                checked={formData.vibrationEnabled}
                onChange={handleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <div className={styles.switchGroup}>
            <label htmlFor="repeatNotification">Repeat Notification</label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                id="repeatNotification"
                name="repeatNotification"
                checked={formData.repeatNotification}
                onChange={handleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {formData.repeatNotification && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="repeatInterval">Repeat Every (minutes)</label>
              <input
                type="number"
                id="repeatInterval"
                name="repeatInterval"
                value={formData.repeatInterval}
                onChange={handleNumberChange}
                min="1"
                max="60"
                className={errors.repeatInterval ? styles.inputError : ''}
              />
              {errors.repeatInterval && (
                <div className={styles.errorText}>{errors.repeatInterval}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxRepeats">Maximum Repeats</label>
              <input
                type="number"
                id="maxRepeats"
                name="maxRepeats"
                value={formData.maxRepeats}
                onChange={handleNumberChange}
                min="1"
                max="10"
                className={errors.maxRepeats ? styles.inputError : ''}
              />
              {errors.maxRepeats && (
                <div className={styles.errorText}>{errors.maxRepeats}</div>
              )}
            </div>
          </>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          <FiX /> Cancel
        </button>
        <button type="submit" className={styles.saveButton}>
          <FiSave /> {initialData ? 'Update' : 'Save'} Reminder
        </button>
      </div>
    </form>
  );
};

export default ReminderForm;
