import express , {Request,Response} from "express";
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@djticketing7/common";
import { isValidObjectId } from "mongoose";
import { Order } from "../models/orders";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.patch('/api/orders/:id', requireAuth , 
    async (req:Request, res:Response) => {
       
    try {
        const orderId = req.params.id;
        if(!isValidObjectId(orderId)){
            throw new NotFoundError();
        }

        const order = await Order.findById(orderId).populate('ticket');
        if(!order){
            throw new NotFoundError();
        }
        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled;
        await order.save();

        // Publish an event saying that an order was cancelled
        new OrderCancelledPublisher(natsWrapper.clientGetter).publish({
            id: order.id,
            status: OrderStatus.Cancelled,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
              id: order.ticket.id,
              price: order.ticket.price
            }
          })

        res.status(204).send(order);

    } catch (error) {
        throw new Error("Error in Deleting the Order");
    }
})


export { router as cancelOrderRouter }