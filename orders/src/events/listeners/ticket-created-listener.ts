import { Listener, Subjects, TicketCreatedEvent } from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;

    queueGroupName = queueGroupName;

    async onMessage(
        data: TicketCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { title, price, id, imageUrl } = data;
        const ticket = Ticket.build({
            title,
            price,
            id,
            imageUrl,
        });
        await ticket.save();

        msg.ack();
    }
}
