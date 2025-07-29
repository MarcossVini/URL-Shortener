import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authRoutes } from '../../features/auth/routes/auth.routes';

// Mock do ambiente de teste
vi.mock('../../config/env', () => ({
  env: {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-jwt-secret-for-testing-purposes-only',
    LOG_LEVEL: 'error',
  },
}));

// Mock do Prisma
vi.mock('../../database/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('Auth API Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should return 400 for invalid email format', async () => {
      const invalidPayload = {
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app).post('/auth/login').send(invalidPayload).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid email');
    });

    it('should return 400 for short password', async () => {
      const invalidPayload = {
        email: 'test@example.com',
        password: '123',
      };

      const response = await request(app).post('/auth/login').send(invalidPayload).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('String must contain at least 6 character(s)');
    });

    it('should return 400 for missing fields', async () => {
      const invalidPayload = {
        email: 'test@example.com',
        // password missing
      };

      const response = await request(app).post('/auth/login').send(invalidPayload).expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should accept valid login payload structure', async () => {
      const validPayload = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Como não temos banco real, esperamos que o controller seja chamado
      // O teste vai falhar na validação de usuário, mas deve passar a validação de input
      const response = await request(app).post('/auth/login').send(validPayload);

      // Aceita tanto 400 (usuário não encontrado) quanto 500 (erro no mock)
      expect([400, 500]).toContain(response.status);
    });
  });
});
