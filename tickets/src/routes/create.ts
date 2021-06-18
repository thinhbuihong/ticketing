import { requireAuth, validateRequest } from "@thinhbh/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import Ticket from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const createTicketRouter = express.Router();

createTicketRouter.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is requires"),
    body("price").isFloat({ gt: 0 }).withMessage("Invalid price"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: Number(ticket.price),
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export default createTicketRouter;
