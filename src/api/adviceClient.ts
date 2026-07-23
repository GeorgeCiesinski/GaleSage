/**
 * Frontend client for requesting weather advice from the local API proxy.
 */

import type { AdviceRequest } from '../types/advice';

type AdviceApiErrorResponse = {
  error: string;
};

type AdviceApiSuccessResponse = {
  answer: string;
};

/**
 * Fetches AI weather advice from the local `/api/advice` endpoint.
 *
 * @param payload - Advice request including scope, geocoded location, question,
 *   optional history (unused by the UI; requests send an empty list), unit-labeled
 *   forecast days, and slim alerts.
 * @returns The model's advice text.
 * @throws When the request fails or the response is missing an answer.
 */
export async function fetchAdvice(payload: AdviceRequest): Promise<string> {
  const response = await fetch('/api/advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let reason = response.statusText || 'Unknown Error';
    try {
      const errorBody = (await response.json()) as AdviceApiErrorResponse;
      if (errorBody.error) reason = errorBody.error;
    } catch {
      // keep statusText
    }
    throw new Error(`Advice request failed (${response.status}): ${reason}`);
  }

  const data = (await response.json()) as AdviceApiSuccessResponse;
  if (!data.answer) {
    throw new Error('Advice request failed: missing answer');
  }
  return data.answer;
}
