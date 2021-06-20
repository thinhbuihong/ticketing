import { OrderStatus } from "@thinhbh/common";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { signinCookie } from "../../helper/signinCookie";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signinCookie())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    price: 30,
    title: "ticket1",
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "userid1",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signinCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    price: 30,
    title: "ticket1",
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signinCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});
