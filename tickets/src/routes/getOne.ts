import { NotFoundError } from "@thinhbh/common";
import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Ticket from "../models/ticket";

const getOneTicketRouter = express.Router();

getOneTicketRouter.get(
  "/api/tickets/:id",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  })
);

export default getOneTicketRouter;
