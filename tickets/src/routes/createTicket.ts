import express , {Request,Response} from "express";
import { requireAuth, validateRequest } from "@djticketing7/common";
import {body} from 'express-validator';
import { Ticket } from "../models/tickets";

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

    res.status(201).send(ticket);
})


export { router as createTicketRouter }