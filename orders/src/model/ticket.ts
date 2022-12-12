import { OrderStatus } from '@rp-gittix/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface TicketAttrs {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    description: string;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    imageUrl: string;
    version: number;
    description: string;
    isReserved(): Promise<boolean>;
    createdAt: string;
    updatedAt: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String, //global string constructor
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin); //this is a plugin that is used to update the version number every time a document is updated <even if any field ain't changed and just called .save() on>

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    const ticket = new Ticket({
        _id: attrs.id,
        ...attrs,
    });
    delete ticket.id;
    return ticket;
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

ticketSchema.methods.isReserved = async function () {
    //this === the ticket document that we just called 'isReserved' on
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from that means the ticket *is* reserved
    const existingOrder = await this.model('Order').findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });
    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
