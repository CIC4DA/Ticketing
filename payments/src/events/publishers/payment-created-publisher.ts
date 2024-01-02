import { PaymentCreatedEvent, Publisher, Subjects } from "@djticketing7/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
