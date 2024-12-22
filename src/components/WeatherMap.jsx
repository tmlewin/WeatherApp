import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Thermometer, Wind, Droplets } from 'lucide-react';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: '/marker-icon-custom.png', // Add this icon to your public folder
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

function MapUpdater({ lat, lon, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lon], zoom);
  }, [lat, lon, zoom, map]);
  
  return null;
}

const WeatherMap = ({ 
  lat, 
  lon, 
  weatherData,
  nearbyLocations = [], // Array of nearby cities with weather data
  onLocationClick 
}) => {
  const [activeBasemap, setActiveBasemap] = useState('standard');
  const [showWeatherLayer, setShowWeatherLayer] = useState(true);
  
  // Add validation for coordinates
  const validLat = lat ?? weatherData?.coord?.lat ?? 0;
  const validLon = lon ?? weatherData?.coord?.lon ?? 0;
  
  if (typeof window === 'undefined') return null; // SSR fix

  // If we don't have valid coordinates, show a message
  if (!validLat || !validLon) {
    return (
      <div className="p-4 text-center bg-gray-100 rounded-lg">
        <p>Map location not available</p>
      </div>
    );
  }

  // Calculate temperature color
  const getTemperatureColor = (temp) => {
    if (temp <= 32) return '#00ffff';
    if (temp <= 50) return '#00ff00';
    if (temp <= 70) return '#ffff00';
    if (temp <= 85) return '#ff9900';
    return '#ff0000';
  };

  return (
    <div className="relative">
      <MapContainer 
        center={[validLat, validLon]} 
        zoom={10} 
        style={{ height: '400px', width: '100%', borderRadius: '0.75rem' }}
        className="mt-4 shadow-lg"
      >
        <LayersControl position="topright">
          {/* Base Maps */}
          <LayersControl.BaseLayer 
            checked={activeBasemap === 'standard'} 
            name="Standard"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer 
            checked={activeBasemap === 'satellite'} 
            name="Satellite"
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri'
            />
          </LayersControl.BaseLayer>

          {/* Weather Overlay */}
          <LayersControl.Overlay 
            checked={showWeatherLayer} 
            name="Weather Layer"
          >
            <TileLayer
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.REACT_APP_WEATHER_API_KEY}`}
              attribution='&copy; OpenWeather'
              opacity={0.5}
            />
          </LayersControl.Overlay>
        </LayersControl>

        {/* Main Location Marker */}
        <Marker 
          position={[validLat, validLon]} 
          icon={customIcon}
          eventHandlers={{
            click: () => onLocationClick?.({ lat: validLat, lon: validLon })
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold mb-2">{weatherData?.name}</h3>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                <span>{Math.round(weatherData?.main?.temp)}°F</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                <span>{Math.round(weatherData?.wind?.speed)} mph</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                <span>{weatherData?.main?.humidity}%</span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Temperature Range Circle */}
        {weatherData && (
          <Circle
            center={[validLat, validLon]}
            radius={5000}
            pathOptions={{
              color: getTemperatureColor(weatherData.main.temp),
              fillColor: getTemperatureColor(weatherData.main.temp),
              fillOpacity: 0.2
            }}
          />
        )}

        {/* Nearby Locations */}
        {nearbyLocations.map((location) => (
          <Marker
            key={`${location.lat}-${location.lon}`}
            position={[location.lat, location.lon]}
            eventHandlers={{
              click: () => onLocationClick?.(location)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{location.name}</h3>
                {location.weather && (
                  <div className="text-sm">
                    <div>{Math.round(location.weather.main.temp)}°F</div>
                    <div>{location.weather.weather[0].description}</div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapUpdater lat={validLat} lon={validLon} zoom={10} />
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 z-[1000]">
        <button
          onClick={() => setShowWeatherLayer(!showWeatherLayer)}
          className={`px-3 py-1 rounded ${
            showWeatherLayer ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Weather Layer
        </button>
      </div>
    </div>
  );
};

export default WeatherMap; 