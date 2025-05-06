import { apiClient, handleApiError } from '../utils/apiClient';

// This service would handle API calls related to medications
// For now, we'll use localStorage for persistence and simulate API behavior

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to ensure consistent date handling
const formatDateForStorage = (dateString) => {
  if (!dateString) return null;

  // For YYYY-MM-DD format dates (from date inputs)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Create a date object using the date parts
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    // Validate the date is valid before storing
    if (isNaN(date.getTime())) {
      return null; // Invalid date
    }

    // Store the date as a simple string format that won't be affected by timezone
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  return dateString;
};

// Helper function to parse stored date strings consistently
const parseStoredDate = (dateString) => {
  if (!dateString) return null;

  // For our custom YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date object with correct parts (month is 0-indexed in JS Date)
    return new Date(year, month - 1, day);
  }

  return new Date(dateString);
};

// Get all medications
const getMedications = async () => {
  const response = await apiClient.get('/medications/');
  const data = response.data;

  const medications = data?.data?.medications || [];

  return medications;
};

// Get medication by ID
const getMedicationById = async (id) => {
  // Simulate API call
  await delay(500);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get medications from localStorage
  const medicationsJson = localStorage.getItem('medications');
  const medications = medicationsJson ? JSON.parse(medicationsJson) : [];

  // Find medication with matching ID
  const medication = medications.find(
    (med) => med.id === id && med.userId === user.id,
  );

  if (!medication) {
    throw new Error('Medication not found');
  }

  return medication;
};

// Add a new medication
const addMedication = async (medicationData) => {
  
  const response = await apiClient.post('/medications/', {
    ...medicationData,
  });

  const data = response.data;

  const medication = data?.data || null;

  // // Get user from local storage
  // const user = JSON.parse(localStorage.getItem('user') || '{}');
  // if (!user.id) {
  //   throw new Error('User not authenticated');
  // }

  // // Get existing medications
  // const medicationsJson = localStorage.getItem('medications');
  // const medications = medicationsJson ? JSON.parse(medicationsJson) : [];

  // // Format date fields for consistent storage
  // const formattedData = {
  //   ...medicationData,
  //   refillDate: formatDateForStorage(medicationData.refillDate),
  // };

  // // Create new medication object
  // const newMedication = {
  //   id: generateId(),
  //   userId: user.id,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  //   status: 'active',
  //   ...formattedData,
  // };

  // // Add to medications array
  // medications.push(newMedication);

  // // Save to localStorage
  // localStorage.setItem('medications', JSON.stringify(medications));

  return medication;
};

// Update an existing medication
const updateMedication = async (id, updates) => {
  // Simulate API call
  await delay(800);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get medications from localStorage
  const medicationsJson = localStorage.getItem('medications');
  const medications = medicationsJson ? JSON.parse(medicationsJson) : [];

  // Find medication index
  const medicationIndex = medications.findIndex(
    (med) => med.id === id && med.userId === user.id,
  );

  if (medicationIndex === -1) {
    throw new Error('Medication not found');
  }

  // Format date fields for consistent storage
  const formattedUpdates = {
    ...updates,
    refillDate: formatDateForStorage(updates.refillDate),
  };

  // Update medication
  const updatedMedication = {
    ...medications[medicationIndex],
    ...formattedUpdates,
    updatedAt: new Date().toISOString(),
  };

  // Replace in array
  medications[medicationIndex] = updatedMedication;

  // Save to localStorage
  localStorage.setItem('medications', JSON.stringify(medications));

  return updatedMedication;
};

// Delete a medication
const deleteMedication = async (id) => {
  // Simulate API call
  await delay(800);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get medications from localStorage
  const medicationsJson = localStorage.getItem('medications');
  const medications = medicationsJson ? JSON.parse(medicationsJson) : [];

  // Filter out the medication to delete
  const updatedMedications = medications.filter(
    (med) => !(med.id === id && med.userId === user.id),
  );

  if (updatedMedications.length === medications.length) {
    throw new Error('Medication not found');
  }

  // Save to localStorage
  localStorage.setItem('medications', JSON.stringify(updatedMedications));

  return { success: true };
};

// Get medication reminders
const getMedicationReminders = async () => {
  // Simulate API call
  await delay(600);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get reminders from localStorage or return empty array
  const remindersJson = localStorage.getItem('medicationReminders');
  let reminders = remindersJson ? JSON.parse(remindersJson) : [];

  // Filter reminders by user
  reminders = reminders.filter((reminder) => reminder.userId === user.id);

  // Sort by next due time
  reminders.sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue));

  return reminders;
};

// Add a new reminder
const addMedicationReminder = async (reminderData) => {
  // Simulate API call
  await delay(800);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get existing reminders
  const remindersJson = localStorage.getItem('medicationReminders');
  const reminders = remindersJson ? JSON.parse(remindersJson) : [];

  // Create new reminder object
  const newReminder = {
    id: generateId(),
    userId: user.id,
    createdAt: new Date().toISOString(),
    status: 'active',
    ...reminderData,
  };

  // Add to reminders array
  reminders.push(newReminder);

  // Save to localStorage
  localStorage.setItem('medicationReminders', JSON.stringify(reminders));

  return newReminder;
};

// Update a reminder
const updateMedicationReminder = async (id, updates) => {
  // Simulate API call
  await delay(600);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get reminders from localStorage
  const remindersJson = localStorage.getItem('medicationReminders');
  const reminders = remindersJson ? JSON.parse(remindersJson) : [];

  // Find reminder index
  const reminderIndex = reminders.findIndex(
    (reminder) => reminder.id === id && reminder.userId === user.id,
  );

  if (reminderIndex === -1) {
    throw new Error('Reminder not found');
  }

  // Update reminder
  const updatedReminder = {
    ...reminders[reminderIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Replace in array
  reminders[reminderIndex] = updatedReminder;

  // Save to localStorage
  localStorage.setItem('medicationReminders', JSON.stringify(reminders));

  return updatedReminder;
};

// Delete a reminder
const deleteMedicationReminder = async (id) => {
  // Simulate API call
  await delay(600);

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }

  // Get reminders from localStorage
  const remindersJson = localStorage.getItem('medicationReminders');
  const reminders = remindersJson ? JSON.parse(remindersJson) : [];

  // Filter out the reminder to delete
  const updatedReminders = reminders.filter(
    (reminder) => !(reminder.id === id && reminder.userId === user.id),
  );

  if (updatedReminders.length === reminders.length) {
    throw new Error('Reminder not found');
  }

  // Save to localStorage
  localStorage.setItem('medicationReminders', JSON.stringify(updatedReminders));

  return { success: true };
};

// Search medications
const searchMedications = async (query) => {
  // Simulate API call
  await delay(700);

  // Get all medications
  const medications = await getMedications();

  // If no query, return all medications
  if (!query) {
    return medications;
  }

  // Search in name and notes
  const lowercaseQuery = query.toLowerCase();
  return medications.filter((medication) => {
    return (
      medication.name.toLowerCase().includes(lowercaseQuery) ||
      (medication.notes &&
        medication.notes.toLowerCase().includes(lowercaseQuery))
    );
  });
};

export {
  getMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication,
  getMedicationReminders,
  addMedicationReminder,
  updateMedicationReminder,
  deleteMedicationReminder,
  searchMedications,
  parseStoredDate, // Export this for use in display components
};
