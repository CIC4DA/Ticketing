import { Publisher, Subjects, TicketCreatedEvent } from '@djticketing7/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}