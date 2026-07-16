/**
 * Presentational component for a single day's forecast fields.
 */
import WindDirectionArrow from './WindDirectionArrow';
import HourlyForecast from './HourlyForecast';
import AdviceQuestionMenu from './AdviceQuestionMenu';
import { formatTemp, formatPrecip, formatSnow, formatWindSpeed } from '../utils/units';
import { formatPrecipType, formatWindDir, formatDayLabel } from '../utils/forecastFormatter';
import { getFallbackWeatherIconSrc, getWeatherIconSrc } from '../utils/weatherIcon';
import { useUnitGroup } from '../hooks/useUnitGroup';
import type { DailyWeather } from '../types/weather';

const DAY_PRESETS = [
  'What should I wear this day?',
  'Is this a good day for outdoor plans?',
  'Do I need an umbrella this day?',
  'Will it feel hot or cold this day?',
  'Anything I should watch for this day?',
] as const;

type DayWeatherPanelProps = {
  day: DailyWeather;
  dayIndex: number;
  isActive: boolean; // Used for aria currently, reserved for lazy-mounting heavy content (like maps) later
  onAskDay?: (question: string) => void;
  disabled?: boolean;
};

export default function DayWeatherPanel({
  day,
  dayIndex,
  isActive,
  onAskDay,
  disabled = false,
}: DayWeatherPanelProps) {
  const { unitGroup } = useUnitGroup();
  const dayLabel = formatDayLabel(dayIndex, day.datetime);

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

      {isActive && onAskDay ? (
        <AdviceQuestionMenu
          scopeName={dayLabel}
          presets={DAY_PRESETS}
          onAsk={onAskDay}
          disabled={disabled}
          placeholder={`Ask about ${dayLabel}...`}
        />
      ) : null}

      <div className="conditions">
        <h3>Conditions:</h3>
        <span>{day.conditions}</span>
      </div>

      <div className="temperature">
        <h3>Temperature:</h3>
        <span>
          {formatTemp(day.temp, unitGroup)} (Max: {formatTemp(day.tempmax, unitGroup)} / Min:{' '}
          {formatTemp(day.tempmin, unitGroup)})
        </span>
      </div>

      <div className="feels-like">
        <h3>Feels like:</h3>
        <span>
          {formatTemp(day.feelslike, unitGroup)} (Max: {formatTemp(day.feelslikemax, unitGroup)} /
          Min: {formatTemp(day.feelslikemin, unitGroup)})
        </span>
      </div>

      <div className="precipitation">
        <h3>Precipitation Type and Probability:</h3>
        <span>
          {formatPrecipType(day.preciptype)} ({day.precipprob}%)
        </span>
      </div>

      {day.precip > 0 && (
        <div className="precipitation-amount">
          <h3>Precipitation Amount:</h3>
          <span>{formatPrecip(day.precip, unitGroup)}</span>
        </div>
      )}

      {day.precipcover > 0 && (
        <div className="precipitation-cover">
          <h3>Proportion of Day it May Precipitate:</h3>
          <span>{day.precipcover}%</span>
        </div>
      )}

      {day.snow > 0 && (
        <div className="snow-today">
          <h3>Snowfall:</h3>
          <span>{formatSnow(day.snow, unitGroup)}</span>
        </div>
      )}

      {day.snowdepth > 0 && (
        <div className="snow-depth">
          <h3>Snow on Ground:</h3>
          <span>{formatSnow(day.snowdepth, unitGroup)}</span>
        </div>
      )}

      <div className="wind-info">
        <h3>Wind Speed & Direction</h3>
        <div className="wind-info__content">
          <WindDirectionArrow degrees={day.winddir} className="wind-direction-arrow" />
          <span>
            {formatWindSpeed(day.windspeed, unitGroup)} {formatWindDir(day.winddir)}
          </span>
        </div>
      </div>

      <div className="humidity">
        <h3>Humidity:</h3>
        <span>{day.humidity}%</span>
      </div>

      <div className="cloud-cover">
        <h3>Cloud Cover:</h3>
        <span>{day.cloudcover}%</span>
      </div>

      <HourlyForecast hours={day.hours} />
    </div>
  );
}
