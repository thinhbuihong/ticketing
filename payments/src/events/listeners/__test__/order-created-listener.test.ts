import { OrderCreatedEvent, OrderStatus, Subjects } from "@thinhbh/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

describe("order created listener", () => {
  const setup = () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent["data"] = {
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: "userId1",
      expireAt: "jan",
      ticket: {
        id: "ticket1",
        price: 20,
      },
    };

    //@ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  it("replicates the order info", async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order?.price).toEqual(data.ticket.price);
    expect(msg.ack).toHaveBeenCalled();
  });
});
