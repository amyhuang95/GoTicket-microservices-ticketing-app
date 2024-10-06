import { ExpirationCompleteEvent, Publisher, Subjects } from '@goticket/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
