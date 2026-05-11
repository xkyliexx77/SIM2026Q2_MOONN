const supertest = require('supertest');
const app = require('../server');
const request = supertest(app);

// before all test cases start
beforeAll(async () => {
  console.log('Connecting to authentication API test suite...');
});

// after all test cases finish
afterAll(async () => {
  console.log('Authentication API test suite completed.');

});

describe('POST /api/auth/login', () => {

  describe('given invalid email and password', () => {

    // test 1
    test('should respond with status code 401', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'notfound@gmail.com',
          password: '123456'
        });

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when email or password is missing', () => {

    // test 2
    test('should respond with status code 401', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: '',
          password: ''
        });

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when email is missing', () => {

    // test 3
    test('should reject missing email', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          password: '123456'
        });

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when password is missing', () => {

    // test 4
    test('should reject missing password', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'admin@gmail.com'
        });

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when request body is empty', () => {

    // test 5
    test('should reject empty request body', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({});

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when password is incorrect', () => {

    // test 6
    test('should reject incorrect password', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'admin@gmail.com',
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when email does not exist', () => {

    // test 7
    test('should reject non-existing email', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'idontexist@gmail.com',
          password: '123456'
        });

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when email format is invalid', () => {

    // test 8
    test('should reject invalid email format', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'invalidemail',
          password: '123456'
        });

      expect(response.statusCode).toBe(401);

    });

  });

  describe('when login fails', () => {

    // test 9
    test('should return JSON response', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'notfound@gmail.com',
          password: '123456'
        });

      expect(response.headers['content-type'])
        .toEqual(expect.stringContaining('json'));

    });

  });

  describe('when login credentials are invalid', () => {

    // test 10
    test('should return an error message', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'notfound@gmail.com',
          password: '123456'
        });

      expect(response.body.error || response.body.message)
        .toBeDefined();

    });

  });

  describe('when login attempt fails', () => {

    // test 11
    test('should not return token for failed login', async () => {

      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'notfound@gmail.com',
          password: '123456'
        });

      expect(response.body.token)
        .toBeUndefined();

    });

  });

});