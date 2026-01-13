import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatDate,
  calculateDiscount,
  truncate,
  slugify,
} from '@/shared/utils/formatters';

describe('formatPrice', () => {
  it('formats integer price with Swiss CHF formatting', () => {
    expect(formatPrice(49)).toBe("CHF 49.00");
  });

  it('formats price with apostrophe separator for thousands', () => {
    expect(formatPrice(1299)).toBe("CHF 1'299.00");
  });

  it('formats large price with multiple separators', () => {
    expect(formatPrice(12345.5)).toBe("CHF 12'345.50");
  });

  it('handles string input', () => {
    expect(formatPrice('99.9')).toBe('CHF 99.90');
  });

  it('returns CHF 0.00 for NaN', () => {
    expect(formatPrice('abc')).toBe('CHF 0.00');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('CHF 0.00');
  });

  it('uses custom currency', () => {
    expect(formatPrice(10, 'EUR')).toBe('EUR 10.00');
  });
});

describe('formatDate', () => {
  it('formats date in de-CH locale', () => {
    const result = formatDate('2025-03-15');
    expect(result).toMatch(/15/);
    expect(result).toMatch(/03|3/);
    expect(result).toMatch(/2025/);
  });

  it('handles Date objects', () => {
    const result = formatDate(new Date(2025, 0, 1));
    expect(result).toMatch(/01|1/);
    expect(result).toMatch(/2025/);
  });
});

describe('calculateDiscount', () => {
  it('calculates discount percentage', () => {
    expect(calculateDiscount(100, 75)).toBe(25);
  });

  it('returns 0 when no discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  it('returns 0 when original price is 0', () => {
    expect(calculateDiscount(0, 50)).toBe(0);
  });

  it('returns 0 when current is higher than original', () => {
    expect(calculateDiscount(50, 100)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    expect(calculateDiscount(100, 67)).toBe(33);
  });
});

describe('truncate', () => {
  it('truncates long text with ellipsis', () => {
    expect(truncate('Hello World This is Long', 10)).toBe('Hello Worl…');
  });

  it('does not truncate short text', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('does not truncate exact length', () => {
    expect(truncate('1234567890', 10)).toBe('1234567890');
  });
});

describe('slugify', () => {
  it('converts to lowercase with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces German umlauts', () => {
    expect(slugify('Über Öffentlichkeit')).toBe('ueber-oeffentlichkeit');
  });

  it('removes special characters', () => {
    expect(slugify('Test! @#$%')).toBe('test-');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a  --  b')).toBe('a-b');
  });
});
