import { Response } from "express";
import request from "supertest";
import app from "../../app";
import { signinHelper } from "../../helper/signinHelper";

it("responds with details about the current user", async () => {
  const cookie = await signinHelper(app);

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@gmail.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(401);

  expect(response.body.currentUser).toBeUndefined;
});
