import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// Connect to the nats server
const stan = nats.connect('goticket', 'abc', {
  url: 'http://localhost:4222',
});

// Connect to event
stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  // // Information in Nats is exchanged in the form of a string
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // // Publish the event
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
