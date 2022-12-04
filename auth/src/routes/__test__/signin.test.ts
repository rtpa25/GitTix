import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'ronit@ronit.io',
            password: 'password',
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'ronit@ronit.io',
            password: 'PASSWORD',
        })
        .expect(400);
});
