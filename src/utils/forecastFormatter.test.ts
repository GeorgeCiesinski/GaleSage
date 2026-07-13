import { describe, expect, it } from 'vitest';
import {
  formatDayLabel,
  formatHourLabel,
  formatPrecipType,
  formatWindDir,
  formatAlertPeriod,
  formatAlertSourceLabel,
  filterActiveAlerts,
} from './forecastFormatter';
import type { WeatherAlert } from '../types/weather';

describe('formatDayLabel', () => {
  it('returns Today for index 0', () => {
    expect(formatDayLabel(0, '2026-07-07')).toBe('Today');
  });

  it('returns Tomorrow for index 1', () => {
    expect(formatDayLabel(1, '2026-07-08')).toBe('Tomorrow');
  });

  it('formats later days as a short date', () => {
    expect(formatDayLabel(2, '2026-07-09')).toMatch(/Jul/);
    expect(formatDayLabel(2, '2026-07-09')).toMatch(/9/);
  });
});

describe('formatHourLabel', () => {
  it('formats afternoon hour', () => {
    expect(formatHourLabel('14:00:00')).toMatch(/2/); // "2 PM" or "14:00" depending on locale
  });
  
  it('formats midnight', () => {
    expect(formatHourLabel('00:00:00')).toBeTruthy();
  });
});

describe('formatPrecipType', () => {
  it('returns correctly for single value in array (Rain)', () => {
    expect(formatPrecipType(['rain'])).toMatch('Rain');
  });

  it('returns correctly for multiple values in array (Rain, snow, ice, freezing rain)', () => {
    expect(formatPrecipType(['rain', 'snow', 'ice', 'freezingrain'])).toMatch(
      'Rain, snow, ice, freezing rain',
    );
  });

  it('splits freezingrain into Freezing rain', () => {
    expect(formatPrecipType(['freezingrain'])).toMatch('Freezing rain');
  });

  it('returns None if receives null', () => {
    expect(formatPrecipType(null)).toMatch('None');
  });
});

describe('formatWindDir', () => {
  it('maps cardinal directions', () => {
    expect(formatWindDir(0)).toBe('from N (0°)');
    expect(formatWindDir(90)).toBe('from E (90°)');
    expect(formatWindDir(180)).toBe('from S (180°)');
    expect(formatWindDir(270)).toBe('from W (270°)');
  });

  it('maps intercardinal directions', () => {
    expect(formatWindDir(45)).toBe('from NE (45°)');
  });

  it('rounds to the nearest compass sector', () => {
    expect(formatWindDir(11)).toBe('from N (11°)');
    expect(formatWindDir(12)).toBe('from NNE (12°)');
  });

  it('wraps degrees for compass but preserves the original value', () => {
    expect(formatWindDir(360)).toBe('from N (360°)');
    expect(formatWindDir(405)).toBe('from NE (405°)');
  });
});

describe('formatAlertPeriod', () => {
  it('formats a start and end range', () => {
    const result = formatAlertPeriod('2026-07-13T10:00:00', '2026-07-13T07:14:19');
    expect(result).toContain('–');
    expect(result).toMatch(/Jul/);
  });

  it('handles only an end date', () => {
    expect(formatAlertPeriod(undefined, '2026-07-13T07:14:19')).toMatch(/^Until/);
  });
});

describe('formatAlertSourceLabel', () => {
  it('labels Environment Canada links', () => {
    expect(formatAlertSourceLabel('https://weather.gc.ca/')).toBe('Environment Canada');
  });

  it('falls back for unknown hosts', () => {
    expect(formatAlertSourceLabel('https://example.com/alerts/123')).toBe('Official source');
  });
});

describe('filterActiveAlerts', () => {
  const nowMs = 1_700_000_000_000;

  const activeAlert: WeatherAlert = {
    event: 'heat',
    headline: 'Active alert',
    endsEpoch: Math.floor(nowMs / 1000) + 3600,
  };

  const expiredAlert: WeatherAlert = {
    event: 'heat',
    headline: 'Expired alert',
    endsEpoch: Math.floor(nowMs / 1000) - 3600,
  };

  const openEndedAlert: WeatherAlert = {
    event: 'wind',
    headline: 'Open-ended alert',
  };

  it('keeps alerts that end in the future', () => {
    expect(filterActiveAlerts([activeAlert], nowMs)).toEqual([activeAlert]);
  });

  it('removes alerts that have already ended', () => {
    expect(filterActiveAlerts([expiredAlert], nowMs)).toEqual([]);
  });

  it('keeps alerts without an endsEpoch', () => {
    expect(filterActiveAlerts([openEndedAlert], nowMs)).toEqual([openEndedAlert]);
  });
});
