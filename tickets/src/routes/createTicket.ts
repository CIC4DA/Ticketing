import express , {Request,Response} from "express";
import { requireAuth, validateRequest } from "@djticketing7/common";
import {body} from 'express-validator';
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-event";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post('/api/tickets', requireAuth , 
[
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is Required'),
    body('price')
        .isFloat({ gt: 0})
        .withMessage("Price Must be greater than zero")
], validateRequest
,async (req:Request, res:Response) => {

    const {title,price} = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    })

    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.clientGetter).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });

    res.status(201).send(ticket);
})


export { router as createTicketRouter }