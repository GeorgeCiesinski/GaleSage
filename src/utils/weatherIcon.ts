const FALLBACK_ICON = 'cloudy';

/**
 * Maps a Visual Crossing icon id to a public asset path.
 */
export function getWeatherIconSrc(icon: string): string {
  return `/weather-icons/${icon}.png`;
}

export function getFallbackWeatherIconSrc(): string {
  return `/weather-icons/${FALLBACK_ICON}.png`
}
