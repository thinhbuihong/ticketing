import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";

//@connect mongoDB
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key not found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsWrapper.connect("ticketing", "client1", "http:nats-srv:4222");
    natsWrapper.client.on("close", () => {
      console.log("NATS connetion closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000!!!!!!!!!");
  });
};
start();
