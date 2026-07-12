import { describe, expect, it } from 'vitest';
import { formatDayLabel, formatPrecipType, formatWindDir } from './forecastFormatter';

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
    expect(formatWindDir(0)).toBe('N (0°)');
    expect(formatWindDir(90)).toBe('E (90°)');
    expect(formatWindDir(180)).toBe('S (180°)');
    expect(formatWindDir(270)).toBe('W (270°)');
  });

  it('maps intercardinal directions', () => {
    expect(formatWindDir(45)).toBe('NE (45°)');
  });

  it('rounds to the nearest compass sector', () => {
    expect(formatWindDir(11)).toBe('N (11°)');
    expect(formatWindDir(12)).toBe('NNE (12°)');
  });

  it('wraps degrees for compass but preserves the original value', () => {
    expect(formatWindDir(360)).toBe('N (360°)');
    expect(formatWindDir(405)).toBe('NE (405°)');
  });
});
