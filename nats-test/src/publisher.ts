import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222', // server running on port 4222 on kubernetes cluster pod
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20,
        });
    } catch (error) {
        console.error(error);
    }
});