import request from "supertest";
import app from "../../app";
import { signinCookie } from "../../helper/signinCookie";

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.statusCode).toEqual(401);
});

it("return a status other than 401 if the users is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signinCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {});

it("returns an error if an invalid price is provided", async () => {});

it("creates a ticket with valid paramater inputs", async () => {});
