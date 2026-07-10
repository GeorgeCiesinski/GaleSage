import { describe, expect, it } from 'vitest';
import { formatTemp, validateUnitGroup } from './units';

describe('formatTemp', () => {
  it('appends °C for metric', () => {
    expect(formatTemp(20, 'metric')).toBe('20°C');
  });

  it('appends °F for us', () => {
    expect(formatTemp(70, 'us')).toBe('70°F');
  });

  it('appends °C for uk', () => {
    expect(formatTemp(20, 'uk')).toBe('20°C');
  });

  it('appends K for base', () => {
    expect(formatTemp(293, 'base')).toBe('293 K');
  });

  it('handles negative values', () => {
    expect(formatTemp(-5, 'metric')).toBe('-5°C');
  });

  it('handles decimal values', () => {
    expect(formatTemp(21.5, 'metric')).toBe('21.5°C');
  });
});

describe('validateUnitGroup', () => {
  it.each(['metric', 'us', 'uk', 'base'] as const)(
    'returns %s when given a valid unit group',
    (group) => {
      expect(validateUnitGroup(group)).toBe(group);
    },
  );

  it('returns metric when selected is undefined', () => {
    expect(validateUnitGroup(undefined)).toBe('metric');
  });

  it('returns metric when selected is an empty string', () => {
    expect(validateUnitGroup('')).toBe('metric');
  });

  it('returns metric when selected is not a valid unit group', () => {
    expect(validateUnitGroup('invalid')).toBe('metric');
  });
});
