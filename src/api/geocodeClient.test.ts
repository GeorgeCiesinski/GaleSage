import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchLocations } from './geocodeClient';

describe('searchLocations', () => {
  // Reset mocked fetch behavior so each test starts with a clean slate.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Confirms the client calls the local API proxy and encodes spaces safely.
  it('calls the local geocode API with an encoded location', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response) as unknown as typeof fetch;

    await searchLocations('New York');

    expect(global.fetch).toHaveBeenCalledWith('/api/geocode?q=New%20York');
  });

  // Verifies successful responses are parsed and returned to the caller.
  it('returns parsed location data for a successful response', async () => {
    const locationData = [
      {
        placeId: '123',
        displayName: 'London, Greater London, England, United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(locationData),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(searchLocations('London')).resolves.toEqual(locationData);
  });

  // Ensures callers get a clear error when the API proxy rejects the request.
  it('throws when the geocode API returns an error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: vi.fn().mockResolvedValue({ error: 'Location not found' }),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(searchLocations('Atlantis')).rejects.toThrow(
      'Geocoding request failed (404): Location not found',
    );
  });

  // Covers punctuation in location names so query strings stay valid.
  it('encodes special characters in locations', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response) as unknown as typeof fetch;

    await searchLocations('Paris, France');

    expect(global.fetch).toHaveBeenCalledWith('/api/geocode?q=Paris%2C%20France');
  });
});
