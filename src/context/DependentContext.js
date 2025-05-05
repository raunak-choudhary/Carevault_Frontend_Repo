import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getPatients, getPatientById } from '../services/patientService';
import { useAuth } from '../hooks/useAuth';

// Create the context
export const DependentContext = createContext();

export const DependentProvider = ({ children }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user || user.role !== 'caregiver') return;

      try {
        setLoading(true);
        const patientsData = await getPatients();
        setPatients(patientsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  // Set current patient
  const switchPatient = useCallback(
    async (patientId) => {
      if (!user || user.role !== 'caregiver') {
        return Promise.reject(new Error('User not authorized'));
      }

      if (!patientId) {
        setCurrentPatient(null);
        localStorage.removeItem('currentPatientId');
        return Promise.resolve(null);
      }

      try {
        setLoading(true);
        setError(null); // Clear any previous errors

        // Check if patient exists in already loaded patients list
        const existingPatient = patients.find((p) => p.id === patientId);

        if (existingPatient) {
          setCurrentPatient(existingPatient);
          localStorage.setItem('currentPatientId', patientId);
          setLoading(false);
          return existingPatient;
        }

        // If not in cached list, fetch from service
        const patient = await getPatientById(patientId);
        setCurrentPatient(patient);

        // Update patients list if needed
        if (!patients.some((p) => p.id === patientId)) {
          setPatients((prev) => [...prev, patient]);
        }

        // Store in localStorage to persist through page refreshes
        localStorage.setItem('currentPatientId', patientId);
        return patient; // Return the patient data for chaining
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError('Failed to load patient details. Please try again.');
        throw err; // Rethrow to allow handling in components
      } finally {
        setLoading(false);
      }
    },
    [user, patients],
  );

  // NEW FUNCTION: Update the current patient data in context when it's modified elsewhere
  const refreshCurrentPatient = useCallback(async () => {
    if (!currentPatient || !currentPatient.id) {
      return Promise.resolve(null);
    }

    try {
      setLoading(true);

      // Fetch the latest patient data
      const updatedPatient = await getPatientById(currentPatient.id);

      // Update both the current patient and the patients list
      setCurrentPatient(updatedPatient);

      // Update in patients array
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === updatedPatient.id ? updatedPatient : p,
        ),
      );

      return updatedPatient;
    } catch (err) {
      console.error('Error refreshing patient data:', err);
      return currentPatient; // Return current data on error
    } finally {
      setLoading(false);
    }
  }, [currentPatient]);

  // Check for previously selected patient in localStorage on mount
  useEffect(() => {
    const checkStoredPatient = async () => {
      if (!user || user.role !== 'caregiver') return;

      const storedPatientId = localStorage.getItem('currentPatientId');
      if (storedPatientId) {
        try {
          await switchPatient(storedPatientId);
        } catch (err) {
          // Handle error silently, just clear the stored ID
          console.error('Error loading stored patient:', err);
          localStorage.removeItem('currentPatientId');
        }
      }
    };

    checkStoredPatient();
  }, [user, switchPatient]);

  // Clear current patient - UPDATED to be more robust
  const clearCurrentPatient = useCallback(() => {
    // First remove from localStorage to ensure persistence is cleared
    localStorage.removeItem('currentPatientId');

    // Then clear the state
    setCurrentPatient(null);

    // Return a resolved promise to allow for chaining with navigation
    return Promise.resolve();
  }, []);

  return (
    <DependentContext.Provider
      value={{
        patients,
        currentPatient,
        loading,
        error,
        switchPatient,
        clearCurrentPatient,
        isViewingPatient: !!currentPatient,
        refreshCurrentPatient, // Add the new function to the context
      }}
    >
      {children}
    </DependentContext.Provider>
  );
};

export default DependentProvider;
