/**
 * Handles temperature related functions.
 */
import { UNIT_GROUPS } from '../context/UnitGroupContext';
import type { UnitGroup } from '../context/UnitGroupContext';

const TEMP_SUFFIX: Record<UnitGroup, string> = {
  metric: '°C',
  us: '°F',
  uk: '°C',
  base: ' K',
};

export function validateUnitGroup(selected: string): UnitGroup {
  if (!selected || selected === undefined) return 'metric' as UnitGroup;

  if (UNIT_GROUPS.includes(selected)) return selected;
}

export function formatTemp(value: number, unitGroup: UnitGroup): string {
  return `${value}${TEMP_SUFFIX[unitGroup]}`;
}
