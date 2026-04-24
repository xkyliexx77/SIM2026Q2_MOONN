const request = require('supertest');
const app = require('../server');

describe('Report API', () => {
  test('should block report access without token', async () => {
    const res = await request(app).get('/api/reports/summary');
    expect(res.statusCode).toBe(401);
  });
});