// Test setup file - runs before all tests
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Set required environment variables for tests
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3000';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes-only';
  process.env.BASE_URL = 'http://localhost:3000';
  process.env.ENABLE_OBSERVABILITY = 'false';
  process.env.LOG_LEVEL = 'error';

  console.log('Test environment variables set');
});
