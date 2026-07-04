/**
 * Root React component for the Weather App.
 *
 * Manages weather cards state (up to 3), handles search and refresh, and renders the form and results.
 */

import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import { fetchWeatherByCity } from './api/weatherClient';
import type { WeatherCard } from './types/weather';

/**
 * Renders the Weather App page and coordinates weather card state with child components.
 *
 * @returns The full application UI.
 */
export default function App() {
  const MAX_CITIES = 3;
  const [cards, setCards] = useState<WeatherCard[]>([]);

  /**
   * Fetches weather for a card and updates only the matching card by id.
   */
  async function fetchWeatherForCard(id: string, query: string) {
    try {
      const data = await fetchWeatherByCity(query);
      setCards((prev) => {
        if (!prev.some((c) => c.id === id)) return prev;
        return prev.map((c) => (c.id === id ? { ...c, data, isLoading: false, error: null } : c));
      });
    } catch (error) {
      console.error('Weather search failed:', error);
      const message = error instanceof Error ? error.message : 'Weather request failed';
      setCards((prev) => {
        if (!prev.some((c) => c.id === id)) return prev;
        return prev.map((c) => (c.id === id ? { ...c, isLoading: false, error: message } : c));
      });
    }
  }

  /**
   * Creates a new weather card for the given city and starts a fetch, up to a maximum of 3 cities.
   *
   * @param city - The city name entered by the user.
   */
  async function handleSearch(city: string) {
    if (cards.length >= MAX_CITIES) return;

    const newCard: WeatherCard = {
      id: crypto.randomUUID(),
      query: city,
      data: null,
      isLoading: true,
      error: null,
    };

    setCards((prev) => [...prev, newCard]);
    fetchWeatherForCard(newCard.id, city);
  }

  /**
   * Re-fetches weather for the card using its stored query.
   */
  function handleRefresh(id: string) {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isLoading: true, error: null } : c)));

    fetchWeatherForCard(id, card.query);
  }

  /**
   * Removes the weather card with the given id from the list.
   */
  function handleRemove(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <header>
        <h1>Weather App</h1>
        <ThemeToggle />
      </header>

      <div className="content">
        <WeatherForm onSearch={handleSearch} isAtLimit={cards.length >= MAX_CITIES} />

        <div className="weather-cards">
          {cards.map((card) => (
            <WeatherDisplay
              key={card.id}
              card={card}
              onRefresh={handleRefresh}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
    </>
  );
}
