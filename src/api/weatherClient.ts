/**
 * Frontend client for requesting weather data from the local API proxy.
 */

import type { WeatherData } from '../types/weather';

type WeatherApiErrorResponse = {
  error: string;
};

/**
 * Fetches weather data for a location from the local `/api/weather` endpoint.
 *
 * @param lat - Latitude of the location.
 * @param lon - Longitude of the location.
 * @returns Parsed weather data for the resolved location.
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);

  if (!response.ok) {
    let reason = response.statusText || 'Unknown Error';

    try {
      const errorBody = (await response.json()) as WeatherApiErrorResponse;
      if (errorBody.error) {
        reason = errorBody.error;
      }
    } catch {
      // Intentionally ignored: Response body wasn't valid JSON; keep the statusText-based reason.
    }

    throw new Error(`Weather request failed (${response.status}): ${reason}`);
  }

  return response.json() as Promise<WeatherData>;
}
