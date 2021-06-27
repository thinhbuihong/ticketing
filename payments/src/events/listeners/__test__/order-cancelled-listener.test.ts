// import { OrderCancelledEvent, Subjects } from "@thinhbh/common";
// import mongoose from "mongoose";
// import { Message } from "node-nats-streaming";
// import Ticket from "../../../models/ticket";
// import { natsWrapper } from "../../../nats-wrapper";
// import { OrderCancelledListener } from "../order-cancelled-listener";

// describe("order created listener", () => {
//   const setup = async () => {
//     const listener = new OrderCancelledListener(natsWrapper.client);

//     const ticket = Ticket.build({
//       title: "concert",
//       price: 90,
//       userId: "userId1",
//     });

//     const orderId = mongoose.Types.ObjectId().toHexString();
//     ticket.set({ orderId });
//     await ticket.save();

//     const data: OrderCancelledEvent["data"] = {
//       id: mongoose.Types.ObjectId().toHexString(),
//       version: 0,
//       ticket: {
//         id: ticket.id,
//       },
//     };

//     //@ts-ignore
//     const msg: Message = {
//       ack: jest.fn(),
//     };

//     return { listener, ticket, data, msg, orderId };
//   };

//   it("updates the ticket, publishes an event ", async () => {
//     const { msg, data, ticket, listener } = await setup();

//     await listener.onMessage(data, msg);

//     const updatedTicket = await Ticket.findById(ticket.id);

//     expect(updatedTicket?.orderId).not.toBeDefined();
//     expect(msg.ack).toHaveBeenCalled();
//     expect(natsWrapper.client.publish).toHaveBeenCalledWith(
//       Subjects.TicketUpdated,
//       expect.anything(),
//       expect.anything()
//     );
//   });
// });
