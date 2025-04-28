import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FiUser, FiX, FiChevronDown, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import styles from './QuickPatientSwitcher.module.css';

const QuickPatientSwitcher = () => {
  const { patients, activePatient, setActivePatient } = usePatients();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setError(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
        setError(null);
      }
    };
    
    document.addEventListener('keydown', handleKeyboard);
    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [isOpen]);
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    if (!searchTerm.trim()) return true;
    
    const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');
    setError(null);
    
    // Reset scroll position when opening
    if (!isOpen && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };
  
  // Handle patient selection
  const handleSelectPatient = async (patient) => {
    try {
      setLoading(true);
      setError(null);
      
      await setActivePatient(patient.id);
      setIsOpen(false);
      setSearchTerm('');
      navigate(`/patient/${patient.id}/dashboard`);
    } catch (err) {
      console.error('Error selecting patient:', err);
      setError('Unable to select patient. Please try again.');
      // Don't close the dropdown if there's an error
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    
    // Reset scroll position when search changes
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  if (patients.length === 0) return null;
  
  return (
    <div className={styles.switcher} ref={dropdownRef}>
      <button 
        className={styles.switcherButton}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Switch patient"
        aria-haspopup="listbox"
        disabled={loading}
      >
        {activePatient ? (
          <>
            <div className={styles.patientAvatar}>
              {activePatient.avatar ? (
                <img 
                  src={activePatient.avatar} 
                  alt={`${activePatient.firstName} ${activePatient.lastName}`} 
                />
              ) : (
                <FiUser />
              )}
            </div>
            <span className={styles.patientName}>
              {activePatient.firstName} {activePatient.lastName}
            </span>
          </>
        ) : (
          <>
            <FiUser className={styles.patientIcon} />
            <span>Select Patient</span>
          </>
        )}
        <FiChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`} />
      </button>
      
      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
              aria-label="Search patients"
            />
            {searchTerm && (
              <button 
                className={styles.clearButton}
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              <FiAlertCircle className={styles.errorIcon} />
              <p>{error}</p>
            </div>
          )}
          
          <ul className={styles.patientList} ref={listRef}>
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <li key={patient.id}>
                  <button
                    className={`${styles.patientItem} ${activePatient?.id === patient.id ? styles.activePatient : ''}`}
                    onClick={() => handleSelectPatient(patient)}
                    role="option"
                    aria-selected={activePatient?.id === patient.id}
                    disabled={loading}
                  >
                    <div className={styles.patientAvatar}>
                      {patient.avatar ? (
                        <img 
                          src={patient.avatar} 
                          alt={`${patient.firstName} ${patient.lastName}`} 
                        />
                      ) : (
                        <FiUser />
                      )}
                    </div>
                    <div className={styles.patientInfo}>
                      <div className={styles.patientFullName}>
                        {patient.firstName} {patient.lastName}
                      </div>
                      {patient.birthDate && (
                        <div className={styles.patientAge}>
                          {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} years
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.noResults}>No patients found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuickPatientSwitcher;