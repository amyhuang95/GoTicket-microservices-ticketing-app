import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

// Mock the nats-wrapper
jest.mock('../nats-wrapper');

let mongo: any;
// Hook that will run before all tests - connect to the in-memory db server
beforeAll(async () => {
  // Set up env var
  process.env.JWT_KEY = 'asdf';

  // connect to server
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

// Hook that will run before each test - reset data in each table
beforeEach(async () => {
  // Reset all mocks
  jest.clearAllMocks();
  const collections = await mongoose.connection.db?.collections();

  for (let collection of collections!) {
    await collection.deleteMany({});
  }
});

// Hook that will run after all tests - disconnect from the in-memory server
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// Global function only accessible to test for signing up and extracting cookie
global.signin = () => {
  // Generate a random valid id
  const id = new mongoose.Types.ObjectId().toHexString();

  // Build a JWT payload {id, email}
  const payload = {
    id,
    email: 'test@test.com',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that is the cookie with the encoded data
  return [`session=${base64}`];
};
