import mongoose, { set } from "mongoose";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/orders";
import { ExpirationCompleteEvent, OrderStatus } from "@djticketing7/common";

const setup = async () => {
    //creates an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.clientGetter);

    // creating a ticket 
    const ticket = Ticket.build({
        title: "asdasd",
        price: 12,
        userId: new mongoose.Types.ObjectId().toHexString(),
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    // creating a order
    const order = Order.build({
        status: OrderStatus.Created,
        userId: '123123',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    // create a fake data event
    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    // create a fake message object
    // this comment helps typescript to ignore this
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, order }
}

it("updates the order status to cancel", async () => {
    const {listener, data, msg, order } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it("emit an ordercancelled event", async () => {
    const {listener, data, msg, order } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);
    expect(natsWrapper.clientGetter.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.clientGetter.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
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