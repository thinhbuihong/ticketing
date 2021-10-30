import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";
import { functionListener } from "./events/base-listener";
import { Subjects } from "./events/subjects";
import { TicketCreatedEvent } from "./events/ticket-created-event";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect(
  "ticketing", //cluster id
  randomBytes(4).toString("hex"), //id cua client
  {
    url: "https://localhost:4222",
  }
);

stan.on("close", () => {
  console.log("nats connection close");
  process.exit();
});

stan.on("connect", () => {
  console.log("listener connected to NATS");

  // stan.on("close", () => {
  //   console.log("NATS connection closed");
  //   process.exit();
  // });

  // new TicketCreatedListener(stan).listen();
  functionListener<TicketCreatedEvent>({
    client: stan,
    queueGroupName: "payment",
    subject: Subjects.TicketCreated,
    onMessage: (data: TicketCreatedEvent["data"], msg: Message): void => {
      console.log("event data ticketed listener", data);

      msg.ack();
    },
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
