import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWeatherByCity } from './weatherClient.js';

describe('fetchWeatherByCity', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls the local weather API with an encoded city', async () => {
    const weatherData = { resolvedAddress: 'New York, NY' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(weatherData),
    });

    await fetchWeatherByCity('New York');

    expect(global.fetch).toHaveBeenCalledWith('/api/weather?city=New%20York');
  });

  it('returns parsed weather data for a successful response', async () => {
    
    const weatherData = {
      resolvedAddress: 'London, England',
      currentConditions: {
        temp: 55,
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(weatherData),
    });

    await expect(fetchWeatherByCity('London')).resolves.toEqual(weatherData);
  });

  it('throws when the weather API returns an error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(fetchWeatherByCity('Atlantis')).rejects.toThrow(
      'Weather request failed: 404'
    );
  });

  it('encodes special characters in city names', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });

    await fetchWeatherByCity('Paris, France');
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/weather?city=Paris%2C%20France'
    );
  });
});
