/**
 * Functions for formatting units used in forecast data.
 *
 * These functions specifically add unit suffixes to values provided by
 * Visual Crossing (temp, precip, snow, wind, solar, visibility). UV index is
 * unitless and formatted without a suffix.
 */
import { UnitGroup } from '../types/unitGroup';

/** Display temperature suffixes keyed by Visual Crossing unitGroup. */
const TEMP_SUFFIX: Record<UnitGroup, string> = {
  metric: '°C',
  us: '°F',
  uk: '°C',
  base: ' K',
};

/**
 * Formats a temperature value with the suffix for the active unit group.
 *
 * @param value - Temperature number as returned by the API.
 * @param unitGroup - Active unit group used for the current fetch.
 * @returns Formatted string.
 */
export function formatTemp(value: number, unitGroup: UnitGroup): string {
  return `${value}${TEMP_SUFFIX[unitGroup]}`;
}

/** Display precipitation suffixes keyed by Visual Crossing unitGroup. */
const PRECIP_SUFFIX: Record<UnitGroup, string> = {
  metric: 'mm',
  us: 'in',
  uk: 'mm',
  base: 'mm',
};

/**
 * Formats a precipitation value with the suffix for the active unit group.
 *
 * @param value - Precipitation number as returned by the API.
 * @param unitGroup - Active unit group used for the current fetch.
 * @returns Formatted string.
 */
export function formatPrecip(value: number, unitGroup: UnitGroup): string {
  return `${value}${PRECIP_SUFFIX[unitGroup]}`;
}

/** Display Snow suffixes keyed by Visual Crossing unitGroup. */
const SNOW_SUFFIX: Record<UnitGroup, string> = {
  metric: 'cm',
  us: 'in',
  uk: 'cm',
  base: 'cm',
};

/**
 * Formats a snow value with the suffix for the active unit group.
 *
 * @param value - Snow number as returned by the API.
 * @param unitGroup - Active unit group used for the current fetch.
 * @returns Formatted string.
 */
export function formatSnow(value: number, unitGroup: UnitGroup): string {
  return `${value}${SNOW_SUFFIX[unitGroup]}`;
}

/** Display windspeed suffixes keyed by Visual Crossing unitGroup. */
const WIND_SUFFIX: Record<UnitGroup, string> = {
  metric: ' km/h',
  us: ' MPH',
  uk: ' MPH',
  base: ' m/s',
};

/**
 * Formats a wind speed value with the suffix for the active unit group.
 *
 * @param value - Wind speed number as returned by the API.
 * @param unitGroup - Active unit group used for the current fetch.
 * @returns Formatted string.
 */
export function formatWindSpeed(value: number, unitGroup: UnitGroup): string {
  return `${value}${WIND_SUFFIX[unitGroup]}`;
}

/**
 * Formats solar radiation (always W/m² from Visual Crossing).
 *
 * @param value - Solar radiation in W/m².
 * @param _unitGroup - Active unit group (unused; kept for formatter consistency).
 * @returns Formatted string.
 */
export function formatSolarRadiation(value: number, _unitGroup: UnitGroup): string {
  return `${value} W/m²`;
}

/**
 * Formats solar energy (always MJ/m² from Visual Crossing).
 *
 * @param value - Solar energy in MJ/m².
 * @param _unitGroup - Active unit group (unused; kept for formatter consistency).
 * @returns Formatted string.
 */
export function formatSolarEnergy(value: number, _unitGroup: UnitGroup): string {
  return `${value} MJ/m²`;
}

/** Display visibility suffixes keyed by Visual Crossing unitGroup. */
const VISIBILITY_SUFFIX: Record<UnitGroup, string> = {
  metric: ' km',
  us: ' mi',
  uk: ' mi',
  base: ' km',
};

/**
 * Formats a visibility value with the suffix for the active unit group.
 *
 * @param value - Visibility number as returned by the API (km or mi).
 * @param unitGroup - Active unit group used for the current fetch.
 * @returns Formatted string.
 */
export function formatVisibility(value: number, unitGroup: UnitGroup): string {
  return `${value}${VISIBILITY_SUFFIX[unitGroup]}`;
}

/**
 * Formats a UV index value (unitless 0–10 scale).
 *
 * @param value - UV index number as returned by the API.
 * @returns Formatted string without a unit suffix.
 */
export function formatUvIndex(value: number): string {
  return `${value}`;
}
