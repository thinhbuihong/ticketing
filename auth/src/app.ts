import cookieSession from "cookie-session";
import express from "express";
import asyncHandler from "express-async-handler";
import { NotFoundError, errorHandler } from "@thinhbh/common";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false, //disable encrypt
    secure: process.env.NODE_ENV !== "test", //only access via https
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all(
  "*",
  asyncHandler(async () => {
    throw new NotFoundError();
  })
);
app.use(errorHandler);

export default app;
