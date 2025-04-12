import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Calendar.module.css';

const Calendar = ({ appointments, currentMonth }) => {
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);
  
  // Check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };
  
  // Generate array of days in the current month with appointment data
  const generateCalendarDays = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month and total days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonthCount = new Date(year, month + 1, 0).getDate();
    
    // Set first day of month (0 = Sunday, 1 = Monday, etc.)
    setFirstDayOfMonth(firstDay);
    
    // Generate array of day objects for the month
    const daysArray = [];
    
    for (let i = 1; i <= daysInMonthCount; i++) {
      const dayDate = new Date(year, month, i);
      const dateString = dayDate.toISOString().split('T')[0];
      
      // Find appointments for this day
      const appointmentsForDay = appointments.filter(appt => {
        const apptDate = new Date(appt.startTime);
        return (
          apptDate.getDate() === i &&
          apptDate.getMonth() === month &&
          apptDate.getFullYear() === year
        );
      });
      
      daysArray.push({
        day: i,
        date: dateString,
        appointments: appointmentsForDay,
        isToday: isToday(year, month, i)
      });
    }
    
    setDaysInMonth(daysArray);
  }, [appointments]);
  
  // Generate calendar days when currentMonth changes
  useEffect(() => {
    generateCalendarDays(currentMonth);
  }, [currentMonth, generateCalendarDays]);
  
  // Get day names for header
  const getDayNames = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => <div key={day} className={styles.dayName}>{day}</div>);
  };
  
  // Get empty cells for days before the 1st of the month
  const getEmptyCells = () => {
    const emptyCells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      emptyCells.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }
    return emptyCells;
  };
  
  // Render appointments for a day
  const renderAppointments = (dayAppointments) => {
    if (!dayAppointments || dayAppointments.length === 0) {
      return null;
    }
    
    // Show up to 2 appointments, with a +X more indicator if there are more
    const displayCount = Math.min(dayAppointments.length, 2);
    const remainingCount = dayAppointments.length - displayCount;
    
    return (
      <div className={styles.appointmentsContainer}>
        {dayAppointments.slice(0, displayCount).map((appt, index) => (
          <div 
            key={index} 
            className={`${styles.appointmentIndicator} ${appt.status === 'cancelled' ? styles.cancelledAppointment : ''}`}
          >
            {appt.title || 'Appointment'}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className={styles.moreAppointments}>
            +{remainingCount} more
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        {getDayNames()}
      </div>
      
      <div className={styles.calendarBody}>
        {getEmptyCells()}
        
        {daysInMonth.map((dayData) => (
          <div 
            key={dayData.day} 
            className={`${styles.calendarDay} ${dayData.isToday ? styles.today : ''} ${dayData.appointments.length > 0 ? styles.hasAppointments : ''}`}
          >
            <div className={styles.dayNumber}>{dayData.day}</div>
            
            {dayData.appointments.length > 0 ? (
              <Link 
                to={`/appointments?date=${dayData.date}`} 
                className={styles.dayContent}
              >
                {renderAppointments(dayData.appointments)}
              </Link>
            ) : (
              <div className={styles.dayContent}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;