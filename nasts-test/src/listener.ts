import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "https://localhost:4222",
});

stan.on("close", () => {
  console.log("nats connection close");
  process.exit();
});

stan.on("connect", () => {
  console.log("listener connected to NATS");

  //set options for nats
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() //send all event is emited in the pass at the first time
    .setDurableName("accounting-service"); //send only unhandled event: store status of all event of durable

  const subscription = stan.subscribe(
    "ticket:created",
    "order-service-queue-group", //store history event, just send 1 sub 1 time
    options
  );

  //subscription receive message event when publish data to chanel
  subscription.on("message", (msg: Message) => {
    console.log("message received");
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(
        `received event number #${msg.getSequence()}, with data: ${JSON.parse(
          data
        )}`
      );
    }

    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
