import { TicketUpdatedEvent } from "@djticketing7/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  //creates an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.clientGetter);

  //create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "asdad",
    price: 12,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: "New Title",
    price: 123,
    userId: ticket.userId,
  };

  // create a fake message object
  // this comment helps typescript to ignore this
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure aticket was created!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  // that is it let the nats know the onMessage function has done its work
  // you can proceed further

  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure aticket was created!
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack, if the event has a skipped version number", async () => {
    const { msg, data, listener, ticket} = await setup();

    // creating a future version
    data.version = 20;

    // using try catch as this will throw an error
    try {
        await listener.onMessage(data,msg);
    } catch (error) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled();
})