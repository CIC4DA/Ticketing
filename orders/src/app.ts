import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser } from '@djticketing7/common';

const app = express();
// to make sure express is aware that we are under a proxy of ingress-nginx
app.set('trust proxy',true);
app.use(json());
// here process.env.NODE_ENV is being set by jest
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !=='test'
    })
)

// this our custom middle ware in common, Which is used to set currentUser if logged in, in the req body
app.use(currentUser);

// handling routes
import { errorHandler, NotFoundError } from '@djticketing7/common';
import { getOrderRouter } from './routes/getOrder';
import { getOrdersRouter } from './routes/getOrders';
import { createOrderRouter } from './routes/createOrder';
import { deleteOrderRouter } from './routes/deleteOrder';

app.use(getOrderRouter);
app.use(getOrdersRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);


// handling the route error 
app.get('*', async () => {
    throw new NotFoundError();
})

// handling errors
app.use(errorHandler);


// exporting app
export {app};

