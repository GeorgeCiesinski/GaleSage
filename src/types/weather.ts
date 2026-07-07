import type { LocationResult } from './location';

export interface DailyWeather {
  datetime: string;
  conditions: string;
  icon: string;
  temp: number;
  feelslike: number;
  humidity: number;
}

export interface WeatherData {
  resolvedAddress: string;
  description?: string;
  days: DailyWeather[];
}

export interface WeatherCard {
  id: string;
  query: string; // user's search term — used for refresh
  location: LocationResult | null;
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}
