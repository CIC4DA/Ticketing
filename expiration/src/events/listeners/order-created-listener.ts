import { Message } from 'node-nats-streaming';
import { Subjects, Listener, queueGroupNames, OrderCreatedEvent } from '@djticketing7/common';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupNames.ExpirationService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
   
    // ack the message
    msg.ack();
  }
}
