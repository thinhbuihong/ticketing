import { currentUser, errorHandler, NotFoundError } from "@thinhbh/common";
import cookieSession from "cookie-session";
import express from "express";
import asyncHandler from "express-async-handler";
import createOrderRouter from "./routes/create";
import deleteOrderRouter from "./routes/delete";
import getOrderRouter from "./routes/getOrder";
import getOrdersListByUserIdRouter from "./routes/getOrdersListByUserId";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false, //disable encrypt
    secure: process.env.NODE_ENV !== "test", //only access via https
  })
);

//check jwt + add currentUser in incomming req
app.use(currentUser);

app.use(createOrderRouter);
app.use(getOrdersListByUserIdRouter);
app.use(getOrderRouter);
app.use(deleteOrderRouter);

app.all(
  "*",
  asyncHandler(async () => {
    throw new NotFoundError();
  })
);
app.use(errorHandler);

export default app;
