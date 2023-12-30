import { Listener, OrderCancelledEvent, Subjects, queueGroupNames } from '@djticketing7/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-event';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupNames.TicketsService;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if No ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being UN-reserved by setting its orderId property
    ticket.set({ title:"New TITLE", orderId: undefined });
    await ticket.save();

    // we are publishing ticket updated event, so that all other services also update the ticket data
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
