import { Listener, OrderCreatedEvent, Subjects } from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../model/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatePublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: OrderCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id, ticket } = data;
        // Find the ticket that the order is reserving
        const existingTicket = await Ticket.findById(ticket.id);
        // If no ticket, throw error
        if (!existingTicket) {
            throw new Error('Ticket not found');
        }
        // Mark the ticket as being reserved by setting its orderId property
        existingTicket.set({ orderId: id });
        // Save the ticket
        await existingTicket.save();

        await new TicketUpdatePublisher(this.client).publish({
            id: existingTicket.id,
            title: existingTicket.title,
            price: existingTicket.price,
            userId: existingTicket.userId,
            version: existingTicket.version,
            orderId: existingTicket.orderId,
            creator: existingTicket.creator,
        });
        // Ack the message
        msg.ack();
    }
}
