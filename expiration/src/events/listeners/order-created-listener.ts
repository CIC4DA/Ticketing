import { Message } from 'node-nats-streaming';
import { Subjects, Listener, queueGroupNames, OrderCreatedEvent } from '@djticketing7/common';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupNames.ExpirationService;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    // enqueuing a job, with a delay of 
    await expirationQueue.add({
      orderId: data.id
    }, {
      delay : 10000
    });
   
    // ack the message
    msg.ack();
  }
}
