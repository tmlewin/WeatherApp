export const getWeatherRecommendations = (weatherData) => {
  const temp = weatherData.main.temp;
  const conditions = weatherData.weather[0].main;
  const recommendations = [];

  if (temp < 32) {
    recommendations.push("Freezing conditions - wear warm layers");
  } else if (temp > 85) {
    recommendations.push("Hot conditions - stay hydrated");
  }

  if (conditions === "Rain") {
    recommendations.push("Bring an umbrella");
  } else if (conditions === "Snow") {
    recommendations.push("Snow expected - dress warmly");
  } else if (conditions === "Clear") {
    recommendations.push("Clear skies - great for outdoor activities");
  } else if (conditions === "Thunderstorm") {
    recommendations.push("Thunderstorm warning - stay indoors");
  }

  // Add UV recommendations based on time of day
  const hour = new Date().getHours();
  if (hour >= 10 && hour <= 16 && conditions === "Clear") {
    recommendations.push("High UV levels - use sunscreen");
  }

  // Wind recommendations
  if (weatherData.wind.speed > 20) {
    recommendations.push("Strong winds - be cautious outdoors");
  }

  // Humidity recommendations
  if (weatherData.main.humidity > 80) {
    recommendations.push("High humidity - stay hydrated");
  }

  return recommendations;
};

export default getWeatherRecommendations; 