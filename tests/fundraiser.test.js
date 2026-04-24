const request = require('supertest');
const app = require('../server');

describe('Fundraiser API', () => {
  test('should return fundraiser list', async () => {
    const res = await request(app).get('/api/fundraisers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should block creating fundraiser without token', async () => {
    const res = await request(app)
      .post('/api/fundraisers')
      .send({
        title: 'Test',
        description: 'Test description',
        target_amount: 1000,
        category_id: 1
      });

    expect(res.statusCode).toBe(401);
  });
});