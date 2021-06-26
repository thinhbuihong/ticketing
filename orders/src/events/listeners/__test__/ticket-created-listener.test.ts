import mongoose from "mongoose";
import { TicketCreatedEvent } from "@thinhbh/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

describe("ticket created listener", () => {
  const setup = () => {
    //create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    //create a fake data event
    const data: TicketCreatedEvent["data"] = {
      version: 0,
      id: mongoose.Types.ObjectId().toHexString(),
      title: "concert",
      price: 10,
      userId: new mongoose.Types.ObjectId().toHexString(),
    };

    //create a fake message object
    //@ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };
  it("creates and saves a ticket", async () => {
    const { listener, data, msg } = setup();

    //call the onMessage function with data object + message object
    await listener.onMessage(data, msg);

    //write assertions to make usre a ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
    expect(ticket?.price).toEqual(data.price);
    expect(msg.ack).toHaveBeenCalled();
  });
});
