import nats from "node-nats-streaming";
import { Subjects } from "./events/subjects";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "https://localhost:4222",
});

console.clear();

stan.on("connect", async () => {
  console.log("publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "asd",
      title: "concert",
      price: 30,
    });
  } catch (error) {
    console.log(error);
  }
});

// kubectl port-forward nats-depl-547f995f7f-c2v9s 4222:4222
