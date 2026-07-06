/**
 * Presentational component for rendering weather details and a refresh control.
 */

import { displayTemp } from '../utils/temperature';
import type { WeatherCard } from '../types/weather';

type WeatherDisplayProps = {
  card: WeatherCard;
  onRefresh: (id: string) => void;
  onRemove: (id: string) => void;
};

/**
 * Renders weather details and a refresh and remove controls.
 *
 * @param props - Component props.
 * @param props.data - Weather data returned from the API.
 * @param props.onRefresh - Callback invoked when the user clicks Refresh.
 * @param props.onRemove - Callback invoked with the card id when Remove is clicked.
 * @returns The weather card UI.
 */
export default function WeatherDisplay({ card, onRefresh, onRemove }: WeatherDisplayProps) {
  const { id, query, location, data, isLoading, error } = card;
  const locationLabel = location?.displayName ?? query;

  return (
    <div className="weather-display">
      <div className="card-actions">
        <button
          type="button"
          className="refresh-btn"
          onClick={() => onRefresh(id)}
          disabled={isLoading}
        >
          {isLoading && data ? 'Refreshing...' : 'Refresh'}
        </button>
        <button
          type="button"
          className="remove-btn"
          onClick={() => onRemove(id)}
          aria-label={`Remove ${locationLabel}`}
        >
          x
        </button>
      </div>

      {location && (
        <div className="location">
          <h3>Location:</h3>
          <span>{location.displayName}</span>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {isLoading && !data && <p>Loading weather for {locationLabel}...</p>}

      {data && (
        <>
          <div className="description">
            <h3>Description:</h3>
            <span>{data.description}</span>
          </div>
          <div className="temperature">
            <h3>Temperature:</h3>
            <span>{displayTemp(data.currentConditions.temp)}</span>
          </div>
          <div className="feels-like">
            <h3>Feels Like:</h3>
            <span>{displayTemp(data.currentConditions.feelslike)}</span>
          </div>
          <div className="humidity">
            <h3>Humidity:</h3>
            <span>{data.currentConditions.humidity}%</span>
          </div>
        </>
      )}
    </div>
  );
}
