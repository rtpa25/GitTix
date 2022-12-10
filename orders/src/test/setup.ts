import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import { Ticket, TicketDoc } from '../model/ticket';

declare global {
    var signin: () => string[];
    var buildTicket: () => Promise<TicketDoc>;
}

let mongo: MongoMemoryServer;
jest.mock('../nats-wrapper');

global.signin = () => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'ticketing@ticketing.com',
        username: 'test',
    };
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return a string thats the cookie with the encoded data
    return [`session=${base64}`]; //array of strings for supertest
};

global.buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new Types.ObjectId().toHexString(),
    });
    await ticket.save();
    return ticket;
};

beforeAll(async () => {
    process.env.JWT_KEY = 'SECRET';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close(); // Close client's connections first
    await mongo.stop(); // Then stop the mongo server
});
