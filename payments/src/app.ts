import cookieSession from "cookie-session";
import express from "express";
import asyncHandler from "express-async-handler";
import { NotFoundError, errorHandler, currentUser } from "@thinhbh/common";
import createPaymentRouter from "./routes/create";

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

app.use(createPaymentRouter);

app.all(
  "*",
  asyncHandler(async () => {
    throw new NotFoundError();
  })
);
app.use(errorHandler);

export default app;
