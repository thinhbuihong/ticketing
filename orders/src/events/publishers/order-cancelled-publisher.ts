import { OrderCancelledEvent, Publisher, Subjects } from "@thinhbh/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
