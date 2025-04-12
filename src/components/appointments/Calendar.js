import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Calendar.module.css';

const Calendar = ({ appointments, currentMonth, onMonthChange }) => {
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [emptyCells, setEmptyCells] = useState([]);
  
  // Format month for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };
  
  // Check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    if (onMonthChange) {
      const prevMonth = new Date(currentMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      onMonthChange(prevMonth);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (onMonthChange) {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      onMonthChange(nextMonth);
    }
  };
  
  // Generate calendar data when month changes
  const generateCalendarData = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    
    // Total days in month
    const daysInMonthCount = new Date(year, month + 1, 0).getDate();
    
    // Generate array of day objects for the month
    const days = [];
    
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
      
      days.push({
        day: i,
        date: dateString,
        appointments: appointmentsForDay,
        isToday: isToday(year, month, i)
      });
    }
    
    // Generate empty cells for days before the 1st of the month
    const empty = Array.from({ length: firstDay }, (_, index) => (
      <div key={`empty-${index}`} className={styles.emptyDay}></div>
    ));
    
    setDaysInMonth(days);
    setEmptyCells(empty);
  }, [appointments, currentMonth]);
  
  useEffect(() => {
    generateCalendarData();
  }, [generateCalendarData]);
  
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
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button 
          className={styles.navButton}
          onClick={goToPrevMonth}
          aria-label="Previous month"
        >
          ◀
        </button>
        
        <h2 className={styles.monthTitle}>
          {formatMonthYear(currentMonth)}
        </h2>
        
        <button 
          className={styles.navButton}
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          ▶
        </button>
      </div>
      
      <div className={styles.weekdaysHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>
      
      <div className={styles.daysGrid}>
        {emptyCells}
        
        {daysInMonth.map((dayData) => (
          <div 
            key={dayData.day} 
            className={`${styles.day} ${dayData.isToday ? styles.today : ''} ${dayData.appointments.length > 0 ? styles.hasAppointments : ''}`}
          >
            <div className={styles.dayHeader}>
              <span className={styles.dayNumber}>{dayData.day}</span>
              {dayData.appointments.length > 0 && (
                <span className={styles.appointmentDot}></span>
              )}
            </div>
            
            <div className={styles.dayContent}>
              {dayData.appointments.length > 0 ? (
                <Link 
                  to={`/appointments?date=${dayData.date}`} 
                  className={styles.appointmentsLink}
                >
                  {renderAppointments(dayData.appointments)}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;