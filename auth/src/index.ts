import express from 'express';
import mongoose from 'mongoose';
import {json} from 'body-parser';
import 'express-async-errors';


const app = express();
app.use(json());

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


// MongoDB
const start = async () => {
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("Mongo Connected");
    } catch (error) {
        console.log("Error Connecting to MongoDB: ",error);
    }

    app.listen(3000, ()=> {
        console.log("Listining on port 3000!");
        console.log("New console log 2");
    })

}

start();

