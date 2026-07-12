/**
 * Returns a human-readable label for a forecast day.
 * 
 * These functions provide more customized and specialized formatting than utils/units.
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
 * Contains multiword precip types that need to be split
 */
const PRECIP_TYPE_LABELS: Record<string, string> = {
  freezingrain: 'freezing rain',
};

/**
 * Exports a human-readable preciptype output.
 */
export function formatPrecipType(precipType: string[] | null | undefined): string {
  if (!precipType?.length) return 'None';

  const joined = precipType.map((type) => PRECIP_TYPE_LABELS[type] ?? type).join(', ');

  return joined.charAt(0).toUpperCase() + joined.slice(1);
}
