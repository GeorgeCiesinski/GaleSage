import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './geocode';

// Creates the small part of Vercel's response object that the handler uses.
function createMockResponse() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };

  return res;
}

describe('Geocode API handler', () => {
  // Replaces the real network layer before every test.
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  // Restores environment variables and mocks so tests do not affect each other.
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // Validates request input before any external API call is attempted.
  it('returns 400 when location is missing', async () => {
    const req = {
      query: {},
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Location is required',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 400 when location is only whitespace', async () => {
    const req = {
      query: {
        q: ' ',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Location is required',
    });
  });

  // Confirms location is mapped correctly
  it('returns location data from a successful upstream response', async () => {
    const nominatimData = [
      {
        place_id: 123456,
        display_name: 'Tokyo, Japan',
        lat: '35.6762',
        lon: '139.6503',
      },
    ];

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(nominatimData),
    } as unknown as Response);

    const req = {
      query: {
        q: 'Tokyo',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        placeId: '123456',
        displayName: 'Tokyo, Japan',
        lat: 35.6762,
        lon: 139.6503,
      },
    ]);
  });

  // Preserves the upstream failure status while returning a stable error shape.
  it('returns the upstream status when Nominatim fails', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 503,
    } as unknown as Response);

    const req = {
      query: {
        q: 'London',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Upstream location request failed (503)',
    });
  });

  it('calls Nominatim with encoded query and User-Agent header', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);
    const req = {
      query: {
        q: 'New York',
      },
    };
    const res = createMockResponse();

    await handler(req, res);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('nominatim.openstreetmap.org/search'),
      {
        headers: {
          'User-Agent': 'GaleSage/1.0',
        },
      },
    );

    const calledUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('q=New+York');
    expect(calledUrl).toContain('format=jsonv2');
    expect(calledUrl).toContain('limit=5');
  });
});
