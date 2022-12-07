import mongoose from 'mongoose';
import { app } from '../../app';
import request from 'supertest';
import { Order, OrderStatus } from '../../model/order';
import { Ticket } from '../../model/ticket';

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();
    const res = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId });

    expect(res.status).toEqual(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = await Ticket.create({
        title: 'concert',
        price: 20,
    });

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
    const ticket = await Ticket.create({
        title: 'concert',
        price: 20,
    });

    const res = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id });

    expect(res.status).toEqual(201);
});

it.todo('emits an order created event');
