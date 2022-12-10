import { Listener, Subjects, TicketUpdatedEvent } from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;

    queueGroupName = queueGroupName;

    async onMessage(
        data: TicketUpdatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price, imageUrl } = data;
        ticket.set({ title, price, imageUrl });
        await ticket.save();

        msg.ack();
    }
}
