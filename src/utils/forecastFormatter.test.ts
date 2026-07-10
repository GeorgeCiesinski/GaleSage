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

  });
  it('returns correctly for multiple values in array (Rain, snow, ice, freezing rain)', () => {

  });
  it('splits freezingrain into Freezing rain', () => {

  });
  it('returns None if array is empty', () => {

  });
});