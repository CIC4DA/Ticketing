import express , {Request,Response} from "express";
import { requireAuth, validateRequest } from "@djticketing7/common";
import {body} from 'express-validator';
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.get('/api/orders/:id', requireAuth , 
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

    

    res.status(201);
})


export { router as getOrderRouter }