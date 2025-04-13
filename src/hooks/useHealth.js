import { useContext } from 'react';
import { HealthContext } from '../context/HealthContext';

export const useHealth = () => {
  const context = useContext(HealthContext);
  
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  
  return context;
};

export default useHealth;