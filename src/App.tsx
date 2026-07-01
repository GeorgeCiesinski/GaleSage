/**
 * Root React component for the Weather App.
 *
 * Manages search state, fetches weather data, and renders the form and results.
 */

import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import { fetchWeatherByCity } from './api/weatherClient';
import type { WeatherData, WeatherCard } from './types/weather';

/**
 * Renders the Weather App page and coordinates search state with child components.
 *
 * @returns The full application UI.
 */
export default function App() {
  const [card, setCard] = useState<WeatherCard | null>(null);

  async function fetchWeatherForCard(id: string, query: string) {
    try {
      const data = await fetchWeatherByCity(query);
      setCard((prev) =>
        prev?.id === id
          ? { ...prev, data, isLoading: false, error: null }
          : prev,
      );
    } catch (error) {
      console.error('Weather search failed:', error);
      const message =
        error instanceof Error ? error.message : 'Weather request failed';
      setCard((prev) =>
        prev?.id === id
          ? { ...prev, isLoading: false, error: message }
          : prev,
      );
    }
  }

  /**
   * Fetches weather data for the given city and updates application state.
   *
   * @param city - The city name entered by the user.
   * @returns A promise that resolves when the search attempt completes.
   */
  async function handleSearch(city: string) {
    const newCard: WeatherCard = {
      id: crypto.randomUUID(),
      query: city,
      data: null,
      isLoading: true,
      error: null,
    };
    setCard(newCard);
    await fetchWeatherForCard(newCard.id, city);
  }

  function handleRefresh() {
    if (!card) return;
    setCard((prev) =>
      prev ? { ...prev, isLoading: true, error: null } : prev,
    );
    fetchWeatherForCard(card.id, card.query);
  }

  return (
    <>
      <header>
        <h1>Weather App</h1>
        <ThemeToggle />
      </header>

      <div className="content">
        <WeatherForm onSearch={handleSearch} isLoading={card?.isLoading ?? false} />

        {card?.error && <p className="error">{card.error}</p>}
        {card?.data && (
          <WeatherDisplay
            data={card.data}
            onRefresh={handleRefresh}
            isLoading={card.isLoading}
          />
        )}
      </div>
    </>
  );
}
