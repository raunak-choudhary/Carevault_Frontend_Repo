import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import styles from './MetricChart.module.css';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

const MetricChart = ({ data = [], metricType, timeRange = '7d' }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  
  // Filter data by time range
  const filterDataByTimeRange = useCallback((data, timeRange) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return data.filter(item => new Date(item.timestamp) >= startDate);
  }, []);
  
  // Get appropriate time unit based on range
  const getTimeUnit = useCallback((timeRange) => {
    switch (timeRange) {
      case '7d':
        return 'day';
      case '1m':
        return 'day';
      case '3m':
      case '6m':
        return 'week';
      case '1y':
        return 'month';
      default:
        return 'day';
    }
  }, []);
  
  // Process chart data based on metric type
  const processChartData = useCallback((data, metricType, timeRange) => {
    // Filter data based on time range
    const filteredData = filterDataByTimeRange(data, timeRange);
    
    // Sort data by date (oldest first for proper charting)
    const sortedData = [...filteredData].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // Extract dates and values based on metric type
    const dates = sortedData.map(item => new Date(item.timestamp));
    
    let datasets = [];
    let yAxisLabel = '';
    
    if (metricType === 'weight') {
      const values = sortedData.map(item => item.value);
      yAxisLabel = sortedData[0]?.unit || 'kg';
      
      datasets = [{
        label: 'Weight',
        data: values,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }];
    } else if (metricType === 'bloodPressure') {
      const systolic = sortedData.map(item => item.systolic);
      const diastolic = sortedData.map(item => item.diastolic);
      yAxisLabel = 'mmHg';
      
      datasets = [
        {
          label: 'Systolic',
          data: systolic,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Diastolic',
          data: diastolic,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 2,
          tension: 0.3
        }
      ];
    } else if (metricType === 'bloodGlucose') {
      const values = sortedData.map(item => item.value);
      yAxisLabel = sortedData[0]?.unit || 'mg/dL';
      
      datasets = [{
        label: 'Blood Glucose',
        data: values,
        borderColor: '#9C27B0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }];
    } else if (metricType === 'heartRate') {
      const values = sortedData.map(item => item.value);
      yAxisLabel = sortedData[0]?.unit || 'bpm';
      
      datasets = [{
        label: 'Heart Rate',
        data: values,
        borderColor: '#E91E63',
        backgroundColor: 'rgba(233, 30, 99, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }];
    } else if (metricType === 'sleep') {
      const values = sortedData.map(item => item.duration);
      yAxisLabel = 'hours';
      
      datasets = [{
        label: 'Sleep Duration',
        data: values,
        borderColor: '#673AB7',
        backgroundColor: 'rgba(103, 58, 183, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }];
    } else if (metricType === 'steps') {
      const values = sortedData.map(item => item.count);
      yAxisLabel = 'steps';
      
      datasets = [{
        label: 'Step Count',
        data: values,
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }];
    }
    
    const chartData = {
      labels: dates,
      datasets
    };
    
    // Chart.js options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: getTimeUnit(timeRange),
            tooltipFormat: 'PP',
            displayFormats: {
              day: 'MMM d',
              week: 'MMM d',
              month: 'MMM yyyy'
            }
          },
          title: {
            display: true,
            text: 'Date',
            color: 'rgba(0, 0, 0, 0.6)'
          }
        },
        y: {
          title: {
            display: true,
            text: yAxisLabel,
            color: 'rgba(0, 0, 0, 0.6)'
          },
          beginAtZero: false
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 10,
            padding: 10,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: function(tooltipItems) {
              return new Date(tooltipItems[0].parsed.x).toLocaleDateString(undefined, { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
            }
          }
        }
      }
    };
    
    return { data: chartData, options };
  }, [filterDataByTimeRange, getTimeUnit]);
  
  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    
    // Process data based on metric type
    const processedData = processChartData(data, metricType, timeRange);
    setChartData(processedData.data);
    setChartOptions(processedData.options);
  }, [data, metricType, timeRange, processChartData]);
  
  return (
    <div className={styles.chartContainer}>
      {chartData && chartOptions ? (
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      ) : (
        <div className={styles.noDataMessage}>
          <p>Not enough data to display chart</p>
        </div>
      )}
    </div>
  );
};

export default MetricChart;