import { Message } from 'node-nats-streaming';
import { Subjects, Listener, queueGroupNames, OrderCreatedEvent, ExpirationCompleteEvent, OrderStatus } from '@djticketing7/common';
import { Order } from '../../models/orders';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupNames.OrdersService;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if(!order){
        throw new Error("Order Not found");
    }

    if(order.status === OrderStatus.Complete){
      return msg.ack();
    }

    // setting the order status to cancelled
    order.set({
        status: OrderStatus.Cancelled
    })
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        status: OrderStatus.Cancelled,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price
        },
        version: order.version
    })
   
    // ack the message
    msg.ack();
  }
}
