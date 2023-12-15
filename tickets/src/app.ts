import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

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

// handling routes
import { errorHandler, NotFoundError } from '@djticketing7/common';


// handling the route error 
app.get('*', async () => {
    throw new NotFoundError();
})

// handling errors
app.use(errorHandler);


// exporting app
export {app};

