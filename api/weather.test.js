import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './weather.js';

function createMockResponse() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };

  return res;
}

describe('weather API handler', () => {
  const originalApiKey = process.env.WEATHER_API_KEY;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    process.env.WEATHER_API_KEY = originalApiKey;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns 400 when city is missing', async () => {
    const req = {
      query: {},
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'City is required',
    });
  });

  it('returns 500 when the API key is not configured', async () => {
    delete process.env.WEATHER_API_KEY;

    const req = {
      query: {
        city: 'London',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'API key not configured',
    });
  });

  it('calls Visual Crossing with the encoded city and API key', async () => {
    process.env.WEATHER_API_KEY = 'test-api-key';

    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ resolvedAddress: 'New York, NY' }),
    });

    const req = {
      query: {
        city: 'New York',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/New%20York?unitGroup=us&key=test-api-key&contentType=json'
    );
  });

  it('returns weather data from a successful upstream response', async () => {
    process.env.WEATHER_API_KEY = 'test-api-key';

    const weatherData = {
      resolvedAddress: 'Tokyo, Japan',
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(weatherData),
    });

    const req = {
      query: {
        city: 'Tokyo',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(weatherData);
  });

  it('returns the upstream status when Visual Crossing fails', async () => {
    process.env.WEATHER_API_KEY = 'test-api-key';

    global.fetch.mockResolvedValue({
      ok: false,
      status: 503,
    });

    const req = {
      query: {
        city: 'Tokyo',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Weather request failed',
    });
  });
});
