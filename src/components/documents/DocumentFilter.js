import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import styles from './DocumentFilter.module.css';

// Define documentTypes outside the component so it's not recreated on each render
const documentTypes = [
  { label: 'All Types', value: '' },
  { label: 'Prescription', value: 'prescription' },
  { label: 'Lab Report', value: 'lab-report' },
  { label: 'Imaging', value: 'imaging' },
  { label: 'Visit Summary', value: 'visit-summary' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Other', value: 'other' },
];

const DocumentFilter = ({ onFilterChange, onSearch }) => {
  const [filters, setFilters] = useState({
    type: '',
    provider: '',
    startDate: '',
    endDate: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  // Update active filters display
  useEffect(() => {
    const newActiveFilters = [];

    if (filters.type) {
      const typeLabel =
        documentTypes.find((t) => t.value === filters.type)?.label ||
        filters.type;
      newActiveFilters.push({ key: 'type', label: `Type: ${typeLabel}` });
    }

    if (filters.provider) {
      newActiveFilters.push({
        key: 'provider',
        label: `Provider: ${filters.provider}`,
      });
    }

    if (filters.startDate) {
      newActiveFilters.push({
        key: 'startDate',
        label: `From: ${filters.startDate}`,
      });
    }

    if (filters.endDate) {
      newActiveFilters.push({
        key: 'endDate',
        label: `To: ${filters.endDate}`,
      });
    }

    setActiveFilters(newActiveFilters);
  }, [filters]); // Removed documentTypes from dependency array

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Submit search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Clear a specific filter
  const clearFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: '' };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    const emptyFilters = {
      type: '',
      provider: '',
      startDate: '',
      endDate: '',
    };

    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className={styles.filterContainer}>
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
            >
              <FiX />
            </button>
          )}
        </div>
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.filtersWrapper}>
        <div className={styles.filterLabel}>
          <FiFilter /> Filters
        </div>

        <div className={styles.filterControls}>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            {documentTypes.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="provider"
            placeholder="Provider"
            value={filters.provider}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />

          <div className={styles.dateRangeWrapper}>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className={styles.filterDate}
            />
            <span className={styles.dateRangeSeparator}>to</span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className={styles.filterDate}
            />
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className={styles.activeFilters}>
          <div className={styles.activeFiltersLabel}>Active filters:</div>
          <div className={styles.filterChips}>
            {activeFilters.map((filter, index) => (
              <div key={index} className={styles.filterChip}>
                {filter.label}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => clearFilter(filter.key)}
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
            {activeFilters.length > 1 && (
              <button
                type="button"
                className={styles.clearAllButton}
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentFilter;
