import { Subjects } from './subjects';

/**
 * Describes the structure of the data that will be sent along with the ticket created event.
 */
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
