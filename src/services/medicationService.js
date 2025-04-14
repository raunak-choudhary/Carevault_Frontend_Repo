// This service would handle API calls related to medications
// For now, we'll use localStorage for persistence and simulate API behavior

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get all medications
const getMedications = async () => {
  // Simulate API call
  await delay(800);
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }
  
  // Get medications from localStorage or return empty array
  const medicationsJson = localStorage.getItem('medications');
  let medications = medicationsJson ? JSON.parse(medicationsJson) : [];
  
  // Filter medications by user
  medications = medications.filter(med => med.userId === user.id);
  
  // Sort by most recently added
  medications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
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
  const medication = medications.find(med => med.id === id && med.userId === user.id);
  
  if (!medication) {
    throw new Error('Medication not found');
  }
  
  return medication;
};

// Add a new medication
const addMedication = async (medicationData) => {
  // Simulate API call
  await delay(1000);
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id) {
    throw new Error('User not authenticated');
  }
  
  // Get existing medications
  const medicationsJson = localStorage.getItem('medications');
  const medications = medicationsJson ? JSON.parse(medicationsJson) : [];
  
  // Create new medication object
  const newMedication = {
    id: generateId(),
    userId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    ...medicationData
  };
  
  // Add to medications array
  medications.push(newMedication);
  
  // Save to localStorage
  localStorage.setItem('medications', JSON.stringify(medications));
  
  return newMedication;
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
  const medicationIndex = medications.findIndex(med => med.id === id && med.userId === user.id);
  
  if (medicationIndex === -1) {
    throw new Error('Medication not found');
  }
  
  // Update medication
  const updatedMedication = {
    ...medications[medicationIndex],
    ...updates,
    updatedAt: new Date().toISOString()
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
  const updatedMedications = medications.filter(med => !(med.id === id && med.userId === user.id));
  
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
  reminders = reminders.filter(reminder => reminder.userId === user.id);
  
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
    ...reminderData
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
  const reminderIndex = reminders.findIndex(reminder => reminder.id === id && reminder.userId === user.id);
  
  if (reminderIndex === -1) {
    throw new Error('Reminder not found');
  }
  
  // Update reminder
  const updatedReminder = {
    ...reminders[reminderIndex],
    ...updates,
    updatedAt: new Date().toISOString()
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
  const updatedReminders = reminders.filter(reminder => !(reminder.id === id && reminder.userId === user.id));
  
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
  return medications.filter(medication => {
    return (
      medication.name.toLowerCase().includes(lowercaseQuery) ||
      (medication.notes && medication.notes.toLowerCase().includes(lowercaseQuery))
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
  searchMedications
};