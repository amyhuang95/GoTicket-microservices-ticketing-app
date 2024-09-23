import { Publisher, TicketCreatedEvent, Subjects } from '@goticket/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
