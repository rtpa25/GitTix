import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20,
            imageUrl: 'https://www.google.com',
            description: 'concert description',
        });
};

it('can fetch a list of tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app).get('/api/tickets').send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(3);
});
