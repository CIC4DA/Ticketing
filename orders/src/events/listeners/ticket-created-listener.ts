import { Subjects, Listener, TicketCreatedEvent, queueGroupNames } from '@djticketing7/common'; 
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupNames.OrdersService;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price, userId } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
      userId
    });
    await ticket.save();

    msg.ack();
  }
}
