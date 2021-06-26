import mongoose from "mongoose";
import app from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

//@connect mongoDB
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key not found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NAT CLIENT ID not found");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URI must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS CLUSTER ID must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connetion closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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
