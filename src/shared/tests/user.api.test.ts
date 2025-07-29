import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { userRoutes } from '../../features/shorten/routes/user.routes';
import { prisma } from '../../database/prisma';

// Mocks do ambiente e Prisma
vi.mock('../../config/env', () => ({
  env: {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-jwt-secret-for-testing-purposes-only',
    LOG_LEVEL: 'error',
    BASE_URL: 'http://localhost:3000',
  },
}));
vi.mock('../../database/prisma', () => ({
  prisma: {
    shortenedUrl: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('User URLs API Integration Tests', () => {
  let app: express.Application;
  let validToken: string;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/user', userRoutes);
    validToken = jwt.sign(
      { sub: 'user123', email: 'test@example.com' },
      'test-jwt-secret-for-testing-purposes-only',
      { expiresIn: '1h' },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /user/urls', () => {
    it('should return 401 without token', () => request(app).get('/user/urls').expect(401));

    it('should return 401 for invalid token', () =>
      request(app).get('/user/urls').set('Authorization', 'Bearer invalid-token').expect(401));

    it('should return 401 for malformed header', async () => {
      const headers = ['invalid-format', 'Bearer', 'Bearer '];
      for (const h of headers) {
        await request(app).get('/user/urls').set('Authorization', h).expect(401);
      }
    });

    it('should return user URLs on success', async () => {
      const mockRaw = [
        {
          id: 'url1',
          original_url: 'http://example.com',
          short_code: 'sc1',
          user_id: 'user123',
          accessLogs: [],
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ];
      vi.mocked(prisma.shortenedUrl.findMany).mockResolvedValueOnce(mockRaw);
      const res = await request(app)
        .get('/user/urls')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('urls');
      expect(res.body).toHaveProperty('total', mockRaw.length);
      expect(Array.isArray(res.body.urls)).toBe(true);
      expect(res.body.urls[0]).toMatchObject({
        id: 'url1',
        original_url: 'http://example.com',
        short_code: 'sc1',
        short_url: `${process.env.BASE_URL}/sc1`,
        click_count: 0,
      });
    });
  });

  describe('PATCH /user/urls/:id', () => {
    const urlId = 'url123';

    it('should return 401 without authentication', () =>
      request(app)
        .patch(`/user/urls/${urlId}`)
        .send({ original_url: 'https://updated.com' })
        .expect(401));

    it('should return 400 for invalid URL', () =>
      request(app)
        .patch(`/user/urls/${urlId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ original_url: 'not-a-url' })
        .expect(400));

    it('should update URL on success', async () => {
      vi.mocked(prisma.shortenedUrl.findFirst).mockResolvedValueOnce({
        id: urlId,
        original_url: 'old',
        short_code: 'sc',
        user_id: 'user123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
      vi.mocked(prisma.shortenedUrl.update).mockResolvedValueOnce({
        id: urlId,
        original_url: 'https://updated.com',
        short_code: 'sc',
        user_id: 'user123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
      const res = await request(app)
        .patch(`/user/urls/${urlId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ original_url: 'https://updated.com' })
        .expect(200);
      expect(res.body).toMatchObject({
        id: urlId,
        original_url: 'https://updated.com',
        short_code: 'sc',
        short_url: `${process.env.BASE_URL}/sc`,
      });
    });
  });

  describe('DELETE /user/urls/:id', () => {
    const urlId = 'url123';

    it('should return 401 without authentication', () =>
      request(app).delete(`/user/urls/${urlId}`).expect(401));

    it('should delete URL on success', async () => {
      vi.mocked(prisma.shortenedUrl.findFirst).mockResolvedValueOnce({
        id: urlId,
        original_url: 'http://example.com',
        short_code: 'sc',
        user_id: 'user123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
      vi.mocked(prisma.shortenedUrl.update).mockResolvedValueOnce({
        id: urlId,
        original_url: 'http://example.com',
        short_code: 'sc',
        user_id: 'user123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
      });
      const res = await request(app)
        .delete(`/user/urls/${urlId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      expect(res.body).toMatchObject({ message: 'URL deletada com sucesso', id: urlId });
    });
  });
});
