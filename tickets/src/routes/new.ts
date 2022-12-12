import { requireAuth, validateRequest } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { TicketCreatePublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../model/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface TicketBody {
    price: number;
    title: string;
    imageUrl: string;
    description: string;
}

router.post(
    '/api/tickets',
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
    async (req: Request<{}, {}, TicketBody>, res: Response) => {
        const { price, title, imageUrl, description } = req.body;
        const ticket = Ticket.build({
            price,
            title,
            userId: req.currentUser!.id,
            creator: req.currentUser!.username,
            imageUrl,
            description,
        });

        await ticket.save();

        await new TicketCreatePublisher(natsWrapper.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            creator: ticket.creator,
            imageUrl: ticket.imageUrl,
            description: ticket.description,
        });

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
