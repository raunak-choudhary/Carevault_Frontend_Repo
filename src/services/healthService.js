// This service would handle API calls related to health metrics
// For now, we'll use localStorage for persistence and simulate API behavior

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get health metrics from localStorage
const getHealthMetrics = async (userId) => {
  // Simulate API call
  await delay(800);
  
  // Get user from local storage if userId not provided
  if (!userId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    userId = user.id;
  }
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get metrics from localStorage or return default metrics
  const metricsJson = localStorage.getItem(`healthMetrics_${userId}`);
  
  if (metricsJson) {
    return JSON.parse(metricsJson);
  }
  
  // Return default metrics if none exist
  return {
    weight: [],
    bloodPressure: [],
    bloodGlucose: [],
    heartRate: [],
    sleep: [],
    steps: []
  };
};

// Get a specific metric type by ID
const getMetricById = async (metricType, userId) => {
  // Simulate API call
  await delay(500);
  
  // Get user from local storage if userId not provided
  if (!userId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    userId = user.id;
  }
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get metrics from localStorage
  const metrics = await getHealthMetrics(userId);
  
  if (!metrics[metricType]) {
    throw new Error(`Metric type ${metricType} not found`);
  }
  
  return {
    type: metricType,
    data: metrics[metricType]
  };
};

// Add a new metric entry
const addMetricEntry = async (metricType, entry, userId) => {
  // Simulate API call
  await delay(1000);
  
  // Get user from local storage if userId not provided
  if (!userId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    userId = user.id;
  }
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get current metrics
  const metrics = await getHealthMetrics(userId);
  
  // Ensure the metric type exists
  if (!metrics[metricType]) {
    metrics[metricType] = [];
  }
  
  // Add timestamp if not provided
  if (!entry.timestamp) {
    entry.timestamp = new Date().toISOString();
  }
  
  // Add the new entry
  metrics[metricType].push(entry);
  
  // Sort by timestamp (newest first)
  metrics[metricType].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Save to localStorage
  localStorage.setItem(`healthMetrics_${userId}`, JSON.stringify(metrics));
  
  return {
    type: metricType,
    data: metrics[metricType]
  };
};

// Get metric insights (simulated AI generation)
const getMetricInsights = async (metricType, userId) => {
  // Simulate API call
  await delay(1200);
  
  // Get user from local storage if userId not provided
  if (!userId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    userId = user.id;
  }
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get metrics
  const metrics = await getHealthMetrics(userId);
  const metricData = metrics[metricType] || [];
  
  // Generate insights based on metric type
  let insights = {
    summary: '',
    trend: '',
    recommendations: []
  };
  
  // Get the most recent readings (last 10)
  const recentReadings = metricData.slice(0, 10);
  
  // Simple insights based on metric type
  if (metricType === 'weight') {
    insights = generateWeightInsights(recentReadings);
  } else if (metricType === 'bloodPressure') {
    insights = generateBloodPressureInsights(recentReadings);
  } else if (metricType === 'bloodGlucose') {
    insights = generateBloodGlucoseInsights(recentReadings);
  } else if (metricType === 'heartRate') {
    insights = generateHeartRateInsights(recentReadings);
  } else if (metricType === 'sleep') {
    insights = generateSleepInsights(recentReadings);
  } else if (metricType === 'steps') {
    insights = generateStepsInsights(recentReadings);
  }
  
  return insights;
};

// Helper functions to generate insights
const generateWeightInsights = (readings) => {
  if (readings.length < 2) {
    return {
      summary: "Not enough weight data to generate insights.",
      trend: "Need more entries to analyze trends.",
      recommendations: [
        "Track your weight regularly, ideally at the same time each day.",
        "Stay hydrated throughout the day.",
        "Maintain a balanced diet rich in fruits and vegetables."
      ]
    };
  }
  
  // Calculate trend
  const latest = readings[0].value;
  const previous = readings[1].value;
  const difference = latest - previous;
  let trend = "Your weight has ";
  
  if (Math.abs(difference) < 0.5) {
    trend += "remained stable.";
  } else if (difference > 0) {
    trend += `increased by ${difference.toFixed(1)} ${readings[0].unit}.`;
  } else {
    trend += `decreased by ${Math.abs(difference).toFixed(1)} ${readings[0].unit}.`;
  }
  
  return {
    summary: `Your most recent weight reading was ${latest} ${readings[0].unit}.`,
    trend,
    recommendations: [
      "Maintain a consistent sleep schedule for better metabolism.",
      "Aim for 30 minutes of moderate exercise daily.",
      "Track your calorie intake to better understand weight changes."
    ]
  };
};

