import { Message } from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '@goticket/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated; // readonly prevents the subject from being changed
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data:', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack(); // allow the message to be timed out
  }
}
