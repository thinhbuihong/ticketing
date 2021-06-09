import request from "supertest";
import app from "../../app";
// import "../../test/setup";

it("returns a 201 on successful signup", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201, done);
});

it("returns a 400 with an invalid email", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "invalidEmail",
      password: "password",
    })
    .expect(400, done);
});

it("returns a 400 with an invalid password", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "as",
    })
    .expect(400, done);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
