import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@thinhbh/common";
import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import Ticket from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const updateTicketRouter = express.Router();

updateTicketRouter.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Invalid price"),
  ],
  validateRequest,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: Number(ticket.price),
      userId: ticket.userId,
    });

    res.send(ticket);
  })
);

export default updateTicketRouter;
