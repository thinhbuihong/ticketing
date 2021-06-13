import { requireAuth, validateRequest } from "@thinhbh/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import Ticket from "../models/ticket";

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

    res.status(201).send(ticket);
  }
);

export default createTicketRouter;
