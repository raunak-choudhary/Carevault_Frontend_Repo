// This service would handle API calls related to patient data
// For now, we'll use localStorage for persistence and simulate API behavior

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Mock patient data for demo purposes
const mockPatients = [
  {
    id: 'patient1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1980-05-15',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, US',
    caregiverId: '2', // Matches the demo caregiver ID
    healthId: 'HC12345678',
    emergencyContact: 'Jane Doe (Wife) - 555-123-4568',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-04-10T14:45:00Z',
    status: 'active',
    notes: 'Regular check-ups for blood pressure monitoring.'
  },
  {
    id: 'patient2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1975-08-22',
    email: 'sarah.j@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Anytown, US',
    caregiverId: '2', // Matches the demo caregiver ID
    healthId: 'HC87654321',
    emergencyContact: 'Mike Johnson (Son) - 555-987-6544',
    createdAt: '2023-04-02T09:15:00Z',
    updatedAt: '2023-04-20T11:30:00Z',
    status: 'active',
    notes: 'Diabetes management. Needs regular glucose monitoring.'
  }
];

// Initialize mock data if not already present
const initializeMockData = () => {
  if (!localStorage.getItem('patients')) {
    localStorage.setItem('patients', JSON.stringify(mockPatients));
  }
};

// Get all patients for the current caregiver
const getPatients = async () => {
  // Initialize mock data
  initializeMockData();
  
  // Simulate API call
  await delay(800);
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id || user.role !== 'caregiver') {
    throw new Error('User not authenticated or not a caregiver');
  }
  
  // Get patients from localStorage or return empty array
  const patientsJson = localStorage.getItem('patients');
  let patients = patientsJson ? JSON.parse(patientsJson) : [];
  
  // Filter patients by caregiver
  patients = patients.filter(patient => patient.caregiverId === user.id);
  
  // Sort by last updated
  patients.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  return patients;
};

// Get patient by ID
const getPatientById = async (id) => {
  // Initialize mock data
  initializeMockData();
  
  // Simulate API call
  await delay(500);
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id || user.role !== 'caregiver') {
    throw new Error('User not authenticated or not a caregiver');
  }
  
  // Get patients from localStorage
  const patientsJson = localStorage.getItem('patients');
  const patients = patientsJson ? JSON.parse(patientsJson) : [];
  
  // Find patient with matching ID
  const patient = patients.find(patient => patient.id === id && patient.caregiverId === user.id);
  
  if (!patient) {
    throw new Error('Patient not found');
  }
  
  return patient;
};

// Add a new patient
const addPatient = async (patientData) => {
  // Initialize mock data
  initializeMockData();
  
  // Simulate API call
  await delay(1000);
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id || user.role !== 'caregiver') {
    throw new Error('User not authenticated or not a caregiver');
  }
  
  // Get existing patients
  const patientsJson = localStorage.getItem('patients');
  const patients = patientsJson ? JSON.parse(patientsJson) : [];
  
  // Create new patient object
  const newPatient = {
    id: generateId(),
    caregiverId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    ...patientData
  };
  
  // Add to patients array
  patients.push(newPatient);
  
  // Save to localStorage
  localStorage.setItem('patients', JSON.stringify(patients));
  
  return newPatient;
};

// Update a patient
const updatePatient = async (id, updates) => {
  // Initialize mock data
  initializeMockData();
  
  // Simulate API call
  await delay(800);
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id || user.role !== 'caregiver') {
    throw new Error('User not authenticated or not a caregiver');
  }
  
  // Get patients from localStorage
  const patientsJson = localStorage.getItem('patients');
  const patients = patientsJson ? JSON.parse(patientsJson) : [];
  
  // Find patient index
  const patientIndex = patients.findIndex(
    patient => patient.id === id && patient.caregiverId === user.id
  );
  
  if (patientIndex === -1) {
    throw new Error('Patient not found');
  }
  
  // Update patient
  const updatedPatient = {
    ...patients[patientIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Replace in array
  patients[patientIndex] = updatedPatient;
  
  // Save to localStorage
  localStorage.setItem('patients', JSON.stringify(patients));
  
  return updatedPatient;
};

// Delete a patient
const deletePatient = async (id) => {
  // Initialize mock data
  initializeMockData();
  
  // Simulate API call
  await delay(800);
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.id || user.role !== 'caregiver') {
    throw new Error('User not authenticated or not a caregiver');
  }
  
  // Get patients from localStorage
  const patientsJson = localStorage.getItem('patients');
  const patients = patientsJson ? JSON.parse(patientsJson) : [];
  
  // Filter out the patient to delete
  const updatedPatients = patients.filter(
    patient => !(patient.id === id && patient.caregiverId === user.id)
  );
  
  if (updatedPatients.length === patients.length) {
    throw new Error('Patient not found');
  }
  
  // Save to localStorage
  localStorage.setItem('patients', JSON.stringify(updatedPatients));
  
  return { success: true };
};

// Search patients
const searchPatients = async (query) => {
  // Initialize mock data
  initializeMockData();
  
  // Simulate API call
  await delay(700);
  
  // Get all patients
  const patients = await getPatients();
  
  // If no query, return all patients
  if (!query) {
    return patients;
  }
  
  // Search in name, email and notes
  const lowercaseQuery = query.toLowerCase();
  return patients.filter(patient => {
    return (
      patient.firstName?.toLowerCase().includes(lowercaseQuery) ||
      patient.lastName?.toLowerCase().includes(lowercaseQuery) ||
      patient.email?.toLowerCase().includes(lowercaseQuery) ||
      patient.healthId?.toLowerCase().includes(lowercaseQuery) ||
      (patient.notes && patient.notes.toLowerCase().includes(lowercaseQuery))
    );
  });
};

export {
  getPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
  searchPatients
};