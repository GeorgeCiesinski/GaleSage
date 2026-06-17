/**
 * Handles DOM setup for the Weather App page
 * 
 * This module adds event listeners and handles user search submissions.
 */

import { fetchWeatherByCity } from '../api/weatherClient';
import { displayTemp } from '../utils/temperature';
import type { WeatherData } from '../types/weather';

function getRequiredElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
  
    if (!element) {
        throw new Error(`Missing required element: ${id}`);
    }
  
    return element as T;
}

const cityInput = getRequiredElement<HTMLInputElement>('city-input');
const weatherForm = getRequiredElement<HTMLInputElement>('weather-form');

const weatherDisplay = getRequiredElement<HTMLInputElement>('weather-display');
const cityVal = getRequiredElement<HTMLInputElement>('city-val');
const tempVal = getRequiredElement<HTMLInputElement>('temp-val');
const feelsLikeVal = getRequiredElement<HTMLInputElement>('feels-like-val');
const humidityVal = getRequiredElement<HTMLInputElement>('humidity-val');

/**
 * Trims the input from city input field
 * 
 * @returns {string} The city input value with leading and trailing whitespace removed.
 */
function getCityInputValue(): string {
    return cityInput.value.trim();
}

/**
 * Handles the weather search form submission.
 * 
 * @param {SubmitEvent} event - The form submit event.
 * @returns {void}
 */
async function handleWeatherSearch(event: SubmitEvent): Promise<void> {
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

function renderWeatherData(weatherData: WeatherData): void {
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
function initPageEvents(): void {
    weatherForm.addEventListener('submit', handleWeatherSearch);
}

initPageEvents();
