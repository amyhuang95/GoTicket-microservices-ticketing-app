import request from 'supertest';
import { app } from '../../app';

// Send post request with email and password to '/api/users/signup'
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
