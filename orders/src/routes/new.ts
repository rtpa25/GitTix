import {
    BadRequestError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order, OrderStatus } from '../model/order';
import { Ticket } from '../model/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

interface RequestBody {
    ticketId: string;
}

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
            .isMongoId() // assumes that the ticketId is a MongoId separate db could also have been used
            .withMessage('ticketId must be valid')
            .notEmpty()
            .withMessage('ticketId is required'),
    ],
    validateRequest,
    async (req: Request<{}, {}, RequestBody>, res: Response) => {
        // Find the ticket the user is trying to find in the tickets collection
        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

        // Check if the ticket is already reserved
        const isReserved = await ticket.isReserved();

        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // Calculate an expiration date for this order
        const expirationTime = new Date(
            Date.now() + EXPIRATION_WINDOW_SECONDS * 1000
        ); // 15 minutes

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expirationTime,
            ticket: ticket,
            creator: req.currentUser!.username,
        });

        await order.save();

        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            version: order.version,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price,
            },
        });

        // Send back the order
        res.status(201).send(order);
    }
);

export { router as newOrderRouter };
