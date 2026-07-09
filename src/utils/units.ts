/**
 * Unit formatting and validation helpers.
 *
 * Values are returned by the API already converted; these functions only
 * validate unit group strings and append the correct display suffix.
 */
import { UNIT_GROUPS } from '../context/UnitGroupContext';
import type { UnitGroup } from '../context/UnitGroupContext';

/** Display suffixes keyed by Visual Crossing unitGroup. */
const TEMP_SUFFIX: Record<UnitGroup, string> = {
  metric: '°C',
  us: '°F',
  uk: '°C',
  base: ' K',
};

/**
 * Validates a unit group string and returns a safe UnitGroup value.
 *
 * @param selected - Raw unit group from a query string or user input.
 * @returns A valid unit group, or 'metric' when selected is missing or invalid.
 */
export function validateUnitGroup(selected: string | undefined): UnitGroup {
  if (selected && UNIT_GROUPS.includes(selected as UnitGroup)) {
    return selected as UnitGroup;
  }
  return 'metric';
}

/**
 * Formats a temperature value with the suffix for the active unit group.
 *
 * @param value - Temperature number as returned by the API.
 * @param unitGroup - Active unit group used for the current fetch.
 * @returns Formatted string, e.g. "20°C" or "70°F".
 */
export function formatTemp(value: number, unitGroup: UnitGroup): string {
  return `${value}${TEMP_SUFFIX[unitGroup]}`;
}
