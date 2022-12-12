import { Listener, OrderCancelledEvent, Subjects } from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../model/ticket';
import { TicketUpdatePublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(
        data: OrderCancelledEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id, ticket, version } = data;
        // Find the ticket that the order was reserving
        const reservedTicket = await Ticket.findById(ticket.id);
        // If no ticket, throw error
        if (!reservedTicket) {
            throw new Error('Ticket not found');
        }
        // Mark the ticket as non reserved by setting its orderId property to undefined
        reservedTicket.set({ orderId: undefined });
        // Save the ticket
        await reservedTicket.save(); // This will increment the version number
        await new TicketUpdatePublisher(this.client).publish({
            id: reservedTicket.id,
            title: reservedTicket.title,
            price: reservedTicket.price,
            userId: reservedTicket.userId,
            version: reservedTicket.version,
            orderId: reservedTicket.orderId,
            creator: reservedTicket.creator,
            imageUrl: reservedTicket.imageUrl,
            description: reservedTicket.description,
        }); // Publish the updated ticket
        // Ack the message
        msg.ack();
    }
}
