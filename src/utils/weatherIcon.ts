/**
 * Maps a Visual Crossing icon id to a public asset path.
 */

const FALLBACK_ICON = 'cloudy';

export function getWeatherIconSrc(icon: string): string {
  return `/weather-icons/${icon}.png`;
}

export function getFallbackWeatherIconSrc(): string {
  return `/weather-icons/${FALLBACK_ICON}.png`;
}
