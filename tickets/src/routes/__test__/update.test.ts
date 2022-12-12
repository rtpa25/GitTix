import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const res = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        });
    expect(res.statusCode).toEqual(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const res = await request(app).put(`/api/tickets/${id}`).send({
        title: 'concert',
        price: 20,
        imageUrl: 'https://www.google.com',
        description: 'concert description',
    });
    expect(res.statusCode).toEqual(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        });

    const res = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'new concert',
            price: 1000,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        });
    expect(res.statusCode).toEqual(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20,
        });

    const res = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20,
        });
    expect(res.status).toEqual(400);

    const res1 = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: -10,
        });
    expect(res1.status).toEqual(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new concert',
            price: 1000,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new concert');
    expect(ticketResponse.body.price).toEqual(1000);
});

it('publishes an event', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'new concert',
            price: 20,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new concert',
            price: 30,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        })
        .expect(400);
});
