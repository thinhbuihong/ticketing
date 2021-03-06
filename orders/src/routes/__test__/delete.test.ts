import { OrderStatus } from "@thinhbh/common";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { signinCookie } from "../../helper/signinCookie";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled and publish event", async () => {
  //create a ticket with ticket model
  const ticket = Ticket.build({
    title: "ticket title",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = signinCookie();
  //make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  //make a request to cancel the order
  await request(app)
    .delete("/api/orders/" + order.id)
    .set("Cookie", user)
    .expect(204);

  //expectation to make suer the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toBeCalled();
});
