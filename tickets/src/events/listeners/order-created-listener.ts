import { Message } from 'node-nats-streaming';
import { Subjects, Listener, queueGroupNames, OrderCreatedEvent } from '@djticketing7/common';
import { Ticket } from '../../models/tickets';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupNames.OrdersService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('Event Data! ', data);

    msg.ack();
  }
}
