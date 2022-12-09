import {
    Listener,
    OrderCancelledEvent,
    OrderStatus,
    Subjects,
} from '@rp-gittix/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(
        data: OrderCancelledEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id, version } = data;

        const order = await Order.findOne({
            _id: id,
            version: version - 1,
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });

        await order.save();

        msg.ack();
    }
}
