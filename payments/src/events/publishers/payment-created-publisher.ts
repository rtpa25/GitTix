import { PaymentCreatedEvent, Publisher, Subjects } from '@rp-gittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
