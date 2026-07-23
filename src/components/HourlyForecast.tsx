/**
 * Presentational component for a single day's hourly forecast.
 */
import WindDirectionArrow from './WindDirectionArrow';
import { useUnitGroup } from '../hooks/useUnitGroup';
import { formatTemp, formatWindSpeed } from '../utils/units';
import { formatHourLabel, formatPrecipCompact } from '../utils/forecastFormatter';
import { getFallbackWeatherIconSrc, getWeatherIconSrc } from '../utils/weatherIcon';
import type { HourlyWeather } from '../types/weather';

type HourlyForecastProps = {
  hours?: HourlyWeather[];
};

export default function HourlyForecast({ hours }: HourlyForecastProps) {
  const { unitGroup } = useUnitGroup();

  if (!hours?.length) return null;

  return (
    <details className="hourly-forecast">
      <summary>Hourly forecast</summary>
      <div className="hourly-forecast__scroll" role="list" aria-label="Hourly forecast">
        {hours.map((hour) => (
          <div className="hourly-forecast__hour" role="listitem" key={hour.datetime}>
            <span className="hourly-forecast__time">{formatHourLabel(hour.datetime)}</span>

            <img
              className="hourly-forecast__icon"
              src={getWeatherIconSrc(hour.icon)}
              alt={hour.conditions}
              onError={(e) => {
                e.currentTarget.src = getFallbackWeatherIconSrc();
              }}
            />

            <span className="hourly-forecast__temp">{formatTemp(hour.temp, unitGroup)}</span>

            <div className="hourly-forecast__wind">
              <WindDirectionArrow degrees={hour.winddir} className="hourly-forecast__wind-arrow" />
              <span>{formatWindSpeed(hour.windspeed, unitGroup)}</span>
            </div>

            {formatPrecipCompact(hour, unitGroup) && (
              <span className="hourly-forecast__precip">
                {formatPrecipCompact(hour, unitGroup)}
              </span>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
