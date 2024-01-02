import { Message } from 'node-nats-streaming';
import { Subjects, Listener, queueGroupNames, OrderStatus, PaymentCreatedEvent } from '@djticketing7/common';
import { Order } from '../../models/orders';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupNames.OrdersService;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if(!order){
        throw new Error("Order Not found");
    }

    // setting the order status to cancelled
    order.set({
        status: OrderStatus.Complete
    })
    await order.save();

    // here we could create a publisher for order-updated-publisher, but we are not doing to save time, as order once completed, we not be updated further.

    // ack the message
    msg.ack();
  }
}
