import { apiClient, handleApiError } from '../utils/apiClient';

// This service would normally make API calls to a backend server
// For now, we'll use localStorage for persistence

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Default user roles
const USER_ROLES = {
  PATIENT: 'patient',
  CAREGIVER: 'caregiver',
  ADMIN: 'admin',
};

// Mock health data for demo
const initialHealthData = {
  weight: {
    data: [
      { value: 72.5, unit: 'kg', timestamp: '2024-03-01T08:30:00Z' },
      { value: 72.1, unit: 'kg', timestamp: '2024-03-08T08:15:00Z' },
      { value: 71.8, unit: 'kg', timestamp: '2024-03-15T08:45:00Z' },
      { value: 71.3, unit: 'kg', timestamp: '2024-03-22T08:20:00Z' },
      { value: 71.0, unit: 'kg', timestamp: '2024-03-29T08:10:00Z' },
      { value: 70.8, unit: 'kg', timestamp: '2024-04-05T08:30:00Z' },
      { value: 70.5, unit: 'kg', timestamp: '2024-04-12T08:15:00Z' },
    ],
    goal: 70.0,
    unit: 'kg',
  },
  bloodPressure: {
    data: [
      { systolic: 135, diastolic: 85, timestamp: '2024-03-01T08:30:00Z' },
      { systolic: 133, diastolic: 84, timestamp: '2024-03-08T08:15:00Z' },
      { systolic: 130, diastolic: 83, timestamp: '2024-03-15T08:45:00Z' },
      { systolic: 128, diastolic: 83, timestamp: '2024-03-22T08:20:00Z' },
      { systolic: 126, diastolic: 82, timestamp: '2024-03-29T08:10:00Z' },
      { systolic: 124, diastolic: 81, timestamp: '2024-04-05T08:30:00Z' },
      { systolic: 120, diastolic: 80, timestamp: '2024-04-12T08:15:00Z' },
    ],
    goal: { systolic: 120, diastolic: 80 },
  },
  heartRate: {
    data: [
      {
        value: 78,
        unit: 'bpm',
        context: 'Resting',
        timestamp: '2024-03-01T08:30:00Z',
      },
      {
        value: 76,
        unit: 'bpm',
        context: 'Resting',
        timestamp: '2024-03-08T08:15:00Z',
      },
      {
        value: 75,
        unit: 'bpm',
        context: 'Resting',
        timestamp: '2024-03-15T08:45:00Z',
      },
      {
        value: 74,
        unit: 'bpm',
        context: 'Resting',
        timestamp: '2024-03-22T08:20:00Z',
      },
      {
        value: 74,
        unit: 'bpm',
        context: 'Resting',
        timestamp: '2024-03-29T08:10:00Z',
      },
      {
        value: 73,
        unit: 'bpm',
        context: 'Resting',
        timestamp: '2024-04-05T08:30:00Z',
      },
      {
        value: 72,
        unit: 'bpm',
        context: 'Resting',
        timestamp: '2024-04-12T08:15:00Z',
      },
    ],
    goal: { min: 60, max: 100 },
    unit: 'bpm',
  },
  bloodGlucose: {
    data: [
      {
        value: 105,
        unit: 'mg/dL',
        context: 'Fasting',
        timestamp: '2024-03-01T08:30:00Z',
      },
      {
        value: 103,
        unit: 'mg/dL',
        context: 'Fasting',
        timestamp: '2024-03-08T08:15:00Z',
      },
      {
        value: 102,
        unit: 'mg/dL',
        context: 'Fasting',
        timestamp: '2024-03-15T08:45:00Z',
      },
      {
        value: 100,
        unit: 'mg/dL',
        context: 'Fasting',
        timestamp: '2024-03-22T08:20:00Z',
      },
      {
        value: 98,
        unit: 'mg/dL',
        context: 'Fasting',
        timestamp: '2024-03-29T08:10:00Z',
      },
      {
        value: 97,
        unit: 'mg/dL',
        context: 'Fasting',
        timestamp: '2024-04-05T08:30:00Z',
      },
      {
        value: 95,
        unit: 'mg/dL',
        context: 'Fasting',
        timestamp: '2024-04-12T08:15:00Z',
      },
    ],
    goal: { min: 70, max: 99 },
    unit: 'mg/dL',
  },
  sleep: {
    data: [
      { duration: 6.5, quality: 'Fair', timestamp: '2024-03-01T08:30:00Z' },
      { duration: 6.8, quality: 'Good', timestamp: '2024-03-08T08:15:00Z' },
      { duration: 7, quality: 'Good', timestamp: '2024-03-15T08:45:00Z' },
      { duration: 7.2, quality: 'Good', timestamp: '2024-03-22T08:20:00Z' },
      {
        duration: 7.5,
        quality: 'Very Good',
        timestamp: '2024-03-29T08:10:00Z',
      },
      {
        duration: 7.8,
        quality: 'Very Good',
        timestamp: '2024-04-05T08:30:00Z',
      },
      { duration: 8, quality: 'Excellent', timestamp: '2024-04-12T08:15:00Z' },
    ],
    goal: 8,
    unit: 'hours',
  },
  steps: {
    data: [
      { count: 5200, timestamp: '2024-03-01T23:59:59Z' },
      { count: 5500, timestamp: '2024-03-08T23:59:59Z' },
      { count: 6300, timestamp: '2024-03-15T23:59:59Z' },
      { count: 7100, timestamp: '2024-03-22T23:59:59Z' },
      { count: 7800, timestamp: '2024-03-29T23:59:59Z' },
      { count: 8200, timestamp: '2024-04-05T23:59:59Z' },
      { count: 8500, timestamp: '2024-04-12T23:59:59Z' },
    ],
    goal: 10000,
  },
};

