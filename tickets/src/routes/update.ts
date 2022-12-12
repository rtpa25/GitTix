import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { Ticket } from '../model/ticket';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { TicketUpdatePublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface TicketBody {
    price: number;
    title: string;
    imageUrl: string;
    description: string;
}

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .isString()
            .withMessage('title must be valid')
            .notEmpty()
            .withMessage('title is required'),
        body('description')
            .isString()
            .withMessage('description must be valid')
            .notEmpty()
            .withMessage('description is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('price must be valid')
            .notEmpty()
            .withMessage('price is required'),
        body('imageUrl')
            .isString()
            .withMessage('imageUrl must be valid')
            .notEmpty()
            .withMessage('imageUrl is required'),
    ],
    validateRequest,
    async (req: Request<{ id: string }, {}, TicketBody>, res: Response) => {
        const ticketId = req.params.id;
        if (!mongoose.isValidObjectId(ticketId)) {
            throw new NotFoundError();
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket');
        }

        if (req.currentUser!.id !== ticket.userId) {
            throw new NotAuthorizedError();
        }

        const { imageUrl, price, title, description } = req.body;

        ticket.set({
            title,
            price,
            imageUrl,
            description,
        });

        await ticket.save();

        await new TicketUpdatePublisher(natsWrapper.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            creator: ticket.creator,
            imageUrl: ticket.imageUrl,
            description: ticket.description,
        });

        return res.status(200).send(ticket);
    }
);

export { router as updateTicketRouter };
