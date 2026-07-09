/**
 * Handles temperature related functions.
 */

const TEMP_SUFFIX: Record<UnitGroup, string> = {
  metric: '°C',
  us: '°F',
  uk: '°C',
  base: ' K',
};

export function formatTemp(value: number, unitGroup: UnitGroup): string {
  return `${value}${TEMP_SUFFIX[unitGroup]}`;
}
