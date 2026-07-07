/**
 * Presentational component for rendering weather details and a refresh control.
 */
import { useState } from 'react';
import { formatDayLabel } from '../utils/dayLabel';
import DayWeatherPanel from './DayWeatherPanel';
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
  const days = data?.days ?? [];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  return (
    <div className="weather-display">
      <div className="card-actions">
        <button
          type="button"
          className="refresh-btn"
          onClick={() => {
            setSelectedDayIndex(0);
            onRefresh(id);
          }}
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
          {data.description && (
            <div className="description">
              <h3>Description:</h3>
              <span>{data.description}</span>
            </div>
          )}

          {days.length === 0 ? (
            <p>No forecast data available.</p>
          ) : (
            <>
              <div className="day-nav">
                <button
                  type="button"
                  className="day-nav-btn"
                  onClick={() => setSelectedDayIndex((i) => i - 1)}
                  disabled={selectedDayIndex === 0}
                  aria-label="Previous day"
                >
                  {'<'}
                </button>

                <span className="day-label">
                  {formatDayLabel(selectedDayIndex, days[selectedDayIndex].datetime)}
                </span>

                <button
                  type="button"
                  className="day-nav-btn"
                  onClick={() => setSelectedDayIndex((i) => i + 1)}
                  disabled={selectedDayIndex === days.length - 1}
                  aria-label="Next day"
                >
                  {'>'}
                </button>

                <div className="day-viewport">
                  <div
                    className="day-track"
                    style={{ '--day-index': selectedDayIndex } as React.CSSProperties}
                  >
                    {days.map((day, index) => (
                      <div className="day-slide" key={day.datetime}>
                        <DayWeatherPanel day={day} isActive={index === selectedDayIndex} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
