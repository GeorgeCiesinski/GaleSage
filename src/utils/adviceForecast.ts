import type { UnitGroup } from '../types/unitGroup';
import type { DailyWeather } from '../types/weather';
import type { SlimDayForecast } from '../types/advice';
import { formatTemp, formatPrecip, formatSnow, formatWindSpeed } from './units';

/**
 * Formats number into a percent string
 * 
 * @param n - Number to format.
 * @returns - Percent value.
 */
export function formatPercent(n: number): string {
  return `${n}%`;
}
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
 * Builts an array containing 3 days of slimDay forecasts.
 * 
 * @param days - Daily Weather forecast data.
 * @param unitGroup - Unit group to append suffixes from.
 * @returns - 3 slimDay forecast array.
 */
export function buildCityForecastDays(
  days: DailyWeather[],
  unitGroup: UnitGroup,
): SlimDayForecast[] {
  return days.slice(0, 3).map((day) => slimDay(day, unitGroup));
}

/**
 * Builds an array with a SlimDayForecast.   
 */
export function buildDayForecastDays(
  day: DailyWeather,
  unitGroup: UnitGroup,
): SlimDayForecast[] {
  return [slimDay(day, unitGroup)];
}

/**
 * Builds seeded advice text to populate AI advisor on city load.
 * This saves the AI being automatically queried on city load.
 * 
 * @param description - Weather description.
 * @param alertCount - Number of alerts.
 */
export function buildSeededAdviceText(
  description: string | undefined,
  alertCount: number,
): string {
  const overview = description?.trim() || 'Forecast loaded.';
  if (alertCount <= 0) return overview;
  const label = alertCount === 1 ? 'alert' : 'alerts';
  return `${overview}\n\n${alertCount} severe weather ${label} active.`;
}
