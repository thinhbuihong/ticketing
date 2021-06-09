import { Express } from "express";
import request from "supertest";

export const signinHelper = async (app: Express) => {
  const email = "test@gmail.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
