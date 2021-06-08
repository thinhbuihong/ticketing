import mongoose, { Document, model, Schema } from "mongoose";
import { Password } from "../services/password";

export interface UserAttrs {
  email: string;
  password: string;
}
export interface UserDoc extends Document, UserAttrs {
  updateAt: string;
  createAt: string;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new Schema<UserDoc, UserModel>(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const password = await Password.toHash(this.password);
    this.password = password;
  }
  next();
});

userSchema.static("build", (attrs: UserAttrs) => {
  return new User(attrs);
});

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
