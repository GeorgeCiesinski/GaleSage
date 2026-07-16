/**
 * Format daily forecasts and seed text for AI advice payloads.
 */
import type { UnitGroup } from '../types/unitGroup';
import type { DailyWeather } from '../types/weather';
import type { SlimDayForecast } from '../types/advice';
import { formatTemp, formatPrecip, formatSnow, formatWindSpeed } from './units';

/**
 * Formats a number as a percent string.
 *
 * @param n - Number to format.
 * @returns Percent string.
 */
export function formatPercent(n: number): string {
  return `${n}%`;
}

/**
 * Maps a DailyWeather day into a SlimDayForecast with unit-formatted strings.
 *
 * @param day - Raw daily weather data.
 * @param unitGroup - Unit group used for temp, precip, snow, and wind suffixes.
 * @returns Slim day forecast for advice payloads.
 */
export function slimDay(day: DailyWeather, unitGroup: UnitGroup): SlimDayForecast {
  return {
    datetime: day.datetime,
    conditions: day.conditions,
    temp: formatTemp(day.temp, unitGroup),
    tempmax: formatTemp(day.tempmax, unitGroup),
    tempmin: formatTemp(day.tempmin, unitGroup),
    feelslike: formatTemp(day.feelslike, unitGroup),
    feelslikemax: formatTemp(day.feelslikemax, unitGroup),
    feelslikemin: formatTemp(day.feelslikemin, unitGroup),
    precipprob: formatPercent(day.precipprob),
    precip: formatPrecip(day.precip, unitGroup),
    precipcover: formatPercent(day.precipcover),
    preciptype: day.preciptype,
    snow: formatSnow(day.snow, unitGroup),
    snowdepth: formatSnow(day.snowdepth, unitGroup),
    humidity: formatPercent(day.humidity),
    cloudcover: formatPercent(day.cloudcover),
    windspeed: formatWindSpeed(day.windspeed, unitGroup),
  };
}

/**
 * Builds up to 3 slim day forecasts for city-scope advice asks.
 *
 * @param days - Daily weather forecast data.
 * @param unitGroup - Unit group used for formatted suffixes.
 * @returns Slim day forecasts (at most 3).
 */
export function buildCityForecastDays(
  days: DailyWeather[],
  unitGroup: UnitGroup,
): SlimDayForecast[] {
  return days.slice(0, 3).map((day) => slimDay(day, unitGroup));
}

/**
 * Builds a one-element slim day forecast array for day-scope advice asks.
 *
 * @param day - Single daily weather day.
 * @param unitGroup - Unit group used for formatted suffixes.
 * @returns Array containing one SlimDayForecast.
 */
export function buildDayForecastDays(day: DailyWeather, unitGroup: UnitGroup): SlimDayForecast[] {
  return [slimDay(day, unitGroup)];
}

/**
 * Builds seeded advice text from the forecast overview and active alert count.
 * Used to populate the AI advisor without querying the model on load.
 *
 * @param description - Multi-day weather overview; falls back to "Forecast loaded." when blank.
 * @param alertCount - Number of active severe weather alerts.
 * @returns Overview text, with an alert summary line appended when alertCount > 0.
 */
export function buildSeededAdviceText(description: string | undefined, alertCount: number): string {
  const overview = description?.trim() || 'Forecast loaded.';
  if (alertCount <= 0) return overview;
  const label = alertCount === 1 ? 'alert' : 'alerts';
  return `${overview}\n\n${alertCount} severe weather ${label} active.`;
}
