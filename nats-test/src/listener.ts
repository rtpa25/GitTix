import { randomBytes } from 'crypto';
import { connect } from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const randomString = randomBytes(4).toString('hex');

const stan = connect('ticketing', randomString, {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close()); // close connection when process is interrupted
process.on('SIGTERM', () => stan.close()); // close connection when process is terminated
