import { Publisher, Subjects, TicketCreatedEvent } from "@thinhbh/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
