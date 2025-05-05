import { useContext } from 'react';
import { MedicationContext } from '../context/MedicationContext';

export const useMedications = () => {
  const context = useContext(MedicationContext);

  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }

  return context;
};

export default useMedications;
