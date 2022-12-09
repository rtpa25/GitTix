import mongoose from 'mongoose';
import { OrderDoc } from './order';

interface PaymentAttrs {
    order: OrderDoc;
    stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
    order: OrderDoc;
    stripeId: string;
    createdAt: string;
    updatedAt: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        order: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
        stripeId: {
            required: true,
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => new Payment(attrs);

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
    'Payment',
    paymentSchema
);

export { Payment };
