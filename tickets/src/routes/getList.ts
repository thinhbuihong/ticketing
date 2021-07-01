import express, { Request, Response } from "express";
import Ticket from "../models/ticket";

const getListTicketRouter = express.Router();

getListTicketRouter.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  res.send(tickets);
});

export default getListTicketRouter;