const generateBloodPressureInsights = (readings) => {
  if (readings.length < 2) {
    return {
      summary: "Not enough blood pressure data to generate insights.",
      trend: "Need more entries to analyze trends.",
      recommendations: [
        "Measure your blood pressure at the same time each day.",
        "Reduce sodium intake to help manage blood pressure.",
        "Practice relaxation techniques like deep breathing or meditation."
      ]
    };
  }
  
  const latest = readings[0];
  
  // Simple categorization
  let category = "normal";
  if (latest.systolic >= 140 || latest.diastolic >= 90) {
    category = "high";
  } else if (latest.systolic >= 120 || latest.diastolic >= 80) {
    category = "elevated";
  }
  
  return {
    summary: `Your most recent blood pressure reading was ${latest.systolic}/${latest.diastolic} mmHg, which is ${category}.`,
    trend: "Your blood pressure readings have been consistent.",
    recommendations: [
      "Limit alcohol consumption to help maintain healthy blood pressure.",
      "Regular exercise can help improve blood pressure levels.",
      "Reduce stress through mindfulness and relaxation techniques."
    ]
  };
};

const generateBloodGlucoseInsights = (readings) => {
  if (readings.length < 2) {
    return {
      summary: "Not enough blood glucose data to generate insights.",
      trend: "Need more entries to analyze trends.",
      recommendations: [
        "Test your blood glucose regularly as advised by your healthcare provider.",
        "Be consistent with meal timing to maintain stable blood glucose.",
        "Stay physically active to help regulate blood glucose levels."
      ]
    };
  }
  
  const latest = readings[0].value;
  
  return {
    summary: `Your most recent blood glucose reading was ${latest} ${readings[0].unit}.`,
    trend: "Your blood glucose levels have been within your target range.",
    recommendations: [
      "Include fiber-rich foods in your diet to help manage blood glucose.",
      "Stay hydrated throughout the day.",
      "Monitor your carbohydrate intake for better glucose control."
    ]
  };
};

const generateHeartRateInsights = (readings) => {
  if (readings.length < 2) {
    return {
      summary: "Not enough heart rate data to generate insights.",
      trend: "Need more entries to analyze trends.",
      recommendations: [
        "Track your resting heart rate in the morning before getting out of bed.",
        "Stay hydrated to help maintain optimal heart function.",
        "Practice deep breathing exercises for heart health."
      ]
    };
  }
  
  const latest = readings[0].value;
  
  return {
    summary: `Your most recent heart rate reading was ${latest} ${readings[0].unit}.`,
    trend: "Your heart rate readings have been within normal range.",
    recommendations: [
      "Regular cardiovascular exercise can improve heart health.",
      "Practice stress-management techniques like meditation.",
      "Limit caffeine intake, especially in the afternoon and evening."
    ]
  };
};

const generateSleepInsights = (readings) => {
  if (readings.length < 2) {
    return {
      summary: "Not enough sleep data to generate insights.",
      trend: "Need more entries to analyze trends.",
      recommendations: [
        "Aim for 7-9 hours of sleep per night.",
        "Maintain a consistent sleep schedule, even on weekends.",
        "Create a restful sleep environment by minimizing noise and light."
      ]
    };
  }
  
  const latest = readings[0].duration;
  const avgDuration = readings.reduce((sum, reading) => sum + reading.duration, 0) / readings.length;
  
  return {
    summary: `Your most recent sleep duration was ${latest} hours.`,
    trend: `You're averaging ${avgDuration.toFixed(1)} hours of sleep per night.`,
    recommendations: [
      "Avoid screens at least 1 hour before bedtime.",
      "Create a relaxing bedtime routine to signal to your body it's time to sleep.",
      "Limit caffeine and alcohol consumption, especially in the evening."
    ]
  };
};

const generateStepsInsights = (readings) => {
  if (readings.length < 2) {
    return {
      summary: "Not enough steps data to generate insights.",
      trend: "Need more entries to analyze trends.",
      recommendations: [
        "Aim for at least 10,000 steps per day.",
        "Take short walking breaks throughout the day.",
        "Park farther from destinations to increase your step count."
      ]
    };
  }
  
  const latest = readings[0].count;
  const avgSteps = readings.reduce((sum, reading) => sum + reading.count, 0) / readings.length;
  
  return {
    summary: `Your most recent step count was ${latest} steps.`,
    trend: `You're averaging ${Math.round(avgSteps)} steps per day.`,
    recommendations: [
      "Set reminders to move every hour during the day.",
      "Try to increase your daily steps by 500 each week.",
      "Use the stairs instead of elevators when possible."
    ]
  };
};

// Get recommended targets for each metric
const getMetricTargets = async () => {
  // Simulate API call
  await delay(300);
  
  return {
    weight: { min: null, max: null, unit: "kg" },
    bloodPressure: { 
      systolic: { min: 90, max: 120, unit: "mmHg" },
      diastolic: { min: 60, max: 80, unit: "mmHg" }
    },
    bloodGlucose: { 
      fasting: { min: 70, max: 100, unit: "mg/dL" },
      afterMeal: { min: null, max: 140, unit: "mg/dL" }
    },
    heartRate: { min: 60, max: 100, unit: "bpm" },
    sleep: { min: 7, max: 9, unit: "hours" },
    steps: { min: 10000, max: null, unit: "steps" }
  };
};

export {
  getHealthMetrics,
  getMetricById,
  addMetricEntry,
  getMetricInsights,
  getMetricTargets
};