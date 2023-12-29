import { TicketCreatedEvent } from "@djticketing7/common";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";

const setup = async () => {
    //creates an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.clientGetter);

    // create a fake data event
    const data: TicketCreatedEvent["data"] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "asdad",
        price: 12,
        userId : new mongoose.Types.ObjectId().toHexString()
    };

    // create a fake message object
    // this comment helps typescript to ignore this
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg }
}

it("created and saves a ticket", async () => {
    const {listener,data,msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);

    // write assertions to make sure aticket was created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.price).toEqual(12);
    expect(ticket!.title).toEqual("asdad");
})


it("acks the message", async () => {
    // that is it let the nats know the onMessage function has done its work
    // you can proceed further

    const { listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);

    // write assertions to make sure aticket was created!
    expect(msg.ack).toHaveBeenCalled();
});