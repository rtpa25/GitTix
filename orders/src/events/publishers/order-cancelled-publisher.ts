import { Publisher, OrderCancelledEvent, Subjects } from '@rp-gittix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
