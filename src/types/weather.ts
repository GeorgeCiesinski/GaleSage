export interface WeatherData {
  resolvedAddress: string;
  description?: string;
  currentConditions: {
    temp: number;
    feelslike: number;
    humidity: number;
  };
}
