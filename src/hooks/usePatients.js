import { useContext } from 'react';
import { DependentContext } from '../context/DependentContext';

export const usePatients = () => {
  const context = useContext(DependentContext);
  
  if (context === undefined) {
    throw new Error('usePatients must be used within a DependentProvider');
  }
  
  // Wrap the clearActivePatient function to ensure proper state management
  const clearActivePatient = async () => {
    // Ensure we're returning a promise to allow for proper sequencing
    return await context.clearCurrentPatient();
  };
  
  // Enhance setActivePatient to handle errors consistently
  const setActivePatient = async (patientId) => {
    if (!patientId) {
      return await context.clearCurrentPatient();
    }
    
    try {
      // Use the switchPatient function from context
      const result = await context.switchPatient(patientId);
      return result;
    } catch (error) {
      console.error('Error setting active patient:', error);
      // Don't automatically clean up - let the component handle the error
      throw error; // Re-throw the error for handling in components
    }
  };
  
  // Rename properties to match expected naming convention in components
  return {
    patients: context.patients,
    activePatient: context.currentPatient,
    setActivePatient, // Use our enhanced version
    clearActivePatient, // Use our wrapped version
    switchPatient: context.switchPatient, // Keep original for compatibility
    refreshActivePatient: context.refreshCurrentPatient, // Expose the refresh function with a consistent name
    loading: context.loading,
    error: context.error,
    isViewingPatient: context.isViewingPatient
  };
};

export default usePatients;