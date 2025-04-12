import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiCalendar, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import Calendar from '../../components/appointments/Calendar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAppointments } from '../../services/appointmentService';
import styles from './AppointmentsListPage.module.css';

const AppointmentsListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [filterStatus, setFilterStatus] = useState('upcoming'); // 'upcoming', 'completed', 'all'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Fetch appointments on component mount and when filter changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const fetchedAppointments = await getAppointments(filterStatus);
        setAppointments(fetchedAppointments);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [filterStatus]);
  
  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  };
  
  // Format month for display
  const formatMonth = (date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className={styles.appointmentsPage}>
      <div className={styles.pageHeader}>
        <h1>Appointments</h1>
        <Link to="/appointments/create" className={styles.createButton}>
          <FiPlus /> New Appointment
        </Link>
      </div>
      
      <div className={styles.viewControls}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.activeView : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'calendar' ? styles.activeView : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar View
          </button>
        </div>
        
        <div className={styles.filterControls}>
          <FiFilter className={styles.filterIcon} />
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Past</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className={styles.appointmentList}>
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FiCalendar size={48} />
                  <h2>No appointments found</h2>
                  <p>
                    {filterStatus === 'upcoming' 
                      ? "You don't have any upcoming appointments." 
                      : filterStatus === 'completed'
                        ? "You don't have any past appointments."
                        : "You don't have any appointments."}
                  </p>
                  <Link to="/appointments/create" className={styles.emptyStateButton}>
                    Schedule an Appointment
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.calendarView}>
              <div className={styles.calendarHeader}>
                <button 
                  className={styles.calendarNavButton}
                  onClick={goToPreviousMonth}
                >
                  <FiChevronLeft />
                </button>
                <h2 className={styles.currentMonth}>{formatMonth(currentMonth)}</h2>
                <button 
                  className={styles.calendarNavButton}
                  onClick={goToNextMonth}
                >
                  <FiChevronRight />
                </button>
              </div>
              
              <Calendar 
                appointments={appointments} 
                currentMonth={currentMonth}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentsListPage;