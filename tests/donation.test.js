const request = require('supertest');
const app = require('../server');

describe('Donation Feature TDD', () => {

  test('should reject donation amount less than or equal to 0', async () => {
    const response = await request(app)
      .post('/api/donations')
      .send({
        fundraiser_id: 1,
        amount: 0
      });

    expect(response.statusCode).toBe(401);
  });

  test('should require fundraiser id', async () => {
    const response = await request(app)
      .post('/api/donations')
      .send({
        amount: 50
      });

    expect(response.statusCode).toBe(401);
  });

});