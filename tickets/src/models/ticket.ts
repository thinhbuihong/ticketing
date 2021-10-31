import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string;
  price: number;
  // userId: mongoose.ObjectId;
  // userId: mongoose.Schema.Types.ObjectId;
  userId: string;
}

interface TicketDoc extends TicketAttrs, mongoose.Document {
  createAt: string;
  updateAt: string;
  version: number;
  orderId?: string;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema<TicketDoc, TicketModel>(
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
    orderId: {
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

//rename _v to version
ticketSchema.set("versionKey", "version");
//plugin increate document version number each save
ticketSchema.plugin(
  (schema: mongoose.Schema<TicketDoc, TicketModel>, opts?: any) => {
    updateIfCurrentPlugin(schema as unknown as mongoose.Schema, opts);
  }
);

ticketSchema.static("build", (attrs: TicketAttrs): TicketDoc => {
  return new Ticket(attrs);
});

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export default Ticket;
