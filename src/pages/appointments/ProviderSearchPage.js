import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiMapPin, FiFilter, FiX } from 'react-icons/fi';
import ProviderCard from '../../components/appointments/ProviderCard';
import MapView from '../../components/appointments/MapView';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { searchProviders } from '../../services/providerService';
import styles from './ProviderSearchPage.module.css';

const ProviderSearchPage = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [mapView, setMapView] = useState(false);
  
  // Specialties for filter
  const specialties = [
    { value: '', label: 'All Specialties' },
    { value: 'primary', label: 'Primary Care' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'gynecology', label: 'Gynecology' }
  ];
  
  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const providersData = await searchProviders();
        setProviders(providersData);
        setFilteredProviders(providersData);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load providers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviders();
  }, []);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, selectedSpecialty);
  };
  
  // Handle specialty filter change
  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
    applyFilters(searchQuery, e.target.value);
  };
  
  // Apply filters to providers list
  const applyFilters = (query, specialty) => {
    let results = [...providers];
    
    // Apply search query filter
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(provider => 
        provider.name.toLowerCase().includes(searchLower) ||
        provider.specialization.toLowerCase().includes(searchLower) ||
        (provider.address && provider.address.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply specialty filter
    if (specialty) {
      results = results.filter(provider => 
        provider.specialization.toLowerCase().includes(specialty.toLowerCase())
      );
    }
    
    setFilteredProviders(results);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('');
    setFilteredProviders(providers);
  };
  
  // Handle provider selection for details view
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };
  
  // Toggle between list and map view
  const toggleMapView = () => {
    setMapView(!mapView);
  };
  
  return (
    <div className={styles.searchPage}>
      <div className={styles.pageHeader}>
        <Link to="/appointments/create" className={styles.backButton}>
          <FiArrowLeft /> Back to Create Appointment
        </Link>
        <h1>Find a Provider</h1>
      </div>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, specialty, or location"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button 
              className={styles.clearButton}
              onClick={() => {
                setSearchQuery('');
                applyFilters('', selectedSpecialty);
              }}
            >
              <FiX />
            </button>
          )}
        </div>
        
        <button 
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter /> Filters
        </button>
        
        <button 
          className={`${styles.viewToggleButton} ${mapView ? styles.activeView : ''}`}
          onClick={toggleMapView}
        >
          <FiMapPin /> {mapView ? 'List View' : 'Map View'}
        </button>
      </div>
      
      {showFilters && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={handleSpecialtyChange}
              className={styles.filterSelect}
            >
              {specialties.map(specialty => (
                <option key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </option>
              ))}
            </select>
          </div>
          
          {(searchQuery || selectedSpecialty) && (
            <button 
              className={styles.clearFiltersButton}
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : mapView ? (
        <div className={styles.mapViewContainer}>
          <MapView 
            providers={filteredProviders}
            onSelectProvider={handleProviderSelect}
            selectedProvider={selectedProvider}
          />
          
          {selectedProvider && (
            <div className={styles.selectedProviderDetails}>
              <ProviderCard 
                provider={selectedProvider} 
                detailed 
                onClose={() => setSelectedProvider(null)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.providersContainer}>
          {filteredProviders.length > 0 ? (
            <div className={styles.providersList}>
              {filteredProviders.map(provider => (
                <ProviderCard 
                  key={provider.id} 
                  provider={provider}
                  onSelect={() => handleProviderSelect(provider)}
                  selected={selectedProvider?.id === provider.id}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResultsMessage}>
              <FiSearch size={48} />
              <h2>No Providers Found</h2>
              <p>Try adjusting your search criteria or filters</p>
              {(searchQuery || selectedSpecialty) && (
                <button 
                  className={styles.clearFiltersButton}
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderSearchPage;