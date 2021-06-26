import { OrderCreatedEvent, OrderStatus, Subjects } from "@thinhbh/common";
import Ticket from "../../../models/ticket";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";

describe("order created listener", () => {
  const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
      title: "concert",
      price: 90,
      userId: "userId1",
    });
    await ticket.save();

    const data: OrderCreatedEvent["data"] = {
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: "userId1",
      expireAt: "jan",
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };

    //@ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
  };

  it("sets the userId of the ticket and publishes a ticket updated event", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTickket = await Ticket.findById(ticket.id);

    expect(updatedTickket?.orderId).toEqual(data.id);
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subjects.TicketUpdated,
      expect.anything(),
      expect.anything()
    );
  });
});
