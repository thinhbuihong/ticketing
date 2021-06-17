import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "https://localhost:4222",
});

console.clear();

stan.on("connect", () => {
  console.log("publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    //cb involed after pushlish data
    console.log("event pushlised");
  });
});

// kubectl port-forward nats-depl-547f995f7f-c2v9s 4222:4222
