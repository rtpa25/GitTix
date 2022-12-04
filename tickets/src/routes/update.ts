import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { Ticket } from '../model/ticket';
import mongoose from 'mongoose';
import { body } from 'express-validator';

const router = Router();

router.put(
    '/api/tickets/:id',
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
        req: Request<
            { id: string },
            {},
            {
                title: string;
                price: number;
            }
        >,
        res: Response
    ) => {
        const ticketId = req.params.id;
        if (!mongoose.isValidObjectId(ticketId)) {
            throw new NotFoundError();
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (req.currentUser!.id !== ticket.userId) {
            throw new NotAuthorizedError();
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });

        await ticket.save();

        return res.status(200).send(ticket);
    }
);

export { router as updateTicketRouter };
