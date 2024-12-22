import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Search, Cloud, Droplets, Wind, Thermometer, MapPin, Star, StarOff, AlertTriangle, Map, Lightbulb } from 'lucide-react';
import WeatherMap from './components/WeatherMap';
import WeatherChart from './components/WeatherChart';
import LocationSearch from './components/LocationSearch';
import { getWeatherRecommendations } from './utils/weatherRecommendations';
import useWeatherNotifications from './hooks/useWeatherNotifications';
import './styles/map.css';
import WeatherRadar from './components/advanced/WeatherRadar';
import WeatherComparison from './components/advanced/WeatherComparison';
import WeatherTimeline from './components/advanced/WeatherTimeline';
import ActivitySuggestions from './components/advanced/ActivitySuggestions';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherSidebar from './components/WeatherSidebar';
import { useDarkMode } from './contexts/DarkModeContext';
import { usePersistentState } from './hooks/usePersistentState';
import { LoadingState } from './components/LoadingState';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "a8e71c9932b20c4ceb0aed183e6a83bb";

// Utility function to get weather icon URL
const getWeatherIconUrl = (iconCode) => {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Utility function to convert temperature
const convertTemp = (temp, unit) => {
  if (unit === 'C') {
    return Math.round((temp - 32) * 5/9);
  }
  return Math.round(temp);
};

const getWeatherData = async (city) => {
  const URL = "https://api.openweathermap.org/data/2.5/weather";
  const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
  const response = await fetch(FULL_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getForecastData = async (city) => {
  const URL = "https://api.openweathermap.org/data/2.5/forecast";
  const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
  const response = await fetch(FULL_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

function App() {
  const [city, setCity] = usePersistentState('lastSearchedCity', '');
  const [weatherData, setWeatherData] = usePersistentState('weatherData', null);
  const [forecastData, setForecastData] = usePersistentState('forecastData', null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = usePersistentState('temperatureUnit', 'F'); // F or C
  const [favorites, setFavorites] = usePersistentState('favoriteCities', []);
  const [alerts, setAlerts] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [comparisonCities, setComparisonCities] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [selectedLocation, setSelectedLocation] = usePersistentState('selectedLocation', null);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [activeView, setActiveView] = usePersistentState('activeView', 'current');
  const { currentTheme, themes, isDarkMode } = useDarkMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();

  // Add refs for each section
  const sectionRefs = {
    current: useRef(null),
    forecast: useRef(null),
    map: useRef(null),
    charts: useRef(null),
    radar: useRef(null),
    recommendations: useRef(null),
    activities: useRef(null),
    alerts: useRef(null),
    'air-quality': useRef(null)
  };

  // Effect to save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoritesCities', JSON.stringify(favorites));
  }, [favorites]);

  // Effect to get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const URL = "https://api.openweathermap.org/data/2.5/weather";
            const FULL_URL = `${URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`;
            const response = await fetch(FULL_URL);
            const data = await response.json();
            setWeatherData(data);
            setCity(data.name);
            // Get forecast data for the location
            const forecastResponse = await getForecastData(data.name);
            setForecastData(forecastResponse);
          } catch (error) {
            setError('Error getting location weather');
          }
        },
        () => {
          setError('Location access denied. Please search for a city.');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (weatherData) {
      // Get air quality data
      const fetchAirQuality = async () => {
        try {
          const response = await fetch(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch air quality data');
          }
          
          const data = await response.json();
          setAirQuality(data);
        } catch (error) {
          console.error('Error fetching air quality:', error);
          setAirQuality(null);
        }
      };

      // Get historical data
      const fetchHistorical = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}&units=imperial`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch historical data');
          }
          
          const data = await response.json();
          // Process the forecast data to use as historical
          const processedData = data.list.map(item => ({
            dt: item.dt,
            temp: item.main.temp,
            humidity: item.main.humidity,
            wind_speed: item.wind.speed,
            weather: item.weather[0]
          }));
          
          setHistoricalData(processedData);
        } catch (error) {
          console.error('Error fetching historical data:', error);
          setHistoricalData(null);
        }
      };

      try {
        fetchAirQuality();
        fetchHistorical();
        const recs = getWeatherRecommendations(weatherData);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error getting recommendations:', error);
        setRecommendations([]);
      }
    }
  }, [weatherData]);

  useEffect(() => {
    if (weatherData) {
      // Fetch nearby cities for comparison
      const fetchNearbyCities = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/find?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&cnt=3&appid=${API_KEY}&units=imperial`
          );
          const data = await response.json();
          setComparisonCities(data.list);
        } catch (error) {
          console.error('Error fetching nearby cities:', error);
        }
      };

      // Fetch hourly forecast
      const fetchHourlyForecast = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}&units=imperial`
          );
          const data = await response.json();
          setHourlyForecast(data.list.slice(0, 24));
        } catch (error) {
          console.error('Error fetching hourly forecast:', error);
        }
      };

      fetchNearbyCities();
      fetchHourlyForecast();
    }
  }, [weatherData]);

  const { checkSevereConditions } = useWeatherNotifications(weatherData, alerts);

  const searchCity = async () => {
    if (!city) return;
    
    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
      );

      if (!weatherResponse.ok) {
        throw new Error(
          weatherResponse.status === 404 
            ? 'City not found. Please check the spelling and try again.' 
            : 'Failed to fetch weather data. Please try again.'
        );
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);

      // Fetch forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
      
      // Store last successful fetch time
      localStorage.setItem('lastDataFetch', new Date().toISOString());
      
      setError(null);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchCity();
    }
  };

  const clearData = () => {
    setCity('');
    setWeatherData(null);
    setForecastData(null);
    setError(null);
    setAlerts([]);
  };

  const toggleFavorite = (cityName) => {
    if (favorites.includes(cityName)) {
      setFavorites(favorites.filter(city => city !== cityName));
    } else {
      setFavorites([...favorites, cityName]);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'F' ? 'C' : 'F');
  };

  // Function to format forecast date
  const formatForecastDate = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  useEffect(() => {
    if (weatherData?.coord) {
      setSelectedLocation({
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      });
    }
  }, [weatherData]);

  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Handle map view
    if (view === 'map') {
      setShowMap(true);
    } else if (showMap && view !== 'map') {
      setShowMap(false);
    }

    // Scroll to section in desktop view
    if (!isMobile && sectionRefs[view]?.current) {
      sectionRefs[view].current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className={`min-h-screen theme-transition bg-gradient-to-br 
      ${isDarkMode ? themes[currentTheme].dark : themes[currentTheme].light} p-4`}>
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block sticky top-4 h-fit">
          <WeatherSidebar 
            activeView={activeView}
            onViewChange={handleViewChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-blue-900">
                Weather Forecast
              </CardTitle>
              <p className="text-sm text-center text-gray-500">
                Enter a city name to get the current weather
              </p>
            </CardHeader>
            <CardContent>
              {/* Mobile Navigation */}
              <div className="lg:hidden mb-6 overflow-x-auto">
                <div className="flex gap-2 pb-2 whitespace-nowrap">
                  {[
                    { id: 'current', label: 'Current' },
                    { id: 'forecast', label: 'Forecast' },
                    { id: 'map', label: 'Map' },
                    { id: 'charts', label: 'Charts' },
                    { id: 'radar', label: 'Radar' },
                    { id: 'recommendations', label: 'Tips' },
                    { id: 'activities', label: 'Activities' },
                    { id: 'alerts', label: 'Alerts' },
                    { id: 'air-quality', label: 'Air Quality' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleViewChange(item.id)}
                      className={`px-4 py-2 rounded-full text-sm
                        ${activeView === item.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Section - Always visible */}
              <div className="space-y-4 mb-6">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    className="pl-10 w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={searchCity}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                  <button
                    onClick={clearData}
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Clear
                  </button>
                  <button
                    onClick={toggleUnit}
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    °{unit}
                  </button>
                </div>

                {/* Favorites List */}
                {favorites.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {favorites.map((favCity) => (
                      <button
                        key={favCity}
                        onClick={() => {
                          setCity(favCity);
                          searchCity();
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {favCity}
                      </button>
                    ))}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Weather Content */}
              {weatherData && (
                <div className="space-y-6 relative">
                  {isRefreshing && (
                    <div className="absolute top-0 right-0 m-4">
                      <LoadingState />
                    </div>
                  )}
                  {/* Current Weather - Always visible when data is available */}
                  <div ref={sectionRefs.current}>
                    {(activeView === 'current' || activeView === 'all') && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">
                              {weatherData.name}
                            </h2>
                            <button onClick={() => toggleFavorite(weatherData.name)} className="ml-2">
                              {favorites.includes(weatherData.name) ? (
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Weather Icon and Current Conditions */}
                        <div className="flex justify-center">
                          <img
                            src={getWeatherIconUrl(weatherData.weather[0].icon)}
                            alt={weatherData.weather[0].description}
                            className="w-20 h-20"
                          />
                        </div>

                        {/* Weather Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-blue-50">
                            <div className="flex items-center space-x-2">
                              <Thermometer className="h-5 w-5 text-blue-600" />
                              <span className="text-sm font-medium text-gray-600">Temperature</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                              {unit === 'F' ? 
                                `${Math.round(weatherData.main.temp)}°F` : 
                                `${convertTemp(weatherData.main.temp, 'C')}°C`}
                            </p>
                          </div>
                          {/* ... other weather grid items ... */}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* In mobile, show sections based on activeView or show all in desktop */}
                  <div className="lg:block">
                    <div ref={sectionRefs.forecast}>
                      {(activeView === 'forecast' || !isMobile) && forecastData && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">5-Day Forecast</h3>
                          <div className="grid grid-cols-5 gap-2">
                            {forecastData.list
                              .filter((item, index) => index % 8 === 0)
                              .slice(0, 5)
                              .map((item, index) => (
                                <div key={index} className="p-2 text-center">
                                  <p className="text-xs text-gray-500">{formatForecastDate(item.dt_txt)}</p>
                                  <img
                                    src={getWeatherIconUrl(item.weather[0].icon)}
                                    alt={item.weather[0].description}
                                    className="w-8 h-8 mx-auto"
                                  />
                                  <p className="text-sm font-medium">
                                    {unit === 'F' ? 
                                      `${Math.round(item.main.temp)}°F` : 
                                      `${convertTemp(item.main.temp, 'C')}°C`}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div ref={sectionRefs.map}>
                      {(activeView === 'map' || !isMobile) && (
                        <WeatherMap
                          lat={selectedLocation?.lat ?? weatherData.coord.lat}
                          lon={selectedLocation?.lon ?? weatherData.coord.lon}
                          weatherData={weatherData}
                          nearbyLocations={nearbyLocations}
                          onLocationClick={handleLocationClick}
                        />
                      )}
                    </div>

                    <div ref={sectionRefs.charts}>
                      {(activeView === 'charts' || !isMobile) && historicalData && (
                        <WeatherChart 
                          historicalData={historicalData}
                          hourlyForecast={hourlyForecast}
                          unit={unit}
                        />
                      )}
                    </div>

                    {/* Weather Radar Section */}
                    <div ref={sectionRefs.radar}>
                      {(activeView === 'radar' || !isMobile) && (
                        <WeatherRadar weatherData={weatherData} />
                      )}
                    </div>

                    {/* Alerts Section */}
                    <div ref={sectionRefs.alerts}>
                      {(activeView === 'alerts' || !isMobile) && (
                        <WeatherAlerts 
                          alerts={alerts}
                          conditions={checkSevereConditions(weatherData)}
                        />
                      )}
                    </div>

                    {/* Activities Section */}
                    <div ref={sectionRefs.activities}>
                      {(activeView === 'activities' || !isMobile) && (
                        <ActivitySuggestions weather={weatherData} />
                      )}
                    </div>

                    {/* Air Quality Section */}
                    <div ref={sectionRefs['air-quality']}>
                      {(activeView === 'air-quality' || !isMobile) && airQuality && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Air Quality</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">AQI Level</p>
                              <p className="text-xl font-bold">
                                {airQuality.list[0].main.aqi}/5
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Quality</p>
                              <p className="text-xl font-bold">
                                {['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][airQuality.list[0].main.aqi - 1]}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommendations Section */}
                    <div ref={sectionRefs.recommendations}>
                      {(activeView === 'recommendations' || !isMobile) && recommendations.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Weather Recommendations</h3>
                          </div>
                          <div className="space-y-3">
                            {recommendations.map((recommendation, index) => (
                              <div 
                                key={index}
                                className="p-3 bg-white rounded-lg shadow-sm border border-blue-100"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <p className="text-gray-700">{recommendation}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App; 