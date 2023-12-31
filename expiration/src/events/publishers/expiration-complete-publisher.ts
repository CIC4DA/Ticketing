import { ExpirationCompleteEvent, Publisher, Subjects } from "@djticketing7/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}