import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@thinhbh/common";

describe("ticket updated listener", () => {
  const setup = async () => {
    //create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 20,
    });
    await ticket.save();

    //create a fake data event
    const data: TicketUpdatedEvent["data"] = {
      version: ticket.version + 1,
      id: ticket.id,
      title: "concert updated",
      price: 110,
      userId: "new userId",
    };

    //create a fake message object
    //@ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg, ticket };
  };
  it("finds, updates and save a ticket", async () => {
    const { msg, data, ticket, listener } = await setup();
    //update ticket
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.title).toEqual(data.title);
    expect(updatedTicket?.price).toEqual(data.price);
    expect(updatedTicket?.version).toEqual(data.version);
    expect(msg.ack).toHaveBeenCalled();
  });

  it("does not call ack if the event has a skiped version number", async () => {
    const { msg, data, listener } = await setup();

    data.version = 5;

    try {
      await listener.onMessage(data, msg);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
