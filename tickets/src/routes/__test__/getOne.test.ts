import request from "supertest";
import app from "../../app";
import { signinCookie } from "../../helper/signinCookie";

it("return a 404 if the ticket is not found", async () => {
  await request(app)
    .get("/api/tickets/51bb793aca2ab77a3200000d")
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signinCookie())
    .send({
      title,
      price,
    });

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});