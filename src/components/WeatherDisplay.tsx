/**
 * Presentational component for rendering fetched weather details.
 */

import { displayTemp } from '../utils/temperature';
import type { WeatherData } from '../types/weather';

type WeatherDisplayProps = {
  data: WeatherData;
};

/**
 * Renders the city, temperature, feels-like, and humidity values.
 *
 * @param props - Component props.
 * @param props.data - Weather data returned from the API.
 * @returns The weather details panel.
 */
export default function WeatherDisplay({ data }: WeatherDisplayProps) {

  return (
    <div className="weather-display">
      <div className="city">
        <h3>City Name:</h3>
        <span>{data.resolvedAddress}</span>
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