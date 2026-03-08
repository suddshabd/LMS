import { describe, expect, it } from 'vitest';
import { getFinalPrice } from '../utils/pricing.js';

describe('getFinalPrice', () => {
  it('returns discounted value', () => {
    expect(getFinalPrice(1000, 20)).toBe(800);
  });

  it('clamps discount to valid range', () => {
    expect(getFinalPrice(1000, 200)).toBe(0);
    expect(getFinalPrice(1000, -40)).toBe(1000);
  });

  it('handles invalid input safely', () => {
    expect(getFinalPrice(undefined, 10)).toBe(0);
  });
});
