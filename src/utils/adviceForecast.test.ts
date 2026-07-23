import { describe, expect, it } from 'vitest';
import {
  formatPercent,
  slimDay,
  buildLocationForecastDays,
  buildDayForecastDays,
  buildSeededAdviceText,
} from './adviceForecast';
import type { DailyWeather } from '../types/weather';

function makeDay(overrides: Partial<DailyWeather> = {}): DailyWeather {
  return {
    datetime: '2026-07-15',
    conditions: 'Partly cloudy',
    icon: 'partly-cloudy-day',
    temp: 22,
    tempmax: 28,
    tempmin: 16,
    feelslike: 23,
    feelslikemax: 29,
    feelslikemin: 15,
    humidity: 55,
    cloudcover: 40,
    preciptype: ['rain'],
    precip: 2.5,
    precipprob: 30,
    precipcover: 10,
    snow: 0,
    snowdepth: 0,
    windspeed: 12,
    winddir: 180,
    ...overrides,
  };
}

describe('formatPercent', () => {
  it('appends a percent sign', () => {
    expect(formatPercent(55)).toBe('55%');
  });

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('0%');
  });
});

describe('slimDay', () => {
  it('formats temps, precip, snow, and wind for metric', () => {
    expect(slimDay(makeDay(), 'metric')).toEqual({
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
    });
  });

  it('formats temps, precip, snow, and wind for us', () => {
    const day = makeDay({
      temp: 72,
      tempmax: 80,
      tempmin: 60,
      feelslike: 74,
      feelslikemax: 82,
      feelslikemin: 58,
      precip: 0.1,
      snow: 1,
      snowdepth: 2,
      windspeed: 8,
    });

    expect(slimDay(day, 'us')).toEqual({
      datetime: '2026-07-15',
      conditions: 'Partly cloudy',
      temp: '72°F',
      tempmax: '80°F',
      tempmin: '60°F',
      feelslike: '74°F',
      feelslikemax: '82°F',
      feelslikemin: '58°F',
      precipprob: '30%',
      precip: '0.1in',
      precipcover: '10%',
      preciptype: ['rain'],
      snow: '1in',
      snowdepth: '2in',
      humidity: '55%',
      cloudcover: '40%',
      windspeed: '8 MPH',
    });
  });

  it('preserves datetime, conditions, and preciptype', () => {
    const day = makeDay({
      datetime: '2026-08-01',
      conditions: 'Snow',
      preciptype: ['snow', 'ice'],
    });
    const slim = slimDay(day, 'metric');
    expect(slim.datetime).toBe('2026-08-01');
    expect(slim.conditions).toBe('Snow');
    expect(slim.preciptype).toEqual(['snow', 'ice']);
  });
});

describe('buildLocationForecastDays', () => {
  it('returns up to five slim days', () => {
    const days = [
      makeDay({ datetime: '2026-07-15' }),
      makeDay({ datetime: '2026-07-16' }),
      makeDay({ datetime: '2026-07-17' }),
      makeDay({ datetime: '2026-07-18' }),
      makeDay({ datetime: '2026-07-19' }),
      makeDay({ datetime: '2026-07-20' }),
    ];
    const result = buildLocationForecastDays(days, 'metric');
    expect(result).toHaveLength(5);
    expect(result.map((d) => d.datetime)).toEqual([
      '2026-07-15',
      '2026-07-16',
      '2026-07-17',
      '2026-07-18',
      '2026-07-19',
    ]);
  });

  it('returns fewer than five when the forecast is shorter', () => {
    expect(buildLocationForecastDays([makeDay()], 'metric')).toHaveLength(1);
  });

  it('returns an empty array when there are no days', () => {
    expect(buildLocationForecastDays([], 'metric')).toEqual([]);
  });
});

describe('buildDayForecastDays', () => {
  it('wraps a single day in an array', () => {
    const day = makeDay({ datetime: '2026-07-20' });
    const result = buildDayForecastDays(day, 'metric');
    expect(result).toHaveLength(1);
    expect(result[0].datetime).toBe('2026-07-20');
    expect(result[0].temp).toBe('22°C');
  });
});

describe('buildSeededAdviceText', () => {
  it('returns the trimmed description when there are no alerts', () => {
    expect(buildSeededAdviceText('  Warm and sunny.  ', 0)).toBe('Warm and sunny.');
  });

  it('falls back when description is missing', () => {
    expect(buildSeededAdviceText(undefined, 0)).toBe('Forecast loaded.');
  });

  it('falls back when description is blank', () => {
    expect(buildSeededAdviceText('   ', 0)).toBe('Forecast loaded.');
  });

  it('appends a singular alert line', () => {
    expect(buildSeededAdviceText('Warm weekend ahead.', 1)).toBe(
      'Warm weekend ahead.\n\n1 severe weather alert active.',
    );
  });

  it('appends a plural alert line', () => {
    expect(buildSeededAdviceText('Stormy conditions.', 3)).toBe(
      'Stormy conditions.\n\n3 severe weather alerts active.',
    );
  });

  it('uses the fallback overview when alerts exist but description is missing', () => {
    expect(buildSeededAdviceText(undefined, 2)).toBe(
      'Forecast loaded.\n\n2 severe weather alerts active.',
    );
  });
});
