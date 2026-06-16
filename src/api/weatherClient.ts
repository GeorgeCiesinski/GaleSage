import type { WeatherData } from "../types/weather";

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
    // Encode the city name for use in URL
    const encodedCity = encodeURIComponent(city);

    const response = await fetch(`/api/weather?city=${encodedCity}`);

    if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`)
    }

    return response.json() as Promise<WeatherData>;
}
