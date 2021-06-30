import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { signinCookie } from "../../helper/signinCookie";
import { Order } from "../../models/order";
import { OrderStatus } from "@thinhbh/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signinCookie())
    .send({
      token: "token",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signinCookie())
    .send({
      token: "token",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 10,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signinCookie(userId))
    .send({
      token: "token",
      orderId: order.id,
    })
    .expect(400);
});

it("return a 201 with valid inputs and save payment in db", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signinCookie(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  expect(stripe.charges.create).toBeCalledWith({
    currency: "usd",
    amount: order.price * 100,
    source: "tok_visa",
  });

  const payment = await Payment.findOne({
    orderId: order.id,
  });
  expect(payment).toBeDefined();
});
