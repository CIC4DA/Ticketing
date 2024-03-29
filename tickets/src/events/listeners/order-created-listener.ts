import { Message } from 'node-nats-streaming';
import { Subjects, Listener, queueGroupNames, OrderCreatedEvent } from '@djticketing7/common';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-event';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupNames.TicketsService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    
    // if No ticket, throw error
    if(!ticket){
      throw new Error("Ticket not found");
    }
    
    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({orderId : data.id});

    // save the ticket
    await ticket.save();
    // we are publishing ticket updated event, so that all other services also update the ticket data
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    // ack the message
    msg.ack();
  }
}
