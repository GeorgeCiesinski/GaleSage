/**
 * Handles DOM setup for the Weather App page
 * 
 * This module adds event listeners and handles user search submissions.
 */

import { fetchWeatherByCity } from '../api/weatherClient.js';
import { displayTemp } from '../utils/temperature.js';

const cityInput = document.getElementById('city-input');
const weatherForm = document.getElementById('weather-form');

const weatherDisplay = document.getElementById('weather-display');
const cityVal = document.getElementById('city-val');
const tempVal = document.getElementById('temp-val');
const feelsLikeVal = document.getElementById('feels-like-val');
const humidityVal = document.getElementById('humidity-val');

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
        renderWeatherData(weatherData);
    } catch (error) {
        console.log(error);
    }
}

function renderWeatherData(weatherData) {
    cityVal.textContent = weatherData.resolvedAddress;
    tempVal.textContent = displayTemp(weatherData.currentConditions.temp);
    feelsLikeVal.textContent = displayTemp(weatherData.currentConditions.feelslike);
    humidityVal.textContent = `${weatherData.currentConditions.humidity}%`;

    weatherDisplay.style.display = 'flex';
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
