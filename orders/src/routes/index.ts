import mongoose from "mongoose";
import { requireAuth, validateRequest } from "@thinhbh/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const createOrderRouter = express.Router();

createOrderRouter.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ticketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export default createOrderRouter;
