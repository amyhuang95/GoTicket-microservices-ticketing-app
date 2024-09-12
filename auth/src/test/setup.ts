import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

let mongo: any;

declare global {
  var signin: () => Promise<string[]>;
}

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
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie!;
};
