import { Listener, OrderCancelledEvent, OrderStatus, Subjects, queueGroupNames } from '@djticketing7/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupNames.PaymentsService;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1  
    });

    if(!order){
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled});
    await order.save();

    // ack the message
    msg.ack();
  }
}