// Login user
// const login = async (credentials) => {
//   // Simulate API call
//   await delay(1000);

//   // In a real app, this would validate with a backend
//   // Simple validation for demo
//   if (
//     credentials.email === 'demo@carevault.com' &&
//     credentials.password === 'password'
//   ) {
//     const user = {
//       id: '1',
//       firstName: 'Demo',
//       lastName: 'User',
//       email: 'demo@carevault.com',
//       role: USER_ROLES.PATIENT,
//       verified: true,
//     };

//     // Store in localStorage
//     localStorage.setItem('user', JSON.stringify(user));
//     localStorage.setItem('token', 'demo-token-12345');

//     // Initialize health data for demo user if not already present
//     if (!localStorage.getItem('healthData')) {
//       localStorage.setItem('healthData', JSON.stringify(initialHealthData));
//     }

//     return { user, token: 'demo-token-12345' };
//   } else if (
//     credentials.email === 'caregiver@carevault.com' &&
//     credentials.password === 'password'
//   ) {
//     // Caregiver user for demo purposes
//     const user = {
//       id: '2',
//       firstName: 'Care',
//       lastName: 'Giver',
//       email: 'caregiver@carevault.com',
//       role: USER_ROLES.CAREGIVER,
//       verified: true,
//     };

//     // Store in localStorage
//     localStorage.setItem('user', JSON.stringify(user));
//     localStorage.setItem('token', 'caregiver-token-12345');

//     return { user, token: 'caregiver-token-12345' };
//   }

//   // Simulate error response
//   throw new Error('Invalid email or password');
// };

/**
 * Logs in a user via the API.
 * @param {object} credentials - User login credentials (email, password).
 * @returns {Promise<{user: object, token: string}>} - The logged-in user object and auth token.
 */

const login = async (credentials) => {
  try {
    console.log(`Inside here login`);
    // Make POST request to the login endpoint
    const formData = new URLSearchParams();
    for (const key in credentials) {
      formData.append(key, credentials[key]);
    }
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // console.log(response)

    // Assuming the API returns { user: {...}, token: '...' }
    const { user, access_token, refresh_token } = response.data;

    // Store token and user data locally
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Call the /me API to get user details
      const userResponse = await apiClient.get('/auth/me');
      const userData = userResponse.data;

      console.log(userData);

      localStorage.setItem('user', JSON.stringify(userData));

      return { userData, access_token };
    }
    // if (user) {
    //   // Store user object for session persistence (optional, but used by getCurrentUser)
    //   localStorage.setItem('user', JSON.stringify(user));
    // }
  } catch (error) {
    // Throw a new error with a processed message
    throw new Error(handleApiError(error));
  }
};

// Register new user
const register = async (userData) => {
  // Simulate API call
  await delay(1000);

  // In a real app, this would send data to a backend
  // Create a new user object
  const user = {
    id: Date.now().toString(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: userData.role || USER_ROLES.PATIENT,
    verified: false,
  };

  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', `user-token-${user.id}`);

  // Initialize empty health data for new user
  if (user.role === USER_ROLES.PATIENT && !localStorage.getItem('healthData')) {
    localStorage.setItem('healthData', JSON.stringify(initialHealthData));
  }

  return { user, token: `user-token-${user.id}` };
};

// Verify account
const verifyAccount = async (code) => {
  // Simulate API call
  await delay(1000);

  // Get current user
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    throw new Error('No user found');
  }

  const user = JSON.parse(userJson);

  // Simulate verification code check
  if (code === '123456') {
    // Update verification status
    user.verified = true;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  throw new Error('Invalid verification code');
};

// Logout
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('documents'); // Clear documents on logout
  localStorage.removeItem('currentPatientId'); // Clear current patient ID on logout
  // Note: We're not clearing health data on logout for demo purposes
};

// Check if user is logged in
const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

