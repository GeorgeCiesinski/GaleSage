import { useState } from 'react';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import { fetchWeatherByCity } from './api/weatherClient';
import type { WeatherData } from './types/weather';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(city: string) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(city);
      setWeatherData(data);
    } catch(error) {
      console.error('Weather search failed:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Weather request failed';
      setError(message);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <header>
        <h1>Weather App</h1>
      </header>

      <div className="content">
        <WeatherForm onSearch={handleSearch} isLoading={isLoading} />

        {error && <p className="error">{error}</p>}

        {weatherData && <WeatherDisplay data={weatherData} />}
      </div>
    </>
  );
}
