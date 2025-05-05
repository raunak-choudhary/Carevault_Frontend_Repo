import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiX } from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import styles from './PatientSelector.module.css';

const PatientSelector = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { patients, activePatient, setActivePatient } = usePatients();
  const selectorRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Filter patients based on search query
  const filteredPatients =
    patients?.filter((patient) => {
      if (!searchQuery.trim()) return true;

      const fullName =
        `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    }) || [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isDropdownOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (!isDropdownOpen) return;

      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [isDropdownOpen]);

  const handleSelectPatient = (patient) => {
    setActivePatient(patient);
    setIsDropdownOpen(false);
    setSearchQuery('');
    navigate(`/patient/${patient.id}/dashboard`);
  };

  const handleClearActivePatient = () => {
    setActivePatient(null);
    navigate('/dashboard');
  };

  return (
    <div className={styles.patientSelectorContainer} ref={selectorRef}>
      {activePatient ? (
        <div className={styles.activePatientIndicator}>
          <div className={styles.activePatientInfo}>
            <div className={styles.patientAvatar}>
              {activePatient.avatar ? (
                <img
                  src={activePatient.avatar}
                  alt={`${activePatient.firstName} ${activePatient.lastName}`}
                />
              ) : (
                activePatient.firstName?.charAt(0) +
                activePatient.lastName?.charAt(0)
              )}
            </div>
            <div className={styles.patientName}>
              {activePatient.firstName} {activePatient.lastName}
            </div>
          </div>
          <button
            className={styles.clearButton}
            onClick={handleClearActivePatient}
            title="Return to caregiver dashboard"
            aria-label="Return to caregiver dashboard"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <div className={styles.patientSelector}>
          <div
            className={styles.selectorHeader}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            role="button"
            tabIndex={0}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsDropdownOpen(!isDropdownOpen);
                e.preventDefault();
              }
            }}
          >
            <FiUser className={styles.userIcon} />
            <span>Select Patient</span>
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdown} role="listbox">
              <div className={styles.searchContainer}>
                <FiSearch className={styles.searchIcon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Search patients"
                />
                {searchQuery && (
                  <button
                    className={styles.clearButton}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <div className={styles.patientsList}>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={styles.patientItem}
                      onClick={() => handleSelectPatient(patient)}
                      role="option"
                      tabIndex={0}
                      aria-selected={activePatient?.id === patient.id}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSelectPatient(patient);
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className={styles.patientAvatar}>
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={`${patient.firstName} ${patient.lastName}`}
                          />
                        ) : (
                          patient.firstName?.charAt(0) +
                          patient.lastName?.charAt(0)
                        )}
                      </div>
                      <div className={styles.patientInfo}>
                        <div className={styles.patientName}>
                          {patient.firstName} {patient.lastName}
                        </div>
                        {patient.birthDate && (
                          <div className={styles.patientDob}>
                            {new Date(patient.birthDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>No patients found</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSelector;
