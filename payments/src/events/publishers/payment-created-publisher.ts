import { PaymentCreatedEvent, Publisher, Subjects } from "@thinhbh/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
