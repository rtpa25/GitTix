import {
    OrderCancelledEvent,
    OrderCreatedEvent,
    OrderStatus,
} from '@rp-gittix/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../model/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    //Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    //Create and save a ticket
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString(),
        creator: 'test',
        imageUrl: 'test',
    });
    ticket.set({ orderId });
    await ticket.save();
    //Create a fake data object
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };
    //Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };
    //Return all of this stuff
    return { listener, data, msg, ticket };
};

it('sets the userId of the ticket', async () => {
    const { data, listener, msg, ticket } = await setup();
    //Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //Write assertions to make sure a ticket was updated!
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toBeUndefined();
    expect(updatedTicket!.version).toEqual(1);
});

it('acks the message', async () => {
    const { data, listener, msg } = await setup();
    //Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalledTimes(1);
});

it('publishes a ticket updated event', async () => {
    const { data, listener, msg, ticket } = await setup();
    //Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //Write assertions to make sure a ticket was updated!
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(ticketUpdatedData.orderId).toBeUndefined();
});
