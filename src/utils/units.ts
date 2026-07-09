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
  if (selected && UNIT_GROUPS.includes(selected as UnitGroup)) {
    return selected as UnitGroup;
  }
  return 'metric';
}

export function formatTemp(value: number, unitGroup: UnitGroup): string {
  return `${value}${TEMP_SUFFIX[unitGroup]}`;
}
