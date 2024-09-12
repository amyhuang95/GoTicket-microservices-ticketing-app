import request from 'supertest';
import { app } from '../../app';

// Valid case
it('responds with details of current user', async () => {
  // create a user
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // extract cookie from the auth response
  const cookie = authResponse.get('Set-Cookie');

  // make request to current user
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie!)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
