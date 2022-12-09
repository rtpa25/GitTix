import { Listener, OrderCreatedEvent, Subjects } from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: OrderCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id, status, ticket, userId, version } = data;

        const order = Order.build({
            id,
            status,
            price: ticket.price,
            userId,
            version,
        });

        await order.save();

        msg.ack();
    }
}
