import { describe, expect, it } from 'vitest';
import { formatDayLabel } from './dayLabel';

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
