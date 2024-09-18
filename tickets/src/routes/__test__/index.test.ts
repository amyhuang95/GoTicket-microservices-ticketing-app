import request from 'supertest';
import { app } from '../../app';

/**
 * Tests for functionality of getting all tickets
 */

// Helper function to create tickets
const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'first event',
    price: 10,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
