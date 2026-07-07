/**
 * Returns a human-readable label for a forecast day.
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
