import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, CloudRain, Wind, Droplets, MapPin, ThermometerSun, Globe2 } from 'lucide-react';
import axios from 'axios';

const API_KEY = '1fa9ff4126d95b8db54f3897a208e91c';
const API_URL = 'https://api.openweathermap.org/data/2.5';
const AZURE_FUNCTION_URL = 'https://weather-yatri-func.azurewebsites.net/api/weather-alert';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');

  const fetchWeather = async (searchCity: string) => {
    try {
      setLoading(true);
      setError('');
      setAlert('');
      
      if (!/^[a-zA-Z\s-]+$/.test(searchCity)) {
        throw new Error('Please enter a valid city name using only letters, spaces, and hyphens.');
      }

      const response = await axios.get(`${API_URL}/weather`, {
        params: {
          q: searchCity,
          units: 'metric',
          appid: API_KEY
        }
      });
      
      if (response.data) {
        setWeather(response.data);
        triggerWeatherAlert(searchCity, response.data.main.temp);
      } else {
        throw new Error('No weather data available for this city.');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('City not found. Please check the spelling and try again.');
        } else if (err.response?.status === 401) {
          setError('API key error. Please try again later.');
        } else if (err.response?.status === 429) {
          setError('Too many requests. Please try again in a moment.');
        } else {
          setError('Unable to fetch weather data. Please try again later.');
        }
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerWeatherAlert = async (city: string, temperature: number) => {
    try {
      const threshold = 30; // Example threshold
      const response = await axios.post(AZURE_FUNCTION_URL, {
        city,
        threshold
      });

      if (response.data) {
        setAlert(response.data.body);
      }
    } catch (err: any) {
      setError('Error triggering weather alert.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (trimmedCity) {
      fetchWeather(trimmedCity).catch((err) => {
        setError('An unexpected error occurred while fetching weather data.');
      });
    } else {
      setError('Please enter a city name.');
    }
  };

  const getWeatherIcon = (weatherCode: string) => {
    switch (weatherCode) {
      case '01d': return <Sun className="w-16 h-16 text-yellow-400" />;
      case '01n': return <Moon className="w-16 h-16 text-gray-300" />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n': return <CloudRain className="w-16 h-16 text-gray-400" />;
      case '09d':
      case '09n':
      case '10d':
      case '10n': return <CloudRain className="w-16 h-16 text-blue-400" />;
      default: return <Sun className="w-16 h-16 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0078f7] via-[#0065d1] to-[#004caa] p-4 flex flex-col items-center relative">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10"
      >
        <a 
          href="https://yatricloud.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-4xl font-bold text-white mb-2 mt-8 hover:text-sky-100 transition-colors"
        >
          Weather Yatri
        </a>
        <h2 className="text-2xl text-white/90 text-center mb-8">Good Day Yatris👋</h2>
      </motion.div>

      <motion.form 
        onSubmit={handleSearch}
        className="w-full max-w-md mb-8 z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setError('');
              setCity(e.target.value);
            }}
            placeholder="Enter city name..."
            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-50"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-red-200 mb-4 text-center max-w-md z-10"
          >
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white z-10"
          >
            Loading...
          </motion.div>
        )}

        {!weather && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto z-10"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8">
              <div className="grid grid-cols-3 gap-6">
                <motion.div 
                  className="flex flex-col items-center text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-white/10 p-3 rounded-full mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/90 text-sm">Global Cities</p>
                </motion.div>
                <motion.div 
                  className="flex flex-col items-center text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-white/10 p-3 rounded-full mb-3">
                    <ThermometerSun className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/90 text-sm">Real-time Data</p>
                </motion.div>
                <motion.div 
                  className="flex flex-col items-center text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-white/10 p-3 rounded-full mb-3">
                    <Globe2 className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/90 text-sm">Worldwide</p>
                </motion.div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm max-w-sm mx-auto">
                Enter any city name above to get instant access to accurate weather forecasts, 
                temperature, humidity, and wind conditions.
              </p>
            </div>
          </motion.div>
        )}

        {weather && !loading && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white/20 backdrop-blur-md rounded-xl p-6 w-full max-w-md z-10"
          >
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-white mb-4">{weather.name}</h2>
              <motion.div 
                className="flex justify-center mb-4"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {getWeatherIcon(weather.weather[0].icon)}
              </motion.div>
              <p className="text-5xl font-bold text-white mb-4">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-xl text-white/90 mb-6">
                {weather.weather[0].description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="flex items-center gap-2 text-white/90"
                whileHover={{ scale: 1.05 }}
              >
                <Wind className="w-5 h-5" />
                <span>{weather.wind.speed} m/s</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-white/90"
                whileHover={{ scale: 1.05 }}
              >
                <Droplets className="w-5 h-5" />
                <span>{weather.main.humidity}%</span>
              </motion.div>
            </div>

            {alert && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-yellow-200 mt-4 text-center max-w-md z-10"
              >
                {alert}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 text-white/80 text-sm z-10">
        © 2025 <a 
          href="https://yatricloud.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          YatriCloud
        </a>. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
