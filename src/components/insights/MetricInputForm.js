import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiCalendar } from 'react-icons/fi';
import { useHealth } from '../../hooks/useHealth';
import styles from './MetricInputForm.module.css';

const MetricInputForm = ({ metricType, onSave, onCancel }) => {
  const { targets } = useHealth();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Set up initial form data based on metric type
  useEffect(() => {
    let initialData = {
      timestamp: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    };

    switch (metricType) {
      case 'weight':
        initialData = {
          ...initialData,
          value: '',
          unit: 'kg',
        };
        break;
      case 'bloodPressure':
        initialData = {
          ...initialData,
          systolic: '',
          diastolic: '',
          unit: 'mmHg',
        };
        break;
      case 'bloodGlucose':
        initialData = {
          ...initialData,
          value: '',
          unit: 'mg/dL',
          context: 'fasting', // fasting, beforeMeal, afterMeal, bedtime
        };
        break;
      case 'heartRate':
        initialData = {
          ...initialData,
          value: '',
          unit: 'bpm',
          context: 'resting', // resting, active, sleeping
        };
        break;
      case 'sleep':
        initialData = {
          ...initialData,
          duration: '',
          quality: 'good', // poor, fair, good, excellent
        };
        break;
      case 'steps':
        initialData = {
          ...initialData,
          count: '',
        };
        break;
      default:
        break;
    }

    setFormData(initialData);
  }, [metricType]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle numeric inputs
    if (type === 'number') {
      // Allow empty values (for clearing)
      if (value === '') {
        setFormData((prev) => ({ ...prev, [name]: '' }));
        // Clear error if any
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        return;
      }

      const numValue = parseFloat(value);

      // Validate based on field
      if (name === 'systolic' && (numValue < 60 || numValue > 250)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Systolic should be between 60-250 mmHg',
        }));
      } else if (name === 'diastolic' && (numValue < 40 || numValue > 150)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Diastolic should be between 40-150 mmHg',
        }));
      } else if (
        name === 'value' &&
        metricType === 'weight' &&
        (numValue < 20 || numValue > 500)
      ) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Weight should be between 20-500 kg',
        }));
      } else if (
        name === 'value' &&
        metricType === 'bloodGlucose' &&
        (numValue < 30 || numValue > 600)
      ) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Blood glucose should be between 30-600 mg/dL',
        }));
      } else if (
        name === 'value' &&
        metricType === 'heartRate' &&
        (numValue < 30 || numValue > 220)
      ) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Heart rate should be between 30-220 bpm',
        }));
      } else if (name === 'duration' && (numValue < 0 || numValue > 24)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Sleep duration should be between 0-24 hours',
        }));
      } else if (name === 'count' && (numValue < 0 || numValue > 100000)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Step count should be between 0-100,000',
        }));
      } else {
        // Clear error if valid
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form before submission
  const validateForm = () => {
    const newErrors = {};

    // Common validation for timestamp
    if (!formData.timestamp) {
      newErrors.timestamp = 'Date and time are required';
    }

    // Validate based on metric type
    switch (metricType) {
      case 'weight':
        if (!formData.value) {
          newErrors.value = 'Weight is required';
        } else if (isNaN(parseFloat(formData.value))) {
          newErrors.value = 'Weight must be a number';
        }
        break;
      case 'bloodPressure':
        if (!formData.systolic) {
          newErrors.systolic = 'Systolic pressure is required';
        } else if (isNaN(parseFloat(formData.systolic))) {
          newErrors.systolic = 'Systolic must be a number';
        }

        if (!formData.diastolic) {
          newErrors.diastolic = 'Diastolic pressure is required';
        } else if (isNaN(parseFloat(formData.diastolic))) {
          newErrors.diastolic = 'Diastolic must be a number';
        }
        break;
      case 'bloodGlucose':
        if (!formData.value) {
          newErrors.value = 'Blood glucose is required';
        } else if (isNaN(parseFloat(formData.value))) {
          newErrors.value = 'Blood glucose must be a number';
        }
        break;
      case 'heartRate':
        if (!formData.value) {
          newErrors.value = 'Heart rate is required';
        } else if (isNaN(parseFloat(formData.value))) {
          newErrors.value = 'Heart rate must be a number';
        }
        break;
      case 'sleep':
        if (!formData.duration) {
          newErrors.duration = 'Sleep duration is required';
        } else if (isNaN(parseFloat(formData.duration))) {
          newErrors.duration = 'Duration must be a number';
        }
        break;
      case 'steps':
        if (!formData.count) {
          newErrors.count = 'Step count is required';
        } else if (isNaN(parseInt(formData.count, 10))) {
          newErrors.count = 'Step count must be a number';
        }
        break;
      default:
        break;
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

    // Prepare data based on metric type
    let submissionData = {};

    switch (metricType) {
      case 'weight':
        submissionData = {
          timestamp: formData.timestamp,
          value: parseFloat(formData.value),
          unit: formData.unit,
        };
        break;
      case 'bloodPressure':
        submissionData = {
          timestamp: formData.timestamp,
          systolic: parseInt(formData.systolic, 10),
          diastolic: parseInt(formData.diastolic, 10),
          unit: 'mmHg',
        };
        break;
      case 'bloodGlucose':
        submissionData = {
          timestamp: formData.timestamp,
          value: parseInt(formData.value, 10),
          unit: formData.unit,
          context: formData.context,
        };
        break;
      case 'heartRate':
        submissionData = {
          timestamp: formData.timestamp,
          value: parseInt(formData.value, 10),
          unit: 'bpm',
          context: formData.context,
        };
        break;
      case 'sleep':
        submissionData = {
          timestamp: formData.timestamp,
          duration: parseFloat(formData.duration),
          quality: formData.quality,
        };
        break;
      case 'steps':
        submissionData = {
          timestamp: formData.timestamp,
          count: parseInt(formData.count, 10),
        };
        break;
      default:
        break;
    }

    // Call the onSave callback with the prepared data
    onSave(submissionData);
  };

  // Get form fields based on metric type
  const renderFormFields = () => {
    switch (metricType) {
      case 'weight':
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="value">Weight</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  step="0.1"
                  min="20"
                  max="500"
                  placeholder="Enter weight"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={styles.unitSelect}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
              {errors.value && (
                <div className={styles.errorText}>{errors.value}</div>
              )}
              {targets?.weight && (
                <div className={styles.targetHint}>
                  Target range:{' '}
                  {targets.weight.min && `${targets.weight.min} - `}
                  {targets.weight.max} {targets.weight.unit}
                </div>
              )}
            </div>
          </>
        );

      case 'bloodPressure':
        return (
          <>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="systolic">Systolic (mmHg)</label>
                <input
                  type="number"
                  id="systolic"
                  name="systolic"
                  value={formData.systolic}
                  onChange={handleChange}
                  min="60"
                  max="250"
                  placeholder="Systolic"
                />
                {errors.systolic && (
                  <div className={styles.errorText}>{errors.systolic}</div>
                )}
                {targets?.bloodPressure?.systolic && (
                  <div className={styles.targetHint}>
                    Target: {targets.bloodPressure.systolic.min} -{' '}
                    {targets.bloodPressure.systolic.max} mmHg
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="diastolic">Diastolic (mmHg)</label>
                <input
                  type="number"
                  id="diastolic"
                  name="diastolic"
                  value={formData.diastolic}
                  onChange={handleChange}
                  min="40"
                  max="150"
                  placeholder="Diastolic"
                />
                {errors.diastolic && (
                  <div className={styles.errorText}>{errors.diastolic}</div>
                )}
                {targets?.bloodPressure?.diastolic && (
                  <div className={styles.targetHint}>
                    Target: {targets.bloodPressure.diastolic.min} -{' '}
                    {targets.bloodPressure.diastolic.max} mmHg
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'bloodGlucose':
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="value">Blood Glucose</label>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  min="30"
                  max="600"
                  placeholder="Enter blood glucose"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={styles.unitSelect}
                >
                  <option value="mg/dL">mg/dL</option>
                  <option value="mmol/L">mmol/L</option>
                </select>
              </div>
              {errors.value && (
                <div className={styles.errorText}>{errors.value}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="context">Measurement Context</label>
              <select
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
              >
                <option value="fasting">Fasting</option>
                <option value="beforeMeal">Before Meal</option>
                <option value="afterMeal">After Meal</option>
                <option value="bedtime">Bedtime</option>
              </select>
              {formData.context === 'fasting' &&
                targets?.bloodGlucose?.fasting && (
                  <div className={styles.targetHint}>
                    Target: {targets.bloodGlucose.fasting.min} -{' '}
                    {targets.bloodGlucose.fasting.max}{' '}
                    {targets.bloodGlucose.fasting.unit}
                  </div>
                )}
              {formData.context === 'afterMeal' &&
                targets?.bloodGlucose?.afterMeal && (
                  <div className={styles.targetHint}>
                    Target:{' '}
                    {targets.bloodGlucose.afterMeal.min
                      ? `${targets.bloodGlucose.afterMeal.min} - `
                      : 'Below '}
                    {targets.bloodGlucose.afterMeal.max}{' '}
                    {targets.bloodGlucose.afterMeal.unit}
                  </div>
                )}
            </div>
          </>
        );

      case 'heartRate':
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="value">Heart Rate (bpm)</label>
              <input
                type="number"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="30"
                max="220"
                placeholder="Enter heart rate"
              />
              {errors.value && (
                <div className={styles.errorText}>{errors.value}</div>
              )}
              {targets?.heartRate && (
                <div className={styles.targetHint}>
                  Target: {targets.heartRate.min} - {targets.heartRate.max}{' '}
                  {targets.heartRate.unit}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="context">Measurement Context</label>
              <select
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
              >
                <option value="resting">Resting</option>
                <option value="active">Active</option>
                <option value="sleeping">Sleeping</option>
              </select>
            </div>
          </>
        );

      case 'sleep':
        return (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="duration">Sleep Duration (hours)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                step="0.5"
                min="0"
                max="24"
                placeholder="Enter sleep duration"
              />
              {errors.duration && (
                <div className={styles.errorText}>{errors.duration}</div>
              )}
              {targets?.sleep && (
                <div className={styles.targetHint}>
                  Target: {targets.sleep.min} - {targets.sleep.max}{' '}
                  {targets.sleep.unit}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="quality">Sleep Quality</label>
              <select
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
              >
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
          </>
        );

      case 'steps':
        return (
          <div className={styles.formGroup}>
            <label htmlFor="count">Step Count</label>
            <input
              type="number"
              id="count"
              name="count"
              value={formData.count}
              onChange={handleChange}
              min="0"
              max="100000"
              placeholder="Enter step count"
            />
            {errors.count && (
              <div className={styles.errorText}>{errors.count}</div>
            )}
            {targets?.steps && (
              <div className={styles.targetHint}>
                Target: {targets.steps.min}
                {targets.steps.max ? ` - ${targets.steps.max}` : '+'}{' '}
                {targets.steps.unit}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form className={styles.metricForm} onSubmit={handleSubmit}>
      <div className={styles.formTitle}>
        {metricType === 'bloodPressure'
          ? 'Blood Pressure'
          : metricType === 'bloodGlucose'
            ? 'Blood Glucose'
            : metricType === 'heartRate'
              ? 'Heart Rate'
              : metricType.charAt(0).toUpperCase() + metricType.slice(1)}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="timestamp">Date and Time</label>
        <div className={styles.dateTimeWrapper}>
          <div className={styles.dateTimeIcon}>
            <FiCalendar />
          </div>
          <input
            type="datetime-local"
            id="timestamp"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 16)}
          />
        </div>
        {errors.timestamp && (
          <div className={styles.errorText}>{errors.timestamp}</div>
        )}
      </div>

      {renderFormFields()}

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          <FiX /> Cancel
        </button>
        <button type="submit" className={styles.saveButton}>
          <FiSave /> Save
        </button>
      </div>
    </form>
  );
};

export default MetricInputForm;
