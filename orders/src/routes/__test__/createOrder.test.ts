import request from "supertest";
import { app } from "../../app";
import { signinHelper } from "../../test/signin-helper";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";
import { Order } from "../../models/orders";
import { OrderStatus } from "@djticketing7/common";
import { natsWrapper } from "../../nats-wrapper";

it("Has a route handler listening to /api/orders for post requests", async () => {
    const response = await request(app)
        .post("/api/orders")
        .send({});

    expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/orders")
        .send({});

    expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/orders")
        .set('Cookie',signinHelper())
        .send({});

    expect(response.status).not.toEqual(401);
});


it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post("/api/orders")
        .set("Cookie", signinHelper())
        .send({ticketId})
        .expect(404);

});


it("reserves a ticket", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        userId: "asdasdasd"
    })
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',signinHelper())
        .send({ticketId: ticket.id})
        .expect(201);

    const order = await Order.find({});    
    expect(order[0].ticket).toEqual(ticket._id);
});

it("returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        userId: "asdasdasd"
    })
    await ticket.save();

    const order = Order.build({
        ticket: ticket.id,
        userId: "asdacasc",
        status: OrderStatus.Created,
        expiresAt: new Date(Date.now() + 15*60*1000)
    });
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',signinHelper())
        .send({ticketId: ticket.id})
        .expect(400);

});


it('emits an order created event',async () => {
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        userId: "asdasdasd"
    })
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',signinHelper())
        .send({ticketId: ticket.id})
        .expect(201);

    expect(natsWrapper.clientGetter.publish).toHaveBeenCalled();
})
