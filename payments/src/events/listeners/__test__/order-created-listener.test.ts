import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@djticketing7/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";


const setup = async () => {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.clientGetter);

    // create a fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "dsfsfdsdfsdf",
        expiresAt: "123123",
        ticket: {
            id: "sdfsdfsdfsdf",
            price: 234
        }
    }

    // creating fake msg
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }


    return { listener , data, msg};
}

it("replicates the order info", async () => {
    const { listener, data, msg} = await setup();

    // creating an instance of listener
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
    
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
