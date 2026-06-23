import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWeatherByCity } from './weatherClient';

describe('fetchWeatherByCity', () => {
  // Reset mocked fetch behavior so each test starts with a clean slate.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Confirms the client calls the local API proxy and encodes spaces safely.
  it('calls the local weather API with an encoded city', async () => {
    const weatherData = { resolvedAddress: 'New York, NY' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(weatherData),
    } as unknown as Response) as unknown as typeof fetch;

    await fetchWeatherByCity('New York');

    expect(global.fetch).toHaveBeenCalledWith('/api/weather?city=New%20York');
  });

  // Verifies successful responses are parsed and returned to the caller.
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
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchWeatherByCity('London')).resolves.toEqual(weatherData);
  });

  // Ensures callers get a clear error when the API proxy rejects the request.
  it('throws when the weather API returns an error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn().mockResolvedValue({ error: 'API key not configured' }),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchWeatherByCity('Atlantis')).rejects.toThrow(
      'Weather request failed (500): API key not configured'
    );
  });

  // Covers punctuation in city names so query strings stay valid.
  it('encodes special characters in city names', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    } as unknown as Response) as unknown as typeof fetch;

    await fetchWeatherByCity('Paris, France');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/weather?city=Paris%2C%20France'
    );
  });
});
