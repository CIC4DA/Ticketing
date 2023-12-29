import express, { Request, Response } from "express";
import {
    BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@djticketing7/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { Ticket } from "../models/tickets";
import { Order } from "../models/orders";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = express.Router();

router.post("/api/orders", requireAuth,
  [ body("ticketId")
        .not()
        .isEmpty()
        .withMessage("TicketId is Required")
],validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    
    // Find the ticket, user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // this will get all the orders which have same ticket and is anything in status but cancelled

    // const existingOrder = await Order.findOne({
    //     ticket: ticket.id,
    //     status: {
    //         $in: [
    //             OrderStatus.Created,
    //             OrderStatus.AwaitingPayment,
    //             OrderStatus.Complete
    //         ]
    //     }
    // })

    // this is the method we createed in tickets schema
    const isReserved = await ticket.isReserved();

    if(isReserved){
        throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date(Date.now() + 15*60*1000);

    // Build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket.id
    })
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.clientGetter).publish({
      id: order.id,
      status: OrderStatus.Created,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      },
      version: order.version
    })

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
