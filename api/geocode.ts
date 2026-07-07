/**
 * Vercel serverless handler that proxies location requests to Nominatim.
 *
 * Searches locations using free-form query q and returns up to the limit of locations.
 */

import type { LocationResult } from '../src/types/location';

const BASE_URL = 'https://nominatim.openstreetmap.org/search';

type LocationRequest = {
  query: {
    q?: string;
  };
};

type GeocodeResponse = {
  status: (code: number) => GeocodeResponse;
  json: (body: unknown) => GeocodeResponse;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

/**
 * Handles incoming location API requests from the frontend.
 *
 * @param req - The incoming request containing the q (location) query parameter.
 * @param res - The response object used to send status codes and JSON.
 * @returns A JSON response with location data or an error message.
 */
export default async function handler(req: LocationRequest, res: GeocodeResponse) {
  const q = req.query.q?.trim();

  if (!q) {
    return res.status(400).json({
      error: 'Location is required',
    });
  }

  const params = new URLSearchParams({
    q,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
    'accept-language': 'en',
  });

  const url = `${BASE_URL}?${params}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Weather-App/1.0' },
  });

  if (!response.ok) {
    return res.status(response.status).json({
      error: `Upstream location request failed (${response.status})`,
    });
  }

  const data = (await response.json()) as NominatimResult[];
  const results: LocationResult[] = data.map((item) => ({
    placeId: String(item.place_id),
    displayName: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
  }));

  return res.status(200).json(results);
}
