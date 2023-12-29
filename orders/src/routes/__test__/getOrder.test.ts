import request from "supertest";
import { app } from "../../app";
import { signinHelper } from "../../test/signin-helper";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

it("returns 404 if order does not exist", async () => {
    await request(app)
        .get(`/api/orders/adfasdfas`)
        .set('Cookie',signinHelper())
        .send()
        .expect(404); 
});

it("returns 401 if user access someone else order", async () => {
    // creating ticket
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id: ticketId,
        title: "Concert",
        price: 20,
        userId: "asdasdasd"
    })
    await ticket.save();

    const user = signinHelper();
    const userTwo = signinHelper();

    // create one order as user
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket._id})
        .expect(201);

    const fetchedOrder = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie',userTwo)
        .send()
        .expect(401); 
});

it("can fetch a particular order for a particular user", async () => {
    // creating ticket
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        id: ticketId,
        title: "Concert",
        price: 20,
        userId: "asdasdasd"
    })
    await ticket.save();

    const user = signinHelper();

    // create one order as user
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket._id})
        .expect(201);

    const fetchedOrder = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie',user)
        .send()
        .expect(200);

    expect(fetchedOrder.body.id).toEqual(response.body.id);   
});