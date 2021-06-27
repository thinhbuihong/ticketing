import { ExpirationCompleteEvent, Publisher, Subjects } from "@thinhbh/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
