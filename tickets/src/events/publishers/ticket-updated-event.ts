import { Publisher, Subjects, TicketUpdatedEvent } from '@djticketing7/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}