import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter, FiX } from 'react-icons/fi';
import MedicationCard from './MedicationCard';
import styles from './MedicationList.module.css';

const MedicationList = ({
  medications = [],
  loading = false,
  onMedicationClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

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

  // Filter medications based on search query and status filter
  const filteredMedications = medications.filter((medication) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === '' ||
      medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (medication.notes &&
        medication.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    // Apply status filter
    const matchesStatus =
      statusFilter === 'all' || medication.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.medicationList}>
      <div className={styles.listHeader}>
        <div className={styles.searchFilterBar}>
          <div className={styles.searchInput}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search medications"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className={styles.clearSearchButton}
                onClick={() => setSearchQuery('')}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className={styles.filterDropdown}>
            <FiFilter className={styles.filterIcon} />
            <select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== 'all') && (
            <button
              className={styles.clearFiltersButton}
              onClick={clearFilters}
            >
              <FiX /> Clear Filters
            </button>
          )}
        </div>

        <Link to="/medications/add" className={styles.addButton}>
          <FiPlus /> Add Medication
        </Link>
      </div>

      <div className={styles.listContent}>
        {loading ? (
          <div className={styles.loadingState}>Loading medications...</div>
        ) : filteredMedications.length > 0 ? (
          filteredMedications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onClick={() => onMedicationClick(medication)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            {medications.length === 0 ? (
              <>
                <p>No medications added yet</p>
                <Link to="/medications/add" className={styles.addEmptyButton}>
                  <FiPlus /> Add Your First Medication
                </Link>
              </>
            ) : (
              <p>No medications match your search</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationList;
