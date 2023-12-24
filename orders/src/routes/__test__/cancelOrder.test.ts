import request from 'supertest';
import { Ticket } from '../../models/tickets';
import { signinHelper } from '../../test/signin-helper';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { OrderStatus } from '@djticketing7/common';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
    // create a ticket with ticket model
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        userId: "123123"
    });
    await ticket.save();

    const user = signinHelper();

    // make a request to create an order
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId : ticket.id})
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .patch(`/api/orders/${response.body.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(response.body.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits an order cancelled event',async () => {
    // create a ticket with ticket model
    const ticket = Ticket.build({
        title: "Concert",
        price: 20,
        userId: "123123"
    });
    await ticket.save();

    const user = signinHelper();

    // make a request to create an order
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId : ticket.id})
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .patch(`/api/orders/${response.body.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);  

    expect(natsWrapper.clientGetter.publish).toHaveBeenCalled();
})
