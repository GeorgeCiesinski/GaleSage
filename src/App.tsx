/**
 * Root React component for the Weather App.
 *
 * Manages weather cards state (up to 3), handles search and refresh, and renders the form and results.
 */

import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import LocationPicker from './components/LocationPicker';
import { searchLocations } from './api/geocodeClient';
import { fetchWeatherByCoords } from './api/weatherClient';
import type { WeatherCard } from './types/weather';
import type { LocationResult } from './types/location';

/**
 * Renders the Weather App page and coordinates weather card state with child components.
 *
 * @returns The full application UI.
 */
export default function App() {
  const MAX_CITIES = 3;
  const [cards, setCards] = useState<WeatherCard[]>([]);
  const [pendingLocations, setPendingLocations] = useState<LocationResult[]>([]);
  const [pendingQuery, setPendingQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  /**
   * Fetches weather for a card and updates only the matching card by id.
   */
  async function fetchWeatherForCard(id: string, lat: number, lon: number) {
    try {
      const data = await fetchWeatherByCoords(lat, lon);
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
   * Creates a new weather card for the given search term and starts a fetch, up to a maximum of 3 locations.
   *
   * @param searchTerm - The location name entered by the user.
   */
  async function handleSearch(searchTerm: string) {
    if (cards.length >= MAX_CITIES) return;

    setFeedbackMessage('');
    setPendingLocations([]);
    setPendingQuery('');
    setIsGeocoding(true);

    try {
      const results = await searchLocations(searchTerm);

      if (results.length === 0) {
        setFeedbackMessage('No locations found. Try a more specific search.');
        return;
      }

      if (results.length === 1) {
        addLocationCard(searchTerm, results[0]);
      } else {
        // More than 1 Result
        setPendingQuery(searchTerm);
        setPendingLocations(results);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      setFeedbackMessage('Could not look up that location.');
    } finally {
      setIsGeocoding(false);
    }
  }

  function handleLocationSelect(location: LocationResult) {
    addLocationCard(pendingQuery, location);
    setPendingLocations([]);
    setPendingQuery('');
  }

  function handleLocationCancel() {
    setPendingLocations([]);
    setPendingQuery('');
  }

  function addLocationCard(query: string, location: LocationResult) {
    const isDuplicate = cards.some((c) => c.location?.placeId === location.placeId);

    if (isDuplicate) {
      setFeedbackMessage('That location is already listed.');
      return;
    }

    const newCard: WeatherCard = {
      id: crypto.randomUUID(),
      query,
      location,
      data: null,
      isLoading: true,
      error: null,
    };

    setCards((prev) => [...prev, newCard]);
    fetchWeatherForCard(newCard.id, location.lat, location.lon);
  }

  /**
   * Re-fetches weather for the card using its stored query.
   */
  function handleRefresh(id: string) {
    const card = cards.find((c) => c.id === id);
    if (!card?.location) return;

    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isLoading: true, error: null } : c)));

    fetchWeatherForCard(id, card.location.lat, card.location.lon);
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
        <WeatherForm
          onSearch={handleSearch}
          isAtLimit={cards.length >= MAX_CITIES}
          feedbackMessage={feedbackMessage}
          isGeocoding={isGeocoding}
        />

        {pendingLocations.length > 0 && (
          <LocationPicker
            query={pendingQuery}
            locations={pendingLocations}
            onSelect={handleLocationSelect}
            onCancel={handleLocationCancel}
          />
        )}

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

        {/* Attribution for Nominatim */}
        <p className="attribution">
          Location data ©{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>{' '}
          contributors
        </p>
      </div>
    </>
  );
}