// Reset password request
const requestPasswordReset = async (email) => {
  // Simulate API call
  await delay(1000);

  // In a real app, this would trigger an email with reset link
  // For now, simulate success
  if (email) {
    return {
      success: true,
      message:
        'If an account exists with that email, we have sent a password reset link',
    };
  }

  throw new Error('Email is required');
};

// Reset password with token
const resetPassword = async (token, newPassword) => {
  // Simulate API call
  await delay(1000);

  // In a real app, this would validate token and update password
  // For now, simulate success if token not empty
  if (token && newPassword) {
    return { success: true, message: 'Password has been reset successfully' };
  }

  throw new Error('Invalid token or password');
};

// Update user profile
const updateProfile = async (userData) => {
  // Simulate API call
  await delay(1000);

  // Get current user
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    throw new Error('No user found');
  }

  const currentUser = JSON.parse(userJson);

  // Update user data
  const updatedUser = { ...currentUser, ...userData };
  localStorage.setItem('user', JSON.stringify(updatedUser));

  return updatedUser;
};

// Document management related functions - Phase 3
// These will be moved to a separate documents service in future phases

// Helper function to save file data to localStorage
const saveFileData = (file) => {
  if (!file) return null;

  // For images, convert to data URL for persistent storage
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result); // This is a data URL that can be stored in localStorage
    };
    reader.readAsDataURL(file);
  });
};

// Get all user documents
const getUserDocuments = async (patientId = null) => {
  const response = await apiClient.get('/documents/');
  const data = response.data;

  console.log(data);

  const documents = data?.documents || [];

  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // // Get documents from localStorage or return empty array
  // const documentsJson = localStorage.getItem('documents');
  // let documents = documentsJson ? JSON.parse(documentsJson) : [];

  // If patientId is provided (for caregivers viewing patient data), filter for that patient
  if (patientId && user.role === USER_ROLES.CAREGIVER) {
    return documents.filter((doc) => doc.patientId === patientId);
  }

  // Otherwise, return the user's own documents
  return documents.filter((doc) => doc.userId === user.id);
};

// Upload a new document
const uploadDocument = async (documentData, patientId = null) => {
  // Simulate API call
  await delay(1500);

  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // If there's a file object (not a URL string), convert it to data URL
  let fileUrl = documentData.fileUrl;
  if (documentData.file && typeof documentData.file !== 'string') {
    fileUrl = await saveFileData(documentData.file);
  }

  // Get existing documents
  const documentsJson = localStorage.getItem('documents');
  const existingDocuments = documentsJson ? JSON.parse(documentsJson) : [];

  // Create new document with ID and timestamp
  const newDocument = {
    id: Date.now().toString(),
    userId: user.id,
    patientId: patientId || user.id, // Use patientId if provided, otherwise use user's own id
    createdAt: new Date().toISOString(),
    status: 'processed', // In real app, this would initially be 'processing' until OCR is complete
    fileUrl: fileUrl, // Store data URL or original URL
    ...documentData,
  };

  // Add to documents array
  const updatedDocuments = [newDocument, ...existingDocuments];

  // Save to localStorage
  localStorage.setItem('documents', JSON.stringify(updatedDocuments));

  return newDocument;
};

// Get document by ID
const getDocumentById = async (id, patientId = null) => {
  // Simulate API call
  await delay(800);

  // Get documents
  const documents = await getUserDocuments(patientId);

  // Find document with matching ID
  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    throw new Error('Document not found');
  }

  return document;
};

