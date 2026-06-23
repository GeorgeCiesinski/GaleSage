/**
 * Frontend client for requesting weather data from the local API proxy.
 */

import type { WeatherData } from "../types/weather";

type WeatherApiErrorResponse = {
  error: string;
}

/**
 * Fetches weather data for a city from the local `/api/weather` endpoint.
 *
 * @param city - The city name to search for.
 * @returns Parsed weather data for the resolved location.
 */
export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  // Encode the city name for use in URL
  const encodedCity = encodeURIComponent(city);
  const response = await fetch(`/api/weather?city=${encodedCity}`);

  if (!response.ok) {
    let reason = response.statusText || 'Unknown Error';

    try {
      const errorBody = (await response.json()) as WeatherApiErrorResponse;
      if (errorBody.error) {
        reason = errorBody.error;
      }
    } catch {

    }

    throw new Error(
      `Weather request failed (${response.status}): ${reason}`
    )
  }

  return response.json() as Promise<WeatherData>;
}
