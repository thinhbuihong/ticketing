import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).send(errors.array());
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    console.log("creating a user....");
    throw new DatabaseConnectionError();
    // res.send({
    //   email,
    //   password,
    // });
  }
);

export { router as signupRouter };
