import { Express } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

export const signinCookie = () => {
  //build a payload for jwt
  const payload = {
    email: "test@gmail.com",
    id: "60c56bc076ed8b0023f40158",
  };
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session obj
  const session = { jwt: token };

  // turn that session into json
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thas the cookie with encoded data
  return [`express:sess=${base64}`];
  //for supertest we need to put cookie in array
};
