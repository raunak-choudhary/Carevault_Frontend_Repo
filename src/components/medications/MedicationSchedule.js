import React, { useState, useEffect } from 'react';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';
import styles from './MedicationSchedule.module.css';

const MedicationSchedule = ({ medications = [], onMarkTaken, onMarkSkipped }) => {
  const [upcomingDoses, setUpcomingDoses] = useState([]);
  const [selectedDay, setSelectedDay] = useState('today'); // 'today', 'tomorrow', 'week'
  
  // Calculate upcoming doses based on medication schedules
  useEffect(() => {
    if (!medications.length) return;
    
    const now = new Date();
    const doses = [];
    
    // For each medication, create dose entries based on schedule
    medications.forEach(medication => {
      // Skip inactive medications
      if (medication.status !== 'active') return;
      
      // Only process medications with a dosage schedule
      if (!medication.dosageSchedule || !medication.dosageSchedule.length) return;
      
      medication.dosageSchedule.forEach(timeString => {
        // Parse time
        const [hours, minutes] = timeString.split(':').map(Number);
        
        // Create today's date with this time
        const doseTime = new Date(now);
        doseTime.setHours(hours, minutes, 0, 0);
        
        // Skip doses that already passed today
        if (doseTime < now && selectedDay === 'today') return;
        
        // For tomorrow, set to tomorrow's date
        if (selectedDay === 'tomorrow') {
          doseTime.setDate(doseTime.getDate() + 1);
        }
        
        // For week view, create entries for the next 7 days
        if (selectedDay === 'week') {
          for (let i = 0; i < 7; i++) {
            const futureDoseTime = new Date(doseTime);
            futureDoseTime.setDate(doseTime.getDate() + i);
            
            // Skip past doses in current day
            if (i === 0 && futureDoseTime < now) continue;
            
            // Check if this medication should be taken on this day based on frequency
            let shouldTakeOnThisDay = true;
            
            // Skip days based on frequency
            if (medication.frequency === 'weekly') {
              shouldTakeOnThisDay = futureDoseTime.getDay() === now.getDay();
            } else if (medication.frequency === 'monthly') {
              shouldTakeOnThisDay = futureDoseTime.getDate() === now.getDate();
            }
            
            if (shouldTakeOnThisDay) {
              doses.push({
                id: `${medication.id}-${futureDoseTime.toISOString()}`,
                medicationId: medication.id,
                name: medication.name,
                dosage: `${medication.dosage} ${medication.unit}`,
                time: futureDoseTime,
                instructions: medication.instructions,
                status: 'scheduled'
              });
            }
          }
        } else {
          // Add today's or tomorrow's dose
          doses.push({
            id: `${medication.id}-${doseTime.toISOString()}`,
            medicationId: medication.id,
            name: medication.name,
            dosage: `${medication.dosage} ${medication.unit}`,
            time: doseTime,
            instructions: medication.instructions,
            status: 'scheduled'
          });
        }
      });
    });
    
    // Sort doses chronologically
    doses.sort((a, b) => a.time - b.time);
    
    setUpcomingDoses(doses);
  }, [medications, selectedDay]);
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Group doses by date for week view
  const getDosesByDate = () => {
    if (selectedDay !== 'week') return { [formatDate(new Date())]: upcomingDoses };
    
    return upcomingDoses.reduce((groups, dose) => {
      const dateKey = formatDate(dose.time);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(dose);
      return groups;
    }, {});
  };
  
  // Handle marking a dose as taken
  const handleMarkTaken = (dose) => {
    if (onMarkTaken) {
      onMarkTaken(dose);
    }
    
    // For UI feedback without backend, update local state
    setUpcomingDoses(prevDoses => 
      prevDoses.map(d => 
        d.id === dose.id ? { ...d, status: 'taken' } : d
      )
    );
  };
  
  // Handle marking a dose as skipped
  const handleMarkSkipped = (dose) => {
    if (onMarkSkipped) {
      onMarkSkipped(dose);
    }
    
    // For UI feedback without backend, update local state
    setUpcomingDoses(prevDoses => 
      prevDoses.map(d => 
        d.id === dose.id ? { ...d, status: 'skipped' } : d
      )
    );
  };
  
  const dosesByDate = getDosesByDate();
  
  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleHeader}>
        <div className={styles.daySelector}>
          <button
            className={`${styles.daySelectorButton} ${selectedDay === 'today' ? styles.daySelectorButtonActive : ''}`}
            onClick={() => setSelectedDay('today')}
          >
            Today
          </button>
          <button
            className={`${styles.daySelectorButton} ${selectedDay === 'tomorrow' ? styles.daySelectorButtonActive : ''}`}
            onClick={() => setSelectedDay('tomorrow')}
          >
            Tomorrow
          </button>
          <button
            className={`${styles.daySelectorButton} ${selectedDay === 'week' ? styles.daySelectorButtonActive : ''}`}
            onClick={() => setSelectedDay('week')}
          >
            Week
          </button>
        </div>
      </div>
      
      <div className={styles.scheduleContent}>
        {Object.keys(dosesByDate).length > 0 ? (
          Object.entries(dosesByDate).map(([date, doses]) => (
            <div key={date} className={styles.scheduleDay}>
              {selectedDay === 'week' && (
                <div className={styles.scheduleDate}>{date}</div>
              )}
              
              {doses.length > 0 ? (
                doses.map(dose => (
                  <div 
                    key={dose.id} 
                    className={`${styles.doseItem} ${dose.status === 'taken' ? styles.doseTaken : ''} ${dose.status === 'skipped' ? styles.doseSkipped : ''}`}
                  >
                    <div className={styles.doseTime}>
                      <FiClock className={styles.doseTimeIcon} />
                      {formatTime(dose.time)}
                    </div>
                    
                    <div className={styles.doseInfo}>
                      <div className={styles.doseName}>{dose.name}</div>
                      <div className={styles.doseDosage}>{dose.dosage}</div>
                      {dose.instructions && (
                        <div className={styles.doseInstructions}>{dose.instructions}</div>
                      )}
                    </div>
                    
                    <div className={styles.doseActions}>
                      {dose.status === 'scheduled' && (
                        <>
                          <button 
                            className={styles.takenButton}
                            onClick={() => handleMarkTaken(dose)}
                            title="Mark as taken"
                          >
                            <FiCheck />
                          </button>
                          <button 
                            className={styles.skipButton}
                            onClick={() => handleMarkSkipped(dose)}
                            title="Mark as skipped"
                          >
                            <FiX />
                          </button>
                        </>
                      )}
                      {dose.status === 'taken' && (
                        <div className={styles.doseStatus}>Taken</div>
                      )}
                      {dose.status === 'skipped' && (
                        <div className={styles.doseStatus}>Skipped</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noDoses}>No medications scheduled</div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No medications scheduled. Add medications with dosage schedules to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationSchedule;