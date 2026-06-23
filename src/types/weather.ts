export interface WeatherData {
    resolvedAddress: string;
    currentConditions: {
        temp: number;
        feelslike: number;
        humidity: number;
    }
}