// Update document
const updateDocument = async (id, updates, patientId = null) => {
  // Simulate API call
  await delay(1000);

  // Get documents
  const documentsJson = localStorage.getItem('documents');
  const documents = documentsJson ? JSON.parse(documentsJson) : [];

  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Find document index
  let documentIndex = -1;

  if (user.role === USER_ROLES.CAREGIVER && patientId) {
    documentIndex = documents.findIndex(
      (doc) => doc.id === id && doc.patientId === patientId,
    );
  } else {
    documentIndex = documents.findIndex(
      (doc) => doc.id === id && doc.userId === user.id,
    );
  }

  if (documentIndex === -1) {
    throw new Error('Document not found');
  }

  // Update document
  const updatedDocument = {
    ...documents[documentIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Replace in array
  documents[documentIndex] = updatedDocument;

  // Save to localStorage
  localStorage.setItem('documents', JSON.stringify(documents));

  return updatedDocument;
};

// Delete document
const deleteDocument = async (id, patientId = null) => {
  // Simulate API call
  await delay(1000);

  // Get documents
  const documentsJson = localStorage.getItem('documents');
  const documents = documentsJson ? JSON.parse(documentsJson) : [];

  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Filter out document with matching ID
  let updatedDocuments;

  if (user.role === USER_ROLES.CAREGIVER && patientId) {
    updatedDocuments = documents.filter(
      (doc) => !(doc.id === id && doc.patientId === patientId),
    );
  } else {
    updatedDocuments = documents.filter(
      (doc) => !(doc.id === id && doc.userId === user.id),
    );
  }

  // If length is the same, document wasn't found
  if (updatedDocuments.length === documents.length) {
    throw new Error('Document not found');
  }

  // Save to localStorage
  localStorage.setItem('documents', JSON.stringify(updatedDocuments));

  return { success: true };
};

// Filter documents
const filterDocuments = async (filters, patientId = null) => {
  // Simulate API call
  await delay(800);

  // Get all documents
  const documents = await getUserDocuments(patientId);

  // Apply filters
  return documents.filter((doc) => {
    // Match on all provided filters
    for (const key in filters) {
      if (filters[key]) {
        if (key === 'startDate' && doc.date) {
          if (new Date(doc.date) < new Date(filters[key])) {
            return false;
          }
        } else if (key === 'endDate' && doc.date) {
          if (new Date(doc.date) > new Date(filters[key])) {
            return false;
          }
        } else if (key === 'type' && doc[key] !== filters[key]) {
          return false;
        } else if (
          key === 'provider' &&
          !doc[key]?.toLowerCase().includes(filters[key].toLowerCase())
        ) {
          return false;
        }
      }
    }
    return true;
  });
};

// Search documents
const searchDocuments = async (query, patientId = null) => {
  // Simulate API call
  await delay(800);

  if (!query) {
    return await getUserDocuments(patientId);
  }

  // Get all documents
  const documents = await getUserDocuments(patientId);
  const lowerQuery = query.toLowerCase();

  // Search in title, provider, type, notes, content and tags
  return documents.filter((doc) => {
    return (
      (doc.title && doc.title.toLowerCase().includes(lowerQuery)) ||
      (doc.provider && doc.provider.toLowerCase().includes(lowerQuery)) ||
      (doc.type && doc.type.toLowerCase().includes(lowerQuery)) ||
      (doc.content && doc.content.toLowerCase().includes(lowerQuery)) ||
      (doc.notes && doc.notes.toLowerCase().includes(lowerQuery)) ||
      (doc.tags &&
        doc.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
    );
  });
};

// Health metrics functions - Phase 6
const getHealthMetrics = async (patientId = null) => {
  // Simulate API call
  await delay(800);

  // Get current user
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get health data from localStorage or return empty object
  const healthDataJson = localStorage.getItem('healthData');
  const healthData = healthDataJson ? JSON.parse(healthDataJson) : {};

  // If patientId is provided and user is a caregiver, return that patient's data
  // In a real app, this would fetch the specific patient's data from the backend
  if (patientId && user.role === USER_ROLES.CAREGIVER) {
    // For demo purposes, we'll just return the same data
    return healthData;
  }

  return healthData;
};

// Get specific health metric
const getHealthMetric = async (metricType, patientId = null) => {
  // Simulate API call
  await delay(600);

  // Get all health metrics
  const healthData = await getHealthMetrics(patientId);

  // Return specific metric or null if not found
  return healthData[metricType] || null;
};

// Add new health metric reading
const addHealthMetricReading = async (
  metricType,
  reading,
  patientId = null,
) => {
  // Simulate API call
  await delay(800);

  // Get current health data
  const healthData = await getHealthMetrics(patientId);

  // If this metric doesn't exist yet, initialize it
  if (!healthData[metricType]) {
    healthData[metricType] = {
      data: [],
      unit: reading.unit || '',
    };
  }

  // Add timestamp if not provided
  if (!reading.timestamp) {
    reading.timestamp = new Date().toISOString();
  }

  // Add reading to metric data
  healthData[metricType].data.unshift(reading);

  // Save updated health data
  localStorage.setItem('healthData', JSON.stringify(healthData));

  return healthData[metricType];
};

// Update health metric goal
const updateHealthMetricGoal = async (metricType, goal, patientId = null) => {
  // Simulate API call
  await delay(600);

  // Get current health data
  const healthData = await getHealthMetrics(patientId);

  // Update goal for specific metric
  if (healthData[metricType]) {
    healthData[metricType].goal = goal;

    // Save updated health data
    localStorage.setItem('healthData', JSON.stringify(healthData));

    return healthData[metricType];
  }

  throw new Error(`Metric ${metricType} not found`);
};

export {
  USER_ROLES,
  login,
  register,
  verifyAccount,
  logout,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  // Document related functions - Phase 3
  getUserDocuments,
  uploadDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  filterDocuments,
  searchDocuments,
  saveFileData,
  // Health metrics functions - Phase 6
  getHealthMetrics,
  getHealthMetric,
  addHealthMetricReading,
  updateHealthMetricGoal,
};
