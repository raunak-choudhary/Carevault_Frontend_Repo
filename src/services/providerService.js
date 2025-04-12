// This service would normally make API calls to a backend server
// For now, we'll use mock data and simulate API behavior

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Sample providers data
const mockProviders = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Primary Care',
    address: '123 Medical Center Dr, New York, NY 10001',
    phone: '(212) 555-1234',
    hours: 'Mon-Fri: 9AM-5PM',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: null,
    latitude: 40.7128,
    longitude: -74.0060,
    about: 'Dr. Johnson is a board-certified primary care physician with over 15 years of experience. She specializes in preventive care and chronic disease management.'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiology',
    address: '456 Heart Center Blvd, New York, NY 10002',
    phone: '(212) 555-5678',
    hours: 'Mon-Thu: 8AM-6PM, Fri: 8AM-2PM',
    rating: 4.9,
    reviewCount: 89,
    imageUrl: null,
    latitude: 40.7282,
    longitude: -73.9942,
    about: 'Dr. Chen is a leading cardiologist specializing in cardiovascular disease prevention and treatment. He is dedicated to providing personalized care using the latest medical advances.'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    address: '789 Children\'s Way, New York, NY 10003',
    phone: '(212) 555-9012',
    hours: 'Mon-Fri: 8AM-7PM, Sat: 9AM-1PM',
    rating: 4.7,
    reviewCount: 156,
    imageUrl: null,
    latitude: 40.7358,
    longitude: -73.9911,
    about: 'Dr. Rodriguez is a compassionate pediatrician who has been caring for children for over 10 years. She focuses on developmental care and promoting healthy lifestyle habits from an early age.'
  },
  {
    id: '4',
    name: 'Dr. David Wilson',
    specialization: 'Orthopedics',
    address: '321 Sports Medicine Ave, New York, NY 10004',
    phone: '(212) 555-3456',
    hours: 'Mon, Wed, Fri: 9AM-6PM',
    rating: 4.5,
    reviewCount: 78,
    imageUrl: null,
    latitude: 40.7218,
    longitude: -74.0101,
    about: 'Dr. Wilson is an orthopedic surgeon specializing in sports medicine and joint replacement. He works with patients of all ages to improve mobility and reduce pain.'
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialization: 'Dermatology',
    address: '567 Skin Health Pkwy, New York, NY 10005',
    phone: '(212) 555-7890',
    hours: 'Tue-Thu: 8:30AM-5PM, Fri: 8:30AM-3PM',
    rating: 4.6,
    reviewCount: 112,
    imageUrl: null,
    latitude: 40.7425,
    longitude: -73.9890,
    about: 'Dr. Thompson is a board-certified dermatologist with expertise in medical, surgical, and cosmetic dermatology. She is passionate about skin cancer prevention and treatment.'
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    specialization: 'Neurology',
    address: '890 Brain Health Blvd, New York, NY 10006',
    phone: '(212) 555-2345',
    hours: 'Mon-Fri: 9AM-4PM',
    rating: 4.9,
    reviewCount: 67,
    imageUrl: null,
    latitude: 40.7312,
    longitude: -74.0032,
    about: 'Dr. Kim is a neurologist specializing in headache disorders, stroke care, and neurological rehabilitation. He takes a comprehensive approach to neurological health.'
  },
  {
    id: '7',
    name: 'Dr. James Martinez',
    specialization: 'Psychiatry',
    address: '432 Mental Health Way, New York, NY 10007',
    phone: '(212) 555-6789',
    hours: 'Mon, Wed, Thu: 10AM-6PM',
    rating: 4.7,
    reviewCount: 91,
    imageUrl: null,
    latitude: 40.7192,
    longitude: -73.9973,
    about: 'Dr. Martinez is a psychiatrist who treats a wide range of mental health conditions. He believes in a collaborative approach that combines medication management with therapy when appropriate.'
  },
  {
    id: '8',
    name: 'Dr. Patricia Lee',
    specialization: 'Gynecology',
    address: '765 Women\'s Health Ctr, New York, NY 10008',
    phone: '(212) 555-0123',
    hours: 'Mon-Fri: 8AM-5PM',
    rating: 4.8,
    reviewCount: 143,
    imageUrl: null,
    latitude: 40.7389,
    longitude: -73.9978,
    about: 'Dr. Lee is an experienced gynecologist providing comprehensive women\'s health services. She specializes in preventive care, family planning, and menopause management.'
  }
];

// Get all providers
const getProviders = async () => {
  // Simulate API call
  await delay(800);
  
  return [...mockProviders];
};

// Get provider by ID
const getProviderById = async (id) => {
  // Simulate API call
  await delay(500);
  
  const provider = mockProviders.find(p => p.id === id);
  
  if (!provider) {
    throw new Error('Provider not found');
  }
  
  return provider;
};

// Search providers
const searchProviders = async (query = '', specialty = '') => {
  // Simulate API call
  await delay(800);
  
  let results = [...mockProviders];
  
  // Filter by search query
  if (query) {
    const searchLower = query.toLowerCase();
    results = results.filter(provider => 
      provider.name.toLowerCase().includes(searchLower) ||
      provider.specialization.toLowerCase().includes(searchLower) ||
      (provider.address && provider.address.toLowerCase().includes(searchLower))
    );
  }
  
  // Filter by specialty
  if (specialty) {
    results = results.filter(provider => 
      provider.specialization.toLowerCase().includes(specialty.toLowerCase())
    );
  }
  
  return results;
};

// Get providers by location
const getProvidersByLocation = async (latitude, longitude, radius = 10) => {
  // Simulate API call
  await delay(800);
  
  // In a real app, this would use a geospatial query
  // For mock data, we'll just return all providers
  return [...mockProviders];
};

// Get provider availability for a given date
const getProviderAvailability = async (providerId, date) => {
  // Simulate API call
  await delay(600);
  
  // Check if provider exists
  const provider = mockProviders.find(p => p.id === providerId);
  if (!provider) {
    throw new Error('Provider not found');
  }
  
  // Generate random availability time slots
  const availableSlots = [];
  const workingHours = [9, 10, 11, 13, 14, 15, 16];
  
  workingHours.forEach(hour => {
    // Randomly make some slots unavailable
    if (Math.random() > 0.3) {
      availableSlots.push({
        startTime: `${hour}:00`,
        endTime: `${hour}:30`
      });
    }
    
    if (Math.random() > 0.3) {
      availableSlots.push({
        startTime: `${hour}:30`,
        endTime: `${hour + 1}:00`
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
  getProviderAvailability
};