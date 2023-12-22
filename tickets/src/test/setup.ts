import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';

// declare global {
//     var signin: () => Promise<string[]>;
// }
// when we use supertest we are not using https connection, instead we are using http connection

// mocking the nats-wrapper file
// to mock running nats client for the test
jest.mock('../nats-wrapper');

let mongo: any;

// it is hook, that will run before all our tests start executing
beforeAll (async () => {
    process.env.JWT_KEY = 'DHRUV';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

// it is hook, that will run before each our tests start executing
beforeEach( async () => {
    // to clear all mocks data
    jest.clearAllMocks();
    
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }
});

// it is hook, that will run after all our tests are complete
afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
})

// this is a global helper 
// global.signin = async () => {
//     const email = 'test@test.com';
//     const password = 'password';

//     const response = await request(app)
//         .post('/api/users/signup')
//         .send({
//             email,
//             password
//         })
//         .expect(201);

//     const cookie = response.get('Set-Cookie');

//     return cookie;
// };