import type { LocationResult } from './location';

export interface DailyWeather {
  datetime: string; // "YYYY-MM-DD"
  conditions: string; // per-day condition text
  icon: string; // Visual Crossing icon id, maps to /weather-icons/{icon}.png
  temp: number;
  tempmax: number;
  tempmin: number;
  feelslike: number;
  feelslikemax: number;
  feelslikemin: number;
  humidity: number;
}

export interface WeatherData {
  resolvedAddress: string;
  description?: string; // Multi-day weather overview
  days: DailyWeather[];
}

export interface WeatherCard {
  id: string; // Random ID for react to differentiate cards
  query: string; // user's search term — used for refresh
  location: LocationResult | null;
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}
