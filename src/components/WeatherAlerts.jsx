import React from 'react';
import { AlertTriangle, ThermometerSun, Wind, Cloud, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const getAlertIcon = (type) => {
  switch (type) {
    case 'extreme-heat':
      return <ThermometerSun className="h-5 w-5 text-red-500" />;
    case 'high-wind':
      return <Wind className="h-5 w-5 text-yellow-500" />;
    case 'severe-weather':
      return <Cloud className="h-5 w-5 text-purple-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
  }
};

const getAlertColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'extreme':
      return 'bg-red-50 border-red-200 text-red-700';
    case 'severe':
      return 'bg-orange-50 border-orange-200 text-orange-700';
    case 'moderate':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    default:
      return 'bg-blue-50 border-blue-200 text-blue-700';
  }
};

const WeatherAlerts = ({ alerts = [], conditions = [] }) => {
  if (alerts.length === 0 && conditions.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Official Weather Alerts */}
        {alerts.map((alert, index) => (
          <div
            key={`alert-${index}`}
            className={`p-4 rounded-lg border ${getAlertColor(alert.severity)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold">{alert.event}</h4>
                <p className="text-sm mt-1">{alert.description}</p>
                {alert.start && alert.end && (
                  <p className="text-sm mt-2 font-medium">
                    Valid: {new Date(alert.start * 1000).toLocaleString()} - {new Date(alert.end * 1000).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Condition-based Alerts */}
        {conditions.map((condition, index) => (
          <div
            key={`condition-${index}`}
            className="p-4 rounded-lg border bg-gray-50 border-gray-200 transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(condition.type)}
              <div>
                <h4 className="font-semibold">{condition.title}</h4>
                <p className="text-sm mt-1">{condition.message}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts; 