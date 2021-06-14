import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { signinCookie } from "../../helper/signinCookie";

it("returns a 404 if the provided id does no exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put("/api/tickets/" + id)
    .set("Cookie", signinCookie())
    .send({
      title: "ticket title",
      price: 10,
    })
    .expect(404);
});

it("retuns a 401 if the user is not authenticeted ", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put("/api/tickets/" + id)
    .send({
      title: "ticket title",
      price: 10,
    })
    .expect(401);
});

it("return a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signinCookie())
    .send({
      title: "ticket title",
      price: 32,
    });

  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", signinCookie())
    .send({
      title: "update title",
      price: 20,
    })
    .expect(401);
});

it("returns a 400 if the provideds an invalid title or price", async () => {
  const cookie = signinCookie();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "ticket title",
      price: 32,
    });

  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      price: 20,
    })
    .expect(400);

  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "update title",
    })
    .expect(400);
});

it("update the ticket success", async () => {
  const cookie = signinCookie();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "ticket title",
      price: 32,
    });

  await request(app)
    .put("/api/tickets/" + response.body.id)
    .set("Cookie", cookie)
    .send({
      title: "update title",
      price: 20,
    })
    .expect(200);

  const newTicket = await request(app)
    .get("/api/tickets/" + response.body.id)
    .send();

  expect(newTicket.body.title).toEqual("update title");
  expect(newTicket.body.price).toEqual(20);
});
