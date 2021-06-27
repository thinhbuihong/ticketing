import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@thinhbh/common";

describe("order created listener", () => {
  const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      price: 10,
      userId: "user1",
      version: 0,
    });
    await order.save();

    const data: OrderCancelledEvent["data"] = {
      id: order.id,
      version: 1,
      ticket: {
        id: "ticket1",
      },
    };

    //@ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, order, data, msg };
  };

  it("updates the status of the order", async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
    expect(msg.ack).toHaveBeenCalled();
  });
});
