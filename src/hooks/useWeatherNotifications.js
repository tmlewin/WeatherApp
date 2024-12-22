import { useEffect, useCallback, useRef } from 'react';
import { Bell } from 'lucide-react';

const useWeatherNotifications = (weatherData, alerts = []) => {
  const notificationShownRef = useRef({});

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  const showNotification = useCallback((title, options) => {
    const notificationId = `${title}-${Date.now()}`;
    if (notificationShownRef.current[notificationId]) return;

    const notification = new Notification(title, {
      ...options,
      icon: '/weather-icon.png', // Add this icon to your public folder
      badge: '/notification-badge.png', // Add this badge to your public folder
      timestamp: Date.now()
    });

    notification.onclick = function(event) {
      event.preventDefault();
      window.focus();
      notification.close();
    };

    notificationShownRef.current[notificationId] = true;
    setTimeout(() => {
      delete notificationShownRef.current[notificationId];
    }, 3600000); // Clear after 1 hour
  }, []);

  const checkSevereConditions = useCallback((data) => {
    if (!data) return [];

    const conditions = [];
    const { main, weather, wind } = data;

    // Temperature checks
    if (main.temp >= 95) {
      conditions.push({
        type: 'extreme-heat',
        title: 'Extreme Heat Warning',
        message: `Current temperature is ${Math.round(main.temp)}°F. Stay hydrated and avoid prolonged sun exposure.`
      });
    }
    if (main.temp <= 32) {
      conditions.push({
        type: 'freezing',
        title: 'Freezing Conditions Alert',
        message: `Current temperature is ${Math.round(main.temp)}°F. Watch for ice and dress warmly.`
      });
    }

    // Wind checks
    if (wind.speed >= 20) {
      conditions.push({
        type: 'high-wind',
        title: 'High Wind Advisory',
        message: `Strong winds at ${Math.round(wind.speed)} mph. Secure loose objects outdoors.`
      });
    }

    // Severe weather conditions
    const severeConditions = ['Thunderstorm', 'Tornado', 'Hurricane', 'Snow'];
    if (weather.some(w => severeConditions.includes(w.main))) {
      conditions.push({
        type: 'severe-weather',
        title: 'Severe Weather Alert',
        message: `${weather[0].main} conditions reported. Take necessary precautions.`
      });
    }

    return conditions;
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      // Check for weather alerts
      if (alerts.length > 0) {
        alerts.forEach(alert => {
          showNotification('Weather Alert', {
            body: `${alert.event}: ${alert.description}`,
            tag: `alert-${alert.event}`,
            requireInteraction: true
          });
        });
      }

      // Check for severe conditions
      const conditions = checkSevereConditions(weatherData);
      conditions.forEach(condition => {
        showNotification(condition.title, {
          body: condition.message,
          tag: condition.type,
          requireInteraction: true
        });
      });
    };

    initializeNotifications();
  }, [weatherData, alerts, showNotification, checkSevereConditions, requestNotificationPermission]);

  // Return functions that can be used by components
  return {
    requestNotificationPermission,
    checkSevereConditions
  };
};

export default useWeatherNotifications; 