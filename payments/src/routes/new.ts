import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';

const router = Router();

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty().withMessage('Token is required'),
        body('orderId')
            .not()
            .isEmpty()
            .withMessage('Order ID is required')
            .isMongoId()
            .withMessage('Order ID must be a valid Mongo ID'),
    ],
    validateRequest,
    async (
        req: Request<{}, {}, { token: string; orderId: string }>,
        res: Response
    ) => {
        const { orderId, token } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100, // Stripe expects amount in cents
            source: token,
            description: `Order ID: ${order.id}`,
        });

        const payment = Payment.build({
            order: order,
            stripeId: charge.id,
        });

        await payment.save();

        // Publish an event saying that a payment was created
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.order.id,
            stripeId: payment.stripeId,
        });

        res.status(201).send({ payment });
    }
);

export { router as createChargeRouter };
