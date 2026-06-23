/**
 * Root React component for the Weather App.
 *
 * Manages search state, fetches weather data, and renders the form and results.
 */

import { useState } from 'react';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import { fetchWeatherByCity } from './api/weatherClient';
import type { WeatherData } from './types/weather';

/**
 * Renders the Weather App page and coordinates search state with child components.
 *
 * @returns The full application UI.
 */
export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches weather data for the given city and updates application state.
   *
   * @param city - The city name entered by the user.
   * @returns A promise that resolves when the search attempt completes.
   */
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
