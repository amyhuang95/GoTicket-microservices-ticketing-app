import { Publisher, OrderCreatedEvent, Subjects } from '@goticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
