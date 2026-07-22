/**
 * Maps a Visual Crossing icon id to a public asset path.
 */

const FALLBACK_ICON = 'cloudy';

/**
 * Builds the public path for a Visual Crossing weather icon asset.
 *
 * @param icon - Visual Crossing icon id (file stem without extension).
 * @returns Path under `/weather-icons/` for the matching PNG.
 */
export function getWeatherIconSrc(icon: string): string {
  return `/weather-icons/${icon}.png`;
}

/**
 * Returns the path for the default cloudy icon used when an icon fails to load.
 *
 * @returns Path to the cloudy fallback PNG under `/weather-icons/`.
 */
export function getFallbackWeatherIconSrc(): string {
  return `/weather-icons/${FALLBACK_ICON}.png`;
}
