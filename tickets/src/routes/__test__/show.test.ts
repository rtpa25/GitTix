import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/api/tickets/${ticketId}`).send();
    expect(res.statusCode).toEqual(404);
});

it('returns the ticket if the ticket is found', async () => {
    const title = 'concert';
    const price = 20;
    const imageUrl = 'https://www.google.com';

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price,
            imageUrl,
        });
    expect(response.statusCode).toEqual(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.statusCode).toEqual(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
    expect(ticketResponse.body.imageUrl).toEqual(imageUrl);
});
