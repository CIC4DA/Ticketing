import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@djticketing7/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/orders";

const setup = async () => {
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.clientGetter);

    // creating an order
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId : '12312313',
        version : 0
    })
    await order.save();

    // create a fake data event
    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        status: OrderStatus.Cancelled,
        userId: "123123123",
        expiresAt: "123123",
        ticket: {
            id: "sdfasdfasdfasdf",
            price: 123
        }
    }

    // creating fake msg
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order};
}

it("updates the status of the order", async () => {
    const { listener, data, msg, order } = await setup();

    // creating an instance of listener
    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id);
    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
    // that is it let the nats know the onMessage function has done its work
    // you can proceed further

    const { listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);

    // write assertions to make sure aticket was created!
    expect(msg.ack).toHaveBeenCalled();
});