import { describe, expect, it } from 'vitest';
import {
  formatTemp,
  formatPrecip,
  formatSnow,
  formatWindSpeed,
  formatSolarRadiation,
  formatSolarEnergy,
  formatVisibility,
  formatUvIndex,
} from './units';

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

describe('formatPrecip', () => {
  it('appends mm for metric', () => {
    expect(formatPrecip(20, 'metric')).toBe('20mm');
  });

  it('appends in for us', () => {
    expect(formatPrecip(5, 'us')).toBe('5in');
  });

  it('appends mm for uk', () => {
    expect(formatPrecip(20, 'uk')).toBe('20mm');
  });

  it('appends mm for base', () => {
    expect(formatPrecip(20, 'base')).toBe('20mm');
  });
});

describe('formatSnow', () => {
  it('appends cm for metric', () => {
    expect(formatSnow(20, 'metric')).toBe('20cm');
  });

  it('appends in for us', () => {
    expect(formatSnow(5, 'us')).toBe('5in');
  });

  it('appends cm for uk', () => {
    expect(formatSnow(20, 'uk')).toBe('20cm');
  });

  it('appends cm for base', () => {
    expect(formatSnow(20, 'base')).toBe('20cm');
  });
});

describe('formatWindSpeed', () => {
  it('appends km/h for metric', () => {
    expect(formatWindSpeed(10, 'metric')).toBe('10 km/h');
  });

  it('appends MPH for us', () => {
    expect(formatWindSpeed(5, 'us')).toBe('5 MPH');
  });

  it('appends MPH for uk', () => {
    expect(formatWindSpeed(5, 'uk')).toBe('5 MPH');
  });

  it('appends m/s for base', () => {
    expect(formatWindSpeed(50, 'base')).toBe('50 m/s');
  });
});

describe('formatSolarRadiation', () => {
  it('appends W/m²', () => {
    expect(formatSolarRadiation(239.1)).toBe('239.1 W/m²');
  });
});

describe('formatSolarEnergy', () => {
  it('appends MJ/m²', () => {
    expect(formatSolarEnergy(20.6)).toBe('20.6 MJ/m²');
  });
});

describe('formatVisibility', () => {
  it('appends km for metric', () => {
    expect(formatVisibility(15.1, 'metric')).toBe('15.1 km');
  });

  it('appends mi for us', () => {
    expect(formatVisibility(10, 'us')).toBe('10 mi');
  });

  it('appends mi for uk', () => {
    expect(formatVisibility(10, 'uk')).toBe('10 mi');
  });

  it('appends km for base', () => {
    expect(formatVisibility(15.1, 'base')).toBe('15.1 km');
  });
});

describe('formatUvIndex', () => {
  it('formats the unitless index value', () => {
    expect(formatUvIndex(8)).toBe('8');
    expect(formatUvIndex(0)).toBe('0');
  });
});
