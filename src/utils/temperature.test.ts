import { describe, expect, it } from 'vitest';
import { displayTemp } from './temperature';

describe('displayTest', () => {
  it('formats freezing point in Fahrenheit and Celsius', () => {
    expect(displayTemp(32)).toBe('32°F (0.0°C)');
  });

  it('formats boiling point in Fahrenheit and Celius', () => {
    expect(displayTemp(212)).toBe('212°F (100.0°C)');
  });

  it('formats the point where Fahrenheit and Celsius are equal', () => {
    expect(displayTemp(-40)).toBe('-40°F (-40.0°C)');
  });

  it('rounds Celsius to one decimal place', () => {
    expect(displayTemp(70)).toBe('70°F (21.1°C)');
  });
});
