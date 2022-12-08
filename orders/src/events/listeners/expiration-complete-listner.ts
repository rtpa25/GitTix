import {
    ExpirationCompleteEvent,
    Listener,
    OrderStatus,
    Subjects,
} from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../model/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    async onMessage(
        data: ExpirationCompleteEvent['data'],
        msg: Message
    ): Promise<void> {
        const { orderId } = data;

        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Cancelled,
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        });
        msg.ack();
    }
}
