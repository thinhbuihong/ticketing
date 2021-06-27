import {
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from "@thinhbh/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

describe("expiration complete listener", () => {
  const setup = async () => {
    //create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 29,
    });
    await ticket.save();

    const order = Order.build({
      status: OrderStatus.Created,
      userId: "user1",
      expiresAt: new Date(),
      ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
      orderId: order.id,
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, order, ticket, data, msg };
  };

  it("updates the order status to cancelled", async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subjects.OrderCancelled,
      expect.anything(),
      expect.anything()
    );
    expect(msg.ack).toHaveBeenCalled();
  });
});
