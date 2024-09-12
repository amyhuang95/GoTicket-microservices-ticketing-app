import request from 'supertest';
import { app } from '../../app';

// Valid case
it('responds with details of current user', async () => {
  const cookie = await global.signin();

  // make request to current user
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie!)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

// Invalid case - responds null if not authenticated
it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
