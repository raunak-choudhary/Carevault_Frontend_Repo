import { apiClient, handleApiError } from '../utils/apiClient';

// This service would normally make API calls to a backend server
// For now, we'll use localStorage for persistence and simulate API behavior

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get all appointments

const getAppointments = async (status = 'all') => {
  const response = await apiClient.get('/appointments/');
  const data = response.data;

  console.log(data);

  const appointments = data?.data?.appointments || [];

  return appointments;
};

// Get appointment by ID
const getAppointmentById = async (id) => {
  const response = await apiClient.get('/appointments/' + id);
  const data = response.data;
  const appointment = data?.data || null;

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  return appointment;
};

// Create a new appointment
const createAppointment = async (appointmentData) => {
  // Simulate API call
  await delay(1000);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get existing appointments
  const appointmentsJson = localStorage.getItem('appointments');
  const appointments = appointmentsJson ? JSON.parse(appointmentsJson) : [];

  // Create new appointment object
  const newAppointment = {
    id: generateId(),
    userId: user.id,
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    ...appointmentData,
    // Combine date and time for start/end times
    startTime: `${appointmentData.date}T${appointmentData.startTime}`,
    endTime: `${appointmentData.date}T${appointmentData.endTime}`,
  };

  // Add to appointments array
  appointments.push(newAppointment);

  // Save to localStorage
  localStorage.setItem('appointments', JSON.stringify(appointments));

  return newAppointment;
};

// Update an appointment
const updateAppointment = async (id, updates) => {
  // Simulate API call
  await delay(800);

  // Get appointments from localStorage
  const appointmentsJson = localStorage.getItem('appointments');
  const appointments = appointmentsJson ? JSON.parse(appointmentsJson) : [];

  // Find appointment index
  const appointmentIndex = appointments.findIndex((appt) => appt.id === id);

  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }

  // Handle date and time updates
  if (updates.date || updates.startTime || updates.endTime) {
    const date =
      updates.date || appointments[appointmentIndex].startTime.split('T')[0];
    const startTime =
      updates.startTime ||
      appointments[appointmentIndex].startTime.split('T')[1];
    const endTime =
      updates.endTime || appointments[appointmentIndex].endTime.split('T')[1];

    updates.startTime = `${date}T${startTime}`;
    updates.endTime = `${date}T${endTime}`;
  }

  // Update appointment
  const updatedAppointment = {
    ...appointments[appointmentIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Replace in array
  appointments[appointmentIndex] = updatedAppointment;

  // Save to localStorage
  localStorage.setItem('appointments', JSON.stringify(appointments));

  return updatedAppointment;
};

// Cancel an appointment
const cancelAppointment = async (id, reason) => {
  // Simulate API call
  await delay(800);

  // Update appointment with cancelled status
  const updatedAppointment = await updateAppointment(id, {
    status: 'cancelled',
    cancellationReason: reason || 'Cancelled by user',
    cancelledAt: new Date().toISOString(),
  });

  return updatedAppointment;
};

// Get available time slots for a provider on a specific date
const getAvailableTimeSlots = async (date, providerId) => {
  // Simulate API call
  await delay(800);

  // In a real app, this would query the backend for the provider's availability
  // For now, we'll generate some random time slots

  // Set the base hours (9 AM to 6 PM)
  const baseHours = Array.from({ length: 10 }, (_, i) => i + 9);

  // Generate slots for every hour
  const timeSlots = baseHours
    .map((hour) => {
      // Create 30-minute slots
      const slot1 = {
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${hour.toString().padStart(2, '0')}:30`,
      };

      const slot2 = {
        startTime: `${hour.toString().padStart(2, '0')}:30`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      };

      return [slot1, slot2];
    })
    .flat();

  // Randomly remove some slots to simulate unavailability
  const randomIndex = parseInt(providerId.charAt(0), 16) % 10; // Use provider ID to seed pseudo-randomness
  const availableSlots = timeSlots.filter((_, index) => {
    // Remove ~30% of slots randomly
    return (index + randomIndex) % 3 !== 0;
  });

  return availableSlots;
};

export {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableTimeSlots,
};
