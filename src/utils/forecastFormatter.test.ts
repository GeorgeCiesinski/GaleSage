import { describe, expect, it } from 'vitest';
import { formatDayLabel, formatPrecipType } from './forecastFormatter';

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

describe('formatPrecipType', () => {
  it('returns correctly for single value in array (Rain)', () => {
    expect(formatPrecipType(['rain'])).toMatch('Rain');
  });

  it('returns correctly for multiple values in array (Rain, snow, ice, freezing rain)', () => {
    expect(formatPrecipType(['rain', 'snow', 'ice', 'freezingrain'])).toMatch('Rain, snow, ice, freezing rain');
  });

  it('splits freezingrain into Freezing rain', () => {
    expect(formatPrecipType(['freezingrain'])).toMatch('Freezing rain');
  });

  it('returns None if receives null', () => {
    expect(formatPrecipType(null)).toMatch('None');
  });
});
