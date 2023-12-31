import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signinHelper = () => {
    // Build a JWT Payload, {id, email}
    const id = new mongoose.Types.ObjectId().toHexString();
    const payload = {
        id,
        email : "test@test.com"
    }

    // create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // BUild Session {jwt : MY_JWT}
    const session = {jwt : token};

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // TAke JSON and decode is as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return the string, thats the cookie with the sessioin data
    return [`session=${base64}`];

};