import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends PaymentAttrs, mongoose.Document {
  createAt: string;
  updateAt: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema<PaymentDoc, PaymentModel>(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
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

paymentSchema.static("build", (attrs: PaymentAttrs) => {
  return new Payment(attrs);
});

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
