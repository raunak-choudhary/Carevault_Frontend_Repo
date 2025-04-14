import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getMedications, 
  getMedicationById, 
  addMedication, 
  updateMedication,
  deleteMedication,
  getMedicationReminders
} from '../services/medicationService';
import { useAuth } from '../hooks/useAuth';

// Create the context
export const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch medications on component mount
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const medications = await getMedications();
        setMedications(medications);
        
        // Also fetch reminders
        const reminders = await getMedicationReminders();
        setReminders(reminders);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching medications:', err);
        setError('Failed to load medications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedications();
  }, [user]);
  
  // Get a specific medication by ID
  const getMedication = useCallback(async (id) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      const medication = await getMedicationById(id);
      return medication;
    } catch (err) {
      console.error('Error fetching medication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Add a new medication
  const addNewMedication = useCallback(async (medicationData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      const newMedication = await addMedication(medicationData);
      
      // Update the medications state
      setMedications(prevMedications => [newMedication, ...prevMedications]);
      
      return newMedication;
    } catch (err) {
      console.error('Error adding medication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Update an existing medication
  const updateExistingMedication = useCallback(async (id, medicationData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      const updatedMedication = await updateMedication(id, medicationData);
      
      // Update the medications state
      setMedications(prevMedications => 
        prevMedications.map(medication => 
          medication.id === id ? updatedMedication : medication
        )
      );
      
      return updatedMedication;
    } catch (err) {
      console.error('Error updating medication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Delete a medication
  const removeExistingMedication = useCallback(async (id) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      await deleteMedication(id);
      
      // Update the medications state
      setMedications(prevMedications => 
        prevMedications.filter(medication => medication.id !== id)
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting medication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  return (
    <MedicationContext.Provider 
      value={{
        medications,
        reminders,
        loading,
        error,
        getMedication,
        addMedication: addNewMedication,
        updateMedication: updateExistingMedication,
        deleteMedication: removeExistingMedication
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export default MedicationProvider;