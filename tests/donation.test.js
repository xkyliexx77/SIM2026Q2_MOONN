const request = require('supertest');
const app = require('../server');

describe('Donation API', () => {
  test('should block donation history access without token', async () => {
    const res = await request(app).get('/api/donations/mine');
    expect(res.statusCode).toBe(401);
  });
});