import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@thinhbh/common";
import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Order } from "../models/order";

const getOrderRouter = express.Router();

getOrderRouter.get(
  "/api/orders/:orderId",
  requireAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  })
);

export default getOrderRouter;
