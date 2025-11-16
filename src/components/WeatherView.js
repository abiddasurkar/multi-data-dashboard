import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Navigation, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const WeatherView = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState('Pune');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      
      // Open-Meteo API (no token required) - using geocoding first
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      
      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];

      // Get weather data
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      const data = weatherResponse.data;
      
      setWeatherData({
        city: name,
        country: country,
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code
      });

      // Prepare 24-hour forecast
      const hourlyForecast = data.hourly.temperature_2m.slice(0, 24).map((temp, index) => ({
        hour: new Date(data.hourly.time[index]).getHours() + ':00',
        temperature: temp,
        precipitation: data.hourly.precipitation_probability[index]
      }));
      
      setForecastData(hourlyForecast);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
    }
  };

  const getWeatherIcon = (code) => {
    // WMO Weather interpretation codes
    if (code === 0) return <Sun className="w-16 h-16 text-yellow-500" />;
    if (code <= 3) return <Cloud className="w-16 h-16 text-gray-400" />;
    if (code <= 67) return <CloudRain className="w-16 h-16 text-blue-500" />;
    return <Cloud className="w-16 h-16 text-gray-500" />;
  };

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain showers';
    if (code <= 86) return 'Snow showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={() => fetchWeatherData(city)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a city..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Search
          </button>
        </div>
      </form>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl p-8 shadow-lg text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-4xl font-bold mb-2">{weatherData.city}, {weatherData.country}</h2>
            <p className="text-blue-100 text-lg">{getWeatherDescription(weatherData.weatherCode)}</p>
            <div className="mt-4">
              <p className="text-7xl font-bold">{Math.round(weatherData.temperature)}°C</p>
              <p className="text-xl text-blue-100 mt-2">Feels like {Math.round(weatherData.feelsLike)}°C</p>
            </div>
          </div>
          <div>
            {getWeatherIcon(weatherData.weatherCode)}
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Droplets className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.humidity}%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Wind className="w-6 h-6 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.windSpeed} km/h</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Navigation className="w-6 h-6 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Direction</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.windDirection}°</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <CloudRain className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Precipitation</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.precipitation} mm</p>
        </div>
      </div>

      {/* 24-Hour Forecast Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">24-Hour Temperature Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="hour" 
              stroke="#9ca3af"
              interval={2}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Source Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
          Weather data provided by Open-Meteo API (No API key required)
        </p>
      </div>
    </div>
  );
};

export default WeatherView;