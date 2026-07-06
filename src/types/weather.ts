import type { LocationResult } from './location';

export interface WeatherData {
  resolvedAddress: string;
  description?: string;
  currentConditions: {
    temp: number;
    feelslike: number;
    humidity: number;
  };
}

export interface WeatherCard {
  id: string;
  query: string; // user's search term — used for refresh
  location: LocationResult | null;
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}
