import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAdvice } from './adviceClient';
import type { AdviceRequest, SlimDayForecast } from '../types/advice';

const slimDay: SlimDayForecast = {
  datetime: '2026-07-15',
  conditions: 'Partly cloudy',
  temp: '22°C',
  tempmax: '28°C',
  tempmin: '16°C',
  feelslike: '23°C',
  feelslikemax: '29°C',
  feelslikemin: '15°C',
  precipprob: '30%',
  precip: '2.5mm',
  precipcover: '10%',
  preciptype: ['rain'],
  snow: '0cm',
  snowdepth: '0cm',
  humidity: '55%',
  cloudcover: '40%',
  windspeed: '12 km/h',
  solarradiation: '239.1 W/m²',
  solarenergy: '20.6 MJ/m²',
  uvindex: '8',
  visibility: '15.1 km',
};

const payload: AdviceRequest = {
  scope: 'location',
  location: 'London, UK',
  question: 'Should I bring an umbrella?',
  history: [],
  days: [slimDay],
  alerts: { count: 0, alerts: [] },
};

describe('fetchAdvice', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('POSTs the advice payload to the local API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ answer: 'Yes, light rain is likely.' }),
    } as unknown as Response) as unknown as typeof fetch;

    await fetchAdvice(payload);

    expect(global.fetch).toHaveBeenCalledWith('/api/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });

  it('returns the answer from a successful response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ answer: 'Bring a light jacket.' }),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchAdvice(payload)).resolves.toBe('Bring a light jacket.');
  });

  it('throws when the advice API returns an error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      json: vi.fn().mockResolvedValue({
        error: 'Advice service is rate limited. Try again shortly.',
      }),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchAdvice(payload)).rejects.toThrow(
      'Advice request failed (429): Advice service is rate limited. Try again shortly.',
    );
  });

  it('falls back to statusText when the error body is not JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: vi.fn().mockRejectedValue(new Error('not json')),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchAdvice(payload)).rejects.toThrow('Advice request failed (502): Bad Gateway');
  });

  it('throws when a successful response is missing an answer', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    } as unknown as Response) as unknown as typeof fetch;

    await expect(fetchAdvice(payload)).rejects.toThrow('Advice request failed: missing answer');
  });
});
