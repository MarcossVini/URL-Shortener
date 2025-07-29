import { describe, it, expect } from 'vitest';

describe('Setup Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have correct environment setup', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
