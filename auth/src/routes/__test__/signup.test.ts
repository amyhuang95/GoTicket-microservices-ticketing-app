import request from 'supertest';
import { app } from '../../app';

// Test valid email and password
// expect return 201 status code
it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

// Test invalid email
// Expect return 400 status code
it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(400);
});

// Test invalid password
// Expect return 400 status code
it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

// Test empty input for email and password
// Expect return 400 status code
it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400);
});

// Test duplicate emails
// Expect return 400 status code
it('disallow duplicate emails', async () => {
  // first request
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // second request with same email
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

// Test creation of cookie after successful signup
// expect return 201 status code
it('sets a cookie after successful signup', async () => {
  const response = request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // Inspect the header in the response
  expect(response.get('Set-Cookie')).toBeDefined();
});
