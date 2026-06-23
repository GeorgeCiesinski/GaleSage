import type { WeatherData } from "../types/weather";

type WeatherApiErrorResponse = {
  error: string;
}

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
