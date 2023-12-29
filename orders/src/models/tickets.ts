import mongoose from "mongoose";
import { Order } from "./orders";
import { OrderStatus } from "@djticketing7/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
// An interface that describes the properties
// that are required to make a New Tickets
interface TicketAttrs {
    id: string
    title: string;
    price: number;
    userId: string;
}

// An interface that describes the properties
// that an Ticket Document has, which get returned to us
export interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    userId: string;
    version: number;
    isReserved(): Promise<boolean>
}

// An interface that describes the properties
// that an Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    price: {
        type : Number,
        required : true,
        min: 0
    },
    userId: {
        type : String,
        required : true
    }
}, {
    // all this here helps to edit the output data of ticket we will get from mongoDB
    // it is not the best approach and not used in model here
    // but we are using
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

// this is to set the version as a field
ticketSchema.set('versionKey','version');
// this is plugin to control updates with version
ticketSchema.plugin(updateIfCurrentPlugin);

// we will call this function to make use of typescript interface
ticketSchema.statics.build = (attributes: TicketAttrs) => {
    // here we are assinging _id, so that the database contains the same id of tickets as it is in tickeservice

    return new Ticket({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price,
        userId: attributes.userId,
    });
};

// this will allow us call this method on the data sent from mongoDB
ticketSchema.methods.isReserved = async function(){
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this.id,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    return existingOrder ? true : false;
};

// now we can use User.build() to build a new ticket;

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket', ticketSchema);
export { Ticket };

// the angle bracket syntax is a generic syntax in typescript
// this gives the all the types we are provinding the function
// Second argument is the type of which the value will be returned
