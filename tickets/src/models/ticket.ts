import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: string;
  userId: string;
}

interface TicketDoc extends TicketAttrs, mongoose.Document {
  createAt: string;
  updateAt: string;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    userId: {
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
      },
    },
  }
);

ticketSchema.static("build", (attrs: TicketAttrs) => {
  return new Ticket(attrs);
});

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export default Ticket;
