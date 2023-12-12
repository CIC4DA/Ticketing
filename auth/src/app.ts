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
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';


app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
// handling the route error 
app.get('*', async () => {
    throw new NotFoundError();
})

// handling errors
app.use(errorHandler);


// exporting app
export {app};

