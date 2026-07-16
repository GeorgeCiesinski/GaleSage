import { describe, expect, it } from 'vitest';
import { stripUrls, truncate, summarizeAlertDescription, buildSlimAlerts } from './alertSummary';
import type { WeatherAlert } from '../types/weather';

describe('stripUrls', () => {
  it('removes http and https URLs', () => {
    expect(stripUrls('See https://example.com/alert and http://weather.gov/now')).toBe('See and');
  });

  it('removes www-prefixed links', () => {
    expect(stripUrls('Check www.weather.gov for updates')).toBe('Check for updates');
  });

  it('collapses leftover whitespace', () => {
    expect(stripUrls('Rain  https://a.com   floods later')).toBe('Rain floods later');
  });

  it('returns empty string when input is only URLs', () => {
    expect(stripUrls('https://example.com www.example.com')).toBe('');
  });
});

describe('truncate', () => {
  it('returns trimmed text when under the limit', () => {
    expect(truncate('  short  ', 10)).toBe('short');
  });

  it('caps long text with an ellipsis', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });

  it('trims trailing spaces before appending the ellipsis', () => {
    expect(truncate('abc de', 5)).toBe('abc…');
  });
});

describe('summarizeAlertDescription', () => {
  it('summarizes a multi-sentence description to about two sentences', () => {
    const description =
      'Heavy rain is expected this afternoon. Flooding is possible in low-lying areas.';
    expect(summarizeAlertDescription(description)).toBe(
      'Heavy rain is expected this afternoon. Flooding is possible in low-lying areas.',
    );
  });

  it('keeps a single-sentence description', () => {
    expect(summarizeAlertDescription('One sentence only.')).toBe('One sentence only.');
  });

  it('strips URLs before summarizing', () => {
    expect(
      summarizeAlertDescription('See https://example.com/alert for details. More rain later.'),
    ).toBe('See for details. More rain later.');
  });

  it('falls back to headline when description is missing', () => {
    expect(summarizeAlertDescription(undefined, 'Heat warning in effect', 'Heat')).toBe(
      'Heat warning in effect',
    );
  });

  it('falls back to event when description and headline are missing', () => {
    expect(summarizeAlertDescription(undefined, undefined, 'Wind Warning')).toBe('Wind Warning');
  });

  it('falls back when description is only URLs', () => {
    expect(summarizeAlertDescription('https://example.com', 'Fallback headline')).toBe(
      'Fallback headline',
    );
  });

  it('truncates very long summaries', () => {
    const longSentence = `${'word '.repeat(100)}. ${'more '.repeat(100)}.`;
    const result = summarizeAlertDescription(longSentence);
    expect(result.length).toBeLessThanOrEqual(400);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('buildSlimAlerts', () => {
  const alert: WeatherAlert = {
    event: 'Heat Warning',
    headline: 'Extreme heat expected',
    description:
      'Temperatures will reach dangerous levels. Stay hydrated and limit outdoor activity.',
    onset: '2026-07-15T12:00:00',
    ends: '2026-07-16T20:00:00',
  };

  it('returns count 0 and an empty alerts array for no alerts', () => {
    expect(buildSlimAlerts([])).toEqual({ count: 0, alerts: [] });
  });

  it('maps alerts into slim alert objects with summaries', () => {
    expect(buildSlimAlerts([alert])).toEqual({
      count: 1,
      alerts: [
        {
          event: 'Heat Warning',
          headline: 'Extreme heat expected',
          summary:
            'Temperatures will reach dangerous levels. Stay hydrated and limit outdoor activity.',
          onset: '2026-07-15T12:00:00',
          ends: '2026-07-16T20:00:00',
        },
      ],
    });
  });

  it('includes every alert in the slim payload', () => {
    const second: WeatherAlert = {
      event: 'Wind Warning',
      headline: 'Strong winds overnight',
    };
    const result = buildSlimAlerts([alert, second]);
    expect(result.count).toBe(2);
    expect(result.alerts).toHaveLength(2);
    expect(result.alerts[1]).toEqual({
      event: 'Wind Warning',
      headline: 'Strong winds overnight',
      summary: 'Strong winds overnight',
      onset: undefined,
      ends: undefined,
    });
  });
});
