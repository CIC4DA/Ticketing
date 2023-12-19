import express , {Request,Response} from "express";
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from "@djticketing7/common";
import {body} from 'express-validator';
import { Ticket } from "../models/tickets";

const router = express.Router();

router.put('/api/tickets/:id', requireAuth , 
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

    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        throw new NotFoundError();
    }

    // Checking the ticket is owned by the same user
    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title : req.body.title,
        price: req.body.price
    })

    await ticket.save();

    res.status(200).send(ticket);
    
});

export { router as updateTicketRouter }