import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation-error";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

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
  expressAsyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({
      email,
      password,
    });
    await user.save();

    //generate JWT
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "thinhdepzai"
    );

    //store insession
    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  })
);

export { router as signupRouter };
