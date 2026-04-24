const request = require('supertest');
const app = require('../server');

describe('Favourite API', () => {
  test('should block favourite access without token', async () => {
    const res = await request(app).get('/api/favourites/mine');
    expect(res.statusCode).toBe(401);
  });
});