/**
 * Presentational component for rendering fetched weather details.
 */

import { displayTemp } from '../utils/temperature';
import type { WeatherData } from '../types/weather';

type WeatherDisplayProps = {
  data: WeatherData;
  onRefresh: () => void;
  isLoading: boolean;
};

/**
 * Renders the city, description, temperature, feels-like, and humidity values.
 *
 * @param props - Component props.
 * @param props.data - Weather data returned from the API.
 * @returns The weather details panel.
 */
export default function WeatherDisplay({ data, onRefresh, isLoading }: WeatherDisplayProps) {
  return (
    <div className="weather-display">
      <button
        type="button"
        className="refresh-btn"
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
      <div className="city">
        <h3>City Name:</h3>
        <span>{data.resolvedAddress}</span>
      </div>
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
    </div>
  );
}
