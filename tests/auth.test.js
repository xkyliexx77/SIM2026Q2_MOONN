const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/login', () => {

  beforeEach(() => {
    console.log('Starting authentication test...');
  });

  afterEach(() => {
    console.log('Authentication test completed.');
  });

  test('should reject invalid email and password', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@gmail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(401);

  });

  test('should reject missing email and password', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: ''
      });

    expect(res.statusCode).toBe(401);

  });

  test('should reject missing email only', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        password: '123456'
      });

    expect(res.statusCode).toBe(401);

  });

  test('should reject missing password only', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@gmail.com'
      });

    expect(res.statusCode).toBe(401);

  });

  test('should reject empty request body', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.statusCode).toBe(401);

  });

  test('should reject incorrect password', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);

  });

  test('should reject non-existing email', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'idontexist@gmail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(401);

  });

  test('should reject invalid email format', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalidemail',
        password: '123456'
      });

    expect(res.statusCode).toBe(401);

  });

  test('should return JSON response', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@gmail.com',
        password: '123456'
      });

    expect(res.headers['content-type'])
      .toEqual(expect.stringContaining('json'));

  });

  test('should return an error message for failed login', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@gmail.com',
        password: '123456'
      });

    expect(res.body.error || res.body.message)
      .toBeDefined();

  });

  test('should not return token for failed login', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@gmail.com',
        password: '123456'
      });

    expect(res.body.token)
      .toBeUndefined();

  });

});