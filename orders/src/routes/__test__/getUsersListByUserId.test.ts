import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { signinCookie } from "../../helper/signinCookie";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "ticket title",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  return ticket;
};
it("fetches orders for an particular user", async () => {
  //create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = signinCookie();
  const user2 = signinCookie();
  //create one order as user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  //create two orders as user #2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  //make request to get order for user #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  //make sure we only got the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
});
