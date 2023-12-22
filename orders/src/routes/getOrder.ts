import express , {Request,Response} from "express";
import { Ticket } from "../models/tickets";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@djticketing7/common";
import { Order } from "../models/orders";
import mongoose, { isValidObjectId } from "mongoose";

const router = express.Router();

router.get('/api/orders/:id', requireAuth,
async (req:Request, res:Response) => {

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

    res.status(200).send(order);
});


export { router as getOrderRouter };