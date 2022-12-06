import { Publisher, Subjects, TicketUpdatedEvent } from '@rp-gittix/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
