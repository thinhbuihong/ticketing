import { Publisher, Subjects, TicketUpdatedEvent } from "@thinhbh/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
