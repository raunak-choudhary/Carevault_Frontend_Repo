import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import PatientsList from '../../components/caregiver/PatientsList';
import styles from './PatientsListPage.module.css';

const PatientsListPage = () => {
  const { isCaregiver } = useAuth();
  const { patients } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Redirect if not a caregiver
  useEffect(() => {
    if (!isCaregiver()) {
      // In a real app, we would redirect here
      console.warn('Non-caregiver attempting to access patients page');
    }
  }, [isCaregiver]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Filter patients based on search query and status filter
  const filteredPatients =
    patients?.filter((patient) => {
      // Apply search filter
      const matchesSearch =
        searchQuery === '' ||
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (patient.email &&
          patient.email.toLowerCase().includes(searchQuery.toLowerCase()));

      // Apply status filter
      const matchesStatus =
        statusFilter === 'all' || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  if (!isCaregiver()) {
    return (
      <div className={styles.unauthorizedContainer}>
        <h1>Unauthorized</h1>
        <p>You don't have permission to view this page.</p>
        <Link to="/dashboard" className={styles.backButton}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.patientsListPage}>
      <div className={styles.pageHeader}>
        <h1>My Patients</h1>
        <Link to="/patients/add" className={styles.addButton}>
          <FiPlus /> Add Patient
        </Link>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchInput}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search patients by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              className={styles.clearSearchButton}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className={styles.filterDropdown}>
          <FiFilter className={styles.filterIcon} />
          <select value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {(searchQuery || statusFilter !== 'all') && (
          <button className={styles.clearFiltersButton} onClick={clearFilters}>
            <FiX /> Clear Filters
          </button>
        )}
      </div>

      <div className={styles.patientsList}>
        <PatientsList filteredPatients={filteredPatients} />
      </div>
    </div>
  );
};

export default PatientsListPage;
