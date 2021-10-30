import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

//all test use mock nats-wrapper
jest.mock("../nats-wrapper");

//mock mongodb server
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "thinhdepzai";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

//clear mongodb
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
