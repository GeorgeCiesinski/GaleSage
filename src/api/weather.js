/**
 * Handles Visual Crossing API call for weather data.
 */

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

/**
 * Fetches weather data for requested city from Visual Crossing.
 * 
 * @param {string} city - City to search for.
 * @returns {promise<object>}  - Weather data returned by Visual Crossing.
 */
export async function fetchWeatherByCity(city) {
    // Encode the city name for use in URL
    const encodedCity = encodeURIComponent(city);

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedCity}?unitGroup=us&key=${apiKey}&contentType=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`)
    }

    return response.json();
}
