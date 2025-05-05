import React, { useEffect, useRef, useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import styles from './MapView.module.css';

const MapView = ({
  address,
  providers,
  onSelectProvider,
  selectedProvider,
}) => {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const markersRef = useRef([]);

  // Initialize map on component mount
  useEffect(() => {
    // In a real application, we would use Google Maps or Mapbox API
    // For now, we'll create a simulated map interface

    if (mapRef.current) {
      // Simulate map initialization delay
      const timer = setTimeout(() => {
        setMapInitialized(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Handle adding providers to the map
  useEffect(() => {
    if (mapInitialized && providers && providers.length > 0) {
      // Clear previous markers
      markersRef.current.forEach((marker) => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      markersRef.current = [];

      // Add markers for each provider
      providers.forEach((provider) => {
        if (provider.latitude && provider.longitude) {
          // In a real app, this would create actual map markers
          const markerElement = document.createElement('div');
          markerElement.className = styles.mapMarker;
          markerElement.setAttribute('data-provider-id', provider.id);

          // Highlight selected provider marker
          if (selectedProvider && selectedProvider.id === provider.id) {
            markerElement.classList.add(styles.selectedMarker);
          }

          markerElement.innerHTML = `<div class="${styles.markerIcon}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`;

          markerElement.addEventListener('click', () => {
            if (onSelectProvider) {
              onSelectProvider(provider);
            }
          });

          // In a real app, we would add this marker to the map
          // For simulation, we'll add it to our mock map container
          const mockMapContainer = mapRef.current.querySelector(
            `.${styles.mockMapContent}`,
          );
          if (mockMapContainer) {
            mockMapContainer.appendChild(markerElement);

            // Position the marker randomly within the container
            const containerRect = mockMapContainer.getBoundingClientRect();
            markerElement.style.left = `${Math.random() * (containerRect.width - 40)}px`;
            markerElement.style.top = `${Math.random() * (containerRect.height - 40)}px`;

            markersRef.current.push(markerElement);
          }
        }
      });
    }
  }, [mapInitialized, providers, selectedProvider, onSelectProvider]);

  // Handle single address geocoding
  useEffect(() => {
    if (mapInitialized && address && !providers) {
      // In a real app, we would geocode the address and center the map on it
      // For now, we'll just display a mock marker in the center

      // Clear previous markers
      markersRef.current.forEach((marker) => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      markersRef.current = [];

      const markerElement = document.createElement('div');
      markerElement.className = `${styles.mapMarker} ${styles.selectedMarker}`;
      markerElement.innerHTML = `<div class="${styles.markerIcon}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`;

      // In a real app, we would add this marker to the map
      // For simulation, we'll add it to our mock map container
      const mockMapContainer = mapRef.current.querySelector(
        `.${styles.mockMapContent}`,
      );
      if (mockMapContainer) {
        mockMapContainer.appendChild(markerElement);

        // Position the marker in the center of the container
        const containerRect = mockMapContainer.getBoundingClientRect();
        markerElement.style.left = `${containerRect.width / 2 - 20}px`;
        markerElement.style.top = `${containerRect.height / 2 - 20}px`;

        markersRef.current.push(markerElement);
      }
    }
  }, [mapInitialized, address, providers]);

  return (
    <div className={styles.mapContainer} ref={mapRef}>
      {!mapInitialized ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading map...</p>
        </div>
      ) : (
        <>
          <div className={styles.mockMapContent}>
            {/* This would be replaced by the actual map in a real implementation */}
            <div className={styles.mapWatermark}>
              Map View <FiMapPin />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;
