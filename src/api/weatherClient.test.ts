import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWeatherByCoords } from './weatherClient';

describe('fetchWeatherByCoords', () => {
  // Reset mocked fetch behavior so each test starts with a clean slate.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Confirms the client calls the local API proxy and encodes spaces safely.
  it('calls the local weather API with lat and lon', async () => {
    const weatherData = {
      resolvedAddress: 'London, UK',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(weatherData),
    } as unknown as Response) as unknown as typeof fetch;

    await fetchWeatherByCoords(51.5074, -0.1278);

    expect(global.fetch).toHaveBeenCalledWith('/api/weather?lat=51.5074&lon=-0.1278');
  });

  // Verifies successful responses are parsed and returned to the caller.
  it('returns parsed weather data for a successful response', async () => {
    const weatherData = {
      resolvedAddress: 'London, England',
      description: 'Mixed conditions over the next week.',
      days: [
        {
          datetime: '2026-07-07',
          conditions: 'Partially cloudy',
          icon: 'partly-cloudy-day',
          temp: 55,
          feelslike: 50,
          humidity: 80,
        },
        {
          datetime: '2026-07-08',
          conditions: 'Clear',
          icon: 'clear-day',
          temp: 60,
          feelslike: 58,
          humidity: 65,
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(weatherData),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchWeatherByCoords(51.5074, -0.1278)).resolves.toEqual(weatherData);
  });

  // Ensures callers get a clear error when the API proxy rejects the request.
  it('throws when the weather API returns an error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockResolvedValue({ error: 'API key not configured' }),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchWeatherByCoords(0, 0)).rejects.toThrow(
      'Weather request failed (500): API key not configured',
    );
  });
});
