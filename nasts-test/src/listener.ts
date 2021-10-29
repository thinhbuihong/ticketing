import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
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

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
