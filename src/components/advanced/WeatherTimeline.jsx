import React from 'react';
import { Card } from '../ui/card';
import { Line } from 'react-chartjs-2';

const WeatherTimeline = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <Card className="mt-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">24-Hour Timeline</h3>
          <p className="text-gray-600">No timeline data available</p>
        </div>
      </Card>
    );
  }

  const data = {
    labels: hourlyData.map(data => 
      new Date(data.dt_txt).toLocaleTimeString([], { hour: '2-digit', hour12: true })
    ),
    datasets: [
      {
        label: 'Temperature (°F)',
        data: hourlyData.map(data => data.main.temp),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '24-Hour Temperature Forecast'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: value => `${value}°F`
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    }
  };

  return (
    <Card className="mt-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">24-Hour Timeline</h3>
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      </div>
    </Card>
  );
};

export default WeatherTimeline; 