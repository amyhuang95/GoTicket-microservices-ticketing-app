import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto'; // generate random id for nats client id
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// Create a client (stan) to connect to the nats server
const stan = nats.connect('goticket', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

// Watch for the connection
stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
