import { describe, it, expect } from 'vitest';
import { generateShortCode } from '../utils/generateShortCode';

describe('Utility Functions', () => {
  describe('generateShortCode', () => {
    it('should generate a short code', () => {
      const code = generateShortCode();
      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(code.length).toBeGreaterThan(0);
    });

    it('should generate different codes on multiple calls', () => {
      const code1 = generateShortCode();
      const code2 = generateShortCode();

      expect(code1).not.toBe(code2);
    });

    it('should only contain alphanumeric characters', () => {
      const code = generateShortCode();
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      expect(alphanumericRegex.test(code)).toBe(true);
    });
  });
});
