import { requireAuth, validateRequest } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../model/ticket';

const router = Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title')
            .isString()
            .withMessage('Email must be valid')
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
        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
