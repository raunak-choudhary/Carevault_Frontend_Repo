// ContactForm.js
import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    role: 'patient', // Default role
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: false,
    message: '',
  });
  
  const formRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set submitting state
    setFormStatus({
      submitting: true,
      submitted: false,
      error: false,
      message: ''
    });
    
    // Simulate form submission
    setTimeout(() => {
      // Success simulation
      setFormStatus({
        submitting: false,
        submitted: true,
        error: false,
        message: 'Thank you for your message! We\'ll get back to you soon.'
      });
      
      // Reset form after successful submission
      setFormState({
        name: '',
        email: '',
        role: 'patient',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({
          ...prev,
          submitted: false,
          message: ''
        }));
      }, 5000);
    }, 1500);
  };
  
  // Setup intersection observer for animation
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const currentRef = formRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    // Cleanup function
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div 
      className={`${styles.contactSection} ${isVisible ? styles.visible : ''}`} 
      ref={formRef}
    >
      <div className={styles.contactContainer}>
        {/* Removed duplicate heading as it's now in the section header in LandingPage.js */}
        
        <div className={styles.formWrapper}>
          <form 
            className={styles.contactForm} 
            onSubmit={handleSubmit}
          >
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Your Role</label>
              <div className={styles.roleOptions}>
                <div className={styles.roleOption}>
                  <input
                    type="radio"
                    id="patient"
                    name="role"
                    value="patient"
                    checked={formState.role === 'patient'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <label htmlFor="patient" className={styles.radioLabel}>
                    Patient
                  </label>
                </div>
                
                <div className={styles.roleOption}>
                  <input
                    type="radio"
                    id="caregiver"
                    name="role"
                    value="caregiver"
                    checked={formState.role === 'caregiver'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <label htmlFor="caregiver" className={styles.radioLabel}>
                    Caregiver
                  </label>
                </div>
                
                <div className={styles.roleOption}>
                  <input
                    type="radio"
                    id="healthcare-provider"
                    name="role"
                    value="healthcare-provider"
                    checked={formState.role === 'healthcare-provider'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <label htmlFor="healthcare-provider" className={styles.radioLabel}>
                    Healthcare Provider
                  </label>
                </div>
                
                <div className={styles.roleOption}>
                  <input
                    type="radio"
                    id="other"
                    name="role"
                    value="other"
                    checked={formState.role === 'other'}
                    onChange={handleChange}
                    className={styles.radioInput}
                  />
                  <label htmlFor="other" className={styles.radioLabel}>
                    Other
                  </label>
                </div>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Enter your message here..."
                required
                rows={5}
              />
            </div>
            
            <button 
              type="submit"
              className={styles.submitButton}
              disabled={formStatus.submitting || formStatus.submitted}
            >
              {formStatus.submitting ? (
                <span className={styles.buttonLoader}>
                  <span className={styles.loadingDot}></span>
                  <span className={styles.loadingDot}></span>
                  <span className={styles.loadingDot}></span>
                </span>
              ) : formStatus.submitted ? (
                <>
                  <FiCheck className={styles.buttonIcon} />
                  Sent Successfully
                </>
              ) : (
                <>
                  <FiSend className={styles.buttonIcon} />
                  Send Message
                </>
              )}
            </button>
            
            {formStatus.message && (
              <div className={`${styles.formMessage} ${formStatus.error ? styles.errorMessage : styles.successMessage}`}>
                {formStatus.error ? (
                  <FiAlertCircle className={styles.messageIcon} />
                ) : (
                  <FiCheck className={styles.messageIcon} />
                )}
                <p>{formStatus.message}</p>
              </div>
            )}
          </form>
          
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoHeader}>
                <span className={styles.infoIcon}>📍</span>
                <h3 className={styles.infoTitle}>Project Details</h3>
              </div>
              <div className={styles.infoContent}>
                <p><strong>Course:</strong> Human-Computer Interaction (CS-GY 6543)</p>
                <p><strong>University:</strong> New York University</p>
                <p><strong>Year:</strong> 2025</p>
              </div>
            </div>
            
            <div className={styles.contactGraphic}>
              <svg 
                viewBox="0 0 200 200" 
                xmlns="http://www.w3.org/2000/svg"
                className={styles.contactBlob}
              >
                <path 
                  d="M42.7,-57.1C55.9,-49.3,67.5,-37.1,71.5,-22.9C75.5,-8.7,72,7.5,67.3,24.5C62.6,41.4,56.9,59.1,44.2,68.3C31.5,77.5,11.8,78.2,-3.1,72.2C-18,66.2,-28.1,53.5,-42,42.3C-55.8,31,-73.4,21.4,-78.9,7.6C-84.5,-6.2,-77.9,-24,-66.3,-35.5C-54.7,-47,-37.9,-52.1,-22.8,-59.2C-7.7,-66.3,5.7,-75.2,19.3,-74.6C32.9,-74,48.9,-64,42.7,-57.1Z" 
                  transform="translate(100 100)" 
                  fill="#4CAF5015"
                />
              </svg>
              
              <div className={styles.graphicIcon}>💬</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;