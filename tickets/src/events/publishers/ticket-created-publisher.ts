import { Publisher, TicketCreatedEvent, Subjects } from '@rp-gittix/common';

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
