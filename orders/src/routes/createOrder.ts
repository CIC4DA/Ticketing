import express , {Request,Response} from "express";
import { requireAuth, validateRequest } from "@djticketing7/common";
import {body} from 'express-validator';
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post('/api/orders', requireAuth , 
[
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('TicketId is Required'),
], validateRequest
,async (req:Request, res:Response) => {

    const {title,price} = req.body;

    

    res.status(201);
})


export { router as createOrderRouter }