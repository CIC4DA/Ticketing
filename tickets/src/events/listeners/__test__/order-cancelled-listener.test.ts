import mongoose from "mongoose";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@djticketing7/common";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.clientGetter);

    // create and save a ticket
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "TITLE",
        price: 12,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    ticket.set({orderId});
    await ticket.save();

    // create a fake data event
    const data: OrderCancelledEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        userId: ticket.userId,
        expiresAt: "123123",
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // creating fake msg
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId};
}

it("updates the ticket as unresereved as the order is cancelled", async () => {
    const { listener, ticket, data, msg, orderId} = await setup();

    // creating an instance of listener
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
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

it("publishes a ticket updated event", async () => {
    const {listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);

    // checking if the publish function is called
    expect(natsWrapper.clientGetter.publish).toHaveBeenCalled();
});