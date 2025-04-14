import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiClock, FiCalendar, FiX } from 'react-icons/fi';
import styles from './MedicationForm.module.css';

const MedicationForm = ({ initialData, onSubmit, onCancel, isEditing = false }) => {
  const defaultFormData = {
    name: '',
    dosage: '',
    unit: 'mg',
    instructions: '',
    frequency: 'daily',
    customFrequency: '',
    dosageSchedule: ['08:00'],
    status: 'active',
    refillDate: '',
    refillReminder: true,
    prescribedBy: '',
    pharmacy: '',
    notes: ''
  };
  
  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [errors, setErrors] = useState({});
  
  // Update form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  // Handle frequency change (special handling for custom frequency)
  const handleFrequencyChange = (e) => {
    const { value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      frequency: value,
      // Reset custom frequency if not selecting 'custom'
      customFrequency: value !== 'custom' ? '' : prevData.customFrequency
    }));
  };
  
  // Add a time slot to the dosage schedule
  const addTimeSlot = () => {
    setFormData(prevData => ({
      ...prevData,
      dosageSchedule: [...prevData.dosageSchedule, '12:00']
    }));
  };
  
  // Remove a time slot from the dosage schedule
  const removeTimeSlot = (index) => {
    setFormData(prevData => ({
      ...prevData,
      dosageSchedule: prevData.dosageSchedule.filter((_, i) => i !== index)
    }));
  };
  
  // Update a specific time slot
  const updateTimeSlot = (index, value) => {
    setFormData(prevData => {
      const updatedSchedule = [...prevData.dosageSchedule];
      updatedSchedule[index] = value;
      return {
        ...prevData,
        dosageSchedule: updatedSchedule
      };
    });
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    } else if (isNaN(parseFloat(formData.dosage))) {
      newErrors.dosage = 'Dosage must be a number';
    }
    
    if (formData.frequency === 'custom' && !formData.customFrequency.trim()) {
      newErrors.customFrequency = 'Please specify the custom frequency';
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
    <form className={styles.medicationForm} onSubmit={handleSubmit}>
      <div className={styles.formTitle}>
        {isEditing ? 'Edit Medication' : 'Add New Medication'}
      </div>
      
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Medication Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter medication name"
              className={errors.name ? styles.inputError : ''}
            />
            {errors.name && <div className={styles.errorText}>{errors.name}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="dosage">Dosage*</label>
            <div className={styles.dosageInput}>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="Enter dosage"
                className={errors.dosage ? styles.inputError : ''}
              />
              <select 
                name="unit" 
                value={formData.unit} 
                onChange={handleChange}
              >
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="tablet">tablet</option>
                <option value="capsule">capsule</option>
                <option value="pill">pill</option>
                <option value="mcg">mcg</option>
                <option value="IU">IU</option>
                <option value="puff">puff</option>
                <option value="drop">drop</option>
              </select>
            </div>
            {errors.dosage && <div className={styles.errorText}>{errors.dosage}</div>}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="instructions">Instructions</label>
          <input
            type="text"
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="e.g., Take with food"
          />
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Schedule</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="frequency">Frequency</label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleFrequencyChange}
          >
            <option value="daily">Daily</option>
            <option value="twice_daily">Twice Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="as_needed">As Needed</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        {formData.frequency === 'custom' && (
          <div className={styles.formGroup}>
            <label htmlFor="customFrequency">Specify Custom Frequency</label>
            <input
              type="text"
              id="customFrequency"
              name="customFrequency"
              value={formData.customFrequency}
              onChange={handleChange}
              placeholder="e.g., Every other day"
              className={errors.customFrequency ? styles.inputError : ''}
            />
            {errors.customFrequency && (
              <div className={styles.errorText}>{errors.customFrequency}</div>
            )}
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label>Dosage Schedule</label>
          <div className={styles.timeSlots}>
            {formData.dosageSchedule.map((time, index) => (
              <div key={index} className={styles.timeSlot}>
                <div className={styles.timeSlotInput}>
                  <FiClock className={styles.timeIcon} />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                  />
                </div>
                {formData.dosageSchedule.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeTimeButton}
                    onClick={() => removeTimeSlot(index)}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
            {formData.dosageSchedule.length < 5 && (
              <button
                type="button"
                className={styles.addTimeButton}
                onClick={addTimeSlot}
              >
                <FiPlus /> Add Time
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Additional Information</h3>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="refillDate">Refill Date</label>
            <div className={styles.dateInput}>
              <FiCalendar className={styles.dateIcon} />
              <input
                type="date"
                id="refillDate"
                name="refillDate"
                value={formData.refillDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="refillReminder"
              name="refillReminder"
              checked={formData.refillReminder}
              onChange={handleChange}
            />
            <label htmlFor="refillReminder">Remind me when it's time to refill</label>
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="prescribedBy">Prescribed By</label>
            <input
              type="text"
              id="prescribedBy"
              name="prescribedBy"
              value={formData.prescribedBy}
              onChange={handleChange}
              placeholder="Doctor's name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="pharmacy">Pharmacy</label>
            <input
              type="text"
              id="pharmacy"
              name="pharmacy"
              value={formData.pharmacy}
              onChange={handleChange}
              placeholder="Pharmacy name"
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes about this medication"
          />
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          <FiX /> Cancel
        </button>
        <button
          type="submit"
          className={styles.saveButton}
        >
          <FiSave /> {isEditing ? 'Update' : 'Save'} Medication
        </button>
      </div>
    </form>
  );
};

export default MedicationForm;