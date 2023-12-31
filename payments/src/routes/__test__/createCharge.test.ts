import request from "supertest";
import { app } from "../../app";
import { signinHelper } from "../../test/signin-helper";
import mongoose from "mongoose";
import { Order } from "../../models/orders";
import { OrderStatus } from "@djticketing7/common";

it("returns a 404 when purchasing an order which does not exist", async() => {
    await request(app)
        .post('/api/payments')
        .set('Cookie',signinHelper())
        .send({
            token: 'asdasdasd',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it("returns a 401 when purchasing an order which does not belong to user", async() => {
    // creating a new order
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId : new mongoose.Types.ObjectId().toHexString(),
        version : 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save();

    // trying to pay for this order
    await request(app)
        .post('/api/payments')
        .set('Cookie',signinHelper())
        .send({
            token: 'asdasdasd',
            orderId: order.id
        })
        .expect(401);
});

it("returns a 400 when purchasing an order which is cancelled", async() => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    // creating a new order
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version : 0,
        price: 20,
        status: OrderStatus.Cancelled
    })
    await order.save();

    // trying to pay for this order
    await request(app)
        .post('/api/payments')
        .set('Cookie',signinHelper(userId))
        .send({
            token: 'asdasdasd',
            orderId: order.id
        })
        .expect(400);
});
