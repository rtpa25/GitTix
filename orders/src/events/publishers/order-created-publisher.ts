import { Publisher, OrderCreatedEvent, Subjects } from '@rp-gittix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}
