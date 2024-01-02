import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@djticketing7/common';
import express , {Request, Response} from 'express';
import { body } from 'express-validator';
import { Order } from '../models/orders';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request, res:Response) => {
        const {token, orderId} = req.body;

        const order = await Order.findById(orderId);

        if(!order){
            throw new NotFoundError();
        }
        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
        }
        if(order.status === OrderStatus.Cancelled){
            throw new BadRequestError("Cannot Pay for an cancelled order");
        }

        // creating a charge
        // await stripe.charges.create({
        //     currency: 'usd',
        //     amount: order.price * 100,
        //     source: token
        // });

        // await stripe.paymentIntents.create({
        //     currency: 'inr',
        //     amount: order.price * 100,
        //     statement_descriptor : `Payment for Order`
        // });
        const payment = Payment.build({
            orderId : orderId,
            stripeId: 'WORK IN PROGRESS'
        });
        await payment.save();

        // publishing the event
        await new PaymentCreatedPublisher(natsWrapper.clientGetter).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: 'WORK IN PROGRESS'
        })

        res.status(201).send({success: true});
    }
)

export { router as createChargeRouter }