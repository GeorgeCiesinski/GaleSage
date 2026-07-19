/**
 * Root React component for the Weather App.
 *
 * Manages weather cards state (up to 3), handles search and refresh, and renders the header and results.
 */

import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './components/ThemeToggle';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import LocationPicker from './components/LocationPicker';
import UnitGroupSelect from './components/UnitGroupSelect';
import { searchLocations } from './api/geocodeClient';
import { fetchWeatherByCoords } from './api/weatherClient';
import { useUnitGroup } from './hooks/useUnitGroup';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unitGroup } = useUnitGroup();

  // Skip the unitGroup effect on mount so we don't refetch before any cards exist.
  const isFirstRender = useRef(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  /**
   * Fetches weather for a card and updates only the matching card by id.
   *
   * Uses the current unitGroup from context for the API request.
   */
  async function fetchWeatherForCard(id: string, lat: number, lon: number) {
    try {
      const data = await fetchWeatherByCoords(lat, lon, unitGroup);
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

  function closeSearch(options?: { restoreFocus?: boolean }) {
    setIsSearchOpen(false);
    setPendingLocations([]);
    setPendingQuery('');
    if (options?.restoreFocus !== false) {
      // Defer so mobile CSS can hide the overlay before focusing the toggle.
      requestAnimationFrame(() => searchToggleRef.current?.focus());
    }
  }

  function closeMenu(options?: { restoreFocus?: boolean }) {
    setIsMenuOpen(false);
    if (options?.restoreFocus !== false) {
      requestAnimationFrame(() => menuToggleRef.current?.focus());
    }
  }

  function openSearch() {
    setIsMenuOpen(false);
    setIsSearchOpen(true);
  }

  function openMenu() {
    setIsSearchOpen(false);
    setPendingLocations([]);
    setPendingQuery('');
    setIsMenuOpen(true);
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
    closeSearch({ restoreFocus: true });
  }

  /**
   * Marks a card as loading and re-fetches its weather using the current unit group.
   *
   * @param card - The weather card to refresh. Skipped if it has no location.
   */
  function refetchCard(card: WeatherCard) {
    if (!card.location) return;

    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isLoading: true, error: null } : c)),
    );
    fetchWeatherForCard(card.id, card.location.lat, card.location.lon);
  }

  /**
   * Re-fetches weather for the card using its stored query.
   */
  function handleRefresh(id: string) {
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    refetchCard(card);
  }

  /**
   * Removes the weather card with the given id from the list.
   */
  function handleRemove(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  /**
   * Re-fetches every card when the user changes unit group.
   *
   * Depends only on unitGroup; cards are read from the render when the preference changes.
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    cards.forEach((card) => refetchCard(card));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when unitGroup changes, not when cards change
  }, [unitGroup]);

  // Focus the city input after the search overlay opens (mobile).
  useEffect(() => {
    if (!isSearchOpen) return;

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frameId);
  }, [isSearchOpen]);

  // Lock body scroll while a mobile overlay is open.
  useEffect(() => {
    const shouldLock = isSearchOpen || isMenuOpen;
    if (!shouldLock) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSearchOpen, isMenuOpen]);

  // Escape closes the active overlay.
  useEffect(() => {
    if (!isSearchOpen && !isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (isSearchOpen) closeSearch();
      else closeMenu();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isMenuOpen]);

  return (
    <>
      <header
        className="site-header"
        data-search-open={isSearchOpen ? 'true' : 'false'}
        data-menu-open={isMenuOpen ? 'true' : 'false'}
      >
        <div className="header-top">
          <h1 className="header-brand">Weather App</h1>
          <div className="header-top__actions">
            <button
              ref={searchToggleRef}
              type="button"
              className="search-toggle"
              aria-controls="header-search"
              aria-expanded={isSearchOpen}
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              onClick={() => (isSearchOpen ? closeSearch() : openSearch())}
            >
              <svg
                className="search-toggle__icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
            <button
              ref={menuToggleRef}
              type="button"
              className="menu-toggle"
              aria-controls="header-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => (isMenuOpen ? closeMenu() : openMenu())}
            >
              <svg
                className="menu-toggle__icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="header-search"
          className="header-search"
          role={isSearchOpen ? 'dialog' : undefined}
          aria-modal={isSearchOpen ? true : undefined}
          aria-label={isSearchOpen ? 'Search for a city' : undefined}
        >
          <div className="header-search__panel">
            <div className="header-search__toolbar">
              <p className="header-search__title">Search</p>
              <button
                type="button"
                className="header-search__close"
                aria-label="Close search"
                onClick={() => closeSearch()}
              >
                Close
              </button>
            </div>

            <WeatherForm
              onSearch={handleSearch}
              isAtLimit={cards.length >= MAX_CITIES}
              feedbackMessage={feedbackMessage}
              isGeocoding={isGeocoding}
              inputRef={searchInputRef}
            />

            <div className="header-search__dropdown">
              {pendingLocations.length > 0 && (
                <LocationPicker
                  query={pendingQuery}
                  locations={pendingLocations}
                  onSelect={handleLocationSelect}
                  onCancel={handleLocationCancel}
                />
              )}
            </div>
          </div>
        </div>

        <div
          id="header-menu"
          className="header-menu"
          role={isMenuOpen ? 'dialog' : undefined}
          aria-modal={isMenuOpen ? true : undefined}
          aria-label={isMenuOpen ? 'Settings' : undefined}
        >
          <div className="header-menu__panel">
            <div className="header-menu__toolbar">
              <p className="header-menu__title">Settings</p>
              <button
                type="button"
                className="header-menu__close"
                aria-label="Close menu"
                onClick={() => closeMenu()}
              >
                Close
              </button>
            </div>
            <div className="header-controls">
              <UnitGroupSelect />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="content">
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
