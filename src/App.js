import React, { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is imported

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const fetchWeather = (lat, lon) => {
    setLoading(true);
    setError(null);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.weather && data.weather.length > 0) {
          setWeather(data);
        } else {
          console.error("Weather data not found", data);
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const currentDate = new Date().toLocaleString();

  return (
    <div className="bg-gray-800 flex items-center justify-center min-h-screen">
      <div className="bg-gray-700 text-white rounded-xl p-6 w-80 relative">
        <div className="absolute top-4 right-4">
          <i className="fas fa-search text-white"></i>
        </div>
        <div className="flex items-center justify-center mb-4">
          {loading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : weather ? (
            <img
              alt="Weather icon"
              className="w-16 rounded-full h-16"
              src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            />
          ) : (
            <img
              alt="Default weather icon"
              className="w-16 rounded-full h-16"
              src="https://storage.googleapis.com/a1aa/image/eLZhmmN7bqwqKqcNfyXofUcgTxACUZBkSeGLPyiYYWZK6XffE.jpg"
            />
          )}
        </div>
        {weather && (
          <>
            <div className="text-5xl font-bold mb-2">{Math.round(weather.main.temp)}°C</div>
            <div className="text-lg mb-4 flex items-center">
              <img
              
                alt="Weather condition icon"
                className="w-5 rounded-full h-5  mr-2"
                src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
              />
              {weather.weather[0].description}
            </div>
            <div className="border-t border-gray-500 pt-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {weather.name}, {weather.sys.country}
              </div>
              <div className="flex items-center">
                <i className="fas fa-calendar-alt mr-2"></i>
                {currentDate}
              </div>
            </div>
          </>
        )}
        {!weather && !loading && (
          <button onClick={getLocation} className="bg-blue-500 text-white w-64 ml-2 p-2 rounded mt-4">
            Get Current Location Weather
          </button>
        )}
      </div>
    </div>
  );
};

export default App;