import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Thermometer, Droplets, Wind } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeatherChart = ({ historicalData, hourlyForecast, unit = 'F' }) => {
  const [dataType, setDataType] = useState('temperature');
  const [timeRange, setTimeRange] = useState('24h');

  if (!historicalData && !hourlyForecast) {
    return <div>No weather data available</div>;
  }

  const convertTemp = (temp) => {
    return unit === 'C' ? Math.round((temp - 32) * 5/9) : Math.round(temp);
  };

  const getChartData = () => {
    let chartData = hourlyForecast || [];
    if (timeRange === '24h') {
      chartData = chartData.slice(0, 24);
    }

    const labels = chartData.map(data => 
      new Date(data.dt * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        hour12: true 
      })
    );

    const datasets = [];

    if (dataType === 'temperature') {
      datasets.push({
        label: `Temperature (°${unit})`,
        data: chartData.map(data => convertTemp(data.main.temp)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      });
      datasets.push({
        label: `Feels Like (°${unit})`,
        data: chartData.map(data => convertTemp(data.main.feels_like)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      });
    } else if (dataType === 'humidity') {
      datasets.push({
        label: 'Humidity (%)',
        data: chartData.map(data => data.main.humidity),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4
      });
    } else if (dataType === 'wind') {
      datasets.push({
        label: 'Wind Speed (mph)',
        data: chartData.map(data => data.wind.speed),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4
      });
    }

    return { labels, datasets };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: dataType === 'humidity',
        ticks: {
          callback: value => {
            if (dataType === 'temperature') return `${value}°${unit}`;
            if (dataType === 'humidity') return `${value}%`;
            if (dataType === 'wind') return `${value} mph`;
            return value;
          }
        }
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Weather Trends</CardTitle>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDataType('temperature')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              dataType === 'temperature' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Thermometer className="h-4 w-4" />
            Temperature
          </button>
          <button
            onClick={() => setDataType('humidity')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              dataType === 'humidity' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Droplets className="h-4 w-4" />
            Humidity
          </button>
          <button
            onClick={() => setDataType('wind')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              dataType === 'wind' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Wind className="h-4 w-4" />
            Wind
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeRange === '24h' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeRange('48h')}
            className={`px-3 py-1 rounded-full text-sm ${
              timeRange === '48h' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            48h
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={getChartData()} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherChart; 