/**
 * Handles DOM setup for the Weather App page
 * 
 * This module adds event listeners and handles user search submissions.
 */

import { fetchWeatherByCity } from '../api/weather.js';

const cityInput = document.getElementById('city-input');
const weatherForm = document.getElementById('weather-form');

/**
 * Trims the input from city input field
 * 
 * @returns {string} The city input value with leading and trailing whitespace removed.
 */
function getCityInputValue() {
    return cityInput.value.trim();
}

/**
 * Handles the weather search form submission.
 * 
 * @param {SubmitEvent} event - The form submit event.
 * @returns {void}
 */
async function handleWeatherSearch(event) {
    event.preventDefault();

    const city = getCityInputValue();

    if (!city) return;

    try {
        const weatherData = await fetchWeatherByCity(city);
        console.log(weatherData);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Registers event listeners for the weather page.
 * 
 * @returns {void}
 */
function initPageEvents() {
    weatherForm.addEventListener('submit', handleWeatherSearch);
}

initPageEvents();
