import mongoose from "mongoose";
import app from "./app";

//@connect mongoDB
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key not found");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000!!!!!!!!!");
  });
};
start();
