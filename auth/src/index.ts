import mongoose from 'mongoose';
import {app} from './app';

// MongoDB
const start = async () => {
    console.log("Starting  up");
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined");
    }
    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Connected");
    } catch (error) {
        console.log("Error Connecting to MongoDB: ",error);
    }

    app.listen(4000, ()=> {
        console.log("Listining on port 4000!");
        console.log("New console log 2");
    })

}

start();

