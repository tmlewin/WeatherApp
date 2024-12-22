import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, History, X } from 'lucide-react';
import { cn } from '../lib/utils';

const LocationSearch = ({ onSelect, className }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);
  const searchInputRef = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const searchLocations = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError('Unable to fetch locations. Please try again.');
      console.error('Location search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleLocationSelect = (location) => {
    // Update recent searches
    const updatedSearches = [
      { name: location.name, country: location.country, lat: location.lat, lon: location.lon },
      ...recentSearches.filter(item => 
        !(item.lat === location.lat && item.lon === location.lon)
      ).slice(0, 4)
    ];
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Clear search
    setQuery('');
    setSuggestions([]);
    
    // Notify parent component
    onSelect(location);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    searchInputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="w-full pl-9 pr-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute w-full bg-red-50 border border-red-200 rounded-lg mt-1 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute w-full bg-white border rounded-lg mt-1 p-2 text-sm text-gray-500">
          Searching...
        </div>
      )}

      {/* Suggestions Dropdown */}
      {(suggestions.length > 0 || recentSearches.length > 0) && !error && (
        <div className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg max-h-80 overflow-y-auto z-50">
          {suggestions.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1">Suggestions</div>
              {suggestions.map((location) => (
                <button
                  key={`${location.lat}-${location.lon}`}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{location.name}, {location.country}</span>
                </button>
              ))}
            </div>
          ) : recentSearches.length > 0 && !query && (
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1">Recent Searches</div>
              {recentSearches.map((location) => (
                <button
                  key={`${location.lat}-${location.lon}`}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <History className="h-4 w-4 text-gray-400" />
                  <span>{location.name}, {location.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch; 