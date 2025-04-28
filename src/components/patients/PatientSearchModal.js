import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import styles from './PatientSearchModal.module.css';

const PatientSearchModal = ({ isOpen, onClose, onSelectPatient }) => {
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  
  // Filter patients when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients.slice(0, 5)); // Show first 5 patients when no search
    } else {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
        const email = (patient.email || '').toLowerCase();
        const phone = (patient.contactPhone || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower)
        );
      });
      
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);
  
  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Reset search term when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Enhanced patient selection with complete patient object
  const handleSelectPatient = (patient) => {
    // Ensure we pass the entire patient object for proper handling
    onSelectPatient(patient);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset scroll position when search changes
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  };
  
  // Clear search input
  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current.focus();
  };
  
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Find Patient">
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>Find Patient</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>
        
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search patients"
          />
          {searchTerm && (
            <button 
              className={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>
        
        <div className={styles.patientResults} ref={resultsRef}>
          {filteredPatients.length > 0 ? (
            <ul className={styles.patientList}>
              {filteredPatients.map(patient => (
                <li key={patient.id}>
                  <button
                    className={styles.patientItem}
                    onClick={() => handleSelectPatient(patient)}
                    aria-label={`Select patient ${patient.firstName} ${patient.lastName}`}
                  >
                    <div className={styles.patientAvatar}>
                      {patient.avatar ? (
                        <img 
                          src={patient.avatar} 
                          alt={`${patient.firstName} ${patient.lastName}`} 
                        />
                      ) : (
                        <FiUser className={styles.avatarIcon} />
                      )}
                    </div>
                    <div className={styles.patientInfo}>
                      <div className={styles.patientName}>
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className={styles.patientDetails}>
                        {patient.contactPhone && (
                          <span className={styles.detailItem}>
                            <FiPhone className={styles.detailIcon} />
                            {patient.contactPhone}
                          </span>
                        )}
                        {patient.email && (
                          <span className={styles.detailItem}>
                            <FiMail className={styles.detailIcon} />
                            {patient.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noResults}>
              {searchTerm ? 'No patients found matching your search' : 'No patients available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSearchModal;