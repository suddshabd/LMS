import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { app } from '../server.js';

describe('health endpoints', () => {
  test.runIf(process.env.CI === 'true')('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('uptimeSeconds');
  });

  test('health shape baseline', () => {
    expect(typeof app).toBe('function');
  });
});
