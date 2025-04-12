import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUser, FiCheck, FiBell, FiFileText, FiSearch } from 'react-icons/fi';
import TimeSlotPicker from './TimeSlotPicker';
import LoadingSpinner from '../common/LoadingSpinner';
import { getProviders } from '../../services/providerService';
import styles from './AppointmentForm.module.css';

const AppointmentForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'checkup',
    providerId: '',
    providerName: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
    reminder: '30',
    ...initialData
  });
  
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Provider, 2: Date & Time, 3: Details
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);
  
  // Appointment types
  const appointmentTypes = [
    { value: 'checkup', label: 'General Checkup' },
    { value: 'followup', label: 'Follow-up Visit' },
    { value: 'specialist', label: 'Specialist Consultation' },
    { value: 'therapy', label: 'Therapy Session' },
    { value: 'test', label: 'Medical Test' },
    { value: 'other', label: 'Other' }
  ];
  
  // Reminder options (in minutes)
  const reminderOptions = [
    { value: '10', label: '10 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '120', label: '2 hours before' },
    { value: '1440', label: '1 day before' }
  ];
  
  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoadingProviders(true);
        const providersData = await getProviders();
        setProviders(providersData);
        setFilteredProviders(providersData);
        
        // If initial provider ID is set, find the provider
        if (initialData.providerId) {
          const provider = providersData.find(p => p.id === initialData.providerId);
          if (provider) {
            setSelectedProvider(provider);
          }
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoadingProviders(false);
      }
    };
    
    fetchProviders();
  }, [initialData.providerId]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle provider selection
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setFormData(prev => ({
      ...prev,
      providerId: provider.id,
      providerName: provider.name,
      location: provider.address || '',
    }));
    
    // Clear provider errors
    if (errors.providerId) {
      setErrors(prev => ({ ...prev, providerId: '' }));
    }
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (startTime, endTime) => {
    setFormData(prev => ({
      ...prev,
      startTime,
      endTime
    }));
    
    // Clear time errors
    if (errors.startTime) {
      setErrors(prev => ({ ...prev, startTime: '' }));
    }
  };
  
  // Search providers
  const handleProviderSearch = (e) => {
    const query = e.target.value;
    setProviderSearchQuery(query);
    
    if (!query) {
      setFilteredProviders(providers);
      return;
    }
    
    const filtered = providers.filter(provider => 
      provider.name.toLowerCase().includes(query.toLowerCase()) ||
      provider.specialization.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredProviders(filtered);
  };
  
  // Move to next step
  const goToNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.providerId) {
        setErrors(prev => ({ ...prev, providerId: 'Please select a provider' }));
        return;
      }
    } else if (step === 2) {
      if (!formData.date) {
        setErrors(prev => ({ ...prev, date: 'Please select a date' }));
        return;
      }
      if (!formData.startTime) {
        setErrors(prev => ({ ...prev, startTime: 'Please select a time slot' }));
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };
  
  // Go back to previous step
  const goToPreviousStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Please enter an appointment title';
    }
    
    if (!formData.type) {
      newErrors.type = 'Please select an appointment type';
    }
    
    if (!formData.providerId) {
      newErrors.providerId = 'Please select a provider';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Please select a time slot';
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
    <div className={styles.formContainer}>
      <div className={styles.formSteps}>
        <div className={`${styles.formStep} ${step >= 1 ? styles.activeStep : ''} ${step > 1 ? styles.completedStep : ''}`}>
          <div className={styles.stepNumber}>
            {step > 1 ? <FiCheck /> : 1}
          </div>
          <span className={styles.stepLabel}>Provider</span>
        </div>
        <div className={styles.stepDivider}></div>
        <div className={`${styles.formStep} ${step >= 2 ? styles.activeStep : ''} ${step > 2 ? styles.completedStep : ''}`}>
          <div className={styles.stepNumber}>
            {step > 2 ? <FiCheck /> : 2}
          </div>
          <span className={styles.stepLabel}>Date & Time</span>
        </div>
        <div className={styles.stepDivider}></div>
        <div className={`${styles.formStep} ${step === 3 ? styles.activeStep : ''}`}>
          <div className={styles.stepNumber}>3</div>
          <span className={styles.stepLabel}>Details</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.appointmentForm}>
        {step === 1 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Select Healthcare Provider</h2>
            
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <FiSearch className={styles.searchIcon} />
                <input 
                  type="text"
                  placeholder="Search by name or specialty"
                  value={providerSearchQuery}
                  onChange={handleProviderSearch}
                  className={styles.searchInput}
                />
              </div>
              
              <Link to="/appointments/provider-search" className={styles.findProvidersButton}>
                Find New Providers
              </Link>
            </div>
            
            <div className={styles.providersContainer}>
              {loadingProviders ? (
                <div className={styles.loadingProviders}>
                  <LoadingSpinner size="medium" />
                  <p>Loading providers...</p>
                </div>
              ) : filteredProviders.length > 0 ? (
                <div className={styles.providersList}>
                  {filteredProviders.map(provider => (
                    <div 
                      key={provider.id}
                      className={`${styles.providerCard} ${selectedProvider?.id === provider.id ? styles.selectedProvider : ''}`}
                      onClick={() => handleProviderSelect(provider)}
                    >
                      <div className={styles.providerAvatar}>
                        {provider.imageUrl ? (
                          <img src={provider.imageUrl} alt={provider.name} className={styles.providerImage} />
                        ) : (
                          <div className={styles.providerInitial}>
                            {provider.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.providerInfo}>
                        <h3 className={styles.providerName}>{provider.name}</h3>
                        <p className={styles.providerSpecialty}>{provider.specialization}</p>
                        
                        {provider.address && (
                          <div className={styles.providerLocation}>
                            <FiMapPin size={14} />
                            <span>{provider.address}</span>
                          </div>
                        )}
                      </div>
                      
                      {selectedProvider?.id === provider.id && (
                        <div className={styles.providerSelectedIcon}>
                          <FiCheck size={18} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noProvidersMessage}>
                  <p>No providers found matching "{providerSearchQuery}"</p>
                </div>
              )}
            </div>
            
            {errors.providerId && (
              <div className={styles.errorText}>{errors.providerId}</div>
            )}
          </div>
        )}
        
        {step === 2 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Select Date & Time</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Appointment Date</label>
                <div className={styles.inputWrapper}>
                  <FiCalendar className={styles.inputIcon} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.formInput}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {errors.date && <div className={styles.errorText}>{errors.date}</div>}
              </div>
            </div>
            
            {formData.date && (
              <>
                <label className={styles.inputLabel}>Available Time Slots</label>
                <TimeSlotPicker 
                  date={formData.date}
                  providerId={formData.providerId}
                  onSelectTimeSlot={handleTimeSlotSelect}
                  selectedStartTime={formData.startTime}
                />
                {errors.startTime && <div className={styles.errorText}>{errors.startTime}</div>}
              </>
            )}
            
            {selectedProvider && (
              <div className={styles.selectedProviderSummary}>
                <h3>Selected Provider</h3>
                <div className={styles.providerDetail}>
                  <FiUser className={styles.detailIcon} />
                  <span>{selectedProvider.name}</span>
                </div>
                
                {selectedProvider.address && (
                  <div className={styles.providerDetail}>
                    <FiMapPin className={styles.detailIcon} />
                    <span>{selectedProvider.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {step === 3 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Appointment Details</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Appointment Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="e.g. Annual Checkup"
                  required
                />
                {errors.title && <div className={styles.errorText}>{errors.title}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Appointment Type*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={styles.formInput}
                  required
                >
                  {appointmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <div className={styles.errorText}>{errors.type}</div>}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Set Reminder</label>
              <div className={styles.inputWrapper}>
                <FiBell className={styles.inputIcon} />
                <select
                  name="reminder"
                  value={formData.reminder}
                  onChange={handleChange}
                  className={styles.formInput}
                >
                  {reminderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Notes for Provider</label>
              <div className={styles.inputWrapper}>
                <FiFileText className={styles.inputIconTextarea} />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={styles.formTextarea}
                  placeholder="Enter any additional information or questions for your provider"
                  rows={4}
                ></textarea>
              </div>
            </div>
            
            <div className={styles.appointmentSummary}>
              <h3>Appointment Summary</h3>
              <div className={styles.summaryDetail}>
                <FiUser className={styles.detailIcon} />
                <span>{formData.providerName || 'No provider selected'}</span>
              </div>
              
              {formData.date && formData.startTime && (
                <div className={styles.summaryDetail}>
                  <FiCalendar className={styles.detailIcon} />
                  <span>
                    {new Date(formData.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {formData.startTime}
                  </span>
                </div>
              )}
              
              {formData.location && (
                <div className={styles.summaryDetail}>
                  <FiMapPin className={styles.detailIcon} />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className={styles.formActions}>
          {step > 1 && (
            <button
              type="button"
              className={styles.backButton}
              onClick={goToPreviousStep}
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              className={styles.nextButton}
              onClick={goToNextStep}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" color="white" /> : 'Schedule Appointment'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;