import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { Ticket } from "../../../models/tickets";
import { OrderCreatedEvent, OrderStatus } from "@djticketing7/common";
import { Message } from "node-nats-streaming";


const setup = async () => {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.clientGetter);

    // create and save a ticket
    const ticket = Ticket.build({
        title: "TITLE",
        price: 12,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    // create a fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
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


    return { listener, ticket, data, msg};
}

it("sets the userId of the ticket", async () => {
    const { listener, ticket, data, msg} = await setup();

    // creating an instance of listener
    await listener.onMessage(data, msg);

    // fetching the updated ticket with order id
    const updatedTicketWithOrderId = await Ticket.findById(ticket.id);

    // checking if the updatedticket contains the same orderid as data
    expect(updatedTicketWithOrderId?.orderId).toEqual(data.id);
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
    const {listener, ticket, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);

    expect(natsWrapper.clientGetter.publish).toHaveBeenCalled();

    // playing with jest
    const ticketUpdatedData = JSON.parse(
        (natsWrapper.clientGetter.publish as jest.Mock).mock.calls[0][1]
        );
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});