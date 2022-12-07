import { app } from '../../app';
import request from 'supertest';
import { OrderStatus } from '@rp-gittix/common';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
    // Create a ticket with Ticket Model
    const ticket = await global.buildTicket();
    // Make a request to create an order
    const user = global.signin();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    const { body: cancelledOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200);
    // Expectation to make sure the thing is cancelled
    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
    // Create a ticket with Ticket Model
    const ticket = await global.buildTicket();
    // Make a request to create an order
    const user = global.signin();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    const { body: cancelledOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200);
    // Expectation to make sure the thing is cancelled
    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
