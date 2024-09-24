import { Publisher, Subjects, TicketUpdatedEvent } from '@goticket/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
