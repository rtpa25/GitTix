import { Listener, OrderCreatedEvent, Subjects } from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: OrderCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id } = data;
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add(
            {
                orderId: id,
            },
            {
                delay,
            }
        );
        msg.ack();
    }
}
