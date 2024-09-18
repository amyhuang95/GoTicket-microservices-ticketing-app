import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';

/**
 * Tests to verify the functionality of show ticket router.
 */

it('returns a 404 if the ticket is not found', async () => {
  await request(app).get('/api/tickets/random_id').send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  // create a ticket
  const title = 'concert';
  const price = 20;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  // access the ticket
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
