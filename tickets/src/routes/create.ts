import { requireAuth } from "@thinhbh/common";
import express, { Request, Response } from "express";

const createTicketRouter = express.Router();

createTicketRouter.post(
  "/api/tickets",
  requireAuth,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export default createTicketRouter;
