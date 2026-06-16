import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './weather.js';

// Creates the small part of Vercel's response object that the handler uses.
function createMockResponse() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };

  return res;
}

describe('weather API handler', () => {
  const originalApiKey = process.env.WEATHER_API_KEY;

  // Replaces the real network layer before every test.
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // Restores environment variables and mocks so tests do not affect each other.
  afterEach(() => {
    process.env.WEATHER_API_KEY = originalApiKey;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // Validates request input before any external API call is attempted.
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

  // Ensures deployment configuration problems are reported clearly.
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

  // Checks that the proxy builds the Visual Crossing request without leaking the key to the client.
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

  // Confirms successful upstream data is passed through to the browser.
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

  // Preserves the upstream failure status while returning a stable error shape.
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
