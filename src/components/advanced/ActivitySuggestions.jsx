import React from 'react';
import { Card } from '../ui/card';
import { Sun, Umbrella, Wind, Cloud, Snowflake, ThermometerSun, Coffee } from 'lucide-react';

const ActivitySuggestions = ({ weather }) => {
  const getActivities = () => {
    const temp = weather.main.temp;
    const condition = weather.weather[0].main;
    const activities = [];

    // Clear weather activities
    if (condition === 'Clear') {
      if (temp > 75) {
        activities.push({
          name: 'Hot Weather Activities',
          icon: <ThermometerSun className="h-5 w-5 text-orange-500" />,
          suggestions: ['Swimming', 'Beach visit', 'Water parks', 'Ice cream break']
        });
      } else if (temp > 60) {
        activities.push({
          name: 'Outdoor Activities',
          icon: <Sun className="h-5 w-5 text-yellow-500" />,
          suggestions: ['Hiking', 'Park visit', 'Cycling', 'Outdoor dining']
        });
      }
    }

    // Rainy weather activities
    if (condition === 'Rain') {
      activities.push({
        name: 'Indoor Activities',
        icon: <Umbrella className="h-5 w-5 text-blue-500" />,
        suggestions: ['Museums', 'Indoor sports', 'Shopping', 'Movie theater']
      });
    }

    // Cloudy weather activities
    if (condition === 'Clouds') {
      activities.push({
        name: 'Mild Weather Activities',
        icon: <Cloud className="h-5 w-5 text-gray-500" />,
        suggestions: ['Photography', 'City walks', 'Sightseeing', 'Café visits']
      });
    }

    // Cold weather activities
    if (temp < 40) {
      activities.push({
        name: 'Cold Weather Activities',
        icon: <Snowflake className="h-5 w-5 text-blue-400" />,
        suggestions: ['Indoor sports', 'Hot chocolate', 'Museums', 'Movie marathon']
      });
    }

    // Default activities if no specific condition matches
    if (activities.length === 0) {
      activities.push({
        name: 'General Activities',
        icon: <Coffee className="h-5 w-5 text-brown-500" />,
        suggestions: ['Local exploration', 'Restaurant visit', 'Shopping', 'Cultural sites']
      });
    }

    return activities;
  };

  return (
    <Card className="mt-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Recommended Activities</h3>
        <div className="space-y-4">
          {getActivities().map((activity, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                {activity.icon}
                <span className="font-medium text-gray-900">{activity.name}</span>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {activity.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ActivitySuggestions; 