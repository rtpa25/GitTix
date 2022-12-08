import { requireAuth, validateRequest } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { TicketCreatePublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../model/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title')
            .isString()
            .withMessage('title must be valid')
            .notEmpty()
            .withMessage('title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('price must be valid')
            .notEmpty()
            .withMessage('price is required'),
    ],
    validateRequest,
    async (
        req: Request<{}, {}, { price: number; title: string }>,
        res: Response
    ) => {
        const { price, title } = req.body;
        const ticket = await Ticket.create({
            price,
            title,
            userId: req.currentUser!.id,
        });

        await new TicketCreatePublisher(natsWrapper.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
        });

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
