import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { signinHelper } from "../../test/signin-helper";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";

it('returns a 404 if the provided id does not exist',async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signinHelper())
        .send({
            title : "asdada",
            price : 20
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated',async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const respone = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title : "asdada",
            price : 20
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket',async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signinHelper())
    .send({
        title: 'asdasd',
        price : 10
    });


    // signinHelper generated random ID everyTime, So we will be having a different user this time
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',signinHelper())
        .send({
            title: '123132',
            price: 1223
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price',async () => {
    const cookie = signinHelper();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'asdasd',
        price : 10
    });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : '',
            price: 21
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : 'asdasd',
            price: -21
        })
        .expect(400);

});

it('updates the ticket provided valid inputs',async () => {
    const cookie = signinHelper();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'asdasd',
        price : 10
    });

     await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : 'New Title',
            price: 21
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('New Title');
    expect(ticketResponse.body.price).toEqual(21);

});

it("Publishes an event", async () => {
    const cookie = signinHelper();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'asdasd',
        price : 10
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title : 'New Title',
        price: 21
    })
    .expect(200);

    expect(natsWrapper.clientGetter.publish).toHaveBeenCalled();
})

it("rejects update if the ticket is resereved", async () => {
    const cookie = signinHelper();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'asdasd',
        price : 10
    });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString()});
    await ticket!.save();

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title : 'New Title',
        price: 21
    })
    .expect(400);
})