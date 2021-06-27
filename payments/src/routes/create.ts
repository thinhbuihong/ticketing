import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@thinhbh/common";
import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { body } from "express-validator";
import { Order } from "../models/order";

const createPaymentRouter = express.Router();

createPaymentRouter.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("cannot pay for an cancelled order");
    }

    res.send({ success: true });
  })
);

export default createPaymentRouter;
