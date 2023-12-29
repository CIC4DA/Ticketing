import { Listener, Subjects, TicketUpdatedEvent, queueGroupNames } from "@djticketing7/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: queueGroupNames = queueGroupNames.OrdersService;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const ticket = await Ticket.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if(!ticket){
            throw new Error('Ticket not found');
        }

        ticket.set({
            title : data.title, 
            price: data.price
        });
        await ticket.save();

        msg.ack();
    }
}