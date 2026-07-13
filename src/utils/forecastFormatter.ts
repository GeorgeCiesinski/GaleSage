/**
 * Returns a human-readable label for hourly and daily forecasts.
 *
 * These functions provide more customized and specialized formatting than utils/units.
 */

import type { WeatherAlert } from '../types/weather';
import type { HourlyWeather } from '../types/weather';
import { formatPrecip } from './units';
import type { UnitGroup } from '../types/unitGroup';

/**
 * Formats data provided by the API into a human readable day label.
 *
 * @param dayIndex - Days array index returned by api.
 * @param datetime - Datetime value returned by api.
 * @returns string - Day label showing either 'Today', 'Tomorrow', or a formatted date.
 */
export function formatDayLabel(dayIndex: number, datetime: string): string {
  if (dayIndex === 0) return 'Today';
  if (dayIndex === 1) return 'Tomorrow';

  const [year, month, day] = datetime.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

const hourLabelFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
});

/**
 * Formats an API hour string into a localized time label.
 *
 * @param datetime - Time portion from the API (e.g. "14:00:00").
 * @returns Localized hour label (e.g. "2 PM" or "14:00" depending on locale).
 */
export function formatHourLabel(datetime: string): string {
  const [hours, minutes, seconds] = datetime.split(':').map(Number);
  const date = new Date(2000, 0, 1, hours, minutes, seconds);
  return hourLabelFormatter.format(date);
}

/**
 * Returns a compact version of the precipitation probability and amount,
 * or null.
 * 
 * @param HourlyWeather - Hour of the forecast.
 * @param unitGroup - User's preferred UnitGroup or default (metric).
 * @returns - Compact string containing precipitation probability and amount.
 */
export function formatPrecipCompact(
  hour: HourlyWeather,
  unitGroup: UnitGroup,
): string | null {
  const parts: string[] = [];
  if (hour.precipprob > 0) parts.push(`${hour.precipprob}%`);
  if (hour.precip > 0) parts.push(formatPrecip(hour.precip, unitGroup));
  return parts.length ? parts.join(' . ') : null;
}

/**
 * Contains multi-word precip types that need to be split into component words.
 */
const PRECIP_TYPE_LABELS: Record<string, string> = {
  freezingrain: 'freezing rain',
};

/**
 * Exports a human-readable preciptype output.
 *
 * @param precipType - Array containing types of precipitation, or null/undefined.
 * @returns - Human readable string containing precipitation types.
 */
export function formatPrecipType(precipType: string[] | null | undefined): string {
  if (!precipType?.length) return 'None';

  // Replaces multi-word precip types using Record, and keeps remaining precipitation types
  const joined = precipType.map((type) => PRECIP_TYPE_LABELS[type] ?? type).join(', ');

  // Capitalizes first word
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

/**
 * Formats wind direction into a compass direction and angle value.
 *
 * @param windDir - Direction from which the wind is blowing, returned by api (0° is North).
 * @returns - Compass direction and angle.
 */
export function formatWindDir(windDir: number): string {
  // 16 point compass array
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  // Get directions index
  const index = Math.round((windDir % 360) / 22.5) % 16;
  // Get compass direction
  const compass = directions[index < 0 ? index + 16 : index];

  return `from ${compass} (${windDir}°)`;
}

/**
 * Maps known alert source hostnames to human-readable agency names.
 */
const ALERT_SOURCE_LABELS: Record<string, string> = {
  'weather.gc.ca': 'Environment Canada',
  'alerts.weather.gov': 'National Weather Service',
};

const alertDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

/**
 * Parses an ISO datetime string into a localized date/time label.
 *
 * @param iso - ISO datetime string from the alerts API (e.g. onset or ends).
 * @returns Formatted date/time string, or null if iso is missing or invalid.
 */
function formatAlertDateTime(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return alertDateFormatter.format(date);
}

/**
 * Formats an alert's active period into a human-readable range.
 *
 * @param onset - ISO datetime when the alert begins.
 * @param ends - ISO datetime when the alert ends.
 * @returns A range like "Mon, Jul 13, 10:00 AM – Wed, Jul 15, 7:14 AM",
 *   or a partial "From …" / "Until …" string when only one date is present.
 */
export function formatAlertPeriod(onset?: string, ends?: string): string {
  const start = formatAlertDateTime(onset);
  const end = formatAlertDateTime(ends);
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return '';
}

/**
 * Returns a human-readable label for an alert's official source link.
 *
 * @param link - URL to the issuing agency's alert page (from the API link field).
 * @returns Agency name for known hosts (e.g. "Environment Canada"), or "Official source".
 */
export function formatAlertSourceLabel(link?: string): string {
  if (!link) return 'Official source';
  try {
    const host = new URL(link).hostname.replace(/^www\./, '');
    return ALERT_SOURCE_LABELS[host] ?? 'Official source';
  } catch {
    return 'Official source';
  }
}

/**
 * Returns alerts that have not yet ended.
 *
 * @param alerts - Alert objects from the API.
 * @param nowMs - Current time in milliseconds (pass Date.now() from a non-render context).
 * @returns Alerts with no endsEpoch or whose end time is still in the future.
 */
export function filterActiveAlerts(alerts: WeatherAlert[], nowMs: number): WeatherAlert[] {
  return alerts.filter((alert) => !alert.endsEpoch || alert.endsEpoch * 1000 > nowMs);
}
