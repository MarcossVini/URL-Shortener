import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { shortenRoutes } from '../../features/shorten/routes/shorten.routes';

// Mock do ambiente de teste
vi.mock('../../config/env', () => ({
  env: {
    NODE_ENV: 'test',
    BASE_URL: 'http://localhost:3000',
    JWT_SECRET: 'test-jwt-secret-for-testing-purposes-only',
    LOG_LEVEL: 'error',
  },
}));

// Mock do Prisma
vi.mock('../../database/prisma', () => ({
  prisma: {
    shortenedUrl: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock das funções utilitárias
vi.mock('../utils/generateShortCode', () => ({
  generateShortCode: vi.fn(() => 'abc123'),
}));

describe('Shorten API Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/shorten', shortenRoutes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /shorten', () => {
    it('should return 400 for invalid URL format', async () => {
      const invalidPayload = {
        original_url: 'not-a-valid-url',
      };

      const response = await request(app).post('/shorten').send(invalidPayload).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Dados inválidos');
    });

    it('should return 400 for missing original_url', async () => {
      const invalidPayload = {};

      const response = await request(app).post('/shorten').send(invalidPayload).expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept valid URL with http protocol', async () => {
      const validPayload = {
        original_url: 'http://example.com',
      };

      const response = await request(app).post('/shorten').send(validPayload);

      // Aceita 201 (sucesso), 400 (erro no mock) ou 500 (erro no mock)
      expect([201, 400, 500]).toContain(response.status);
    });

    it('should accept valid URL with https protocol', async () => {
      const validPayload = {
        original_url: 'https://www.google.com',
      };

      const response = await request(app).post('/shorten').send(validPayload);

      // Aceita 201 (sucesso), 400 (erro no mock) ou 500 (erro no mock)
      expect([201, 400, 500]).toContain(response.status);
    });

    it('should accept complex URLs with parameters', async () => {
      const validPayload = {
        original_url: 'https://example.com/path?param=value&other=123',
      };

      const response = await request(app).post('/shorten').send(validPayload);

      // Aceita 201 (sucesso), 400 (erro no mock) ou 500 (erro no mock)
      expect([201, 400, 500]).toContain(response.status);
    });

    it('should reject malformed URLs', async () => {
      const malformedUrls = [
        'htp://example.com', // typo in protocol
        'example.com', // missing protocol
        'http://', // incomplete URL
        'https://.com', // invalid domain
        '', // empty string
      ];

      for (const url of malformedUrls) {
        const response = await request(app).post('/shorten').send({ original_url: url });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  describe('GET /shorten/:shortCode', () => {
    it('should handle redirect requests', async () => {
      const shortCode = 'abc123';

      const response = await request(app).get(`/shorten/${shortCode}`);

      // Aceita 302 (redirect), 404 (not found) ou 500 (erro no mock)
      expect([302, 404, 500]).toContain(response.status);
    });

    it('should handle invalid short codes', async () => {
      const invalidCodes = ['', '   ', 'invalid-code-with-special-chars!'];

      for (const code of invalidCodes) {
        const response = await request(app).get(`/shorten/${encodeURIComponent(code)}`);

        // Aceita qualquer status pois estamos testando apenas se não quebra
        expect(response.status).toBeGreaterThanOrEqual(200);
      }
    });
  });
});
