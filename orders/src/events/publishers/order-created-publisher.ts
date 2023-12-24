import { OrderCreatedEvent, Publisher, Subjects } from "@djticketing7/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
