/**
 * Returns a human-readable label for a forecast day.
 *
 * These functions provide more customized and specialized formatting than utils/units.
 */

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
 * @param windDir - Wind direction value returned by api (0° is North).
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

  return `${compass} (${windDir}°)`;
}
