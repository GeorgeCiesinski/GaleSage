/**
 * Handles temperature related functions.
 */

/**
 * Converts Farenheit to Celsius.
 * 
 * @param {number} farenheit - Temperature value in farenheit.
 * @returns {number} celsius - Temperature value in celsius.
 */
function toCelsius(farenheit) {
    console.log(typeof(farenheit));
    return ((farenheit - 32) * (5/9)).toFixed(1);
}

/**
 * Builds the string for displaying temperature.
 * 
 * @param {number} temperature - Temperature value in farenheit.
 * @returns {string} - Temperature in farenheit and celsius. 
 */
export function displayTemp(temperature) {
    return `${temperature}°F (${toCelsius(temperature)}°C)`;
}