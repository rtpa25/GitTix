import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import { Order, OrderStatus } from '../../model/order';
import { Ticket } from '../../model/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();
    const res = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId });

    expect(res.status).toEqual(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = await global.buildTicket();

    const order = await Order.create({
        ticket,
        userId: '123',
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });

    const res = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id });

    expect(res.status).toEqual(400);
});

it('reserves a ticket', async () => {
    const ticket = await global.buildTicket();

    const res = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id });

    expect(res.status).toEqual(201);
});

it('emits an order created event', async () => {
    const ticket = await global.buildTicket();

    const res = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id });

    expect(res.status).toEqual(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
