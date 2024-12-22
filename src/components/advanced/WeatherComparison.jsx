import React from 'react';
import { Card } from '../ui/card';
import { Cloud, Thermometer, Wind, Droplets } from 'lucide-react';

const WeatherComparison = ({ cities }) => {
  return (
    <Card className="mt-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">City Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cities.map(city => (
            <div key={city.name} className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-lg text-gray-900">{city.name}</h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                  <span>{Math.round(city.main.temp)}°F</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Cloud className="h-4 w-4 text-gray-500" />
                  <span>{city.weather[0].main}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Wind className="h-4 w-4 text-blue-400" />
                  <span>{Math.round(city.wind.speed)} mph</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span>{city.main.humidity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeatherComparison; 