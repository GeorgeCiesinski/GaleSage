/**
 * Presentational component for a single day's forecast fields.
 */

import { displayTemp } from '../utils/temperature';
import { getFallbackWeatherIconSrc, getWeatherIconSrc } from '../utils/weatherIcon';
import type { DailyWeather } from '../types/weather';

type DayWeatherPanelProps = {
  day: DailyWeather;
  isActive: boolean; // Used for aria currently, reserved for lazy-mounting heavy content (like maps) later
};

export default function DayWeatherPanel({ day, isActive }: DayWeatherPanelProps) {
  return (
    <div className="day-weather-panel" aria-hidden={!isActive}>
      <div className="icon-wrapper">
        <img
          className="weather-icon"
          src={getWeatherIconSrc(day.icon)}
          alt={day.conditions}
          onError={(e) => {
            e.currentTarget.src = getFallbackWeatherIconSrc();
          }}
        />
      </div>

      <div className="conditions">
        <h3>Conditions:</h3>
        <span>{day.conditions}</span>
      </div>

      <div className="temperature">
        <h3>Temperature:</h3>
        <span>{displayTemp(day.temp)}</span>
      </div>

      <div className="feels-like">
        <h3>Feels like:</h3>
        <span>{displayTemp(day.feelslike)}</span>
      </div>

      <div className="humidity">
        <h3>Humidity:</h3>
        <span>{day.humidity}%</span>
      </div>
    </div>
  );
}
