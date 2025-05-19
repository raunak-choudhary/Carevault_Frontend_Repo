import { apiClient, handleApiError } from '../utils/apiClient';

// This service would normally make API calls to a backend server
// For now, we'll use mock data and simulate API behavior

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get all providers
const getProviders = async () => {
  const response = await apiClient.get('/providers/');
  const data = response.data;

  const providers = data?.data?.providers || [];

  return providers;
};

// Get provider by ID
const getProviderById = async (id) => {
  const response = await apiClient.get('/providers/' + id);
  const data = response.data;

  const provider = data?.data || null;

  if (!provider) {
    throw new Error('Provider not found');
  }

  return provider;
};

// Search providers
const searchProviders = async (query = '', specialty = '') => {
  const response = await apiClient.get('/providers/', {
    params: {
      name: query,
      specialty: specialty,
    },
  });

  const data = response.data;
  const providers = data?.data?.providers || [];

  return providers;
};

// Get providers by location
const getProvidersByLocation = async (latitude, longitude, radius = 10) => {
  // Simulate API call
  await delay(800);

  // In a real app, this would use a geospatial query
  // For mock data, we'll just return all providers
  return [];
};

// Get provider availability for a given date
const getProviderAvailability = async (providerId, date) => {
  // Simulate API call
  await delay(600);

  // Check if provider exists
  // const provider = mockProviders.find((p) => p.id === providerId);
  // if (!provider) {
  //   throw new Error('Provider not found');
  // }

  // Generate random availability time slots
  const availableSlots = [];
  const workingHours = [9, 10, 11, 13, 14, 15, 16];

  workingHours.forEach((hour) => {
    // Randomly make some slots unavailable
    if (Math.random() > 0.3) {
      availableSlots.push({
        startTime: `${hour}:00`,
        endTime: `${hour}:30`,
      });
    }

    if (Math.random() > 0.3) {
      availableSlots.push({
        startTime: `${hour}:30`,
        endTime: `${hour + 1}:00`,
      });
    }
  });

  return availableSlots;
};

export {
  getProviders,
  getProviderById,
  searchProviders,
  getProvidersByLocation,
  getProviderAvailability,
};
