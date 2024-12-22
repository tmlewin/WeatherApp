import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "a8e71c9932b20c4ceb0aed183e6a83bb";

const WeatherRadar = ({ weatherData }) => {
  const [activeLayer, setActiveLayer] = useState('temp');
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gridDensity, setGridDensity] = useState('medium'); // 'low', 'medium', 'high'

  const layers = {
    temp: {
      name: 'Temperature',
      colors: {
        min: '#0000ff', // Very cold (blue)
        mid1: '#00ffff', // Cold (cyan)
        mid2: '#ffff00', // Warm (yellow)
        max: '#ff0000'   // Hot (red)
      },
      range: {
        min: -10,
        max: 100
      },
      unit: '°F'
    },
    wind: {
      name: 'Wind Speed',
      colors: {
        min: '#00ff00',   // Calm (green)
        mid1: '#ffff00',  // Light (yellow)
        mid2: '#ff9900',  // Moderate (orange)
        max: '#ff0000'    // Strong (red)
      },
      range: {
        min: 0,
        max: 50
      },
      unit: 'mph'
    },
    pressure: {
      name: 'Pressure',
      colors: {
        min: '#ff9900',   // Low (orange)
        mid1: '#ff0000',  // Normal-Low (red)
        mid2: '#cc00cc',  // Normal-High (purple)
        max: '#990099'    // High (dark purple)
      },
      range: {
        min: 970,
        max: 1030
      },
      unit: 'hPa'
    },
    humidity: {
      name: 'Humidity',
      colors: {
        min: '#ffcc00',   // Dry (yellow)
        mid1: '#66cc00',  // Comfortable (green)
        mid2: '#0099ff',  // Humid (light blue)
        max: '#0000ff'    // Very Humid (dark blue)
      },
      range: {
        min: 0,
        max: 100
      },
      unit: '%'
    },
    clouds: {
      name: 'Cloud Cover',
      colors: {
        min: '#ffffff',   // Clear (white)
        mid1: '#cccccc',  // Partly Cloudy (light gray)
        mid2: '#666666',  // Mostly Cloudy (dark gray)
        max: '#333333'    // Overcast (very dark gray)
      },
      range: {
        min: 0,
        max: 100
      },
      unit: '%'
    }
  };

  const gridSizes = {
    low: { size: 1.5, radius: 75000 },    // Fewer points, larger circles
    medium: { size: 1, radius: 50000 },    // Default
    high: { size: 0.5, radius: 25000 }     // More points, smaller circles
  };

  useEffect(() => {
    const fetchGridData = async () => {
      if (!weatherData?.coord) return;
      
      setLoading(true);
      try {
        const { lat, lon } = weatherData.coord;
        const { size } = gridSizes[gridDensity];
        const points = [];
        
        // Create an animated sequence of API calls
        for (let i = -3; i <= 3; i++) {
          for (let j = -3; j <= 3; j++) {
            const pointLat = lat + (i * size);
            const pointLon = lon + (j * size);
            
            // Add delay for animation effect
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${pointLat}&lon=${pointLon}&appid=${API_KEY}&units=imperial`
            );
            const data = await response.json();
            
            points.push({
              lat: pointLat,
              lon: pointLon,
              temp: data.main.temp,
              wind: data.wind.speed,
              pressure: data.main.pressure,
              humidity: data.main.humidity,
              clouds: data.clouds.all,
              timestamp: Date.now()
            });
            
            // Update state for each new point for animation
            setGridData([...points]);
          }
        }
      } catch (error) {
        console.error('Error fetching grid data:', error);
      }
      setLoading(false);
    };

    fetchGridData();
  }, [weatherData, gridDensity]);

  const getColor = (value, type) => {
    const { range, colors } = layers[type];
    const percentage = (value - range.min) / (range.max - range.min);
    
    if (percentage <= 0.33) {
      return interpolateColor(colors.min, colors.mid1, percentage * 3);
    } else if (percentage <= 0.66) {
      return interpolateColor(colors.mid1, colors.mid2, (percentage - 0.33) * 3);
    } else {
      return interpolateColor(colors.mid2, colors.max, (percentage - 0.66) * 3);
    }
  };

  const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
      const c1 = parseInt(hex, 16);
      const c2 = parseInt(color2.slice(1).match(/.{2}/g)[i], 16);
      const val = Math.round(c1 + (c2 - c1) * factor);
      return val.toString(16).padStart(2, '0');
    });
    return `#${result.join('')}`;
  };

  return (
    <Card className="mt-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Weather Radar</h3>
        
        {/* Layer Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
            {Object.entries(layers).map(([key, layer]) => (
              <button
                key={key}
                onClick={() => setActiveLayer(key)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
                  ${activeLayer === key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white hover:bg-gray-100'}`}
              >
                {layer.name}
              </button>
            ))}
          </div>
          
          {/* Grid Density Controls */}
          <div className="flex gap-1">
            {Object.keys(gridSizes).map((density) => (
              <button
                key={density}
                onClick={() => setGridDensity(density)}
                className={`px-2 py-1 rounded text-xs
                  ${gridDensity === density 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {density.charAt(0).toUpperCase() + density.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[weatherData.coord.lat, weatherData.coord.lon]}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {/* Weather Data Visualization with Animation */}
              {gridData.map((point, index) => (
                <Circle
                  key={`${point.lat}-${point.lon}-${point.timestamp}`}
                  center={[point.lat, point.lon]}
                  radius={gridSizes[gridDensity].radius}
                  pathOptions={{
                    color: getColor(point[activeLayer], activeLayer),
                    fillColor: getColor(point[activeLayer], activeLayer),
                    fillOpacity: 0.5,
                    className: 'weather-circle'
                  }}
                >
                  {/* Popup with detailed information */}
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{layers[activeLayer].name}</p>
                      <p>{point[activeLayer]} {layers[activeLayer].unit}</p>
                    </div>
                  </Popup>
                </Circle>
              ))}

              {/* Center Marker */}
              <CircleMarker
                center={[weatherData.coord.lat, weatherData.coord.lon]}
                radius={8}
                pathOptions={{
                  color: '#fff',
                  weight: 2,
                  fillColor: '#1d4ed8',
                  fillOpacity: 1
                }}
              />
            </MapContainer>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="mt-4">
          <div className="text-sm text-gray-600">
            <p>Showing {layers[activeLayer].name.toLowerCase()} radar data for {weatherData.name} and surrounding areas.</p>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-4 bg-gradient-to-r" style={{
                backgroundImage: `linear-gradient(to right, 
                  ${layers[activeLayer].colors.min}, 
                  ${layers[activeLayer].colors.mid1},
                  ${layers[activeLayer].colors.mid2},
                  ${layers[activeLayer].colors.max})`
              }}></div>
              <div className="flex justify-between text-xs text-gray-500 w-40">
                <span>{layers[activeLayer].range.min}{layers[activeLayer].unit}</span>
                <span>{layers[activeLayer].range.max}{layers[activeLayer].unit}</span>
              </div>
            </div>
            {loading && (
              <div className="text-sm text-blue-600">
                Loading weather data...
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherRadar; 