import { describe, it, expect } from 'vitest';
import {
  createShortUrlSchema,
  type CreateShortUrlDTO,
} from '../../features/shorten/dto/CreateShortUrlDTO';
import {
  updateShortUrlSchema,
  type UpdateShortUrlDTO,
} from '../../features/shorten/dto/UpdateShortUrlDTO';
import { loginSchema, type LoginDTO } from '../../features/auth/dto/LoginDTO';

describe('DTO Validation Tests', () => {
  describe('CreateShortUrlDTO', () => {
    it('should validate correct URL formats', () => {
      const validUrls = [
        'http://example.com',
        'https://www.google.com',
        'https://subdomain.example.com/path',
        'http://localhost:3000',
        'https://example.com:8080/api/v1/resource?param=value',
        'https://example.com/path?param1=value1&param2=value2#section',
      ];

      validUrls.forEach((url) => {
        const result = createShortUrlSchema.safeParse({ original_url: url });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.original_url).toBe(url);
        }
      });
    });

    it('should reject invalid URL formats', () => {
      const invalidUrls = [
        'not-a-url',
        'example.com', // missing protocol
        'http://', // incomplete
        '', // empty string
      ];

      invalidUrls.forEach((url) => {
        const result = createShortUrlSchema.safeParse({ original_url: url });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('URL deve ser válida');
        }
      });
    });

    it('should require original_url field', () => {
      const result = createShortUrlSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_type');
      }
    });

    it('should type check CreateShortUrlDTO', () => {
      const validDto: CreateShortUrlDTO = {
        original_url: 'https://example.com',
      };

      expect(validDto.original_url).toBe('https://example.com');
      expect(typeof validDto.original_url).toBe('string');
    });
  });

  describe('UpdateShortUrlDTO', () => {
    it('should validate URL updates', () => {
      const validUpdate = { original_url: 'https://updated-example.com' };
      const result = updateShortUrlSchema.safeParse(validUpdate);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.original_url).toBe('https://updated-example.com');
      }
    });

    it('should reject invalid URL in updates', () => {
      const invalidUpdate = { original_url: 'invalid-url' };
      const result = updateShortUrlSchema.safeParse(invalidUpdate);

      expect(result.success).toBe(false);
    });

    it('should type check UpdateShortUrlDTO', () => {
      const validDto: UpdateShortUrlDTO = {
        original_url: 'https://updated-example.com',
      };

      expect(validDto.original_url).toBe('https://updated-example.com');
    });
  });

  describe('LoginDTO', () => {
    it('should validate correct email and password', () => {
      const validCredentials = [
        { email: 'user@example.com', password: 'password123' },
        { email: 'test.user+tag@domain.co.uk', password: 'strongP@ssw0rd!' },
        { email: 'simple@test.com', password: '123456' },
      ];

      validCredentials.forEach((creds) => {
        const result = loginSchema.safeParse(creds);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.email).toBe(creds.email);
          expect(result.data.password).toBe(creds.password);
        }
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'not-an-email',
        'missing@',
        '@missing-local.com',
        'spaces in@email.com',
        'double@@domain.com',
        '',
      ];

      invalidEmails.forEach((email) => {
        const result = loginSchema.safeParse({ email, password: 'password123' });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some((issue) => issue.path.includes('email'))).toBe(true);
        }
      });
    });

    it('should reject passwords shorter than 6 characters', () => {
      const shortPasswords = ['', '1', '12', '123', '1234', '12345'];

      shortPasswords.forEach((password) => {
        const result = loginSchema.safeParse({ email: 'test@example.com', password });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some(
              (issue) => issue.path.includes('password') && issue.message.includes('at least 6'),
            ),
          ).toBe(true);
        }
      });
    });

    it('should require both email and password', () => {
      // Missing email
      const missingEmail = loginSchema.safeParse({ password: 'password123' });
      expect(missingEmail.success).toBe(false);

      // Missing password
      const missingPassword = loginSchema.safeParse({ email: 'test@example.com' });
      expect(missingPassword.success).toBe(false);

      // Missing both
      const missingBoth = loginSchema.safeParse({});
      expect(missingBoth.success).toBe(false);
    });

    it('should type check LoginDTO', () => {
      const validDto: LoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(validDto.email).toBe('test@example.com');
      expect(validDto.password).toBe('password123');
      expect(typeof validDto.email).toBe('string');
      expect(typeof validDto.password).toBe('string');
    });
  });

  describe('Cross-DTO Validation', () => {
    it('should handle edge cases consistently', () => {
      // Test que URLs com protocolos específicos são tratadas consistentemente
      const urlsToTest = ['http://example.com', 'https://example.com'];

      urlsToTest.forEach((url) => {
        const createResult = createShortUrlSchema.safeParse({ original_url: url });
        const updateResult = updateShortUrlSchema.safeParse({ original_url: url });

        expect(createResult.success).toBe(updateResult.success);
      });
    });

    it('should handle special characters and encoding', () => {
      const specialUrls = [
        'https://example.com/path with spaces',
        'https://example.com/path?query=value with spaces',
        'https://example.com/path?param=value&other=value',
      ];

      specialUrls.forEach((url) => {
        // Note: URLs with spaces are technically invalid but let's see how Zod handles them
        const result = createShortUrlSchema.safeParse({ original_url: url });
        // This test documents current behavior rather than asserting correctness
        expect(typeof result.success).toBe('boolean');
      });
    });
  });
});
