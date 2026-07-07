import { describe, expect, it } from 'vitest';
import { getFallbackWeatherIconSrc, getWeatherIconSrc } from './weatherIcon';

describe('getWeatherIconSrc', () => {
  it('builds the icon path from the icon id', () => {
    expect(getWeatherIconSrc('partly-cloudy-day')).toBe('/weather-icons/partly-cloudy-day.png');
  });
});

describe('getFallbackWeatherIconSrc', () => {
  it('returns the cloudy fallback icon', () => {
    expect(getFallbackWeatherIconSrc()).toBe('/weather-icons/cloudy.png');
  });
});
