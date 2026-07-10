/**
 * Presentational component for a single day's forecast fields.
 */

import { formatTemp } from '../utils/units';
import { formatPrecipType } from '../utils/forecastFormatter';
import { getFallbackWeatherIconSrc, getWeatherIconSrc } from '../utils/weatherIcon';
import { useUnitGroup } from '../hooks/useUnitGroup';
import type { DailyWeather } from '../types/weather';

type DayWeatherPanelProps = {
  day: DailyWeather;
  isActive: boolean; // Used for aria currently, reserved for lazy-mounting heavy content (like maps) later
};

export default function DayWeatherPanel({ day, isActive }: DayWeatherPanelProps) {
  const { unitGroup } = useUnitGroup();

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
        <span>{formatTemp(day.temp, unitGroup)} (Max: {formatTemp(day.tempmax, unitGroup)} / Min: {formatTemp(day.tempmin, unitGroup)})</span>
      </div>

      <div className="feels-like">
        <h3>Feels like:</h3>
        <span>{formatTemp(day.feelslike, unitGroup)} (Max: {formatTemp(day.feelslikemax, unitGroup)} / Min: {formatTemp(day.feelslikemin, unitGroup)})</span>
      </div>

      <div className="precipitation">
        <h3>Precipitation Type:</h3>
        <span>{formatPrecipType(day.preciptype)}</span>
      </div>

      <div className="humidity">
        <h3>Humidity:</h3>
        <span>{day.humidity}%</span>
      </div>

      <div className="cloud-cover">
        <h3>Cloud Cover:</h3>
        <span>{day.cloudcover}%</span>
      </div>
    </div>
  );
}
