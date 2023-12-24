import { OrderCancelledEvent, Publisher, Subjects } from "@djticketing7/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
