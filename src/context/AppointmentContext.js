import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} from '../services/appointmentService';

// Create context
export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allAppointments = await getAppointments('all');
      const upcoming = await getAppointments('upcoming');
      const past = await getAppointments('completed');

      setAppointments(allAppointments);
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Get appointment by ID
  const getAppointment = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const appointment = await getAppointmentById(id);
      return appointment;
    } catch (err) {
      console.error(`Error getting appointment ${id}:`, err);
      setError('Failed to load appointment details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new appointment
  const addAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);

      const newAppointment = await createAppointment(appointmentData);

      // Update appointment lists
      await fetchAppointments();

      return newAppointment;
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Failed to create appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an appointment
  const updateAppointmentData = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);

      const updatedAppointment = await updateAppointment(id, updates);

      // Update appointment lists
      await fetchAppointments();

      return updatedAppointment;
    } catch (err) {
      console.error(`Error updating appointment ${id}:`, err);
      setError('Failed to update appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel an appointment
  const cancelAppointmentById = async (id, reason) => {
    try {
      setLoading(true);
      setError(null);

      const cancelledAppointment = await cancelAppointment(id, reason);

      // Update appointment lists
      await fetchAppointments();

      return cancelledAppointment;
    } catch (err) {
      console.error(`Error cancelling appointment ${id}:`, err);
      setError('Failed to cancel appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        upcomingAppointments,
        pastAppointments,
        loading,
        error,
        fetchAppointments,
        getAppointment,
        addAppointment,
        updateAppointment: updateAppointmentData,
        cancelAppointment: cancelAppointmentById,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentProvider;
