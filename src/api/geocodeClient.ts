/**
 * Frontend client for requesting location data from the local API proxy.
 */

import type { LocationResult } from '../types/location';

type LocationApiErrorResponse = {
  error: string;
};

/**
 * Fetches location data from the local `/api/geocode` endpoint.
 *
 * @param query - The location to search for.
 * @returns A list of locations from the geocoder.
 */
export async function searchLocations(query: string): Promise<LocationResult[]> {
  // Encode the location for use in URL
  const encodedLocation = encodeURIComponent(query);
  const response = await fetch(`/api/geocode?q=${encodedLocation}`);

  if (!response.ok) {
    let reason = response.statusText || 'Unknown Error';

    try {
      const errorBody = (await response.json()) as LocationApiErrorResponse;
      if (errorBody.error) {
        reason = errorBody.error;
      }
    } catch {
      // Intentionally ignored: Response body wasn't valid JSON; keep the statusText-based reason.
    }

    throw new Error(`Geocoding request failed (${response.status}): ${reason}`);
  }

  return response.json() as Promise<LocationResult[]>;
}
