import { TicketUpdatedEvent } from '@rp-gittix/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../model/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // Create and saves a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
        imageUrl: 'test',
    });
    await ticket.save();
    // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        price: 10,
        version: ticket.version + 1,
        userId: new mongoose.Types.ObjectId().toHexString(),
        creator: 'test',
        imageUrl: 'test',
    };
    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };
    // Return all of this stuff
    return { listener, data, msg, ticket };
};

it('updates a ticket once the ticket:updated event is called', async () => {
    const { data, listener, msg, ticket } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure a ticket was updated!
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message received from the nats streaming server', async () => {
    const { data, listener, msg } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalledTimes(1);
});

it('does not call ack if the event has a skipped version number', async () => {
    const { data, listener, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (err: any) {
        expect(err.message).toEqual('Ticket not found');
    }
    expect(msg.ack).not.toHaveBeenCalled();
});
