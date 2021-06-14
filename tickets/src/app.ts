import cookieSession from "cookie-session";
import express from "express";
import asyncHandler from "express-async-handler";
import { NotFoundError, errorHandler, currentUser } from "@thinhbh/common";
import createTicketRouter from "./routes/create";
import getOneTicketRouter from "./routes/getOne";
import getListTicketRouter from "./routes/getList";
import updateTicketRouter from "./routes/update";

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

app.use(createTicketRouter);
app.use(getOneTicketRouter);
app.use(getListTicketRouter);
app.use(updateTicketRouter);

app.all(
  "*",
  asyncHandler(async () => {
    throw new NotFoundError();
  })
);
app.use(errorHandler);

export default app;
