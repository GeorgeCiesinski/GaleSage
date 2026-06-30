/**
 * Handles temperature related functions.
 */

/**
 * Converts Farenheit to Celsius.
 *
 * @param {number} farenheit - Temperature value in farenheit.
 * @returns {string} celsius - Temperature value in celsius.
 */
function toCelsius(farenheit: number): string {
  return ((farenheit - 32) * (5 / 9)).toFixed(1);
}

/**
 * Builds the string for displaying temperature.
 *
 * @param {number} temperature - Temperature value in farenheit.
 * @returns {string} - Temperature in farenheit and celsius.
 */
export function displayTemp(temperature: number): string {
  return `${temperature}°F (${toCelsius(temperature)}°C)`;
}
