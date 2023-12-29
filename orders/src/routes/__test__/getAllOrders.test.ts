import request from "supertest";
import { app } from "../../app";
import { signinHelper } from "../../test/signin-helper";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

const createTicket = async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id: ticketId,
        title: "Concert",
        price: 20,
        userId: "asdasdasd"
    })
    await ticket.save();
    await ticket.save();
    return ticket;
}

it("can fetch a list of orders for a particular user", async () => {
    // creating three ticket
   const ticketOne = await createTicket();
   const ticketTwo = await createTicket();
   const ticketThree = await createTicket();

   const userOne = signinHelper();
   const userTwo = signinHelper();

    // create one order as user #1
    const res = await request(app)
        .post('/api/orders')
        .set('Cookie',userOne)
        .send({ticketId: ticketOne._id})
        .expect(201);

    // create two orders as user #2
    // destructing body and setting orderOne === body
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie',userTwo)
        .send({ticketId: ticketTwo._id})
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie',userTwo)
        .send({ticketId: ticketThree._id})
        .expect(201);
    
    // Make request to get orders for user #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);
    
    // Make sure we only got the orders for user #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);

});