const getAirQualityData = async (lat, lon) => {
  const URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(URL);
  return response.json();
}; 