import mongoose from "mongoose";

interface OrderAttrs {
  userId: string;
  status: string; //expired,paind,pending
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends OrderAttrs, mongoose.Document {
  createAt: string;
  updateAt: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.static("build", (attrs: OrderAttrs) => {
  return new Order(attrs);
});

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
