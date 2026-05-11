const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/login', () => {

  describe('given invalid email and password', () => {

    test('should respond with status code 401', async () => {

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@gmail.com',
          password: '123456'
        });

      expect(res.statusCode).toBe(401);
    });

  });

  describe('when email or password is missing', () => {

    test('should respond with status code 401', async () => {

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: '',
          password: ''
        });

      expect(res.statusCode).toBe(401);
    });

  });

  describe('when password is incorrect', () => {

    test('should respond with status code 401', async () => {

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@gmail.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });

  });

});