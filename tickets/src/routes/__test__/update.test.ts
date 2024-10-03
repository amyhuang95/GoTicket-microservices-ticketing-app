import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

/**
 * Tests for functionality of updating a ticket.
 */

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'new title',
      price: 5,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'new title',
      price: 5,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'event a',
      price: 10,
    });

  // Edit the ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'event b',
      price: 5,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  // keep track of the user
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'event a',
      price: 10,
    });

  // edit the ticket with invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 5,
    })
    .expect(400);

  // edit the ticket with invalid price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'event b',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  // keep track of the user
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'event a',
      price: 10,
    });

  // edit the ticket with valid title and price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'event b',
      price: 5,
    })
    .expect(200);

  // Get the ticket to check whether it's updated correctly
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('event b');
  expect(ticketResponse.body.price).toEqual(5);
});

it('publishes an event', async () => {
  // keep track of the user
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'event a',
      price: 10,
    });

  // edit the ticket with valid title and price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'event b',
      price: 5,
    })
    .expect(200);

  // Check if the event is published
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects update if the ticket is reserved', async () => {
  // keep track of the user
  const cookie = global.signin();

  // Create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'event a',
      price: 10,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  // edit the ticket with valid title and price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'event b',
      price: 5,
    })
    .expect(400);
});
