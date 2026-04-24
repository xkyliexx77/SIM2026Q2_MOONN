const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  test('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@mail.com`,
        password: '123456',
        role: 'donee'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBeDefined();
  });

  test('should fail login for invalid user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@mail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(401);
  });
});